from datetime import datetime

from sqlalchemy import CheckConstraint, DateTime, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship


from app.database import Base


class Event(Base):
    __tablename__ = "events"

    __table_args__ = (
        CheckConstraint(
            "capacity > 0",
            name="ck_event_capacity_positive",
        ),
        CheckConstraint(
            "max_discount_percent >= 0 AND max_discount_percent <= 100",
            name="ck_event_discount_range",
        ),
        CheckConstraint(
            "status IN ('pending', 'approved', 'rejected')",
            name="ck_event_status_valid",
        ),
    )

    id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True,
    )

    organizer_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
    )

    title: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    venue: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    event_date: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
    )

    capacity: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    max_discount_percent: Mapped[float] = mapped_column(
        Numeric(5, 2),
        nullable=False,
        default=0,
    )

    certificate_template_path: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="pending",
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    organizer = relationship("User")