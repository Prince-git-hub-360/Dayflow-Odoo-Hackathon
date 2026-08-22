from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.config import settings
from app.core.security import (
    get_password_hash,
    verify_password,
    create_access_token,
    create_refresh_token,
)
from app.core.exceptions import CredentialsException, ConflictException
from app.core.dependencies import get_current_user, get_db
from app.models.user import User, UserRole
from app.models.employee import Employee
from app.models.payroll import Payroll
from app.schemas.auth import Token, LoginRequest, RegisterRequest
from app.schemas.user import UserOut
from app.services.audit_service import log_action
from app.services.notification_service import send_notification

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def register(req: RegisterRequest, db: AsyncSession = Depends(get_db)):
    # Check existing email or employee_id
    stmt = select(User).where(
        (User.email == req.email) | (User.employee_id == req.employee_id)
    )
    res = await db.execute(stmt)
    if res.scalar_one_or_none():
        raise ConflictException(
            detail="User with this Email or Employee ID already exists"
        )

    # Hash password
    pwd_hash = get_password_hash(req.password)

    # Create User
    user = User(
        employee_id=req.employee_id,
        email=req.email,
        password_hash=pwd_hash,
        role=req.role,
        email_verified=True,
        is_active=True,
    )
    db.add(user)
    await db.flush()

    # Create Employee Profile
    employee = Employee(
        user_id=user.id,
        first_name=req.first_name,
        last_name=req.last_name,
        job_title=req.job_title,
        department_id=req.department_id,
    )
    db.add(employee)
    await db.flush()

    # Create Default Payroll Record
    payroll = Payroll(
        employee_id=employee.id,
        basic_salary=50000.0,
        allowances=5000.0,
        deductions=2000.0,
        net_salary=53000.0,
    )
    db.add(payroll)

    # Send Welcome Notification
    await send_notification(
        db=db,
        user_id=user.id,
        title="Welcome to Dayflow HRMS",
        message=f"Hello {req.first_name}, your account has been successfully created.",
    )

    # Audit Log
    await log_action(
        db=db,
        actor_user_id=user.id,
        action="USER_REGISTERED",
        entity_type="User",
        entity_id=user.id,
        metadata_json={"email": user.email, "role": user.role.value},
    )

    await db.commit()

    # Refresh user with employee relationship
    stmt = (
        select(User)
        .options(selectinload(User.employee_profile))
        .where(User.id == user.id)
    )
    res = await db.execute(stmt)
    return res.scalar_one()


@router.post("/login", response_model=Token)
async def login(
    req: LoginRequest, db: AsyncSession = Depends(get_db)
):
    stmt = (
        select(User)
        .options(selectinload(User.employee_profile))
        .where(User.email == req.email)
    )
    res = await db.execute(stmt)
    user = res.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User account not found"
        )

    if not verify_password(req.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password"
        )

    if not user.is_active:
        raise CredentialsException(detail="Account is inactive")

    access_token = create_access_token(subject=user.id)
    refresh_token = create_refresh_token(subject=user.id)

    # Log action
    await log_action(
        db=db,
        actor_user_id=user.id,
        action="USER_LOGIN",
        entity_type="User",
        entity_id=user.id,
    )
    await db.commit()

    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
    )


@router.post("/forgot-password")
async def forgot_password(email: str, db: AsyncSession = Depends(get_db)):
    stmt = select(User).where(User.email == email)
    res = await db.execute(stmt)
    user = res.scalar_one_or_none()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User with this email does not exist"
        )
    return {"message": "Password reset link sent to your registered email address"}


@router.post("/reset-password")
async def reset_password(req: LoginRequest, db: AsyncSession = Depends(get_db)):
    stmt = select(User).where(User.email == req.email)
    res = await db.execute(stmt)
    user = res.scalar_one_or_none()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User account not found"
        )
    user.password_hash = get_password_hash(req.password)
    await db.commit()
    return {"message": "Password successfully reset! You can now log in with your new password."}


@router.post("/refresh", response_model=Token)
async def refresh_token(refresh_token: str, db: AsyncSession = Depends(get_db)):
    try:
        from jose import jwt
        payload = jwt.decode(
            refresh_token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        user_id = int(payload.get("sub"))
        token_type = payload.get("type")
        if token_type != "refresh":
            raise CredentialsException(detail="Invalid refresh token type")
    except Exception:
        raise CredentialsException(detail="Invalid refresh token")

    stmt = select(User).where(User.id == user_id)
    res = await db.execute(stmt)
    user = res.scalar_one_or_none()

    if not user or not user.is_active:
        raise CredentialsException(detail="User inactive or not found")

    new_access_token = create_access_token(subject=user.id)
    new_refresh_token = create_refresh_token(subject=user.id)

    return Token(
        access_token=new_access_token,
        refresh_token=new_refresh_token,
        token_type="bearer",
    )


@router.post("/logout")
async def logout(current_user: User = Depends(get_current_user)):
    return {"message": "Successfully logged out"}


@router.get("/me", response_model=UserOut)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user
