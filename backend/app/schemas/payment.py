from decimal import Decimal

from pydantic import BaseModel


class PaymentCreateRequest(BaseModel):
    ticket_id: int


class PaymentResponse(BaseModel):
    id: int
    ticket_id: int
    amount: Decimal
    status: str
    transaction_id: str | None

    class Config:
        from_attributes = True