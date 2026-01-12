from fastapi import APIRouter
from pydantic import BaseModel
from ..utils.smart_planner import generate_smart_plan

router = APIRouter(prefix="/smart-plan", tags=["Smart Planner"])

class SmartPlanRequest(BaseModel):
    subject: str
    hours: int
    category: str
    difficulty: str

@router.post("/")
def smart_plan(data: SmartPlanRequest):
    return generate_smart_plan(
        data.subject,
        data.hours,
        data.category,
        data.difficulty
    )
