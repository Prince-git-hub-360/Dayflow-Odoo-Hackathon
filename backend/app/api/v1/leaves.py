from datetime import datetime, date, timedelta, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy import select
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
from app.models.leave import LeaveRequest, LeaveStatus, LeaveType
from app.models.attendance import Attendance, AttendanceStatus
from app.models.notification import NotificationType
from app.schemas.leave import LeaveCreate, LeaveReview, LeaveOut
from app.services.audit_service import log_action
from app.services.notification_service import send_notification

router = APIRouter(prefix="/leaves", tags=["Leave Management"])


@router.post("/", response_model=LeaveOut, status_code=status.HTTP_201_CREATED)
async def create_leave_request(
    req: LeaveCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Employee apply for leave."""
    employee = current_user.employee_profile
    if not employee:
        raise NotFoundException(detail="Employee profile not found")

    leave = LeaveRequest(
        employee_id=employee.id,
        leave_type=req.leave_type,
        start_date=req.start_date,
        end_date=req.end_date,
        remarks=req.remarks,
        status=LeaveStatus.PENDING,
    )
    db.add(leave)
    await db.flush()

    # Log action
    await log_action(
        db=db,
        actor_user_id=current_user.id,
        action="LEAVE_REQUEST_SUBMITTED",
        entity_type="LeaveRequest",
        entity_id=leave.id,
        metadata_json={
            "type": req.leave_type.value,
            "start": req.start_date.isoformat(),
            "end": req.end_date.isoformat(),
        },
    )

    # Notify HR/Admin if possible, and send confirmation to employee
    await send_notification(
        db=db,
        user_id=current_user.id,
        title="Leave Request Submitted",
        message=f"Your {req.leave_type.value} leave request for {req.start_date} to {req.end_date} has been submitted.",
        notification_type=NotificationType.LEAVE_SUBMITTED,
    )

    await db.commit()

    stmt = (
        select(LeaveRequest)
        .options(selectinload(LeaveRequest.employee))
        .where(LeaveRequest.id == leave.id)
    )
    res = await db.execute(stmt)
    return res.scalar_one()


@router.get("/me", response_model=List[LeaveOut])
async def get_my_leaves(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get current employee's leave requests."""
    employee = current_user.employee_profile
    if not employee:
        raise NotFoundException(detail="Employee profile not found")

    stmt = (
        select(LeaveRequest)
        .options(selectinload(LeaveRequest.employee))
        .where(LeaveRequest.employee_id == employee.id)
        .order_by(LeaveRequest.created_at.desc())
    )
    res = await db.execute(stmt)
    return res.scalars().all()


@router.get("/all", response_model=List[LeaveOut])
async def list_all_leaves(
    status_filter: Optional[LeaveStatus] = Query(None, alias="status"),
    employee_id: Optional[int] = None,
    current_user: User = Depends(require_hr_or_admin),
    db: AsyncSession = Depends(get_db),
):
    """HR / Admin view all leave requests across organization."""
    stmt = (
        select(LeaveRequest)
        .options(
            selectinload(LeaveRequest.employee).selectinload(Employee.department)
        )
        .order_by(LeaveRequest.created_at.desc())
    )

    if status_filter:
        stmt = stmt.where(LeaveRequest.status == status_filter)
    if employee_id:
        stmt = stmt.where(LeaveRequest.employee_id == employee_id)

    res = await db.execute(stmt)
    return res.scalars().all()


@router.get("/{id}", response_model=LeaveOut)
async def get_leave_by_id(
    id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    stmt = (
        select(LeaveRequest)
        .options(selectinload(LeaveRequest.employee))
        .where(LeaveRequest.id == id)
    )
    res = await db.execute(stmt)
    leave = res.scalar_one_or_none()

    if not leave:
        raise NotFoundException(detail=f"Leave request {id} not found")

    check_employee_access(current_user, target_employee_id=leave.employee_id)
    return leave


@router.patch("/{id}/review", response_model=LeaveOut)
async def review_leave_request(
    id: int,
    req: LeaveReview,
    current_user: User = Depends(require_hr_or_admin),
    db: AsyncSession = Depends(get_db),
):
    """
    HR / Admin Approve or Reject leave request.
    Atomic operation:
    1. Validate state transition
    2. Update leave status, reviewed_by, reviewed_at, admin_comment
    3. Create employee notification
    4. Create audit log
    5. Update attendance records for date range if APPROVED
    """
    stmt = (
        select(LeaveRequest)
        .options(selectinload(LeaveRequest.employee).selectinload(Employee.user))
        .where(LeaveRequest.id == id)
    )
    res = await db.execute(stmt)
    leave = res.scalar_one_or_none()

    if not leave:
        raise NotFoundException(detail=f"Leave request {id} not found")

    if leave.status != LeaveStatus.PENDING:
        raise ConflictException(
            detail=f"Leave request is already in status '{leave.status.value}' and cannot be modified"
        )

    leave.status = req.status
    leave.admin_comment = req.admin_comment
    leave.reviewed_by = current_user.id
    leave.reviewed_at = datetime.now(timezone.utc)

    # 1. Update Attendance records if Approved
    if req.status == LeaveStatus.APPROVED:
        curr_date = leave.start_date
        while curr_date <= leave.end_date:
            att_stmt = select(Attendance).where(
                Attendance.employee_id == leave.employee_id,
                Attendance.date == curr_date,
            )
            att_res = await db.execute(att_stmt)
            att = att_res.scalar_one_or_none()
            if att:
                att.status = AttendanceStatus.LEAVE
            else:
                new_att = Attendance(
                    employee_id=leave.employee_id,
                    date=curr_date,
                    status=AttendanceStatus.LEAVE,
                )
                db.add(new_att)
            curr_date += timedelta(days=1)

    # 2. Notify Employee
    notif_type = (
        NotificationType.LEAVE_APPROVED
        if req.status == LeaveStatus.APPROVED
        else NotificationType.LEAVE_REJECTED
    )
    await send_notification(
        db=db,
        user_id=leave.employee.user_id,
        title=f"Leave Request {req.status.value}",
        message=f"Your {leave.leave_type.value} leave request ({leave.start_date} to {leave.end_date}) was {req.status.value.lower()} by HR."
        + (f" Comment: {req.admin_comment}" if req.admin_comment else ""),
        notification_type=notif_type,
    )

    # 3. Log Audit
    await log_action(
        db=db,
        actor_user_id=current_user.id,
        action=f"LEAVE_{req.status.value}",
        entity_type="LeaveRequest",
        entity_id=leave.id,
        metadata_json={
            "employee_id": leave.employee_id,
            "status": req.status.value,
            "admin_comment": req.admin_comment,
        },
    )

    await db.commit()

    res = await db.execute(stmt)
    return res.scalar_one()
