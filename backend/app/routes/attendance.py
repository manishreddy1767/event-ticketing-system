from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_db, require_role
from app.models.attendance import Attendance
from app.models.ticket import Ticket
from app.models.user import User
from app.schemas.attendance import CheckInRequest, AttendanceResponse


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
    ticket = (
        db.query(Ticket)
        .filter(Ticket.qr_token == check_in_data.qr_token)
        .first()
    )

    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invalid QR code",
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