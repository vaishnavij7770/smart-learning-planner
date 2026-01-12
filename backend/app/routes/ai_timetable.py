from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
import json

from ..database import get_db
from ..models import AITimetable
from .deps import get_current_user
from ..utils.ai_timetable import generate_full_timetable

router = APIRouter(prefix="/ai-timetable", tags=["AI Timetable"])


# ---------- SCHEMAS ----------
class TimetableRequest(BaseModel):
    subject: str
    hours: int
    category: str
    difficulty: str


# ---------- GENERATE TIMETABLE ----------
@router.post("/")
def generate_timetable(
    data: TimetableRequest,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    try:
        raw = generate_full_timetable(
            data.subject,
            data.hours,
            data.category,
            data.difficulty,
        )

        # handle string or dict safely
        if isinstance(raw, str):
            start = raw.find("{")
            end = raw.rfind("}") + 1
            timetable = json.loads(raw[start:end])
        else:
            timetable = raw

        record = AITimetable(
            user_id=user.id,
            subject=data.subject,
            timetable=timetable,
        )

        db.add(record)
        db.commit()
        db.refresh(record)

        return {"timetable": timetable}

    except Exception as e:
        print("AI timetable error:", e)
        raise HTTPException(
            status_code=500,
            detail="AI timetable generation failed",
        )


# ---------- GET LATEST TIMETABLE (FIXES 404) ----------
@router.get("/latest")
def get_latest_timetable(
    user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    record = (
        db.query(AITimetable)
        .filter(AITimetable.user_id == user.id)
        .order_by(AITimetable.id.desc())
        .first()
    )

    if not record:
        raise HTTPException(status_code=404, detail="No timetable found")

    return {"timetable": record.timetable}
@router.post("/save")
def save_timetable_dummy():
    return {"message": "Already saved"}