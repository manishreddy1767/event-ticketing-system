from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_db, require_role
from app.models.event import Event
from app.models.ticket_type import TicketType
from app.models.user import User
from app.schemas.ticket import (
    TicketTypeCreateRequest,
    TicketTypeResponse,
)

from app.models.ticket import Ticket
from app.schemas.ticket import TicketCreateRequest, TicketResponse

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

    if event.status != "approved":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ticket types can only be created for approved events",
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

    return (
        db.query(TicketType)
        .filter(TicketType.event_id == event_id)
        .order_by(TicketType.team_size.asc())
        .all()
    )

@router.post(
    "/{event_id}/book",
    response_model=TicketResponse,
    status_code=status.HTTP_201_CREATED,
)
def book_ticket(
    event_id: int,
    ticket_data: TicketCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("student")),
):
    # Make sure the event exists and is approved
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

    # Lock the ticket-type row while booking
    ticket_type = (
        db.query(TicketType)
        .filter(
            TicketType.id == ticket_data.ticket_type_id,
            TicketType.event_id == event_id,
        )
        .with_for_update()
        .first()
    )

    if not ticket_type:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket type not found",
        )

    # Check availability while the row is locked
    if ticket_type.available_quantity < ticket_data.quantity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Not enough tickets available",
        )

    total_amount = ticket_type.price * ticket_data.quantity

    ticket_type.available_quantity -= ticket_data.quantity

    ticket = Ticket(
        ticket_type_id=ticket_type.id,
        user_id=current_user.id,
        quantity=ticket_data.quantity,
        total_amount=total_amount,
        status="reserved",
    )

    db.add(ticket)
    db.commit()
    db.refresh(ticket)

    return ticket

@router.get(
    "/my",
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


