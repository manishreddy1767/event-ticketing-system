import uuid


def generate_certificate_code() -> str:
    return f"EVT-CERT-{uuid.uuid4().hex.upper()}"