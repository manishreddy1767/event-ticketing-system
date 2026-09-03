from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_db, require_role
from app.core.security import hash_password
from app.models.event import Event
from app.models.organizer import Organizer
from app.models.ticket import Ticket
from app.models.ticket_type import TicketType
from app.models.user import User
from app.schemas.organizer import (
    OrganizerRegisterRequest,
    OrganizerRegisterResponse,
)


router = APIRouter(
    prefix="/organizers",
    tags=["Organizers"],
)


@router.post(
    "/register",
    response_model=OrganizerRegisterResponse,
    status_code=status.HTTP_201_CREATED,
)
def register_organizer(
    organizer_data: OrganizerRegisterRequest,
    db: Session = Depends(get_db),
):
    existing_user = (
        db.query(User)
        .filter(User.email == organizer_data.email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    user = User(
        name=organizer_data.name,
        email=organizer_data.email,
        password_hash=hash_password(organizer_data.password),
        role="organizer",
        status="pending",
    )

    db.add(user)
    db.flush()

    organizer = Organizer(
        user_id=user.id,
        organization_name=organizer_data.organization_name,
        phone=organizer_data.phone,
        description=organizer_data.description,
    )

    db.add(organizer)
    db.commit()
    db.refresh(user)

    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "status": user.status,
        "organization_name": organizer.organization_name,
        "phone": organizer.phone,
        "description": organizer.description,
        "created_at": user.created_at,
    }


@router.get(
    "/events/{event_id}/registrations",
)
def get_event_registrations(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("organizer")),
):
    event = (
        db.query(Event)
        .filter(
            Event.id == event_id,
            Event.organizer_id == current_user.id,
        )
        .first()
    )

    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found",
        )

    tickets = (
        db.query(Ticket)
        .join(TicketType, Ticket.ticket_type_id == TicketType.id)
        .filter(TicketType.event_id == event_id)
        .all()
    )

    return [
        {
            "id": ticket.id,
            "ticket_type": ticket.ticket_type.name,
            "quantity": ticket.quantity,
            "total_amount": float(ticket.total_amount),
            "discount_percent": float(ticket.discount_percent),
            "discount_amount": float(ticket.discount_amount),
            "status": ticket.status,
            "qr_token": ticket.qr_token,
            "team_id": ticket.team_id,
            "created_at": ticket.created_at,
            "user": {
                "id": ticket.user.id,
                "name": ticket.user.name,
                "email": ticket.user.email,
            }
            if ticket.user
            else None,
        }
        for ticket in tickets
    ]