import json
from pathlib import Path

import requests


BASE_URL = "http://127.0.0.1:8000"

EMAIL = "organizer2@test.com"
PASSWORD = "TestPassword123!"

EVENT_ID = 2


def main():
    print("1. Logging in...")

    login_response = requests.post(
        f"{BASE_URL}/auth/login",
        json={
            "email": EMAIL,
            "password": PASSWORD,
        },
        timeout=10,
    )

    print(f"   Login status: {login_response.status_code}")

    if login_response.status_code != 200:
        print(login_response.text)
        return

    login_data = login_response.json()
    token = login_data["access_token"]

    print("   Login successful.")
    print("   JWT received.")

    headers = {
        "Authorization": f"Bearer {token}",
    }

    print()
    print(f"2. Checking certificates for Event {EVENT_ID}...")

    certificates_response = requests.get(
        f"{BASE_URL}/certificates/events/{EVENT_ID}",
        headers=headers,
        timeout=10,
    )

    print(
        f"   Certificate list status: "
        f"{certificates_response.status_code}"
    )

    if certificates_response.status_code != 200:
        print(certificates_response.text)
        return

    certificates_before = certificates_response.json()

    print(
        f"   Existing certificates: "
        f"{len(certificates_before)}"
    )

    print()
    print(f"3. Issuing certificates for Event {EVENT_ID}...")

    issue_response = requests.post(
        f"{BASE_URL}/certificates/events/{EVENT_ID}/issue-all",
        headers=headers,
        timeout=30,
    )

    print(
        f"   Issue-all status: "
        f"{issue_response.status_code}"
    )

    if issue_response.status_code not in (200, 201):
        print(issue_response.text)
        return

    result = issue_response.json()

    print()
    print(json.dumps(result, indent=2))

    print()
    print("4. Checking generated files...")

    certificates_response = requests.get(
        f"{BASE_URL}/certificates/events/{EVENT_ID}",
        headers=headers,
        timeout=10,
    )

    if certificates_response.status_code != 200:
        print(certificates_response.text)
        return

    certificates_after = certificates_response.json()

    print(
        f"   Certificates after issuing: "
        f"{len(certificates_after)}"
    )

    backend_dir = Path(__file__).resolve().parent.parent

    found = 0

    for certificate in certificates_after:
        certificate_path = certificate.get("certificate_path")

        print()
        print(f"   Student: {certificate['user']['name']}")
        print(f"   Code: {certificate['certificate_code']}")
        print(f"   Path: {certificate_path}")

        if certificate_path:
            file_path = backend_dir / certificate_path

            if file_path.exists():
                print("   File: EXISTS")
                print(f"   Size: {file_path.stat().st_size} bytes")
                found += 1
            else:
                print("   File: NOT FOUND")

    print()
    print(
        f"5. Result: {found}/{len(certificates_after)} "
        f"certificate files found."
    )


if __name__ == "__main__":
    main()
