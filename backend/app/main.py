from fastapi import Depends, FastAPI
from sqlalchemy import text

from app.database import Base, engine
from app.models import User
from app.routes.auth import router as auth_router

from app.core.dependencies import (
    get_current_user,
    require_admin,
    require_organizer,
    require_student,
)

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
    current_user: User = Depends(require_student),
):
    return {
        "message": "Student access granted",
        "user_id": current_user.id,
        "role": current_user.role,
    }


@app.get("/test/organizer")
def test_organizer_access(
    current_user: User = Depends(require_organizer),
):
    return {
        "message": "Organizer access granted",
        "user_id": current_user.id,
        "role": current_user.role,
    }


@app.get("/test/admin")
def test_admin_access(
    current_user: User = Depends(require_admin),
):
    return {
        "message": "Admin access granted",
        "user_id": current_user.id,
        "role": current_user.role,
    }