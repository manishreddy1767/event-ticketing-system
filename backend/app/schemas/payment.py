from decimal import Decimal

from pydantic import BaseModel


class PaymentCreateRequest(BaseModel):
    ticket_id: int


class PaymentOrderResponse(BaseModel):
    payment_id: int
    ticket_id: int
    amount: Decimal
    currency: str
    razorpay_order_id: str
    razorpay_key_id: str


class PaymentVerifyRequest(BaseModel):
    ticket_id: int
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str


class PaymentResponse(BaseModel):
    id: int
    ticket_id: int
    amount: Decimal
    status: str
    transaction_id: str | None
    razorpay_order_id: str | None
    razorpay_payment_id: str | None
    razorpay_signature: str | None

    class Config:
        from_attributes = True