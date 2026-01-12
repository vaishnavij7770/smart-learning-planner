from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ..utils.ai_planner import generate_ai_study_plan

router = APIRouter(prefix="/ai-plan", tags=["AI Planner"])

class AIPlanRequest(BaseModel):
    subject: str
    hours: int
    category: str
    difficulty: str

@router.post("/")
def ai_plan(data: AIPlanRequest):
    try:
        result = generate_ai_study_plan(
            data.subject,
            data.hours,
            data.category,
            data.difficulty
        )
        return {"ai_plan": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
