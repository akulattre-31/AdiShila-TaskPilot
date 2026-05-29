import re
from typing import List, Literal
from pydantic import BaseModel, Field, validator

ALLOWED_SKILLS = {
    "Python", "JavaScript", "React", "FastAPI", "Data Analysis",
    "Prompt Engineering", "AI/ML", "Cybersecurity", "Market Research",
    "Content Writing", "Video Editing", "Graphic Design",
    "Business Strategy", "Financial Modelling", "Public Speaking"
}

class ProfilePayload(BaseModel):
    name: str = Field(..., min_length=2, max_length=80)
    team_id: str = Field(..., pattern=r'^\d{4}$')
    cohort: str = Field(..., pattern=r'^[IVX]{1,4}$')
    track: Literal["Tech", "Business", "Both"]
    skills: List[str] = Field(..., min_items=1, max_items=15)
    hours_per_week: int = Field(..., ge=1, le=168)
    experience: Literal["Beginner", "Intermediate", "Advanced"]
    prefer_high_gbp: bool
    prefer_low_time: bool
    prefer_new_tasks: bool

    @validator("skills", each_item=True)
    def skills_whitelist(cls, v):
        if v not in ALLOWED_SKILLS:
            raise ValueError(f"Invalid skill: {v}")
        return v

    @validator("name")
    def no_script_chars(cls, v):
        if re.search(r'[<>{}&"\']', v):
            raise ValueError("Invalid characters in name")
        return v.strip()

class RecommendRequest(BaseModel):
    profile: ProfilePayload
    completed_task_ids: List[str] = Field(default=[], max_items=50)
    skipped_task_ids: List[str] = Field(default=[], max_items=50)

    @validator("completed_task_ids", "skipped_task_ids", each_item=True)
    def valid_task_id(cls, v):
        if not re.match(r'^TASK_[A-Z0-9_]{2,20}$', v):
            raise ValueError(f"Invalid task ID: {v}")
        return v
