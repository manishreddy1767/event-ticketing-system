from datetime import datetime

from pydantic import BaseModel


class CheckInRequest(BaseModel):
    qr_token: str | None = None
    ticket_id: int | None = None


class AttendanceResponse(BaseModel):
    id: int
    ticket_id: int
    checked_in_at: datetime
    status: str
    user_id: int
    user_name: str
    user_email: str
    team_name: str | None = None
    ticket_type: str

    class Config:
        from_attributes = True
