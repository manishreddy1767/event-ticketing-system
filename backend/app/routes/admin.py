from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_db, require_role
from app.models.event import Event
from app.models.organizer import Organizer
from app.models.user import User


router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
)


# =========================
# ORGANIZER MANAGEMENT
# =========================

@router.get("/organizers/pending")
def get_pending_organizers(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin")),
):
    organizers = (
        db.query(Organizer)
        .join(User, Organizer.user_id == User.id)
        .filter(User.role == "organizer")
        .filter(User.status == "pending")
        .all()
    )

    return [
        {
            "id": organizer.id,
            "user_id": organizer.user_id,
            "name": organizer.user.name,
            "email": organizer.user.email,
            "organization_name": organizer.organization_name,
            "phone": organizer.phone,
            "description": organizer.description,
            "status": organizer.user.status,
            "created_at": organizer.created_at,
        }
        for organizer in organizers
    ]


@router.post("/organizers/{organizer_id}/approve")
def approve_organizer(
    organizer_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin")),
):
    organizer = (
        db.query(Organizer)
        .filter(Organizer.id == organizer_id)
        .first()
    )

    if not organizer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organizer application not found",
        )

    user = (
        db.query(User)
        .filter(User.id == organizer.user_id)
        .first()
    )

    if user.status != "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Organizer application is not pending",
        )

    user.status = "active"

    db.commit()
    db.refresh(user)

    return {
        "message": "Organizer approved successfully",
        "organizer_id": organizer.id,
        "user_id": user.id,
        "status": user.status,
    }


@router.post("/organizers/{organizer_id}/reject")
def reject_organizer(
    organizer_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin")),
):
    organizer = (
        db.query(Organizer)
        .filter(Organizer.id == organizer_id)
        .first()
    )

    if not organizer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organizer application not found",
        )

    user = (
        db.query(User)
        .filter(User.id == organizer.user_id)
        .first()
    )

    if user.status != "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Organizer application is not pending",
        )

    user.status = "rejected"

    db.commit()
    db.refresh(user)

    return {
        "message": "Organizer application rejected",
        "organizer_id": organizer.id,
        "user_id": user.id,
        "status": user.status,
    }


# =========================
# EVENT MANAGEMENT
# =========================

@router.get("/events/pending")
def get_pending_events(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin")),
):
    events = (
        db.query(Event)
        .filter(Event.status == "pending")
        .order_by(Event.created_at.asc())
        .all()
    )

    return events


@router.post("/events/{event_id}/approve")
def approve_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin")),
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

    if event.status != "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Event is not pending approval",
        )

    event.status = "approved"

    db.commit()
    db.refresh(event)

    return {
        "message": "Event approved successfully",
        "event_id": event.id,
        "status": event.status,
    }


@router.post("/events/{event_id}/reject")
def reject_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin")),
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

    if event.status != "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Event is not pending approval",
        )

    event.status = "rejected"

    db.commit()
    db.refresh(event)

    return {
        "message": "Event rejected successfully",
        "event_id": event.id,
        "status": event.status,
    }