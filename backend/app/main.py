from fastapi import FastAPI
from sqlalchemy import text

from app.database import Base, engine
from app.routes.auth import router as auth_router

from app.routes.admin import router as admin_router

from app.routes.events import router as events_router

from app.routes.tickets import router as tickets_router

from app.routes.payments import router as payments_router

from app.routes.attendance import router as attendance_router

from app.routes.teams import router as teams_router

from app.routes.certificates import router as certificates_router

from app.routes.users import router as users_router

from app.routes.organizers import router as organizers_router

app = FastAPI(title="Evently API")

Base.metadata.create_all(bind=engine)

app.include_router(auth_router)
app.include_router(admin_router)
app.include_router(events_router)
app.include_router(tickets_router)
app.include_router(payments_router)
app.include_router(attendance_router)
app.include_router(teams_router)
app.include_router(certificates_router)
app.include_router(users_router)
app.include_router(organizers_router)


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