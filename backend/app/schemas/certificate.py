from datetime import datetime

from pydantic import BaseModel


class CertificateResponse(BaseModel):
    id: int
    user_id: int
    event_id: int
    certificate_code: str
    issued_at: datetime
    certificate_path: str | None = None

    class Config:
        from_attributes = True