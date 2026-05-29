import sys
import os
import asyncio
import json

# Add parent directory to path to import app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from PyPDF2 import PdfReader
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from app.db.models import Base, Task
import google.generativeai as genai
from app.core.config import settings

DATABASE_URL = "sqlite+aiosqlite:///./taskpilot.db"
engine = create_async_engine(DATABASE_URL, echo=False)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

PDF_PATH = r"C:\Users\akula\Intern Work\Business_Lab_Participant_Task_Catalogue_and_Operational_Guidelines.pdf"

genai.configure(api_key=settings.GEMINI_API_KEY)

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

import re

async def extract_tasks_from_pdf(path):
    print(f"Reading PDF: {path}")
    reader = PdfReader(path)
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
        
    print("Parsing tasks from text using Regex...")
    
    # Example format:
    # TASK_T08  Team Communication Workspace Fully Configured  Grade B | 90 GBP | 3 MP | Open | Tech  
    # Who can do it: ...
    # Estimated time: 3-4 hours
    # Objective: ...
    
    tasks = []
    # Split text by "TASK_"
    chunks = text.split("TASK_")[1:]
    
    for chunk in chunks:
        try:
            lines = chunk.strip().split("\n")
            header = lines[0].strip()
            # T08  Team Communication Workspace Fully Configured  Grade B | 90 GBP | 3 MP | Open | Tech
            # split by  or similar characters
            id_part = header.split(" ")[0].strip()
            task_id = f"T_{id_part}"
            
            # Find Track Alignment (e.g. Tech, Business) from the header
            track_alignment = "Both"
            if "Tech" in header: track_alignment = "Tech"
            elif "Business" in header: track_alignment = "Business"
            
            # Find difficulty based on Grade
            difficulty = "Beginner"
            if "Grade A" in header: difficulty = "Advanced"
            elif "Grade B" in header: difficulty = "Intermediate"
            
            # Extract objective as description
            description = ""
            for line in lines:
                if line.startswith("Objective:"):
                    description = line.replace("Objective:", "").strip()
                    break
            if not description and len(lines) > 2:
                description = lines[2].strip()
                
            tasks.append(Task(
                id=task_id,
                title=header[:100] + "...", # truncate title if needed
                description=description[:250],
                category="Core",
                difficulty=difficulty,
                estimated_hours=4, # Hardcoded default or can parse
                track_alignment=track_alignment
            ))
        except Exception as e:
            print(f"Failed to parse chunk: {e}")
            
    return tasks

async def run():
    await init_db()
    tasks = await extract_tasks_from_pdf(PDF_PATH)
    
    if not tasks:
        print("No tasks extracted.")
        return
        
    async with AsyncSessionLocal() as session:
        for t in tasks:
            existing = await session.get(Task, t.id)
            if not existing:
                session.add(t)
        await session.commit()
    print(f"Database seeded with {len(tasks)} tasks successfully!")

if __name__ == "__main__":
    asyncio.run(run())
