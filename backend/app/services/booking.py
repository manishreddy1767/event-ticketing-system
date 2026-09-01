from datetime import datetime
from decimal import Decimal

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.ml.predict import predict_discount
from app.models.event import Event
from app.models.team import Team
from app.models.team_member import TeamMember
from app.models.ticket import Ticket
from app.models.ticket_type import TicketType
from app.models.user import User
from app.schemas.ticket import TicketCreateRequest


def book_ticket(
    db: Session,
    ticket_data: TicketCreateRequest,
    current_user: User,
    event_id: int,
) -> Ticket:
    event = (
        db.query(Event)
        .filter(
            Event.id == event_id,
            Event.status == "approved",
        )
        .first()
    )

    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found",
        )

    ticket_type = (
        db.query(TicketType)
        .filter(
            TicketType.id == ticket_data.ticket_type_id,
            TicketType.event_id == event_id,
        )
        .with_for_update()
        .first()
    )

    if not ticket_type:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket type not found",
        )

    if ticket_type.available_quantity < ticket_data.quantity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Not enough tickets available",
        )

    if ticket_data.team_id is not None:
        team = (
            db.query(Team)
            .filter(
                Team.id == ticket_data.team_id,
                Team.event_id == event_id,
            )
            .first()
        )

        if not team:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Team not found",
            )

        is_team_member = (
            db.query(TeamMember)
            .filter(
                TeamMember.team_id == team.id,
                TeamMember.user_id == current_user.id,
            )
            .first()
        )

        if not is_team_member:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You are not a member of this team",
            )

        if team.leader_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only the team leader can book a team ticket",
            )

        member_count = (
            db.query(TeamMember)
            .filter(
                TeamMember.team_id == team.id
            )
            .count()
        )

        if member_count != ticket_type.team_size:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Team size does not match the selected ticket type",
            )

    original_amount = (
        ticket_type.price * ticket_data.quantity
    )

    registered_count = (
        db.query(Ticket)
        .join(
            TicketType,
            Ticket.ticket_type_id == TicketType.id,
        )
        .filter(
            TicketType.event_id == event_id,
            Ticket.status == "paid",
        )
        .count()
    )

    days_until_event = max(
        0,
        (event.event_date - datetime.utcnow()).days,
    )

    predicted_discount = predict_discount(
        registered_count=registered_count,
        capacity=event.capacity,
        days_until_event=days_until_event,
    )

    discount_percent = min(
        predicted_discount,
        float(event.max_discount_percent),
    )

    discount_amount = (
        original_amount
        * Decimal(str(discount_percent))
        / Decimal("100")
    ).quantize(
        Decimal("0.01")
    )

    total_amount = (
        original_amount - discount_amount
    ).quantize(
        Decimal("0.01")
    )

    ticket_type.available_quantity -= ticket_data.quantity

    ticket = Ticket(
        ticket_type_id=ticket_type.id,
        user_id=current_user.id,
        team_id=ticket_data.team_id,
        quantity=ticket_data.quantity,
        total_amount=total_amount,
        discount_percent=discount_percent,
        discount_amount=discount_amount,
        status="reserved",
    )

    db.add(ticket)
    db.commit()
    db.refresh(ticket)

    return ticket