from fastapi import Depends, FastAPI
from sqlalchemy import text

from app.core.dependencies import require_role
from app.database import Base, engine
from app.models import User
from app.routes.auth import router as auth_router


app = FastAPI(title="Evently API")

Base.metadata.create_all(bind=engine)

app.include_router(auth_router)


@app.get("/")
def root():
    return {
        "message": "Evently API is running"
    }


@app.get("/db-test")
def database_test():
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))

        return {
            "database": "connected",
            "result": result.scalar(),
        }


@app.get("/test/student")
def test_student_access(
    current_user: User = Depends(
        require_role("student")
    ),
):
    return {
        "message": "Student access granted",
        "user_id": current_user.id,
        "role": current_user.role,
    }


@app.get("/test/organizer")
def test_organizer_access(
    current_user: User = Depends(
        require_role("organizer", "admin")
    ),
):
    return {
        "message": "Organizer/Admin access granted",
        "user_id": current_user.id,
        "role": current_user.role,
    }


@app.get("/test/admin")
def test_admin_access(
    current_user: User = Depends(
        require_role("admin")
    ),
):
    return {
        "message": "Admin access granted",
        "user_id": current_user.id,
        "role": current_user.role,
    }