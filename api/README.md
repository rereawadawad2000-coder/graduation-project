# API (FastAPI) - Demo Inference Service

This service is for project demo/testing only.

## What it does

- Accepts an uploaded image from the mobile app.
- Runs model inference.
- Returns predicted class, confidence, probabilities, and disclaimer.

## Expected model artifacts

Place these files in `../scanModel/` relative to this folder:

- `skin_lesion_model.h5`
- `classes.json` (optional)

If `classes.json` is missing, defaults are used:

- `akiec`, `bcc`, `bkl`, `df`, `mel`, `nv`, `vasc`

## Setup

```bash
cd api
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

If installation times out on Windows (large wheel downloads), run:

```bash
.venv\Scripts\python -m pip install --upgrade pip
pip install --default-timeout 1000 --retries 20 -r requirements.txt
```

## Run

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Endpoints

- `GET /health`
- `POST /predict` (multipart form-data with file field name: `file`)

Example cURL:

```bash
curl -X POST "http://127.0.0.1:8000/predict" -F "file=@sample.jpg"
```
