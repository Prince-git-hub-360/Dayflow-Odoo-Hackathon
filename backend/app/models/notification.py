import enum
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, Enum, ForeignKey
from sqlalchemy.orm import relationship
from app.db.database import Base


class NotificationType(str, enum.Enum):
    LEAVE_SUBMITTED = "LEAVE_SUBMITTED"
    LEAVE_APPROVED = "LEAVE_APPROVED"
    LEAVE_REJECTED = "LEAVE_REJECTED"
    PAYROLL_UPDATED = "PAYROLL_UPDATED"
    ATTENDANCE_ALERT = "ATTENDANCE_ALERT"
    GENERAL = "GENERAL"


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    notification_type = Column(
        Enum(NotificationType), default=NotificationType.GENERAL, nullable=False
    )
    is_read = Column(Boolean, default=False, nullable=False)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    user = relationship("User", back_populates="notifications")
