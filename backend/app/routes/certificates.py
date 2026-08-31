from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_db, require_role
from app.models.attendance import Attendance
from app.models.certificate import Certificate
from app.models.event import Event
from app.models.ticket import Ticket
from app.models.ticket_type import TicketType
from app.models.user import User
from app.schemas.certificate import CertificateResponse
from app.services.certificates import generate_certificate_code


router = APIRouter(
    prefix="/certificates",
    tags=["Certificates"],
)


@router.post(
    "/events/{event_id}/generate",
    response_model=CertificateResponse,
    status_code=status.HTTP_201_CREATED,
)
def generate_certificate(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("student")),
):
    event = (
        db.query(Event)
        .filter(Event.id == event_id)
        .first()
    )

    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found",
        )

    ticket = (
        db.query(Ticket)
        .join(TicketType, Ticket.ticket_type_id == TicketType.id)
        .filter(
            TicketType.event_id == event_id,
            Ticket.user_id == current_user.id,
            Ticket.status == "paid",
        )
        .first()
    )

    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No paid ticket found for this event",
        )

    attendance = (
        db.query(Attendance)
        .filter(Attendance.ticket_id == ticket.id)
        .first()
    )

    if not attendance:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Certificate requires event attendance",
        )

    existing_certificate = (
        db.query(Certificate)
        .filter(
            Certificate.user_id == current_user.id,
            Certificate.event_id == event_id,
        )
        .first()
    )

    if existing_certificate:
        return existing_certificate

    certificate = Certificate(
        user_id=current_user.id,
        event_id=event_id,
        certificate_code=generate_certificate_code(),
    )

    db.add(certificate)
    db.commit()
    db.refresh(certificate)

    return certificate

@router.get(
    "/verify/{certificate_code}",
    response_model=CertificateResponse,
)
def verify_certificate(
    certificate_code: str,
    db: Session = Depends(get_db),
):
    certificate = (
        db.query(Certificate)
        .filter(
            Certificate.certificate_code == certificate_code,
        )
        .first()
    )

    if not certificate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invalid certificate",
        )

    return certificate