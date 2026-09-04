from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.core.dependencies import get_db, require_role
from app.models.event import Event
from app.models.ticket import Ticket
from app.models.ticket_type import TicketType
from app.models.user import User
from app.schemas.ticket import (
    TicketCreateRequest,
    TicketResponse,
    TicketTypeCreateRequest,
    TicketTypeResponse,
)
from app.services.booking import book_ticket
from app.services.qr import generate_qr_code


router = APIRouter(
    prefix="/events",
    tags=["Ticket Types"],
)


@router.post(
    "/{event_id}/ticket-types",
    response_model=TicketTypeResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_ticket_type(
    event_id: int,
    ticket_data: TicketTypeCreateRequest,
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

    ticket_type = TicketType(
        event_id=event.id,
        name=ticket_data.name,
        price=ticket_data.price,
        capacity=ticket_data.capacity,
        available_quantity=ticket_data.capacity,
        team_size=ticket_data.team_size,
    )

    db.add(ticket_type)
    db.commit()
    db.refresh(ticket_type)

    return ticket_type


@router.get(
    "/my-tickets",
    response_model=list[TicketResponse],
)
def get_my_tickets(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("student")),
):
    return (
        db.query(Ticket)
        .filter(Ticket.user_id == current_user.id)
        .order_by(Ticket.created_at.desc())
        .all()
    )


@router.get(
    "/{event_id}/ticket-types",
    response_model=list[TicketTypeResponse],
)
def get_ticket_types(
    event_id: int,
    db: Session = Depends(get_db),
):
    event = (
        db.query(Event)
        .filter(
            Event.id == event_id,
            Event.status == "approved",
        )
        .first()
    )

    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found",
        )

    ticket_types = (
        db.query(TicketType)
        .filter(TicketType.event_id == event_id)
        .order_by(TicketType.team_size.asc())
        .all()
    )

    has_team_tickets = any(ticket_type.team_size > 1 for ticket_type in ticket_types)

    if has_team_tickets:
        ticket_types = [
            ticket_type for ticket_type in ticket_types
            if ticket_type.team_size > 1
        ]

    return ticket_types


@router.post(
    "/{event_id}/book",
    response_model=TicketResponse,
    status_code=status.HTTP_201_CREATED,
)
def book_ticket_route(
    event_id: int,
    ticket_data: TicketCreateRequest,
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

    if event.status != "approved":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This event is not approved for registration yet",
        )

    return book_ticket(
        db=db,
        ticket_data=ticket_data,
        current_user=current_user,
        event_id=event_id,
    )


@router.get(
    "/ticket/{ticket_id}",
    response_model=TicketResponse,
)
def get_ticket(
    ticket_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("student")),
):
    ticket = (
        db.query(Ticket)
        .filter(
            Ticket.id == ticket_id,
            Ticket.user_id == current_user.id,
        )
        .first()
    )

    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket not found",
        )

    return ticket


@router.get("/ticket/{ticket_id}/qr")
def get_ticket_qr(
    ticket_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("student")),
):
    ticket = (
        db.query(Ticket)
        .filter(
            Ticket.id == ticket_id,
            Ticket.user_id == current_user.id,
        )
        .first()
    )

    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket not found",
        )

    if ticket.status != "paid":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="QR code is available only for paid tickets",
        )

    qr_image = generate_qr_code(ticket.qr_token)

    return StreamingResponse(
        qr_image,
        media_type="image/png",
    )
