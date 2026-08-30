from sqlalchemy.orm import Session

from app.core.config import ADMIN_EMAIL, ADMIN_PASSWORD
from app.core.security import hash_password
from app.database import SessionLocal
from app.models.user import User


def create_admin():
    db: Session = SessionLocal()

    try:
        existing_admin = (
            db.query(User)
            .filter(User.role == "admin")
            .first()
        )

        if existing_admin:
            print(f"Admin already exists: {existing_admin.email}")
            return

        existing_user = (
            db.query(User)
            .filter(User.email == ADMIN_EMAIL)
            .first()
        )

        if existing_user:
            print(f"Email already exists: {existing_user.email}")
            return

        admin = User(
            name="Evently Admin",
            email=ADMIN_EMAIL,
            password_hash=hash_password(ADMIN_PASSWORD),
            role="admin",
            status="active",
        )

        db.add(admin)
        db.commit()
        db.refresh(admin)

        print("Default admin account created successfully.")
        print(f"Admin ID: {admin.id}")
        print(f"Admin email: {admin.email}")

    finally:
        db.close()


if __name__ == "__main__":
    create_admin()