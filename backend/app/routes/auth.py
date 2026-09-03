from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.schemas.user import UserResponse

from app.core.security import (
    create_access_token,
    hash_password,
    verify_password,
)
from app.database import SessionLocal
from app.models.user import User
from app.schemas.auth import (
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RegisterResponse,
)

from app.models.organizer import Organizer

from app.schemas.organizer import (
    OrganizerRegisterRequest,
    OrganizerRegisterResponse,
)


router = APIRouter(prefix="/auth", tags=["Authentication"])


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.post("/register", response_model=RegisterResponse)
def register(
    register_data: RegisterRequest,
    db: Session = Depends(get_db),
):
    existing_user = (
        db.query(User)
        .filter(User.email == register_data.email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )

    user = User(
        name=register_data.name,
        email=register_data.email,
        password_hash=hash_password(register_data.password),
        role="student",
        status="active",
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return RegisterResponse(
        id=user.id,
        name=user.name,
        email=user.email,
        role=user.role,
        status=user.status,
    )

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.post(
    "/organizer/register",
    response_model=OrganizerRegisterResponse,
    status_code=status.HTTP_201_CREATED,
)
def register_organizer(
    register_data: OrganizerRegisterRequest,
    db: Session = Depends(get_db),
):
    existing_user = (
        db.query(User)
        .filter(User.email == register_data.email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )

    user = User(
        name=register_data.name,
        email=register_data.email,
        password_hash=hash_password(register_data.password),
        role="organizer",
        status="pending",
    )

    db.add(user)
    db.flush()

    organizer = Organizer(
        user_id=user.id,
        organization_name=register_data.organization_name,
        phone=register_data.phone,
        description=register_data.description,
    )

    db.add(organizer)
    db.commit()
    db.refresh(user)
    db.refresh(organizer)

    return OrganizerRegisterResponse(
        id=user.id,
        name=user.name,
        email=user.email,
        role=user.role,
        status=user.status,
        organization_name=organizer.organization_name,
        phone=organizer.phone,
        description=organizer.description,
        created_at=user.created_at,
    )

@router.post("/login", response_model=LoginResponse)
def login(
    login_data: LoginRequest,
    db: Session = Depends(get_db),
):
    user = (
        db.query(User)
        .filter(User.email == login_data.email)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not verify_password(
        login_data.password,
        user.password_hash,
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if user.status != "active":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is not active",
        )

    access_token = create_access_token(
        user_id=user.id,
        role=user.role,
    )

    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        user_id=user.id,
        role=user.role,
    )