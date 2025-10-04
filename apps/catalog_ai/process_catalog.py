import cv2
import pytesseract
import os
import json
import re
from PIL import Image, ImageEnhance
import numpy as np   # <-- THIS WAS MISSING
# -----------------------------
# Helper Functions
# -----------------------------

def optimize_image(image_path, output_path):
    """Crop product, center, resize 1:1 and enhance contrast."""
    img = cv2.imread(image_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(gray, (5,5), 0)
    _, thresh = cv2.threshold(blur, 50, 255, cv2.THRESH_BINARY_INV+cv2.THRESH_OTSU)

    # Find largest contour (assume it's product)
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if contours:
        c = max(contours, key=cv2.contourArea)
        x,y,w,h = cv2.boundingRect(c)
        crop = img[y:y+h, x:x+w]
    else:
        crop = img

    # Make 1:1 square
    h, w, _ = crop.shape
    size = max(h, w)
    square = 255 * np.ones((size, size, 3), dtype=np.uint8)
    offset_x = (size - w) // 2
    offset_y = (size - h) // 2
    square[offset_y:offset_y+h, offset_x:offset_x+w] = crop

    # Resize to 800x800 (for web)
    resized = cv2.resize(square, (800, 800))

    # Save optimized image
    cv2.imwrite(output_path, resized)
    return output_path


def extract_text(image_path):
    """Extract weight, purity, HUID from tag if visible."""
    img = Image.open(image_path)
    enhancer = ImageEnhance.Contrast(img).enhance(2)
    text = pytesseract.image_to_string(enhancer, lang="eng")

    weight = None
    purity = None
    huid = None

    # Regex patterns
    weight_match = re.search(r"(\d+(\.\d+)?)\s*(gm|g|grams?)", text, re.I)
    if weight_match:
        weight = float(weight_match.group(1))

    purity_match = re.search(r"(22K|18K|24K|916|750)", text, re.I)
    if purity_match:
        purity = purity_match.group(1).upper()

    huid_match = re.search(r"HUID[:\s]*([A-Z0-9]+)", text, re.I)
    if huid_match:
        huid = huid_match.group(1)

    return {"weight": weight, "purity": purity, "huid": huid, "raw_text": text}


def build_highlight(name, purity):
    """Stub for highlights (can later replace with LLM)."""
    return f"पेश हैं {purity} सोने के {name}, जो स्टाइलिश और आधुनिक लुक के लिए एकदम सही हैं।"


# -----------------------------
# Entry Point
# -----------------------------
def process_catalog(input_folder):
    output_folder = os.path.join(input_folder, "output")
    os.makedirs(output_folder, exist_ok=True)

    catalog = []
    img_id = 1

    for file in os.listdir(input_folder):
        if not file.lower().endswith((".jpg", ".jpeg", ".png")):
            continue

        input_path = os.path.join(input_folder, file)
        output_path = os.path.join(output_folder, file)

        # Step 1. Optimize Image
        optimized_img = optimize_image(input_path, output_path)

        # Step 2. Extract Info
        extracted = extract_text(optimized_img)

        # Step 3. Extract Name from filename
        name = os.path.splitext(file)[0]

        # Step 4. Build Highlight
        highlight = build_highlight(name, extracted["purity"] or "22K")

        # Step 5. Build JSON Entry
        product = {
            "id": img_id,
            "name": name,
            "category": "gold",
            "weight": extracted["weight"],
            "purity": extracted["purity"],
            "images": [file],
            "highlights": [highlight],
            "handpicked": True,
            "newArrival": False
        }
        catalog.append(product)
        img_id += 1

    # Save JSON
    with open(os.path.join(output_folder, "catalog.json"), "w", encoding="utf-8") as f:
        json.dump(catalog, f, indent=2, ensure_ascii=False)

    return catalog


# -----------------------------
# Example Run
# -----------------------------
if __name__ == "__main__":
    folder = "input_photos"
    catalog = process_catalog(folder)
    print("✅ Catalog generated with", len(catalog), "items.")
