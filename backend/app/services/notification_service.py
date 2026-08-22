from sqlalchemy.ext.asyncio import AsyncSession
from app.models.notification import Notification, NotificationType


async def send_notification(
    db: AsyncSession,
    user_id: int,
    title: str,
    message: str,
    notification_type: NotificationType = NotificationType.GENERAL,
) -> Notification:
    notif = Notification(
        user_id=user_id,
        title=title,
        message=message,
        notification_type=notification_type,
        is_read=False,
    )
    db.add(notif)
    await db.flush()
    return notif
