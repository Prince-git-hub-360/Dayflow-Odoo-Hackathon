from typing import List, Optional
from fastapi import APIRouter, Depends, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.exceptions import NotFoundException, PermissionDeniedException
from app.core.dependencies import (
    get_current_user,
    get_db,
    require_hr_or_admin,
    check_employee_access,
)
from app.models.user import User, UserRole
from app.models.employee import Employee
from app.models.payroll import Payroll
from app.models.notification import NotificationType
from app.schemas.payroll import PayrollOut, PayrollUpdate
from app.services.audit_service import log_action
from app.services.notification_service import send_notification

router = APIRouter(prefix="/payroll", tags=["Payroll Management"])


@router.get("/me", response_model=PayrollOut)
async def get_my_payroll(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Employee read-only access to own payroll structure.
    """
    employee = current_user.employee_profile
    if not employee:
        raise NotFoundException(detail="Employee profile not found")

    stmt = (
        select(Payroll)
        .options(selectinload(Payroll.employee))
        .where(Payroll.employee_id == employee.id)
    )
    res = await db.execute(stmt)
    payroll = res.scalar_one_or_none()

    if not payroll:
        raise NotFoundException(detail="Payroll record not found for employee")
    return payroll


@router.get("/", response_model=List[PayrollOut])
async def list_all_payrolls(
    current_user: User = Depends(require_hr_or_admin),
    db: AsyncSession = Depends(get_db),
):
    """
    HR / Admin view payroll for all employees across organization.
    """
    stmt = (
        select(Payroll)
        .options(
            selectinload(Payroll.employee).selectinload(Employee.department)
        )
        .order_by(Payroll.employee_id.asc())
    )
    res = await db.execute(stmt)
    return res.scalars().all()


@router.get("/{employee_id}", response_model=PayrollOut)
async def get_employee_payroll(
    employee_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    check_employee_access(current_user, target_employee_id=employee_id)

    stmt = (
        select(Payroll)
        .options(selectinload(Payroll.employee))
        .where(Payroll.employee_id == employee_id)
    )
    res = await db.execute(stmt)
    payroll = res.scalar_one_or_none()

    if not payroll:
        raise NotFoundException(detail=f"Payroll for employee ID {employee_id} not found")
    return payroll


@router.patch("/{employee_id}", response_model=PayrollOut)
async def update_employee_payroll(
    employee_id: int,
    req: PayrollUpdate,
    current_user: User = Depends(require_hr_or_admin),  # Explicit RBAC check
    db: AsyncSession = Depends(get_db),
):
    """
    HR / Admin update employee salary structure.
    Strictly forbidden for standard EMPLOYEE role (returns HTTP 403 Forbidden).
    Calculates net_salary = basic_salary + allowances - deductions.
    Sends notification to employee & logs audit trail.
    """
    stmt = (
        select(Payroll)
        .options(selectinload(Payroll.employee).selectinload(Employee.user))
        .where(Payroll.employee_id == employee_id)
    )
    res = await db.execute(stmt)
    payroll = res.scalar_one_or_none()

    if not payroll:
        # Create payroll if missing
        net = req.basic_salary + req.allowances - req.deductions
        payroll = Payroll(
            employee_id=employee_id,
            basic_salary=req.basic_salary,
            allowances=req.allowances,
            deductions=req.deductions,
            net_salary=net,
            effective_from=req.effective_from or date.today(),
        )
        db.add(payroll)
    else:
        payroll.basic_salary = req.basic_salary
        payroll.allowances = req.allowances
        payroll.deductions = req.deductions
        payroll.net_salary = req.basic_salary + req.allowances - req.deductions
        if req.effective_from:
            payroll.effective_from = req.effective_from

    await db.flush()

    # Notify employee
    if payroll.employee and payroll.employee.user_id:
        await send_notification(
            db=db,
            user_id=payroll.employee.user_id,
            title="Payroll Structure Updated",
            message=f"Your payroll record has been updated by HR. Net Salary: ${payroll.net_salary:,.2f}",
            notification_type=NotificationType.PAYROLL_UPDATED,
        )

    # Log audit action
    await log_action(
        db=db,
        actor_user_id=current_user.id,
        action="PAYROLL_UPDATED",
        entity_type="Payroll",
        entity_id=payroll.id,
        metadata_json={
            "employee_id": employee_id,
            "basic": float(payroll.basic_salary),
            "net": float(payroll.net_salary),
        },
    )

    await db.commit()

    res = await db.execute(stmt)
    return res.scalar_one()
