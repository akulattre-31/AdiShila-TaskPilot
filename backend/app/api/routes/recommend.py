from fastapi import APIRouter, Depends, Request, HTTPException
from typing import Dict, Any
from app.schemas.recommend import RecommendRequest
from app.core.security import get_current_user
from app.core.limiter import limiter
from app.services.gemini import call_gemini
from app.services.sanitizer import safe_parse_json
from app.services.pdf_reader import get_catalogue_text
from app.api.routes.track import get_user_actions

router = APIRouter()

@router.post("")
@limiter.limit("100/minute")
async def recommend_tasks(
    request: Request, 
    req_data: RecommendRequest,
    current_user: dict = Depends(get_current_user)
):
    if current_user["sub"] != req_data.profile.team_id:
        raise HTTPException(403, "Access denied.")

    auth_header = request.headers.get("Authorization", "")
    token = auth_header.replace("Bearer ", "") if auth_header else "anonymous"
    
    catalogue_text = get_catalogue_text()
    live_actions = await get_user_actions(token)
    
    prompt = f"""
    You are the Adishila recommendation engine. Your task is to recommend 3 tasks from the Business Lab Task Catalogue for this user.
    
    --- BUSINESS LAB CATALOGUE ---
    {catalogue_text[:10000]} # Truncating slightly to avoid context limits if necessary, though Gemini handles large contexts.
    
    User Profile:
    {req_data.profile.json()}
    
    Live Session Actions (What they are doing right now):
    {live_actions[-10:] if live_actions else 'No recent actions recorded.'}
    
    Based on the profile and their live actions (e.g. if they clicked on specific tasks or generated briefs), select 3 highly relevant tasks from the catalogue.
    Return ONLY valid JSON in this structure:
    {{
        "rankings": [
            {{"taskId": "TASK_T15", "grade": "S", "successProbability": 85, "title": "AI Tool Built", "gbp": 450, "timeHours": 15, "fitReason": "Matches your AI skills."}}
        ]
    }}
    """
    
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"temperature": 0.2}
    }
    
    raw_response = await call_gemini(payload)
    parsed = safe_parse_json(raw_response, {"rankings": []})
    
    return parsed
