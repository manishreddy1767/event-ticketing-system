from datetime import datetime

from pydantic import BaseModel, ConfigDict


class OrganizerRegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    organization_name: str
    phone: str
    description: str | None = None


class OrganizerRegisterResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    status: str
    organization_name: str
    phone: str
    description: str | None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)