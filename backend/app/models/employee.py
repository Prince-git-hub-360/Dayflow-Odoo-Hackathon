from datetime import datetime, date, timezone
from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.database import Base


class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False
    )
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=True)
    address = Column(String(255), nullable=True)
    job_title = Column(String(100), nullable=False)
    department_id = Column(
        Integer, ForeignKey("departments.id", ondelete="SET NULL"), nullable=True
    )
    joining_date = Column(Date, default=date.today, nullable=False)
    profile_picture = Column(String(500), nullable=True)
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

    # Relationships
    user = relationship("User", back_populates="employee_profile")
    department = relationship("Department", back_populates="employees")
    attendances = relationship(
        "Attendance", back_populates="employee", cascade="all, delete-orphan"
    )
    leave_requests = relationship(
        "LeaveRequest", back_populates="employee", cascade="all, delete-orphan"
    )
    payroll = relationship(
        "Payroll", back_populates="employee", uselist=False, cascade="all, delete-orphan"
    )
