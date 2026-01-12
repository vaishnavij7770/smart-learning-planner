from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..models import StudyPlan
from ..schemas import StudyPlanCreate, StudyPlanResponse
from .deps import get_current_user, get_db

router = APIRouter(prefix="/study", tags=["Study Plan"])

@router.post("/", response_model=StudyPlanResponse)
def create_plan(
    plan: StudyPlanCreate,
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    new_plan = StudyPlan(
        user_id=user.id,
        subject=plan.subject,
        hours=plan.hours
    )
    db.add(new_plan)
    db.commit()
    db.refresh(new_plan)
    return new_plan

@router.get("/", response_model=list[StudyPlanResponse])
def get_plans(
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(StudyPlan).filter(
        StudyPlan.user_id == user.id
    ).all()
