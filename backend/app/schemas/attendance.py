from datetime import datetime

from pydantic import BaseModel


class CheckInRequest(BaseModel):
    qr_token: str


class AttendanceResponse(BaseModel):
    id: int
    ticket_id: int
    checked_in_at: datetime
    status: str

    class Config:
        from_attributes = True