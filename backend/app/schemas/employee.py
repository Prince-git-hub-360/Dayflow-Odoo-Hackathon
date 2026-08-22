from datetime import datetime, date
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict
from app.schemas.department import DepartmentOut
from app.schemas.user import UserOut


class EmployeeCreate(BaseModel):
    user_id: int
    first_name: str = Field(..., min_length=1, max_length=100)
    last_name: str = Field(..., min_length=1, max_length=100)
    phone: Optional[str] = Field(None, max_length=20)
    address: Optional[str] = Field(None, max_length=255)
    job_title: str = Field(..., min_length=1, max_length=100)
    department_id: Optional[int] = None
    joining_date: Optional[date] = None
    profile_picture: Optional[str] = None


class EmployeeUpdatePermitted(BaseModel):
    phone: Optional[str] = Field(None, max_length=20)
    address: Optional[str] = Field(None, max_length=255)
    profile_picture: Optional[str] = None
    pan_number: Optional[str] = None
    aadhaar_number: Optional[str] = None
    uan_number: Optional[str] = None
    bank_account: Optional[str] = None
    ifsc_code: Optional[str] = None
    emergency_contact: Optional[str] = None


class EmployeeAdminUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    job_title: Optional[str] = None
    department_id: Optional[int] = None
    joining_date: Optional[date] = None
    profile_picture: Optional[str] = None
    pan_number: Optional[str] = None
    aadhaar_number: Optional[str] = None
    uan_number: Optional[str] = None
    bank_account: Optional[str] = None
    ifsc_code: Optional[str] = None
    emergency_contact: Optional[str] = None


class EmployeeOut(BaseModel):
    id: int
    user_id: int
    first_name: str
    last_name: str
    phone: Optional[str] = None
    address: Optional[str] = None
    job_title: str
    department_id: Optional[int] = None
    joining_date: date
    profile_picture: Optional[str] = None
    pan_number: Optional[str] = None
    aadhaar_number: Optional[str] = None
    uan_number: Optional[str] = None
    bank_account: Optional[str] = None
    ifsc_code: Optional[str] = None
    emergency_contact: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class EmployeeDetailOut(EmployeeOut):
    user: UserOut
    department: Optional[DepartmentOut] = None

    model_config = ConfigDict(from_attributes=True)
