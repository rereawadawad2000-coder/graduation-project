# Model Export To-Do (Notebook -> FastAPI)

This checklist is focused on one goal: after training in `skin-lesion-classification-analysis.ipynb`, produce model artifacts that your FastAPI API can load and use.

## Current status from your notebook

- Training is already implemented.
- Evaluation is already implemented.
- `classes.json` already exists in this folder.
- Missing piece in notebook: explicit model export cell and artifact validation flow.

## 1) Add export cells in notebook

Do this after the evaluation step (after the section where classification report is printed).

Notebook placement tip:

- Insert these new cells after Cell 23 (the code cell under Model Evaluation).

- [ ] Add a new markdown cell: `Export Trained Model Artifacts`
- [ ] Add a new code cell with this content:

```python
import json
from pathlib import Path

OUTPUT_DIR = Path(".")  # current notebook folder (scanModel)
MODEL_NAME = "skin_lesion_model.h5"
CLASSES_NAME = "classes.json"

model_path = OUTPUT_DIR / MODEL_NAME
classes_path = OUTPUT_DIR / CLASSES_NAME

# Save trained Keras model
model.save(model_path)

# Save class order used during training
classes_path.write_text(json.dumps(le.classes_.tolist(), indent=2), encoding="utf-8")

print(f"Saved model to: {model_path.resolve()}")
print(f"Saved classes to: {classes_path.resolve()}")
```

## 2) Validate artifacts inside notebook

Notebook placement tip:

- Insert these cells right after the export code you added in Step 1.

- [ ] Add a new markdown cell: `Validate Saved Model`
- [ ] Add a new code cell with this content:

```python
# Reload model from disk to confirm export is valid
reloaded_model = tf.keras.models.load_model(model_path)

# Run one sample prediction from test set
sample = X_test[0:1]
probs = reloaded_model.predict(sample, verbose=0)[0]
idx = int(np.argmax(probs))

print("Predicted class:", le.classes_[idx])
print("Confidence:", float(probs[idx]))
```

## 3) Confirm files are in expected path for API

Your API currently expects:

- `scanModel/skin_lesion_model.h5`
- `scanModel/classes.json`

Checklist:

- [ ] Verify both files exist in this exact folder: `scanModel/`
- [ ] Verify `classes.json` order matches `le.classes_` from training run

## 4) Start and verify FastAPI with exported model

From project root:

- [ ] Install API requirements (once):

```bash
cd api
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

- [ ] Run API:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

- [ ] Health check:

```bash
curl http://127.0.0.1:8000/health
```

Expected: `model_loaded` should be `true`.

## 5) Test prediction endpoint with one image

- [ ] Send one test image:

```bash
curl -X POST "http://127.0.0.1:8000/predict" -F "file=@path_to_image.jpg"
```

Expected response keys:

- `predicted_class`
- `confidence`
- `probabilities`
- `disclaimer`

## 6) Mobile handoff checklist

- [ ] Use multipart upload field name exactly `file`
- [ ] Display `predicted_class` and `confidence`
- [ ] Show disclaimer text in result screen

## Done criteria

You are done with this phase when all are true:

- [ ] Notebook saves `skin_lesion_model.h5` successfully
- [ ] Notebook reload test works (no load errors)
- [ ] FastAPI `/health` returns `model_loaded: true`
- [ ] FastAPI `/predict` returns valid JSON for uploaded image
