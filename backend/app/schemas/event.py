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
    event_type: str = Field(min_length=2, max_length=50)
    registration_mode: str = Field(pattern="^(individual|team)$")
    min_team_size: int = Field(ge=1, le=10)
    max_team_size: int = Field(ge=1, le=10)


class EventUpdateRequest(BaseModel):
    title: str = Field(min_length=3, max_length=200)
    description: str | None = None
    venue: str = Field(min_length=2, max_length=255)
    event_date: datetime
    capacity: int = Field(gt=0)
    max_discount_percent: Decimal = Field(
        ge=0,
        le=100,
    )
    event_type: str = Field(min_length=2, max_length=50)
    registration_mode: str = Field(pattern="^(individual|team)$")
    min_team_size: int = Field(ge=1, le=10)
    max_team_size: int = Field(ge=1, le=10)


class EventResponse(BaseModel):
    id: int
    organizer_id: int
    title: str
    description: str | None
    venue: str
    event_date: datetime
    capacity: int
    registered_count: int
    max_discount_percent: Decimal
    event_type: str
    registration_mode: str
    min_team_size: int
    max_team_size: int
    status: str
    certificate_template_path: str | None
    created_at: datetime

    class Config:
        from_attributes = True
