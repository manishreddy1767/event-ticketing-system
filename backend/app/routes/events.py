from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.dependencies import get_db, require_role
from app.models.event import Event
from app.models.ticket import Ticket
from app.models.ticket_type import TicketType
from app.models.user import User
from app.schemas.event import (
    EventCreateRequest,
    EventUpdateRequest,
    EventResponse,
)


router = APIRouter(
    prefix="/events",
    tags=["Events"],
)


ALLOWED_EVENT_TYPES = {
    "hackathon",
    "workshop",
    "seminar",
    "conference",
    "competition",
    "meetup",
    "other",
}


def validate_event_configuration(event_data):
    if event_data.event_type not in ALLOWED_EVENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid event type",
        )

    if event_data.registration_mode == "individual":
        if event_data.min_team_size != 1 or event_data.max_team_size != 1:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Individual events must have team size 1",
            )

    elif event_data.registration_mode == "team":
        if event_data.min_team_size < 2:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Team events must have a minimum team size of at least 2",
            )

        if event_data.max_team_size < event_data.min_team_size:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Maximum team size cannot be less than minimum team size",
            )

    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Registration mode must be individual or team",
        )


def get_registered_count(
    db: Session,
    event_id: int,
) -> int:
    result = (
        db.query(
            func.coalesce(
                func.sum(
                    Ticket.quantity * TicketType.team_size
                ),
                0,
            )
        )
        .join(
            TicketType,
            Ticket.ticket_type_id == TicketType.id,
        )
        .filter(
            TicketType.event_id == event_id,
            Ticket.status.in_(["reserved", "paid"]),
        )
        .scalar()
    )

    return int(result or 0)


def event_with_registered_count(
    db: Session,
    event: Event,
):
    data = {
        "id": event.id,
        "organizer_id": event.organizer_id,
        "title": event.title,
        "description": event.description,
        "venue": event.venue,
        "event_date": event.event_date,
        "capacity": event.capacity,
        "registered_count": get_registered_count(
            db,
            event.id,
        ),
        "max_discount_percent": event.max_discount_percent,
        "event_type": event.event_type,
        "registration_mode": event.registration_mode,
        "min_team_size": event.min_team_size,
        "max_team_size": event.max_team_size,
        "status": event.status,
        "certificate_template_path": event.certificate_template_path,
        "created_at": event.created_at,
    }

    return data


@router.post(
    "",
    response_model=EventResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_event(
    event_data: EventCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("organizer")),
):
    event = Event(
        organizer_id=current_user.id,
        title=event_data.title,
        description=event_data.description,
        venue=event_data.venue,
        event_date=event_data.event_date,
        capacity=event_data.capacity,
        max_discount_percent=event_data.max_discount_percent,
        event_type=event_data.event_type,
        registration_mode=event_data.registration_mode,
        min_team_size=event_data.min_team_size,
        max_team_size=event_data.max_team_size,
        status="pending",
    )

    db.add(event)
    db.commit()
    db.refresh(event)

    return event_with_registered_count(db, event)


@router.put(
    "/{event_id}",
    response_model=EventResponse,
)
def update_event(
    event_id: int,
    event_data: EventUpdateRequest,
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

    registered_count = get_registered_count(
        db,
        event.id,
    )

    if event_data.capacity < registered_count:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Capacity cannot be less than the current registration count ({registered_count})",
        )

    validate_event_configuration(event_data)

    event.title = event_data.title
    event.description = event_data.description
    event.venue = event_data.venue
    event.event_date = event_data.event_date
    event.capacity = event_data.capacity
    event.max_discount_percent = event_data.max_discount_percent
    event.event_type = event_data.event_type
    event.registration_mode = event_data.registration_mode
    event.min_team_size = event_data.min_team_size
    event.max_team_size = event_data.max_team_size

    db.commit()
    db.refresh(event)

    return event_with_registered_count(db, event)


@router.get(
    "",
    response_model=list[EventResponse],
)
def get_events(
    db: Session = Depends(get_db),
):
    events = (
        db.query(Event)
        .filter(Event.status == "approved")
        .order_by(Event.event_date.asc())
        .all()
    )

    return [
        event_with_registered_count(db, event)
        for event in events
    ]


@router.get(
    "/my",
    response_model=list[EventResponse],
)
def get_my_events(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("organizer")),
):
    events = (
        db.query(Event)
        .filter(Event.organizer_id == current_user.id)
        .order_by(Event.created_at.desc())
        .all()
    )

    return [
        event_with_registered_count(db, event)
        for event in events
    ]


@router.get(
    "/my/{event_id}",
    response_model=EventResponse,
)
def get_my_event(
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

    return event_with_registered_count(db, event)
