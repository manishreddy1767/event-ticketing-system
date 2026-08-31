from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Attendance(Base):
    __tablename__ = "attendance"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True,
    )

    ticket_id: Mapped[int] = mapped_column(
        ForeignKey("tickets.id"),
        unique=True,
        nullable=False,
    )

    checked_in_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    status: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="checked_in",
    )

    ticket = relationship("Ticket")