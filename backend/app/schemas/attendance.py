from datetime import datetime, date
from typing import Optional
from pydantic import BaseModel, ConfigDict
from app.models.attendance import AttendanceStatus


class CheckInRequest(BaseModel):
    date: Optional[date] = None


class CheckOutRequest(BaseModel):
    attendance_id: Optional[int] = None


class AttendanceOut(BaseModel):
    id: int
    employee_id: int
    date: date
    check_in: Optional[datetime] = None
    check_out: Optional[datetime] = None
    status: AttendanceStatus
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AttendanceSummaryOut(BaseModel):
    total_days: int
    present_days: int
    absent_days: int
    half_days: int
    leave_days: int
    attendance_rate: float
