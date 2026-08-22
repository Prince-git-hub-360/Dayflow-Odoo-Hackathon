from datetime import datetime, date
from typing import Optional
from pydantic import BaseModel, Field, model_validator, ConfigDict
from app.models.leave import LeaveType, LeaveStatus
from app.schemas.employee import EmployeeOut


class LeaveCreate(BaseModel):
    leave_type: LeaveType
    start_date: date
    end_date: date
    remarks: Optional[str] = Field(None, max_length=500)

    @model_validator(mode="after")
    def validate_dates(self):
        if self.end_date < self.start_date:
            raise ValueError("end_date cannot be earlier than start_date")
        return self


class LeaveReview(BaseModel):
    status: LeaveStatus
    admin_comment: Optional[str] = Field(None, max_length=500)

    @model_validator(mode="after")
    def validate_status(self):
        if self.status not in (LeaveStatus.APPROVED, LeaveStatus.REJECTED):
            raise ValueError("Review status must be APPROVED or REJECTED")
        return self


class LeaveOut(BaseModel):
    id: int
    employee_id: int
    leave_type: LeaveType
    start_date: date
    end_date: date
    remarks: Optional[str] = None
    status: LeaveStatus
    admin_comment: Optional[str] = None
    reviewed_by: Optional[int] = None
    reviewed_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    employee: Optional[EmployeeOut] = None

    model_config = ConfigDict(from_attributes=True)
