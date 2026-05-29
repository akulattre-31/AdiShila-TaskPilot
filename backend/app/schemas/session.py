from pydantic import BaseModel, Field

class SessionCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=80)
    team_id: str = Field(..., pattern=r'^\d{4}$')
