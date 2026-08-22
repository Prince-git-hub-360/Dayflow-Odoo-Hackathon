from typing import List, Optional
from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_db, require_hr_or_admin
from app.models.user import User
from app.models.audit_log import AuditLog
from app.schemas.audit_log import AuditLogOut

router = APIRouter(prefix="/audit-logs", tags=["Audit Trail"])


@router.get("/", response_model=List[AuditLogOut])
async def list_audit_logs(
    action: Optional[str] = None,
    limit: int = 50,
    current_user: User = Depends(require_hr_or_admin),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(AuditLog).order_by(AuditLog.timestamp.desc()).limit(limit)

    if action:
        stmt = stmt.where(AuditLog.action.ilike(f"%{action}%"))

    res = await db.execute(stmt)
    return res.scalars().all()
