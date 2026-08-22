from typing import List, Callable
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.config import settings
from app.core.exceptions import CredentialsException, PermissionDeniedException
from app.db.database import get_db
from app.models.user import User, UserRole
from app.models.employee import Employee

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")


async def get_current_user(
    db: AsyncSession = Depends(get_db), token: str = Depends(oauth2_scheme)
) -> User:
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        user_id_str: str = payload.get("sub")
        token_type: str = payload.get("type")
        if user_id_str is None or token_type != "access":
            raise CredentialsException()
        user_id = int(user_id_str)
    except (JWTError, ValueError):
        raise CredentialsException()

    stmt = (
        select(User)
        .options(
            selectinload(User.employee_profile).selectinload(Employee.department)
        )
        .where(User.id == user_id)
    )
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()

    if user is None or not user.is_active:
        raise CredentialsException(detail="Inactive or non-existent user")
    return user


def require_roles(allowed_roles: List[UserRole]) -> Callable:
    async def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in allowed_roles:
            raise PermissionDeniedException(
                detail=f"Operation restricted to roles: {[r.value for r in allowed_roles]}"
            )
        return current_user

    return role_checker


require_admin = require_roles([UserRole.ADMIN])
require_hr = require_roles([UserRole.HR])
require_hr_or_admin = require_roles([UserRole.HR, UserRole.ADMIN])
require_employee_or_hr = require_roles([UserRole.EMPLOYEE, UserRole.HR, UserRole.ADMIN])


def check_employee_access(current_user: User, target_employee_id: int):
    """
    Object-level authorization check.
    Employee users can ONLY access their own employee record.
    HR and ADMIN users can access any employee record.
    """
    if current_user.role in (UserRole.HR, UserRole.ADMIN):
        return True
    if current_user.employee_profile and current_user.employee_profile.id == target_employee_id:
        return True
    raise PermissionDeniedException(
        detail="You are not authorized to view or modify another employee's records"
    )
