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
from app.services.certificates import (
    create_certificate_image,
    generate_certificate_code,
)


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

    if not event.certificate_template_path:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Certificate template has not been uploaded",
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

    base_dir = Path(__file__).resolve().parent.parent
    template_path = base_dir / event.certificate_template_path

    if not template_path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Certificate template file not found",
        )

    generated_dir = (
        base_dir
        / "uploads"
        / "certificates"
        / "generated"
        / f"event_{event_id}"
    )

    certificate_code = generate_certificate_code()

    output_path = (
        generated_dir
        / f"{certificate_code}.png"
    )

    event_date = event.event_date.strftime("%d %B %Y")

    create_certificate_image(
        template_path=str(template_path),
        output_path=str(output_path),
        student_name=current_user.name,
        event_name=event.title,
        event_date=event_date,
    )

    certificate = Certificate(
        user_id=current_user.id,
        event_id=event_id,
        certificate_code=certificate_code,
        certificate_path=str(
            output_path.relative_to(base_dir)
        ),
    )

    db.add(certificate)
    db.commit()
    db.refresh(certificate)

    return certificate


@router.post(
    "/events/{event_id}/issue-all",
    operation_id="issue_all_event_certificates",
)
def issue_all_certificates(
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

    if not event.certificate_template_path:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Certificate template has not been uploaded",
        )

    base_dir = Path(__file__).resolve().parent.parent
    template_path = base_dir / event.certificate_template_path

    if not template_path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Certificate template file not found",
        )

    attendance_records = (
        db.query(Attendance)
        .join(Ticket, Attendance.ticket_id == Ticket.id)
        .join(TicketType, Ticket.ticket_id if False else Ticket.ticket_type_id == TicketType.id)
        .join(User, Ticket.user_id == User.id)
        .filter(
            TicketType.event_id == event_id,
            Ticket.status == "paid",
            Attendance.status == "checked_in",
        )
        .all()
    )

    generated_dir = (
        base_dir
        / "uploads"
        / "certificates"
        / "generated"
        / f"event_{event_id}"
    )

    generated_dir.mkdir(
        parents=True,
        exist_ok=True,
    )

    issued = []
    already_issued = []

    for attendance in attendance_records:
        user = attendance.ticket.user

        existing_certificate = (
            db.query(Certificate)
            .filter(
                Certificate.user_id == user.id,
                Certificate.event_id == event_id,
            )
            .first()
        )

        if existing_certificate:
            if existing_certificate.certificate_path:
                existing_file = base_dir / existing_certificate.certificate_path

                if existing_file.exists():
                    already_issued.append(user.id)
                    continue

            certificate_code = existing_certificate.certificate_code
        else:
            certificate_code = generate_certificate_code()

        output_path = (
            generated_dir
            / f"{certificate_code}.png"
        )

        create_certificate_image(
            template_path=str(template_path),
            output_path=str(output_path),
            student_name=user.name,
            event_name=event.title,
            event_date=event.event_date.strftime("%d %B %Y"),
        )

        if existing_certificate:
            existing_certificate.certificate_path = str(
                output_path.relative_to(base_dir)
            )
            certificate = existing_certificate
        else:
            certificate = Certificate(
                user_id=user.id,
                event_id=event_id,
                certificate_code=certificate_code,
                certificate_path=str(
                    output_path.relative_to(base_dir)
                ),
            )
            db.add(certificate)

        issued.append({
            "user_id": user.id,
            "user_name": user.name,
            "certificate_code": certificate_code,
        })

    db.commit()

    return {
        "message": "Certificates issued successfully",
        "event_id": event_id,
        "issued_count": len(issued),
        "already_issued_count": len(already_issued),
        "issued": issued,
    }


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
            "certificate_path": cert.certificate_path,
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