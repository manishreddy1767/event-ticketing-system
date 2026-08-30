from fastapi import FastAPI
from sqlalchemy import text

from app.database import Base, engine
from app.routes.auth import router as auth_router

from app.routes.admin import router as admin_router

app = FastAPI(title="Evently API")

Base.metadata.create_all(bind=engine)

app.include_router(auth_router)
app.include_router(admin_router)


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