from fastapi import APIRouter, Depends
from app.core.security import get_current_user
from app.core.limiter import limiter
from fastapi import Request
import random

router = APIRouter()

TIPS = [
    "Block out 2 hours of deep work for your SS grade tasks.",
    "Communication is key: always verify requirements with your PM.",
    "Double check your proof requirements before marking complete."
]

@router.get("")
@limiter.limit("2/hour")
async def get_tip(
    request: Request,
    current_user: dict = Depends(get_current_user)
):
    return {"tip": random.choice(TIPS)}
