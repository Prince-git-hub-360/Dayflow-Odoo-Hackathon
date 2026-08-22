from typing import Optional, Any, Dict
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.audit_log import AuditLog


async def log_action(
    db: AsyncSession,
    actor_user_id: Optional[int],
    action: str,
    entity_type: str,
    entity_id: Optional[int] = None,
    metadata_json: Optional[Dict[str, Any]] = None,
) -> AuditLog:
    log_entry = AuditLog(
        actor_user_id=actor_user_id,
        action=action,
        entity_type=entity_type,
        entity_id=entity_id,
        metadata_json=metadata_json,
    )
    db.add(log_entry)
    await db.flush()
    return log_entry
