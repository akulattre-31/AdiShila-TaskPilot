import logging
import json
from datetime import datetime, timezone

REDACTED = {"api_key", "key", "token", "secret", "password", "message", "response", "content", "text", "brief", "prompt"}

def utcnow():
    return datetime.now(timezone.utc)

class SecureFormatter(logging.Formatter):
    def format(self, record):
        data = {"ts": utcnow().isoformat(), "level": record.levelname}
        if isinstance(record.msg, dict):
            data.update({
                k: "[REDACTED]" if k in REDACTED else v
                for k, v in record.msg.items()
            })
        else:
            data["event"] = str(record.msg)
        return json.dumps(data)

# Set up global logger
logger = logging.getLogger("taskpilot")
logger.setLevel(logging.INFO)
handler = logging.StreamHandler()
handler.setFormatter(SecureFormatter())
logger.addHandler(handler)
# Remove default handlers if any
if logger.hasHandlers() and len(logger.handlers) > 1:
    logger.handlers = [handler]
