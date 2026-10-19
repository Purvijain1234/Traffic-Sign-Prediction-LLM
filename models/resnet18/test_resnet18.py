import json
import random
from pathlib import Path

import numpy as np
import tensorflow as tf
import matplotlib.pyplot as plt

# Project paths
PROJECT_DIR = Path(r"C:\Programming\Projects\Traffic Sign")

MODEL_PATH = (
    PROJECT_DIR / "models" / "resnet18"
    / "resnet18_best.keras"
)

CLASS_PATH = (
    PROJECT_DIR / "models" / "resnet18"
    / "class_names_resnet18.json"
)

TEST_DIR = PROJECT_DIR / "dataset" / "traffic_sign" / "test"

print("Model exists:", MODEL_PATH.exists(), MODEL_PATH)
print("Class names exist:", CLASS_PATH.exists(), CLASS_PATH)

# Check paths
if not MODEL_PATH.exists():
    raise FileNotFoundError(f"Model not found: {MODEL_PATH}")

if not CLASS_PATH.exists():
    raise FileNotFoundError(f"Class names not found: {CLASS_PATH}")

if not TEST_DIR.exists():
    raise FileNotFoundError(f"Test directory not found: {TEST_DIR}")

# Load model and class names
print("\nLoading ResNet18 model...")
model = tf.keras.models.load_model(MODEL_PATH)

with open(CLASS_PATH, "r", encoding="utf-8") as f:
    CLASS_NAMES = json.load(f)

print("Model loaded successfully!")
print("Number of classes:", len(CLASS_NAMES))

IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".bmp", ".webp"}

# Select a random test image
image_paths = [
    p for p in TEST_DIR.rglob("*")
    if p.is_file() and p.suffix.lower() in IMAGE_EXTS
]

if not image_paths:
    raise FileNotFoundError(f"No test images found in {TEST_DIR}")

image_path = random.choice(image_paths)

# Load and preprocess image
img = tf.keras.utils.load_img(
    image_path,
    target_size=(224, 224)
)

img_array = tf.keras.utils.img_to_array(img)

# ResNet18 was trained on raw pixel values (0-255)
img_batch = np.expand_dims(img_array, axis=0)

# Predict
probabilities = model.predict(img_batch, verbose=0)[0]

predicted_idx = int(np.argmax(probabilities))
predicted_class = CLASS_NAMES[predicted_idx]
confidence = float(probabilities[predicted_idx]) * 100

actual_class = image_path.parent.name

# Display image and results
plt.figure(figsize=(7, 6))
plt.imshow(img)
plt.axis("off")
plt.title(
    f"Actual: {actual_class}\n"
    f"Predicted: {predicted_class}\n"
    f"Confidence: {confidence:.2f}%"
)
plt.tight_layout()
plt.show()

print("\nImage:", image_path.name)
print("Actual class:", actual_class)
print("Predicted class:", predicted_class)
print(f"Confidence: {confidence:.2f}%")
print("Correct prediction:", actual_class == predicted_class)

# Top 3 predictions
print("\nTop 3 predictions:")

top_indices = np.argsort(probabilities)[-3:][::-1]

for idx in top_indices:
    print(f"{CLASS_NAMES[idx]}: {probabilities[idx] * 100:.2f}%")