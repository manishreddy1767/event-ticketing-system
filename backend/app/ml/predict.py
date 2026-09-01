from pathlib import Path
from datetime import datetime

import joblib
from sqlalchemy.orm import Session

from app.ml.features import build_discount_features
from app.models.discount_prediction import DiscountPrediction
from app.models.event import Event
from app.models.ticket import Ticket
from app.models.ticket_type import TicketType


MODEL_PATH = Path(__file__).resolve().parent / "discount_model.joblib"


def predict_discount(
    registered_count: int,
    capacity: int,
    days_until_event: int,
) -> float:
    if not MODEL_PATH.exists():
        raise FileNotFoundError(
            "Discount model not found. Run train.py first."
        )

    features = build_discount_features(
        registered_count=registered_count,
        capacity=capacity,
        days_until_event=days_until_event,
    )

    model = joblib.load(MODEL_PATH)

    prediction = model.predict([features])[0]

    # Keep the discount within a sensible range.
    prediction = max(0.0, min(float(prediction), 30.0))

    return round(prediction, 2)


def save_discount_prediction(
    db: Session,
    event: Event,
) -> DiscountPrediction:
    registered_count = (
        db.query(Ticket)
        .join(
            TicketType,
            Ticket.ticket_type_id == TicketType.id,
        )
        .filter(
            TicketType.event_id == event.id,
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
    predicted_discount = min(
        predicted_discount,
        float(event.max_discount_percent),
    )

    prediction = DiscountPrediction(
        event_id=event.id,
        registered_count=registered_count,
        capacity=event.capacity,
        days_until_event=days_until_event,
        predicted_discount=predicted_discount,
    )

    db.add(prediction)
    db.commit()
    db.refresh(prediction)

    return prediction


if __name__ == "__main__":
    print(
        predict_discount(
            registered_count=30,
            capacity=100,
            days_until_event=20,
        )
    )