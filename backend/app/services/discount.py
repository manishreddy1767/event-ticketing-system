from decimal import Decimal


def calculate_discount(
    amount: Decimal,
    discount_percent: Decimal,
) -> Decimal:
    """
    Calculate the discount amount.

    Example:
        amount = 1000
        discount_percent = 10
        result = 100
    """

    if amount < 0:
        raise ValueError("Amount cannot be negative")

    if discount_percent < 0 or discount_percent > 100:
        raise ValueError(
            "Discount must be between 0 and 100"
        )

    discount = (
        amount * discount_percent / Decimal("100")
    )

    return discount.quantize(
        Decimal("0.01")
    )


def calculate_discounted_amount(
    amount: Decimal,
    discount_percent: Decimal,
) -> Decimal:
    """
    Calculate the final amount after applying a discount.
    """

    discount = calculate_discount(
        amount,
        discount_percent,
    )

    return (
        amount - discount
    ).quantize(Decimal("0.01"))