from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta

from ..models import StudyPlan
from .deps import get_current_user, get_db

router = APIRouter(prefix="/progress", tags=["Progress"])

@router.get("/weekly")
def weekly_progress(
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # last 7 days
    week_ago = datetime.utcnow() - timedelta(days=7)

    total_hours = db.query(
        func.sum(StudyPlan.hours)
    ).filter(
        StudyPlan.user_id == user.id
    ).scalar() or 0

    return {
        "total_hours": total_hours
    }
