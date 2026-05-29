from fastapi import Depends, Request
from app.core.security import get_current_user

# Additional dependencies if needed, otherwise get_current_user is used directly in routes.
