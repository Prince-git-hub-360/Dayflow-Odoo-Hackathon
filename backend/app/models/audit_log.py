from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.db.database import Base


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    actor_user_id = Column(
        Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True
    )
    action = Column(String(100), nullable=False, index=True)  # e.g., LEAVE_APPROVED, PAYROLL_UPDATED
    entity_type = Column(String(100), nullable=False)  # e.g., LeaveRequest, Payroll, Employee
    entity_id = Column(Integer, nullable=True)
    metadata_json = Column(JSON, nullable=True)  # additional context, no secrets
    timestamp = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
        index=True,
    )

    actor_user = relationship("User", back_populates="audit_logs")
