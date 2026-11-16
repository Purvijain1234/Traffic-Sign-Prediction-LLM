#!/usr/bin/env python
"""Convert the ResNet‑18 Keras checkpoint to a TensorFlow‑Lite model (float‑32).

No quantization is applied, so the conversion always succeeds.
The resulting .tflite file is ~30 MiB, well within Render’s memory budget."""
import pathlib
import tensorflow as tf

# ----------------------------------------------------------------------
BASE_DIR   = pathlib.Path(__file__).parent
MODEL_KERAS = BASE_DIR / "models" / "resnet18" / "resnet18_best.keras"
MODEL_TFLITE = BASE_DIR / "models" / "resnet18" / "resnet18_best.tflite"
# ----------------------------------------------------------------------

if not MODEL_KERAS.exists():
    raise FileNotFoundError(f"Keras model not found at {MODEL_KERAS}")

print(f"Loading Keras model from {MODEL_KERAS} …")
keras_model = tf.keras.models.load_model(MODEL_KERAS, compile=False)

print("Converting to TensorFlow‑Lite (float‑32)…")
converter = tf.lite.TFLiteConverter.from_keras_model(keras_model)

# **No optimizations / quantization here**
tflite_model = converter.convert()

# Save the result
MODEL_TFLITE.parent.mkdir(parents=True, exist_ok=True)
with open(MODEL_TFLITE, "wb") as f:
    f.write(tflite_model)

size_mb = MODEL_TFLITE.stat().st_size / 1_048_576
print(f"✅ TFLite model written to {MODEL_TFLITE} ({size_mb:.2f} MiB)")