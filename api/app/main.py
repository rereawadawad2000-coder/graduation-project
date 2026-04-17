from __future__ import annotations

import io
import json
import os
from pathlib import Path
from typing import Annotated, Dict, List

import numpy as np
import tensorflow as tf
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image, UnidentifiedImageError

DISCLAIMER = "For educational use only. Not a medical diagnosis."
DEFAULT_CLASSES = ["akiec", "bcc", "bkl", "df", "mel", "nv", "vasc"]
IMG_SIZE = int(os.getenv("IMG_SIZE", "128"))

PROJECT_ROOT = Path(__file__).resolve().parents[2]
MODEL_PATH = Path(os.getenv("MODEL_PATH", str(PROJECT_ROOT / "scanModel" / "skin_lesion_model.h5")))
CLASSES_PATH = Path(os.getenv("CLASSES_PATH", str(PROJECT_ROOT / "scanModel" / "classes.json")))

app = FastAPI(title="Skin Lesion Demo API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PredictionResponse(BaseModel):
    predicted_class: str
    confidence: float
    probabilities: Dict[str, float]
    disclaimer: str = DISCLAIMER


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    model_path: str
    classes_path: str
    disclaimer: str = DISCLAIMER


class ModelUnavailableError(Exception):
    """Raised when model artifacts are missing or cannot be loaded."""


class InvalidImageError(Exception):
    """Raised when uploaded data cannot be parsed as an image."""


_model: tf.keras.Model | None = None
_class_names: List[str] | None = None


def _load_class_names() -> List[str]:
    if not CLASSES_PATH.exists():
        return DEFAULT_CLASSES

    try:
        content = json.loads(CLASSES_PATH.read_text(encoding="utf-8"))
        if not isinstance(content, list) or not content:
            return DEFAULT_CLASSES
        return [str(label) for label in content]
    except (json.JSONDecodeError, OSError):
        return DEFAULT_CLASSES


def _ensure_model_loaded() -> None:
    global _model, _class_names

    if _model is not None and _class_names is not None:
        return

    if not MODEL_PATH.exists():
        raise ModelUnavailableError(
            f"Model file not found at '{MODEL_PATH}'. "
            "Export your trained model to this path or set MODEL_PATH."
        )

    try:
        _model = tf.keras.models.load_model(MODEL_PATH)
        _class_names = _load_class_names()
    except Exception as exc:  # pylint: disable=broad-except
        raise ModelUnavailableError(f"Failed to load model: {exc}") from exc


def _preprocess_image(file_bytes: bytes) -> np.ndarray:
    try:
        image = Image.open(io.BytesIO(file_bytes)).convert("RGB")
    except UnidentifiedImageError as exc:
        raise InvalidImageError("Invalid image file.") from exc

    image = image.resize((IMG_SIZE, IMG_SIZE))
    array = np.asarray(image, dtype=np.float32) / 255.0
    return np.expand_dims(array, axis=0)


@app.get("/health")
def health() -> HealthResponse:
    model_loaded = MODEL_PATH.exists()
    return HealthResponse(
        status="ok",
        model_loaded=model_loaded,
        model_path=str(MODEL_PATH),
        classes_path=str(CLASSES_PATH),
    )


@app.post(
    "/predict",
    responses={
        400: {"description": "Invalid or empty uploaded image."},
        503: {"description": "Model unavailable or not loaded."},
    },
)
async def predict(file: Annotated[UploadFile, File(...)]) -> PredictionResponse:
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image uploads are supported.")

    try:
        _ensure_model_loaded()
    except ModelUnavailableError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc

    file_bytes = await file.read()
    if not file_bytes:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    try:
        input_tensor = _preprocess_image(file_bytes)
    except InvalidImageError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    probs = _model.predict(input_tensor, verbose=0)[0]

    class_names = _class_names if _class_names is not None else DEFAULT_CLASSES
    if len(class_names) != len(probs):
        class_names = [f"class_{i}" for i in range(len(probs))]

    probabilities = {label: float(score) for label, score in zip(class_names, probs)}
    top_index = int(np.argmax(probs))

    return PredictionResponse(
        predicted_class=class_names[top_index],
        confidence=float(probs[top_index]),
        probabilities=probabilities,
    )
