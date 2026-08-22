from datetime import datetime, date, timezone
from sqlalchemy import Column, Integer, Numeric, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.database import Base


class Payroll(Base):
    __tablename__ = "payrolls"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(
        Integer, ForeignKey("employees.id", ondelete="CASCADE"), unique=True, nullable=False
    )
    basic_salary = Column(Numeric(12, 2), nullable=False, default=0.0)
    allowances = Column(Numeric(12, 2), nullable=False, default=0.0)
    deductions = Column(Numeric(12, 2), nullable=False, default=0.0)
    net_salary = Column(Numeric(12, 2), nullable=False, default=0.0)
    effective_from = Column(Date, default=date.today, nullable=False)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    employee = relationship("Employee", back_populates="payroll")
