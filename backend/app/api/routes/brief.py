from fastapi import APIRouter, Depends, Request, HTTPException
from app.schemas.brief import BriefRequest
from app.core.security import get_current_user
from app.core.limiter import limiter
from app.services.prompt_builder import build_brief_prompt
from app.services.gemini import call_gemini
from app.services.sanitizer import sanitize_text

router = APIRouter()

# Mocked task db reference
TASKS_DB = {
    "TASK_T11": {"id": "TASK_T11", "title": "AI Chatbot Prototype", "gbp": 200, "timeHours": 10, "skills": ["Python", "FastAPI"], "grade": "A", "description": "Build a chatbot", "proofRequired": ["Code", "Demo"]},
    "TASK_T15": {"id": "TASK_T15", "title": "AI-Powered Internal Tool Built and Deployed", "gbp": 450, "timeHours": 17, "skills": ["React", "FastAPI", "Prompt Engineering", "AI/ML", "Python"], "grade": "SS", "description": "Conceptualise, build, and deploy an AI-powered tool", "proofRequired": ["Live tool link", "User guide", "Technical documentation", "Demo recording or live session", "Tech Lead and Chief Administrator sign-off"]},
    "TASK_B01": {"id": "TASK_B01", "title": "Market Entry Strategy", "gbp": 300, "timeHours": 12, "skills": ["Business Strategy", "Market Research"], "grade": "S", "description": "Strategy", "proofRequired": ["Report"]},
    "TASK_C01": {"id": "TASK_C01", "title": "Brand Redesign", "gbp": 400, "timeHours": 20, "skills": ["Graphic Design", "Content Writing"], "grade": "SS", "description": "Redesign", "proofRequired": ["Figma link"]}
}

@router.post("")
@limiter.limit("100/minute")
async def generate_brief(
    request: Request,
    req_data: BriefRequest,
    current_user: dict = Depends(get_current_user)
):
    if current_user["sub"] != req_data.profile.team_id:
        raise HTTPException(403, "Access denied.")
    
    # Use dynamic task data from frontend payload
    task = req_data.task
    if not task:
        raise HTTPException(404, "Task not found.")

    prompt_payload = build_brief_prompt(task, req_data.profile)
    raw_response = await call_gemini(prompt_payload)
    safe_text = sanitize_text(raw_response)
    
    return {"brief": safe_text}
