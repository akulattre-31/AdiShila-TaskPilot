from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.config import settings

security = HTTPBearer()

def utcnow():
    return datetime.now(timezone.utc)

def create_session_token(team_id: str, name: str) -> str:
    return jwt.encode(
        {"sub": team_id, "name": name, "exp": utcnow() + timedelta(hours=24)},
        settings.JWT_SECRET, algorithm="HS256"
    )

def verify_token(token: str) -> dict:
    try:
        return jwt.decode(token, settings.JWT_SECRET, algorithms=["HS256"])
    except JWTError:
        raise HTTPException(401, "Invalid or expired session.")

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> dict:
    return verify_token(credentials.credentials)
