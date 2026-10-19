"""
Traffic Sign Saarthi AI - FastAPI Backend
Provides multi-model inference endpoints for Indian Traffic Sign classification:
- ResNet18 (Best Accuracy: 87.58% - Default)
- MobileNetV2 (Fast & Lightweight: 87.17%)
- EfficientNet-B0 (Compound Scaling: 82.69%)
- Custom CNN Baseline (71.82%)

Also provides statutory AI explanations aligned with IRC:67-2022 and Motor Vehicles Act 1988/2019.
"""

import os
import io
import json
import logging
from pathlib import Path
from typing import Optional, List, Dict, Any

from fastapi import FastAPI, UploadFile, File, Form, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel
from PIL import Image
import numpy as np
import tensorflow as tf

from backend.sign_knowledge import get_sign_metadata, SIGN_KNOWLEDGE

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("saarthi-backend")

BASE_DIR = Path(__file__).resolve().parent.parent
DATASET_TEST_DIR = BASE_DIR / "dataset" / "traffic_sign" / "test"
DATASET_TRAIN_DIR = BASE_DIR / "dataset" / "traffic_sign" / "train"

app = FastAPI(
    title="Traffic Sign Saarthi AI API",
    description="Multi-Model Indian Traffic Sign Classification & LLM Assistant API",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Multi-Model Registry Definition
AVAILABLE_MODELS: Dict[str, Dict[str, Any]] = {
    "resnet18": {
        "id": "resnet18",
        "name": "ResNet18 (Best Accuracy)",
        "short_name": "ResNet18",
        "tag": "Best Accuracy",
        "accuracy": "87.58%",
        "macro_f1": "72.25%",
        "weighted_f1": "87.33%",
        "architecture": "ResNet18 (Residual Neural Network)",
        "description": "Deep residual architecture with skip connections; achieved highest overall test accuracy (87.58%) and macro F1 (72.25%).",
        "model_path": BASE_DIR / "models" / "resnet18" / "resnet18_best.keras",
        "class_path": BASE_DIR / "models" / "resnet18" / "class_names_resnet18.json",
        "preprocessing": "raw",  # raw RGB (0-255)
        "is_default": True
    },
    "mobilenetv2": {
        "id": "mobilenetv2",
        "name": "MobileNetV2",
        "short_name": "MobileNetV2",
        "tag": "Fast & Lightweight",
        "accuracy": "87.17%",
        "macro_f1": "69.34%",
        "weighted_f1": "87.17%",
        "architecture": "MobileNetV2 (Inverted Residuals)",
        "description": "Lightweight architecture with depthwise separable convolutions; close second with 87.17% accuracy and low latency.",
        "model_path": BASE_DIR / "models" / "mobilenetv2" / "mobilenetv2_finetuned.keras",
        "class_path": BASE_DIR / "models" / "mobilenetv2" / "class_names_mobilenetv2.json",
        "preprocessing": "mobilenet",  # [-1, 1] scaling
        "is_default": False
    },
    "efficientnetb0": {
        "id": "efficientnetb0",
        "name": "EfficientNet-B0",
        "short_name": "EfficientNet-B0",
        "tag": "Compound Scaled",
        "accuracy": "82.69%",
        "macro_f1": "63.48%",
        "weighted_f1": "82.31%",
        "architecture": "EfficientNet-B0 (MBConv Blocks)",
        "description": "Compound-scaled architecture balancing depth, width, and resolution; 82.69% test accuracy.",
        "model_path": BASE_DIR / "models" / "efficientnetb0" / "efficientnetb0_best.keras",
        "class_path": BASE_DIR / "models" / "efficientnetb0" / "class_names_efficientnetb0.json",
        "preprocessing": "raw",  # raw RGB (0-255)
        "is_default": False
    },
    "cnn": {
        "id": "cnn",
        "name": "Custom CNN",
        "short_name": "Custom CNN",
        "tag": "Baseline Architecture",
        "accuracy": "71.82%",
        "macro_f1": "52.68%",
        "weighted_f1": "77.27%",
        "architecture": "Custom CNN Baseline (4-Block ConvNet)",
        "description": "Trained-from-scratch 4-block convolutional network baseline; 71.82% test accuracy.",
        "model_path": BASE_DIR / "models" / "cnn" / "custom_cnn_baseline.keras",
        "class_path": BASE_DIR / "models" / "cnn" / "class_names.json",
        "preprocessing": "raw",  # raw RGB (0-255) - model includes internal Rescaling layer
        "is_default": False
    }
}

# In-memory Model & Class Name Caches
LOADED_MODELS: Dict[str, Any] = {}
CLASS_NAMES_CACHE: Dict[str, List[str]] = {}

def normalize_model_id(raw_id: Optional[str]) -> str:
    """Normalize model selector string into canonical model key."""
    if not raw_id:
        return "resnet18"
    cleaned = raw_id.lower().replace("-", "").replace("_", "").replace(" ", "").strip()
    mapping = {
        "resnet18": "resnet18",
        "resnet": "resnet18",
        "mobilenetv2": "mobilenetv2",
        "mobilenet": "mobilenetv2",
        "efficientnetb0": "efficientnetb0",
        "efficientnet": "efficientnetb0",
        "cnn": "cnn",
        "customcnn": "cnn",
    }
    return mapping.get(cleaned, raw_id.lower().strip())

def get_or_load_model(model_key: str = "resnet18"):
    """
    Load and cache model checkpoint and class mapping.
    Raises clear errors if checkpoint files are missing or corrupted.
    Never returns fake or hallucinated predictions.
    """
    actual_key = normalize_model_id(model_key)
    if actual_key not in AVAILABLE_MODELS:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown model '{model_key}'. Supported models: {', '.join(AVAILABLE_MODELS.keys())}"
        )
    
    cfg = AVAILABLE_MODELS[actual_key]
    model_path = cfg["model_path"]
    class_path = cfg["class_path"]

    # 1. Validate checkpoint existence
    if not model_path.exists():
        raise HTTPException(
            status_code=503,
            detail=f"Model checkpoint for '{cfg['name']}' not found at {model_path}. Fake predictions are disabled."
        )

    # 2. Validate class names file
    if not class_path.exists():
        raise HTTPException(
            status_code=503,
            detail=f"Class names file for '{cfg['name']}' not found at {class_path}."
        )

    # 3. Load & cache class mapping
    if actual_key not in CLASS_NAMES_CACHE:
        try:
            with open(class_path, "r", encoding="utf-8") as f:
                CLASS_NAMES_CACHE[actual_key] = json.load(f)
            logger.info("Loaded %d class names for %s", len(CLASS_NAMES_CACHE[actual_key]), actual_key)
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to read class mapping for '{cfg['name']}': {str(e)}"
            )

    # 4. Load & cache model instance
    if actual_key not in LOADED_MODELS:
        try:
            logger.info("Loading model checkpoint for %s from %s...", actual_key, model_path)
            LOADED_MODELS[actual_key] = tf.keras.models.load_model(str(model_path))
            logger.info("Model '%s' loaded successfully into memory!", actual_key)
        except Exception as e:
            logger.error("Failed to load model %s: %s", actual_key, str(e))
            raise HTTPException(
                status_code=500,
                detail=f"Error loading model checkpoint for '{cfg['name']}': {str(e)}"
            )

    return actual_key, cfg, LOADED_MODELS[actual_key], CLASS_NAMES_CACHE[actual_key]

def preprocess_image_for_model(pil_img: Image.Image, preprocessing_mode: str) -> np.ndarray:
    """Apply exact preprocessing required by the respective architecture."""
    target_size = (224, 224)
    resized_img = pil_img.resize(target_size, Image.Resampling.BILINEAR)
    img_array = np.array(resized_img, dtype=np.float32)

    if preprocessing_mode == "mobilenet":
        # MobileNetV2 uses [-1, 1] normalization
        from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
        img_array = preprocess_input(img_array)
    # ResNet18, EfficientNet-B0, and Custom CNN expect raw float32 pixel values in [0, 255]

    return np.expand_dims(img_array, axis=0)

@app.on_event("startup")
def startup_event():
    """Preload ResNet18 (default best accuracy model) at application launch."""
    try:
        logger.info("Initializing default ResNet18 model on server startup...")
        get_or_load_model("resnet18")
    except Exception as e:
        logger.warning("Startup model preloading failed: %s", str(e))

@app.get("/api/models")
def list_available_models():
    """List all available deep learning models and their checkpoint statuses."""
    result = []
    for m_id, cfg in AVAILABLE_MODELS.items():
        result.append({
            "id": m_id,
            "name": cfg["name"],
            "short_name": cfg["short_name"],
            "tag": cfg["tag"],
            "accuracy": cfg["accuracy"],
            "macro_f1": cfg["macro_f1"],
            "weighted_f1": cfg["weighted_f1"],
            "architecture": cfg["architecture"],
            "description": cfg["description"],
            "is_default": cfg["is_default"],
            "checkpoint_exists": cfg["model_path"].exists(),
            "is_loaded": m_id in LOADED_MODELS
        })
    return result

@app.get("/api/health")
def health_check():
    """Check API and model health status."""
    resnet_ready = "resnet18" in LOADED_MODELS or AVAILABLE_MODELS["resnet18"]["model_path"].exists()
    return {
        "status": "healthy" if resnet_ready else "degraded",
        "product": "Traffic Sign Saarthi AI",
        "tagline": "Understand Every Sign. Drive Safer.",
        "default_model": "resnet18",
        "default_model_name": AVAILABLE_MODELS["resnet18"]["name"],
        "default_model_accuracy": AVAILABLE_MODELS["resnet18"]["accuracy"],
        "models_count": len(AVAILABLE_MODELS),
        "available_models": [
            {
                "id": k,
                "name": v["name"],
                "short_name": v["short_name"],
                "accuracy": v["accuracy"],
                "tag": v["tag"]
            }
            for k, v in AVAILABLE_MODELS.items()
        ],
        "framework": "TensorFlow / Keras 3"
    }

@app.post("/api/predict")
async def predict_traffic_sign(
    file: UploadFile = File(...),
    model: Optional[str] = Form(None),
    model_query: Optional[str] = Query(None, alias="model")
):
    """
    Run traffic sign classification using the selected model checkpoint:
    - Default: ResNet18 (87.58% accuracy)
    - Options: resnet18, mobilenetv2, efficientnetb0, cnn
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be a valid image (JPEG, PNG, WebP).")

    selected_model_id = model or model_query or "resnet18"
    actual_key, cfg, model_instance, class_names = get_or_load_model(selected_model_id)

    try:
        contents = await file.read()
        pil_img = Image.open(io.BytesIO(contents)).convert("RGB")

        # Apply model-specific preprocessing
        img_batch = preprocess_image_for_model(pil_img, cfg["preprocessing"])

        # Execute model prediction
        probabilities = model_instance.predict(img_batch, verbose=0)[0]
        predicted_idx = int(np.argmax(probabilities))
        predicted_class = class_names[predicted_idx] if predicted_idx < len(class_names) else f"CLASS_{predicted_idx}"
        confidence = float(probabilities[predicted_idx]) * 100

        # Extract top 5 hypotheses
        top_k_indices = np.argsort(probabilities)[-5:][::-1]
        top_predictions = []
        for idx in top_k_indices:
            c_name = class_names[idx]
            top_predictions.append({
                "class_name": c_name,
                "title": c_name.replace("_", " ").title(),
                "confidence": round(float(probabilities[idx]) * 100, 2)
            })

        metadata = get_sign_metadata(predicted_class)

        return {
            "predicted_class": predicted_class,
            "title": metadata["title"],
            "confidence": round(confidence, 2),
            "metadata": metadata,
            "top_predictions": top_predictions,
            "model_info": {
                "model_id": actual_key,
                "name": cfg["name"],
                "short_name": cfg["short_name"],
                "tag": cfg["tag"],
                "architecture": cfg["architecture"],
                "test_accuracy": cfg["accuracy"],
                "macro_f1": cfg["macro_f1"],
                "weighted_f1": cfg["weighted_f1"],
                "num_classes": len(class_names)
            }
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error("Inference execution error on model %s: %s", actual_key, str(e))
        raise HTTPException(status_code=500, detail=f"Inference error with model {cfg['name']}: {str(e)}")

class ExplainRequest(BaseModel):
    sign_name: str
    question: Optional[str] = None
    conversation_history: Optional[List[Dict[str, str]]] = None

@app.post("/api/explain")
def explain_sign(req: ExplainRequest):
    """Generate statutory AI explanation for traffic sign."""
    metadata = get_sign_metadata(req.sign_name)
    sign_title = metadata["title"]

    # If the user asked a specific follow-up question
    if req.question and req.question.strip():
        q = req.question.strip().lower()

        if any(w in q for w in ["fine", "penalty", "law", "rule", "act", "section", "challan"]):
            answer = (
                f"Under the Indian Motor Vehicles Act 1988 (Section 119 - Duty to obey traffic signs), "
                f"violating the '{sign_title}' sign constitutes a regulatory violation. "
                f"{metadata['legal_reference']} Traffic police may issue electronic challans or compound "
                f"notices, and repeat infractions may lead to points endorsement or license suspension under Section 206."
            )
        elif any(w in q for w in ["do", "action", "react", "drive", "driver", "precaution"]):
            answer = (
                f"When encountering the '{sign_title}' sign on Indian roads, you should:\n"
                f"{metadata['driver_action']}\n\n"
                f"Remember to always anticipate mixed traffic conditions, pedestrians, and two-wheelers."
            )
        elif any(w in q for w in ["why", "importance", "hazard", "danger", "risk"]):
            answer = (
                f"The '{sign_title}' sign is critical because: {metadata['safety_context']}\n\n"
                f"Indian road networks feature varied speed differentials and high pedestrian traffic. "
                f"Adhering to this sign mitigates collision exposure significantly."
            )
        elif any(w in q for w in ["mean", "meaning", "represent", "indicate", "stand for"]):
            answer = (
                f"{metadata['meaning']}\n\n"
                f"Visual geometry: {metadata['shape']}. Categorized officially as a {metadata['category']} sign."
            )
        else:
            answer = (
                f"Regarding '{sign_title}':\n"
                f"• Meaning: {metadata['meaning']}\n"
                f"• Driver Directive: {metadata['driver_action'].splitlines()[0]}\n"
                f"• Statutory Basis: {metadata['legal_reference']}"
            )

        return {
            "sign_name": metadata["class_name"],
            "title": sign_title,
            "question": req.question,
            "answer": answer,
            "metadata": metadata
        }

    # Standard structured response
    return {
        "sign_name": metadata["class_name"],
        "title": sign_title,
        "metadata": metadata,
        "sections": {
            "meaning": metadata["meaning"],
            "driver_action": metadata["driver_action"],
            "safety_context": metadata["safety_context"],
            "legal_reference": metadata["legal_reference"],
            "sources": metadata["sources"],
            "irc_code": metadata["irc_code"]
        }
    }

@app.get("/api/samples")
def list_sample_signs():
    """Return a curated list of authentic test signs present in the dataset."""
    sample_classes = [
        "STOP",
        "GIVE_WAY",
        "NO_ENTRY",
        "SPEED_LIMIT_50",
        "SPEED_LIMIT_20",
        "PEDESTRIAN_CROSSING",
        "SCHOOL_AHEAD",
        "HORN_PROHIBITED",
        "ROUNDABOUT",
        "OVERTAKING_PROHIBITED",
        "MEN_AT_WORK",
        "RIGHT_HAIR_PIN_BEND",
        "DANGEROUS_DIP",
        "COMPULSARY_KEEP_LEFT",
        "NO_PARKING",
        "NO_STOPPING_OR_STANDING"
    ]

    samples = []
    for c in sample_classes:
        meta = get_sign_metadata(c)
        samples.append({
            "class_name": c,
            "title": meta["title"],
            "category": meta["category"],
            "category_type": meta["category_type"],
            "image_url": f"/api/sample-image/{c}"
        })
    return samples

@app.get("/api/sample-image/{class_name}")
def get_sample_image(class_name: str):
    """Retrieve an actual authentic test image from the dataset."""
    class_folder = DATASET_TEST_DIR / class_name
    if not class_folder.exists() or not class_folder.is_dir():
        class_folder = DATASET_TRAIN_DIR / class_name

    if not class_folder.exists() or not class_folder.is_dir():
        raise HTTPException(status_code=404, detail=f"No image folder for class {class_name}")

    image_files = [f for f in class_folder.iterdir() if f.is_file() and f.suffix.lower() in [".jpg", ".jpeg", ".png", ".bmp", ".webp"]]
    if not image_files:
        raise HTTPException(status_code=404, detail="No images found for this class")

    return FileResponse(image_files[0], media_type="image/jpeg")

@app.get("/api/classes")
def list_all_classes():
    """List all 85 classes with basic metadata for search and selection."""
    # Ensure classes are loaded
    classes = []
    if "resnet18" not in CLASS_NAMES_CACHE:
        try:
            with open(AVAILABLE_MODELS["resnet18"]["class_path"], "r", encoding="utf-8") as f:
                CLASS_NAMES_CACHE["resnet18"] = json.load(f)
        except Exception:
            CLASS_NAMES_CACHE["resnet18"] = []

    for c in CLASS_NAMES_CACHE.get("resnet18", []):
        meta = get_sign_metadata(c)
        classes.append({
            "class_name": c,
            "title": meta["title"],
            "category": meta["category"],
            "category_type": meta["category_type"]
        })
    return classes
