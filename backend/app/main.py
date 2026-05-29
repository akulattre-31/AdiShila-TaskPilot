from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from app.core.config import settings
from app.core.limiter import limiter
from app.api.routes import session, recommend, brief, tip, track, chat

app = FastAPI(title="TaskPilot API")

# Setup Rate Limiting
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.ALLOWED_ORIGIN],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "Authorization"],
)

# Security Headers
@app.middleware("http")
async def security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Cache-Control"] = "no-store"
    return response

# Routes
app.include_router(session.router, prefix="/api/session", tags=["Session"])
app.include_router(recommend.router, prefix="/api/recommend", tags=["Recommend"])
app.include_router(brief.router, prefix="/api/brief", tags=["Brief"])
app.include_router(tip.router, prefix="/api/tip", tags=["Tip"])
app.include_router(track.router, prefix="/api/track", tags=["Track"])
app.include_router(chat.router, prefix="/api/chat", tags=["Chat"])

@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "taskpilot-api"}
