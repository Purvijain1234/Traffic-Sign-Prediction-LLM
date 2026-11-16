import json
import random
from pathlib import Path

import numpy as np
import tensorflow as tf
import matplotlib.pyplot as plt

# Project paths
PROJECT_DIR = Path(r"C:\Programming\Projects\Traffic")
MODEL_PATH = PROJECT_DIR / "models" / "model_name" / "model_file.keras"
CLASS_PATH = PROJECT_DIR / "models" / "model_name" / "class_names.json"
TEST_DIR = PROJECT_DIR / "dataset" / "traffic_sign" / "test"

# Load model and class names
model = tf.keras.models.load_model(MODEL_PATH)

with open(CLASS_PATH, "r", encoding="utf-8") as f:
    CLASS_NAMES = json.load(f)

IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".bmp", ".webp"}

# Select a random test image
image_paths = [
    p for p in TEST_DIR.rglob("*")
    if p.is_file() and p.suffix.lower() in IMAGE_EXTS
]

if not image_paths:
    raise FileNotFoundError(f"No test images found in {TEST_DIR}")

image_path = random.choice(image_paths)

# Preprocess the image
img = tf.keras.utils.load_img(
    image_path,
    target_size=(224, 224)
)

img_array = tf.keras.utils.img_to_array(img)

# Predict
probabilities = model.predict(
    np.expand_dims(img_array, axis=0),
    verbose=0
)[0]

predicted_idx = int(np.argmax(probabilities))
predicted_class = CLASS_NAMES[predicted_idx]
confidence = float(probabilities[predicted_idx]) * 100
actual_class = image_path.parent.name

# Display image and results
plt.imshow(img)
plt.axis("off")
plt.title(f"Actual: {actual_class}\nPredicted: {predicted_class}")
plt.show()

print("Image:", image_path.name)
print("Actual class:", actual_class)
print("Predicted class:", predicted_class)
print(f"Confidence: {confidence:.2f}%")
print("Correct prediction:", actual_class == predicted_class)

# Top 3 predictions
print("\nTop 3 predictions:")
for idx in np.argsort(probabilities)[-3:][::-1]:
    print(f"{CLASS_NAMES[idx]}: {probabilities[idx] * 100:.2f}%")