from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Certificate(Base):
    __tablename__ = "certificates"

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "event_id",
            name="uq_certificate_user_event",
        ),
    )

    id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True,
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
    )

    event_id: Mapped[int] = mapped_column(
        ForeignKey("events.id"),
        nullable=False,
    )

    certificate_code: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False,
    )

    certificate_path: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    issued_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    user = relationship("User")
    event = relationship("Event")