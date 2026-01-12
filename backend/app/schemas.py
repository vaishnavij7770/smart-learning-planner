from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str

    class Config:
        orm_mode = True

from pydantic import BaseModel

class StudyPlanCreate(BaseModel):
    subject: str
    hours: int

class StudyPlanResponse(BaseModel):
    id: int
    subject: str
    hours: int

    class Config:
        orm_mode = True
