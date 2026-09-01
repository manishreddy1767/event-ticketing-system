from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_db, require_role
from app.models.event import Event
from app.models.user import User
from app.schemas.event import EventCreateRequest, EventResponse


router = APIRouter(
    prefix="/events",
    tags=["Events"],
)


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
        status="pending",
    )

    db.add(event)
    db.commit()
    db.refresh(event)

    return event


@router.get(
    "",
    response_model=list[EventResponse],
)
def get_events(
    db: Session = Depends(get_db),
):
    return (
        db.query(Event)
        .filter(Event.status == "approved")
        .order_by(Event.event_date.asc())
        .all()
    )


@router.get(
    "/my",
    response_model=list[EventResponse],
)
def get_my_events(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("organizer")),
):
    return (
        db.query(Event)
        .filter(Event.organizer_id == current_user.id)
        .order_by(Event.created_at.desc())
        .all()
    )


@router.get(
    "/{event_id}",
    response_model=EventResponse,
)
def get_event(
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

    return event