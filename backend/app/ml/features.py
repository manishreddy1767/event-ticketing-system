def build_discount_features(
    registered_count: int,
    capacity: int,
    days_until_event: int,
) -> list[float]:
    if capacity <= 0:
        raise ValueError("Capacity must be greater than 0")

    occupancy_rate = registered_count / capacity

    occupancy_rate = max(
        0.0,
        min(occupancy_rate, 1.0),
    )

    return [
        occupancy_rate,
        float(days_until_event),
    ]