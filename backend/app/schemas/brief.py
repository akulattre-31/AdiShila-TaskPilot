from pydantic import BaseModel, Field
from typing import Dict, Any
from app.schemas.recommend import ProfilePayload

class BriefRequest(BaseModel):
    task_id: str = Field(..., pattern=r'^TASK_[A-Z0-9_]{2,20}$')
    profile: ProfilePayload
    task: Dict[str, Any]

