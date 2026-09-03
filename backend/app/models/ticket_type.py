from sqlalchemy import CheckConstraint, ForeignKey, Integer, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class TicketType(Base):
    __tablename__ = "ticket_types"

    __table_args__ = (
        CheckConstraint(
            "price >= 0",
            name="ck_ticket_type_price_non_negative",
        ),
        CheckConstraint(
            "capacity > 0",
            name="ck_ticket_type_capacity_positive",
        ),
        CheckConstraint(
            "available_quantity >= 0",
            name="ck_ticket_type_available_non_negative",
        ),
        CheckConstraint(
            "available_quantity <= capacity",
            name="ck_ticket_type_available_lte_capacity",
        ),
        CheckConstraint(
            "team_size >= 1 AND team_size <= 3",
            name="ck_ticket_type_team_size_range",
        ),
    )

    id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True,
    )

    event_id: Mapped[int] = mapped_column(
        ForeignKey("events.id"),
        nullable=False,
    )

    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    price: Mapped[float] = mapped_column(
        Numeric(10, 2),
        nullable=False,
    )

    capacity: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    available_quantity: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    team_size: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=1,
    )

    event = relationship("Event")