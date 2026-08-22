from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy import select, or_
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
from app.models.department import Department
from app.schemas.employee import (
    EmployeeOut,
    EmployeeDetailOut,
    EmployeeUpdatePermitted,
    EmployeeAdminUpdate,
)
from app.schemas.department import DepartmentOut, DepartmentCreate
from app.services.audit_service import log_action

router = APIRouter(prefix="/employees", tags=["Employee Management"])


@router.get("/me", response_model=EmployeeDetailOut)
async def get_my_employee_profile(current_user: User = Depends(get_current_user)):
    if not current_user.employee_profile:
        raise NotFoundException(detail="Employee profile not found")
    return current_user.employee_profile


@router.patch("/me", response_model=EmployeeDetailOut)
async def update_my_employee_profile(
    req: EmployeeUpdatePermitted,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Employee permitted edits: phone, address, profile_picture.
    Does NOT allow modifying job_title, department, role, or salary.
    """
    employee = current_user.employee_profile
    if not employee:
        raise NotFoundException(detail="Employee profile not found")

    if req.phone is not None:
        employee.phone = req.phone
    if req.address is not None:
        employee.address = req.address
    if req.profile_picture is not None:
        employee.profile_picture = req.profile_picture
    if req.pan_number is not None:
        employee.pan_number = req.pan_number
    if req.aadhaar_number is not None:
        employee.aadhaar_number = req.aadhaar_number
    if req.uan_number is not None:
        employee.uan_number = req.uan_number
    if req.bank_account is not None:
        employee.bank_account = req.bank_account
    if req.ifsc_code is not None:
        employee.ifsc_code = req.ifsc_code
    if req.emergency_contact is not None:
        employee.emergency_contact = req.emergency_contact

    await log_action(
        db=db,
        actor_user_id=current_user.id,
        action="EMPLOYEE_PROFILE_UPDATED",
        entity_type="Employee",
        entity_id=employee.id,
    )
    await db.commit()

    stmt = (
        select(Employee)
        .options(selectinload(Employee.user), selectinload(Employee.department))
        .where(Employee.id == employee.id)
    )
    res = await db.execute(stmt)
    return res.scalar_one()


@router.get("/", response_model=List[EmployeeDetailOut])
async def list_employees(
    search: Optional[str] = None,
    department_id: Optional[int] = None,
    current_user: User = Depends(require_hr_or_admin),
    db: AsyncSession = Depends(get_db),
):
    """
    HR sees only EMPLOYEE role staff.
    ADMIN sees everyone (both EMPLOYEE and HR staff).
    """
    stmt = (
        select(Employee)
        .join(Employee.user)
        .options(selectinload(Employee.user), selectinload(Employee.department))
    )

    if current_user.role == UserRole.HR:
        stmt = stmt.where(User.role == UserRole.EMPLOYEE)

    if department_id:
        stmt = stmt.where(Employee.department_id == department_id)

    if search:
        search_pattern = f"%{search}%"
        stmt = stmt.where(
            or_(
                Employee.first_name.ilike(search_pattern),
                Employee.last_name.ilike(search_pattern),
                Employee.job_title.ilike(search_pattern),
            )
        )

    stmt = stmt.order_by(Employee.id.asc())
    res = await db.execute(stmt)
    return res.scalars().all()


@router.get("/{id}", response_model=EmployeeDetailOut)
async def get_employee_by_id(
    id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    check_employee_access(current_user, target_employee_id=id)

    stmt = (
        select(Employee)
        .options(selectinload(Employee.user), selectinload(Employee.department))
        .where(Employee.id == id)
    )
    res = await db.execute(stmt)
    employee = res.scalar_one_or_none()

    if not employee:
        raise NotFoundException(detail=f"Employee with ID {id} not found")
    return employee


@router.patch("/{id}", response_model=EmployeeDetailOut)
async def admin_update_employee(
    id: int,
    req: EmployeeAdminUpdate,
    current_user: User = Depends(require_hr_or_admin),
    db: AsyncSession = Depends(get_db),
):
    """HR / Admin update any employee attributes."""
    stmt = (
        select(Employee)
        .options(selectinload(Employee.user), selectinload(Employee.department))
        .where(Employee.id == id)
    )
    res = await db.execute(stmt)
    employee = res.scalar_one_or_none()

    if not employee:
        raise NotFoundException(detail=f"Employee with ID {id} not found")

    if req.first_name is not None:
        employee.first_name = req.first_name
    if req.last_name is not None:
        employee.last_name = req.last_name
    if req.phone is not None:
        employee.phone = req.phone
    if req.address is not None:
        employee.address = req.address
    if req.job_title is not None:
        employee.job_title = req.job_title
    if req.department_id is not None:
        employee.department_id = req.department_id
    if req.joining_date is not None:
        employee.joining_date = req.joining_date
    if req.profile_picture is not None:
        employee.profile_picture = req.profile_picture

    await log_action(
        db=db,
        actor_user_id=current_user.id,
        action="ADMIN_EMPLOYEE_UPDATED",
        entity_type="Employee",
        entity_id=employee.id,
    )
    await db.commit()

    res = await db.execute(stmt)
    return res.scalar_one()


# Department Endpoints
@router.get("/departments/all", response_model=List[DepartmentOut])
async def list_departments(db: AsyncSession = Depends(get_db)):
    stmt = select(Department).order_by(Department.name.asc())
    res = await db.execute(stmt)
    return res.scalars().all()


@router.post(
    "/departments/all",
    response_model=DepartmentOut,
    status_code=status.HTTP_201_CREATED,
)
async def create_department(
    req: DepartmentCreate,
    current_user: User = Depends(require_hr_or_admin),
    db: AsyncSession = Depends(get_db),
):
    dept = Department(name=req.name, description=req.description)
    db.add(dept)
    await db.flush()

    await log_action(
        db=db,
        actor_user_id=current_user.id,
        action="DEPARTMENT_CREATED",
        entity_type="Department",
        entity_id=dept.id,
    )
    await db.commit()
    return dept
