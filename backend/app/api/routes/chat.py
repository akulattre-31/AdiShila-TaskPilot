from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel
from app.services.gemini import call_gemini
from app.services.pdf_reader import get_catalogue_text
from app.core.limiter import limiter
from app.services.sanitizer import sanitize_text
from app.api.routes.track import get_user_actions

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    profile: dict

@router.post("")
@limiter.limit("20/minute")
async def chat_with_bot(request: Request, payload: ChatRequest):
    auth_header = request.headers.get("Authorization", "")
    token = auth_header.replace("Bearer ", "") if auth_header else "anonymous"
    
    pdf_text = get_catalogue_text()
    recent_actions = await get_user_actions(token)
    
    system_prompt = f"""
    You are the Adishila Core, an advanced AI Assistant for the GO-BRICS Business Lab.
    You possess complete knowledge of the Task Catalogue.
    
    --- TASK CATALOGUE PDF ---
    {pdf_text[:15000]}
    --- END CATALOGUE ---
    
    User Profile: {payload.profile}
    Recent User Actions (Live Tracking): {recent_actions[-5:] if recent_actions else 'None'}
    
    Respond directly, concisely, and professionally to the user's question based strictly on the provided Task Catalogue. Do not hallucinate tasks or details not in the catalogue. 
    If the user asks about which task they should do, analyze their profile and their recent actions to provide a hyper-personalized recommendation. Use a mystical, commanding, yet highly operational 'Adishila' persona (think ancient wisdom meets high-tech military ops). Use markdown formatting for readability.
    """
    
    try:
        req_payload = {
            "contents": [{"parts": [{"text": f"System Context: {system_prompt}\n\nUser Message: {payload.message}"}]}],
            "generationConfig": {"temperature": 0.7}
        }
        raw_response = await call_gemini(req_payload)
        safe_response = sanitize_text(raw_response)
        return {"response": safe_response}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Adishila Core offline. Connection failed.")
