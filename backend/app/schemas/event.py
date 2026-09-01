from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, Field


class EventCreateRequest(BaseModel):
    title: str = Field(min_length=3, max_length=200)
    description: str | None = None
    venue: str = Field(min_length=2, max_length=255)
    event_date: datetime
    capacity: int = Field(gt=0)
    max_discount_percent: Decimal = Field(
        ge=0,
        le=100,
    )


class EventResponse(BaseModel):
    id: int
    organizer_id: int
    title: str
    description: str | None
    venue: str
    event_date: datetime
    capacity: int
    max_discount_percent: Decimal
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class DiscountResponse(BaseModel):
    event_id: int
    predicted_discount: Decimal