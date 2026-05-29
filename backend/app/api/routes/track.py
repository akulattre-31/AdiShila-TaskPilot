from fastapi import APIRouter, Request
from pydantic import BaseModel
from typing import Dict, Any, List
import sqlite3
import json
import os

router = APIRouter()

DB_PATH = "tracking.db"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS user_actions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            team_id TEXT,
            action TEXT,
            details TEXT,
            timestamp TEXT
        )
    ''')
    conn.commit()
    conn.close()

# Initialize DB on load
init_db()

class TrackActionRequest(BaseModel):
    action: str
    details: Dict[str, Any] = {}
    timestamp: str

@router.post("")
async def track_action(request: Request, payload: TrackActionRequest):
    auth_header = request.headers.get("Authorization", "")
    token = auth_header.replace("Bearer ", "") if auth_header else "anonymous"
    
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute(
        "INSERT INTO user_actions (team_id, action, details, timestamp) VALUES (?, ?, ?, ?)",
        (token, payload.action, json.dumps(payload.details), payload.timestamp)
    )
    conn.commit()
    conn.close()
    
    return {"status": "tracked"}

@router.get("/{team_id}")
async def get_user_actions(team_id: str):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT action, details, timestamp FROM user_actions WHERE team_id = ? ORDER BY id DESC LIMIT 50", (team_id,))
    rows = c.fetchall()
    conn.close()
    
    actions = []
    for r in rows:
        actions.append({
            "action": r[0],
            "details": json.loads(r[1]) if r[1] else {},
            "timestamp": r[2]
        })
    return actions
