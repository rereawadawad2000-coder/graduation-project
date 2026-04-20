# API (FastAPI) - Demo Inference Service

This service is for project demo/testing only.

## What it does

- Accepts an uploaded image from the mobile app.
- Runs model inference.
- Returns predicted class, confidence, probabilities, and disclaimer.

Model scope note:

- This is a closed-set classifier trained for skin-lesion categories.
- It is not inherently aware of all possible image types; out-of-scope images can still produce a class without reliability checks.

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

Important:

- `0.0.0.0` means "listen on all interfaces". It is not a browser URL.
- On the same PC, open: `http://127.0.0.1:8000/health`
- On a phone (same Wi-Fi), open: `http://<YOUR_PC_LAN_IP>:8000/health`

To find your LAN IP on Windows:

```bash
ipconfig
```

Use the `IPv4 Address` under your active Wi-Fi adapter.

For Expo mobile app testing, set this in `skin-cancer-detection/.env.local`:

```bash
EXPO_PUBLIC_API_BASE_URL=http://<YOUR_PC_LAN_IP>:8000
```

Then restart Expo.

## Endpoints

- `GET /health`
- `POST /predict` (multipart form-data with file field name: `file`)

`POST /predict` also returns reliability metadata:

- `reliable` (boolean): whether the result passes confidence/consistency checks.
- `reliability_reason` (string or null): why a result is marked inconclusive.
- `top2_margin`, `skin_ratio`, `tta_std`: diagnostic values for tuning.

Recommended app behavior: if `reliable` is `false`, show **INCONCLUSIVE** instead of a class label.

Optional env tuning:

- `MIN_CONFIDENCE` (default `0.93`)
- `MIN_MARGIN` (default `0.12`)
- `MIN_SKIN_RATIO` (default `0.20`)
- `MAX_TTA_STD` (default `0.10`)

Example cURL:

```bash
curl -X POST "http://127.0.0.1:8000/predict" -F "file=@sample.jpg"
```
