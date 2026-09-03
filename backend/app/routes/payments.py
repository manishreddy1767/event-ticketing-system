import os
from decimal import Decimal

from dotenv import load_dotenv

load_dotenv()

import razorpay
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_db, require_role
from app.models.payment import Payment
from app.models.ticket import Ticket
from app.models.user import User
from app.schemas.payment import (
    PaymentCreateRequest,
    PaymentOrderResponse,
    PaymentResponse,
    PaymentVerifyRequest,
)

router = APIRouter(
    prefix="/payments",
    tags=["Payments"],
)


RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET")


def get_razorpay_client():
    if not RAZORPAY_KEY_ID or not RAZORPAY_KEY_SECRET:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Razorpay credentials are not configured",
        )

    return razorpay.Client(
        auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET)
    )


@router.post(
    "/order",
    response_model=PaymentOrderResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_payment_order(
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
        if existing_payment.status == "paid":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Payment already completed for this ticket",
            )

        if existing_payment.razorpay_order_id:
            return PaymentOrderResponse(
                payment_id=existing_payment.id,
                ticket_id=ticket.id,
                amount=ticket.total_amount,
                currency="INR",
                razorpay_order_id=existing_payment.razorpay_order_id,
                razorpay_key_id=RAZORPAY_KEY_ID,
            )

        payment = existing_payment

    else:
        payment = Payment(
            ticket_id=ticket.id,
            amount=ticket.total_amount,
            status="pending",
        )

        db.add(payment)
        db.flush()

    amount_paise = int(
        Decimal(str(ticket.total_amount)) * Decimal("100")
    )

    client = get_razorpay_client()

    try:
        razorpay_order = client.order.create(
            data={
                "amount": amount_paise,
                "currency": "INR",
                "receipt": f"evently_ticket_{ticket.id}",
            }
        )
    except Exception as exc:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Unable to create Razorpay order: {str(exc)}",
        )

    payment.razorpay_order_id = razorpay_order["id"]

    db.commit()
    db.refresh(payment)

    return PaymentOrderResponse(
        payment_id=payment.id,
        ticket_id=ticket.id,
        amount=ticket.total_amount,
        currency="INR",
        razorpay_order_id=razorpay_order["id"],
        razorpay_key_id=RAZORPAY_KEY_ID,
    )


@router.post(
    "/verify",
    response_model=PaymentResponse,
)
def verify_payment(
    payment_data: PaymentVerifyRequest,
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

    payment = (
        db.query(Payment)
        .filter(Payment.ticket_id == ticket.id)
        .first()
    )

    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment record not found",
        )

    if not payment.razorpay_order_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Razorpay order not found",
        )

    if payment.razorpay_order_id != payment_data.razorpay_order_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Razorpay order ID mismatch",
        )

    if payment.status == "paid":
        return payment

    client = get_razorpay_client()

    try:
        client.utility.verify_payment_signature(
            {
                "razorpay_order_id": payment.razorpay_order_id,
                "razorpay_payment_id": payment_data.razorpay_payment_id,
                "razorpay_signature": payment_data.razorpay_signature,
            }
        )
    except Exception:
        payment.status = "failed"

        db.commit()

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Payment verification failed",
        )

    payment.razorpay_payment_id = (
        payment_data.razorpay_payment_id
    )

    payment.razorpay_signature = (
        payment_data.razorpay_signature
    )

    payment.transaction_id = (
        payment_data.razorpay_payment_id
    )

    payment.status = "paid"

    ticket.status = "paid"

    db.commit()
    db.refresh(payment)

    return payment