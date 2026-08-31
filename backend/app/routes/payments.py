import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_db, require_role
from app.models.payment import Payment
from app.models.ticket import Ticket
from app.models.user import User
from app.schemas.payment import PaymentCreateRequest, PaymentResponse


router = APIRouter(
    prefix="/payments",
    tags=["Payments"],
)


@router.post(
    "",
    response_model=PaymentResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_payment(
    payment_data: PaymentCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("student")),
):
    ticket = (
        db.query(Ticket)
        .filter(
            Ticket.id == payment_data.ticket_id,
            Ticket.user_id == current_user.id,
        )
        .first()
    )

    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket not found",
        )

    if ticket.status != "reserved":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ticket is not available for payment",
        )

    existing_payment = (
        db.query(Payment)
        .filter(Payment.ticket_id == ticket.id)
        .first()
    )

    if existing_payment:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Payment already exists for this ticket",
        )

    payment = Payment(
        ticket_id=ticket.id,
        amount=ticket.total_amount,
        status="paid",
        transaction_id=str(uuid.uuid4()),
    )

    ticket.status = "paid"

    db.add(payment)
    db.commit()
    db.refresh(payment)

    return payment