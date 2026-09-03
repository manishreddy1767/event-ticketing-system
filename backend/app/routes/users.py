from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_db, require_role
from app.models.student_profile import StudentProfile
from app.models.user import User
from app.schemas.user import (
    StudentProfileResponse,
    StudentProfileUpdateRequest,
    UserResponse,
    UserUpdateRequest,
)


router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


@router.get(
    "/me",
    response_model=UserResponse,
)
def get_my_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("student")),
):
    user = (
        db.query(User)
        .filter(User.id == current_user.id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    return user


@router.put(
    "/me",
    response_model=UserResponse,
)
def update_my_profile(
    profile_data: UserUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("student")),
):
    user = (
        db.query(User)
        .filter(User.id == current_user.id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    existing_user = (
        db.query(User)
        .filter(
            User.email == profile_data.email,
            User.id != current_user.id,
        )
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )

    user.name = profile_data.name
    user.email = profile_data.email

    db.commit()
    db.refresh(user)

    return user


@router.get(
    "/me/student-profile",
    response_model=StudentProfileResponse,
)
def get_student_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("student")),
):
    profile = (
        db.query(StudentProfile)
        .filter(
            StudentProfile.user_id == current_user.id
        )
        .first()
    )

    if not profile:
        return StudentProfileResponse()

    return profile


@router.put(
    "/me/student-profile",
    response_model=StudentProfileResponse,
)
def update_student_profile(
    profile_data: StudentProfileUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("student")),
):
    profile = (
        db.query(StudentProfile)
        .filter(
            StudentProfile.user_id == current_user.id
        )
        .first()
    )

    existing_roll = (
        db.query(StudentProfile)
        .filter(
            StudentProfile.roll_number
            == profile_data.roll_number,
            StudentProfile.user_id != current_user.id,
        )
        .first()
    )

    if existing_roll:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Roll number already registered",
        )

    if not profile:
        profile = StudentProfile(
            user_id=current_user.id,
            roll_number=profile_data.roll_number,
            department=profile_data.department,
            year=profile_data.year,
            college=profile_data.college,
        )

        db.add(profile)

    else:
        profile.roll_number = profile_data.roll_number
        profile.department = profile_data.department
        profile.year = profile_data.year
        profile.college = profile_data.college

    db.commit()
    db.refresh(profile)

    return profile
