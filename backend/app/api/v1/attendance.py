from datetime import datetime, date, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.exceptions import (
    NotFoundException,
    ConflictException,
    PermissionDeniedException,
)
from app.core.dependencies import (
    get_current_user,
    get_db,
    require_hr_or_admin,
    check_employee_access,
)
from app.models.user import User, UserRole
from app.models.employee import Employee
from app.models.attendance import Attendance, AttendanceStatus
from app.schemas.attendance import (
    AttendanceOut,
    AttendanceSummaryOut,
    CheckInRequest,
    CheckOutRequest,
)
from app.services.audit_service import log_action

router = APIRouter(prefix="/attendance", tags=["Attendance Management"])


@router.post("/check-in", response_model=AttendanceOut)
async def check_in(
    req: Optional[CheckInRequest] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Employee check in for today."""
    employee = current_user.employee_profile
    if not employee:
        raise NotFoundException(detail="Employee profile not found")

    today = req.date if req and req.date else date.today()
    now_utc = datetime.now(timezone.utc)

    stmt = select(Attendance).where(
        and_(Attendance.employee_id == employee.id, Attendance.date == today)
    )
    res = await db.execute(stmt)
    attendance = res.scalar_one_or_none()

    if attendance:
        if attendance.check_in is not None:
            raise ConflictException(
                detail=f"Already checked in for {today} at {attendance.check_in.strftime('%H:%M:%S UTC')}"
            )
        attendance.check_in = now_utc
        attendance.status = AttendanceStatus.PRESENT
    else:
        attendance = Attendance(
            employee_id=employee.id,
            date=today,
            check_in=now_utc,
            status=AttendanceStatus.PRESENT,
        )
        db.add(attendance)

    await log_action(
        db=db,
        actor_user_id=current_user.id,
        action="ATTENDANCE_CHECK_IN",
        entity_type="Attendance",
        entity_id=attendance.id,
    )
    await db.commit()
    await db.refresh(attendance)
    return attendance


@router.post("/check-out", response_model=AttendanceOut)
async def check_out(
    req: Optional[CheckOutRequest] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Employee check out for today."""
    employee = current_user.employee_profile
    if not employee:
        raise NotFoundException(detail="Employee profile not found")

    today = date.today()
    now_utc = datetime.now(timezone.utc)

    stmt = select(Attendance).where(
        and_(Attendance.employee_id == employee.id, Attendance.date == today)
    )
    res = await db.execute(stmt)
    attendance = res.scalar_one_or_none()

    if not attendance or attendance.check_in is None:
        raise ConflictException(detail="Cannot check out without checking in first")

    if attendance.check_out is not None:
        raise ConflictException(
            detail=f"Already checked out for today at {attendance.check_out.strftime('%H:%M:%S UTC')}"
        )

    attendance.check_out = now_utc

    # Normalize timezone for subtraction
    check_in_dt = attendance.check_in
    if check_in_dt.tzinfo is None:
        check_in_dt = check_in_dt.replace(tzinfo=timezone.utc)

    # Calculate hours worked
    duration = now_utc - check_in_dt
    hours_worked = duration.total_seconds() / 3600.0

    if hours_worked < 4.0:
        attendance.status = AttendanceStatus.HALF_DAY
    else:
        attendance.status = AttendanceStatus.PRESENT

    await log_action(
        db=db,
        actor_user_id=current_user.id,
        action="ATTENDANCE_CHECK_OUT",
        entity_type="Attendance",
        entity_id=attendance.id,
        metadata_json={"hours_worked": round(hours_worked, 2)},
    )
    await db.commit()
    await db.refresh(attendance)
    return attendance


@router.get("/me", response_model=List[AttendanceOut])
async def get_my_attendance(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get current employee's attendance records."""
    employee = current_user.employee_profile
    if not employee:
        raise NotFoundException(detail="Employee profile not found")

    stmt = (
        select(Attendance)
        .where(Attendance.employee_id == employee.id)
        .order_by(Attendance.date.desc())
    )
    res = await db.execute(stmt)
    return res.scalars().all()


@router.get("/me/summary", response_model=AttendanceSummaryOut)
async def get_my_attendance_summary(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get attendance statistics for current employee."""
    employee = current_user.employee_profile
    if not employee:
        raise NotFoundException(detail="Employee profile not found")

    stmt = select(Attendance).where(Attendance.employee_id == employee.id)
    res = await db.execute(stmt)
    records = res.scalars().all()

    total = len(records)
    present = sum(1 for r in records if r.status == AttendanceStatus.PRESENT)
    absent = sum(1 for r in records if r.status == AttendanceStatus.ABSENT)
    half = sum(1 for r in records if r.status == AttendanceStatus.HALF_DAY)
    leave = sum(1 for r in records if r.status == AttendanceStatus.LEAVE)

    rate = (present + (half * 0.5)) / total * 100.0 if total > 0 else 0.0

    return AttendanceSummaryOut(
        total_days=total,
        present_days=present,
        absent_days=absent,
        half_days=half,
        leave_days=leave,
        attendance_rate=round(rate, 1),
    )


@router.get("/", response_model=List[AttendanceOut])
async def list_org_attendance(
    employee_id: Optional[int] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    status_filter: Optional[AttendanceStatus] = Query(None, alias="status"),
    current_user: User = Depends(require_hr_or_admin),
    db: AsyncSession = Depends(get_db),
):
    """HR / Admin list attendance across organization with filters."""
    stmt = select(Attendance).order_by(Attendance.date.desc())

    if employee_id:
        stmt = stmt.where(Attendance.employee_id == employee_id)
    if start_date:
        stmt = stmt.where(Attendance.date >= start_date)
    if end_date:
        stmt = stmt.where(Attendance.date <= end_date)
    if status_filter:
        stmt = stmt.where(Attendance.status == status_filter)

    res = await db.execute(stmt)
    return res.scalars().all()
