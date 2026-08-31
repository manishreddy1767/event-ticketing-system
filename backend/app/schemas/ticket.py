from decimal import Decimal

from pydantic import BaseModel, Field


class TicketTypeCreateRequest(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    price: Decimal = Field(ge=0)
    capacity: int = Field(gt=0)
    team_size: int = Field(ge=1, le=3)


class TicketTypeResponse(BaseModel):
    id: int
    event_id: int
    name: str
    price: Decimal
    capacity: int
    available_quantity: int
    team_size: int

    class Config:
        from_attributes = True


class TicketCreateRequest(BaseModel):
    ticket_type_id: int = Field(gt=0)
    quantity: int = Field(gt=0)
    team_id: int | None = Field(default=None, gt=0)


class TicketResponse(BaseModel):
    id: int
    ticket_type_id: int
    user_id: int
    quantity: int
    total_amount: Decimal
    status: str
    qr_token: str
    team_id: int | None

    class Config:
        from_attributes = True