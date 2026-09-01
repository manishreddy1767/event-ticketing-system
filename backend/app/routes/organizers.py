from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_db
from app.core.security import hash_password
from app.models.organizer import Organizer
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