from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.models.event import Event
from app.core.dependencies import get_db, require_role
from app.models.attendance import Attendance
from app.models.ticket import Ticket
from app.models.user import User
from app.schemas.attendance import CheckInRequest, AttendanceResponse
from app.models.ticket_type import TicketType


router = APIRouter(
    prefix="/attendance",
    tags=["Attendance"],
)


@router.post(
    "/check-in",
    response_model=AttendanceResponse,
    status_code=status.HTTP_201_CREATED,
)
def check_in(
    check_in_data: CheckInRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("organizer", "admin")),
):
    if not check_in_data.qr_token and not check_in_data.ticket_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Provide either a QR token or Ticket ID",
        )

    if check_in_data.ticket_id:
        ticket = (
            db.query(Ticket)
            .filter(Ticket.id == check_in_data.ticket_id)
            .first()
        )
    else:
        ticket = (
            db.query(Ticket)
            .filter(Ticket.qr_token == check_in_data.qr_token)
            .first()
        )

    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket not found",
        )

    ticket_type = (
        db.query(TicketType)
        .filter(TicketType.id == ticket.ticket_type_id)
        .first()
    )

    if not ticket_type:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket type not found",
        )

    event = (
        db.query(Event)
        .filter(Event.id == ticket_type.event_id)
        .first()
    )

    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found",
        )

    if current_user.role == "organizer" and event.organizer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to check in tickets for this event",
        )

    if ticket.status != "paid":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ticket is not valid for check-in",
        )

    existing_attendance = (
        db.query(Attendance)
        .filter(Attendance.ticket_id == ticket.id)
        .first()
    )

    if existing_attendance:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ticket has already been checked in",
        )

    attendance = Attendance(
        ticket_id=ticket.id,
        status="checked_in",
    )

    db.add(attendance)
    db.commit()
    db.refresh(attendance)

    return attendance

@router.get(
    "/events/{event_id}",
    response_model=list[AttendanceResponse],
)
def get_event_attendance(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("organizer", "admin")),
):
    query = (
        db.query(Attendance)
        .join(Ticket, Attendance.ticket_id == Ticket.id)
        .join(TicketType, Ticket.ticket_type_id == TicketType.id)
        .join(Event, TicketType.event_id == Event.id)
        .join(User, Ticket.user_id == User.id)
        .filter(Event.id == event_id)
    )

    if current_user.role == "organizer":
        query = query.filter(Event.organizer_id == current_user.id)

    attendances = query.order_by(Attendance.checked_in_at.asc()).all()

    return [
        {
            "id": attendance.id,
            "ticket_id": attendance.ticket_id,
            "checked_in_at": attendance.checked_in_at,
            "status": attendance.status,
            "user_id": attendance.ticket.user_id,
            "user_name": attendance.ticket.user.name,
            "user_email": attendance.ticket.user.email,
            "team_name": attendance.ticket.team.name if attendance.ticket.team else None,
            "ticket_type": attendance.ticket.ticket_type.name,
        }
        for attendance in attendances
    ]
