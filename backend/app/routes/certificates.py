from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
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


TEMPLATE_DIR = (
    Path(__file__).resolve().parent.parent
    / "uploads"
    / "certificates"
)

ALLOWED_EXTENSIONS = {".png", ".jpg", ".jpeg"}


@router.post(
    "/events/{event_id}/template",
    operation_id="upload_certificate_template",
)
async def upload_certificate_template(
    event_id: int,
    file: UploadFile = File(...),
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
            detail="Certificate template can only be uploaded for approved events",
        )

    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File name is required",
        )

    extension = Path(file.filename).suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PNG, JPG, and JPEG templates are allowed",
        )

    TEMPLATE_DIR.mkdir(
        parents=True,
        exist_ok=True,
    )

    template_filename = f"event_{event.id}_certificate{extension}"
    template_path = TEMPLATE_DIR / template_filename

    file_content = await file.read()

    if not file_content:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty",
        )

    template_path.write_bytes(file_content)

    event.certificate_template_path = str(
        template_path.relative_to(
            Path(__file__).resolve().parent.parent
        )
    )

    db.commit()
    db.refresh(event)

    return {
        "message": "Certificate template uploaded successfully",
        "event_id": event.id,
        "template_path": event.certificate_template_path,
    }


@router.post(
    "/events/{event_id}/generate",
    response_model=CertificateResponse,
    status_code=status.HTTP_201_CREATED,
    operation_id="generate_event_certificate",
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
        .join(
            TicketType,
            Ticket.ticket_type_id == TicketType.id,
        )
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
        .filter(
            Attendance.ticket_id == ticket.id,
            Attendance.status == "checked_in",
        )
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
    operation_id="verify_certificate",
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


@router.get(
    "/events/{event_id}",
)
def get_event_certificates(
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

    certificates = (
        db.query(Certificate)
        .filter(Certificate.event_id == event_id)
        .all()
    )

    return [
        {
            "id": cert.id,
            "user_id": cert.user_id,
            "event_id": cert.event_id,
            "certificate_code": cert.certificate_code,
            "issued_at": cert.issued_at,
            "user": {
                "id": cert.user.id,
                "name": cert.user.name,
                "email": cert.user.email,
            }
            if cert.user
            else None,
        }
        for cert in certificates
    ]