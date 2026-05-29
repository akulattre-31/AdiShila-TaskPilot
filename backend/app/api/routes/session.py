from fastapi import APIRouter, Request
from app.schemas.session import SessionCreate
from app.core.security import create_session_token
from app.core.limiter import limiter

router = APIRouter()

@router.post("")
@limiter.limit("5/minute")
async def create_session(request: Request, data: SessionCreate):
    token = create_session_token(data.team_id, data.name)
    return {"token": token}
