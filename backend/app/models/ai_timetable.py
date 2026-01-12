from sqlalchemy import Column, Integer, ForeignKey, JSON, String, DateTime
from sqlalchemy.sql import func
from ..database import Base

class AITimetable(Base):
    __tablename__ = "ai_timetables"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    subject = Column(String(100))
    timetable = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
