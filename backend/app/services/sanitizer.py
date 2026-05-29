import re
import json
from app.core.logger import logger

def sanitize_text(raw: str) -> str:
    cleaned = re.sub(r'<[^>]*>', '', raw)          # strip HTML tags
    cleaned = re.sub(r'javascript\s*:', '',          # strip JS protocol
                     cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r'on\w+\s*=', '',              # strip event handlers
                     cleaned, flags=re.IGNORECASE)
    return cleaned.strip()[:4000]                   # hard length cap

def safe_parse_json(raw: str, fallback: dict) -> dict:
    try:
        clean = re.sub(r'```json|```', '', raw).strip()
        return json.loads(clean)
    except (json.JSONDecodeError, ValueError):
        logger.warning({"event": "json_parse_failed"})
        return fallback   # always return safe data, never crash or expose
