from pathlib import Path

import joblib
import numpy as np
from sklearn.linear_model import LinearRegression


MODEL_PATH = Path(__file__).resolve().parent / "discount_model.joblib"


def train_discount_model() -> LinearRegression:
    """
    Train a simple model that predicts discount percentage.

    Features:
        1. occupancy rate
        2. days until event
    """

    X = np.array(
        [
            [0.10, 60],
            [0.20, 45],
            [0.30, 30],
            [0.40, 25],
            [0.50, 20],
            [0.60, 15],
            [0.70, 10],
            [0.80, 7],
            [0.90, 3],
            [0.95, 1],
        ]
    )

    y = np.array(
        [
            20,
            18,
            15,
            13,
            10,
            8,
            6,
            4,
            2,
            0,
        ]
    )

    model = LinearRegression()
    model.fit(X, y)

    joblib.dump(model, MODEL_PATH)

    return model


if __name__ == "__main__":
    model = train_discount_model()

    print("Discount model trained successfully.")
    print(f"Model saved to: {MODEL_PATH}")