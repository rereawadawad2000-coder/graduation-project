from __future__ import annotations

import io
import json
import os
from pathlib import Path
from typing import Annotated, Dict, List, Optional

import numpy as np
import tensorflow as tf
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image, UnidentifiedImageError

DISCLAIMER = "For educational use only. Not a medical diagnosis."
DEFAULT_CLASSES = ["akiec", "bcc", "bkl", "df", "mel", "nv", "vasc"]
IMG_SIZE = int(os.getenv("IMG_SIZE", "128"))
MIN_CONFIDENCE = float(os.getenv("MIN_CONFIDENCE", "0.93"))
MIN_MARGIN = float(os.getenv("MIN_MARGIN", "0.12"))
MIN_SKIN_RATIO = float(os.getenv("MIN_SKIN_RATIO", "0.20"))
MAX_TTA_STD = float(os.getenv("MAX_TTA_STD", "0.10"))

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
    reliable: bool
    top2_margin: float
    skin_ratio: float
    tta_std: float
    reliability_reason: Optional[str] = None
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


_model: Optional[tf.keras.Model] = None
_class_names: Optional[List[str]] = None


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


def _preprocess_image(file_bytes: bytes) -> tuple[np.ndarray, np.ndarray]:
    try:
        image = Image.open(io.BytesIO(file_bytes)).convert("RGB")
    except UnidentifiedImageError as exc:
        raise InvalidImageError("Invalid image file.") from exc

    image = image.resize((IMG_SIZE, IMG_SIZE))
    image_uint8 = np.asarray(image, dtype=np.uint8)
    array = image_uint8.astype(np.float32) / 255.0
    return np.expand_dims(array, axis=0), image_uint8


def _estimate_skin_ratio(image_uint8: np.ndarray) -> float:
    pixels = image_uint8.astype(np.float32)
    if pixels.size == 0:
        return 0.0

    red = pixels[..., 0]
    green = pixels[..., 1]
    blue = pixels[..., 2]
    max_rgb = np.maximum(np.maximum(red, green), blue)
    min_rgb = np.minimum(np.minimum(red, green), blue)

    sum_rgb = red + green + blue + 1e-6
    chroma_red = red / sum_rgb
    chroma_green = green / sum_rgb
    saturation = (max_rgb - min_rgb) / (max_rgb + 1e-6)
    non_gray = saturation >= 0.08
    warm_tone = red >= green * 0.85

    # Broad skin-color prior to filter obvious non-skin images in demo mode.
    chroma_mask = (
        (chroma_red >= 0.23)
        & (chroma_red <= 0.68)
        & (chroma_green >= 0.18)
        & (chroma_green <= 0.50)
        & (red > 20)
        & (green > 20)
        & (blue > 20)
    )

    chroma_blue = -0.168736 * red - 0.331264 * green + 0.5 * blue + 128.0
    chroma_red_component = 0.5 * red - 0.418688 * green - 0.081312 * blue + 128.0
    ycbcr_mask = (
        (chroma_red_component >= 125)
        & (chroma_red_component <= 180)
        & (chroma_blue >= 70)
        & (chroma_blue <= 140)
    )

    skin_mask = (chroma_mask | ycbcr_mask) & non_gray & warm_tone
    return float(np.mean(skin_mask))


def _predict_with_augmentations(input_tensor: np.ndarray) -> np.ndarray:
    augmented_inputs = np.concatenate(
        [
            input_tensor,
            np.flip(input_tensor, axis=1),
            np.flip(input_tensor, axis=2),
            np.rot90(input_tensor, k=1, axes=(1, 2)),
        ],
        axis=0,
    )

    batch_scores = _model.predict(augmented_inputs, verbose=0)
    normalized_scores = [_normalize_scores(row) for row in batch_scores]
    return np.stack(normalized_scores, axis=0)


def _normalize_scores(raw_scores: np.ndarray) -> np.ndarray:
    scores = np.asarray(raw_scores, dtype=np.float32).reshape(-1)

    if scores.size == 0:
        return scores

    safe_scores = np.nan_to_num(scores, nan=0.0, posinf=0.0, neginf=0.0)

    # Keep probability outputs stable when they are already normalized.
    total = float(np.sum(safe_scores))
    if np.all(safe_scores >= 0.0) and 0.99 <= total <= 1.01:
        return safe_scores / total

    # Otherwise treat model output as logits and apply softmax.
    shifted = safe_scores - float(np.max(safe_scores))
    exp_scores = np.exp(shifted)
    exp_total = float(np.sum(exp_scores))

    if exp_total <= 0.0:
        return np.full(safe_scores.shape, 1.0 / safe_scores.size, dtype=np.float32)

    return exp_scores / exp_total


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
        input_tensor, image_uint8 = _preprocess_image(file_bytes)
    except InvalidImageError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    skin_ratio = _estimate_skin_ratio(image_uint8)
    probs_batch = _predict_with_augmentations(input_tensor)
    if probs_batch.size == 0:
        raise HTTPException(status_code=503, detail="Model returned an empty prediction tensor.")
    probs = np.mean(probs_batch, axis=0)

    class_names = _class_names if _class_names is not None else DEFAULT_CLASSES
    if len(class_names) != len(probs):
        class_names = [f"class_{i}" for i in range(len(probs))]

    probabilities = {label: float(score) for label, score in zip(class_names, probs)}
    sorted_indices = np.argsort(probs)[::-1]
    top_index = int(sorted_indices[0])
    second_index = int(sorted_indices[1]) if len(sorted_indices) > 1 else top_index

    top_confidence = float(probs[top_index])
    tta_std = float(np.std(probs_batch[:, top_index]))
    top2_margin = top_confidence - float(probs[second_index]) if len(sorted_indices) > 1 else top_confidence
    reliable = (
        top_confidence >= MIN_CONFIDENCE
        and top2_margin >= MIN_MARGIN
        and skin_ratio >= MIN_SKIN_RATIO
        and tta_std <= MAX_TTA_STD
    )
    reliability_reason = None
    if not reliable:
        if skin_ratio < MIN_SKIN_RATIO:
            reliability_reason = "Inconclusive result. The image does not look like a close-up skin lesion."
        elif tta_std > MAX_TTA_STD:
            reliability_reason = "Inconclusive result. Prediction changed too much across image transforms."
        elif top_confidence < MIN_CONFIDENCE:
            reliability_reason = "Inconclusive result. Confidence is too low for a stable class prediction."
        else:
            reliability_reason = "Inconclusive result. Top classes are too close to each other."

    return PredictionResponse(
        predicted_class=class_names[top_index],
        confidence=top_confidence,
        probabilities=probabilities,
        reliable=reliable,
        top2_margin=float(top2_margin),
        skin_ratio=skin_ratio,
        tta_std=tta_std,
        reliability_reason=reliability_reason,
    )
