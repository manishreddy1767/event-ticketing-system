import uuid
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont


def generate_certificate_code() -> str:
    return f"EVT-CERT-{uuid.uuid4().hex.upper()}"


def _load_font(size: int, bold: bool = False):
    candidates = []

    if bold:
        candidates.extend([
            "C:/Windows/Fonts/arialbd.ttf",
            "C:/Windows/Fonts/calibrib.ttf",
        ])
    else:
        candidates.extend([
            "C:/Windows/Fonts/arial.ttf",
            "C:/Windows/Fonts/calibri.ttf",
        ])

    candidates.extend([
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
        if bold
        else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
    ])

    for path in candidates:
        if Path(path).exists():
            return ImageFont.truetype(path, size)

    return ImageFont.load_default()


def _draw_centered(draw, text, y, font, image_width):
    bbox = draw.textbbox((0, 0), text, font=font)

    text_width = bbox[2] - bbox[0]
    x = (image_width - text_width) / 2

    draw.text(
        (x, y),
        text,
        font=font,
        fill=(80, 65, 35),
    )


def _remove_placeholder_text(image):
    """
    Remove the dark placeholder text from the center of the
    certificate while preserving the original artwork.
    """

    image_bgr = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

    height, width = image.shape[:2]

    # Work in grayscale to identify dark text.
    gray = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2GRAY)

    mask = np.zeros((height, width), dtype=np.uint8)

    # Only inspect the central text area.
    x1 = int(width * 0.20)
    x2 = int(width * 0.80)

    # Placeholder text bands.
    bands = [
        (int(height * 0.34), int(height * 0.41)),
        (int(height * 0.41), int(height * 0.51)),
        (int(height * 0.51), int(height * 0.60)),
        (int(height * 0.60), int(height * 0.69)),
        (int(height * 0.69), int(height * 0.75)),
    ]

    for y1, y2 in bands:
        region = gray[y1:y2, x1:x2]

        # Dark pixels are likely template text.
        text_mask = cv2.inRange(region, 0, 145)

        # Remove tiny noise.
        small_kernel = np.ones((2, 2), np.uint8)
        text_mask = cv2.morphologyEx(
            text_mask,
            cv2.MORPH_OPEN,
            small_kernel,
        )

        # Slightly connect anti-aliased character pixels.
        text_mask = cv2.dilate(
            text_mask,
            np.ones((2, 2), np.uint8),
            iterations=1,
        )

        mask[y1:y2, x1:x2] = cv2.bitwise_or(
            mask[y1:y2, x1:x2],
            text_mask,
        )

    # Inpaint only the detected text pixels.
    restored = cv2.inpaint(
        image_bgr,
        mask,
        3,
        cv2.INPAINT_TELEA,
    )

    return cv2.cvtColor(restored, cv2.COLOR_BGR2RGB)

def create_certificate_image(
    template_path,
    output_path,
    student_name,
    event_name,
    event_date,
    organization="Vardhaman College of Engineering",
):
    """
    Generate a personalized certificate while preserving
    the original certificate template design.
    """

    template_path = Path(template_path)

    # Load original template.
    image = Image.open(template_path).convert("RGB")
    image_array = np.array(image)

    width, height = image.size

    # Remove only placeholder text.
    image_array = _remove_placeholder_text(image_array)

    certificate = Image.fromarray(image_array)
    draw = ImageDraw.Draw(certificate)

    # Fonts.
    name_font_size = max(28, int(width * 0.052))
    detail_font_size = max(14, int(width * 0.024))
    small_font_size = max(10, int(width * 0.018))

    name_font = _load_font(name_font_size)
    detail_font = _load_font(detail_font_size)
    small_font = _load_font(small_font_size)

    # Draw personalized information.
    _draw_centered(
        draw,
        student_name,
        int(height * 0.43),
        name_font,
        width,
    )

    _draw_centered(
        draw,
        f"for participating in {event_name}",
        int(height * 0.56),
        detail_font,
        width,
    )

    _draw_centered(
        draw,
        organization,
        int(height * 0.64),
        detail_font,
        width,
    )

    _draw_centered(
        draw,
        event_date,
        int(height * 0.70),
        small_font,
        width,
    )

    # Save.
    output = Path(output_path)
    output.parent.mkdir(parents=True, exist_ok=True)

    certificate.save(
        output,
        format="PNG",
        optimize=True,
    )

    return str(output)