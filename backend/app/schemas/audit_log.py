from datetime import datetime
from typing import Optional, Any, Dict
from pydantic import BaseModel, ConfigDict


class AuditLogOut(BaseModel):
    id: int
    actor_user_id: Optional[int] = None
    action: str
    entity_type: str
    entity_id: Optional[int] = None
    metadata_json: Optional[Dict[str, Any]] = None
    timestamp: datetime

    model_config = ConfigDict(from_attributes=True)
