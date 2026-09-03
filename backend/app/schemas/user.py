from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr


class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class UserUpdateRequest(BaseModel):
    name: str
    email: EmailStr


class StudentProfileResponse(BaseModel):
    roll_number: str | None = None
    department: str | None = None
    year: str | None = None
    college: str | None = None

    model_config = ConfigDict(from_attributes=True)


class StudentProfileUpdateRequest(BaseModel):
    roll_number: str
    department: str
    year: str
    college: str
