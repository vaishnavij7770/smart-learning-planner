from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from .routes import auth, study, progress, smart_plan, ai_plan, ai_timetable

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(study.router)
app.include_router(progress.router)
app.include_router(smart_plan.router)
app.include_router(ai_plan.router)
app.include_router(ai_timetable.router)


@app.get("/")
def root():
    return {"status": "Backend running"}
