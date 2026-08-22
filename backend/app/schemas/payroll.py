from datetime import datetime, date
from decimal import Decimal
from typing import Optional
from pydantic import BaseModel, Field, model_validator, ConfigDict
from app.schemas.employee import EmployeeOut


class PayrollUpdate(BaseModel):
    basic_salary: Decimal = Field(..., ge=0)
    allowances: Decimal = Field(Decimal("0.0"), ge=0)
    deductions: Decimal = Field(Decimal("0.0"), ge=0)
    effective_from: Optional[date] = None

    @model_validator(mode="after")
    def calculate_net(self):
        return self


class PayrollOut(BaseModel):
    id: int
    employee_id: int
    basic_salary: Decimal
    allowances: Decimal
    deductions: Decimal
    net_salary: Decimal
    effective_from: date
    created_at: datetime
    updated_at: datetime
    employee: Optional[EmployeeOut] = None

    model_config = ConfigDict(from_attributes=True)
