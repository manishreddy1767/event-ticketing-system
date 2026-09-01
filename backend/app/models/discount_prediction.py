from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class DiscountPrediction(Base):
    __tablename__ = "discount_predictions"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True,
    )

    event_id: Mapped[int] = mapped_column(
        ForeignKey("events.id"),
        nullable=False,
    )

    registered_count: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    capacity: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    days_until_event: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    predicted_discount: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    event = relationship("Event")