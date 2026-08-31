from datetime import datetime

from pydantic import BaseModel


class CertificateResponse(BaseModel):
    id: int
    user_id: int
    event_id: int
    certificate_code: str
    issued_at: datetime

    class Config:
        from_attributes = True