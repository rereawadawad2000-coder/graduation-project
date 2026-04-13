# Graduation Project: Skin Cancer Detection (Final Project Scope)

This repository is for an academic final project, not a real medical product.

## 1) Project Goal

Build an end-to-end demo system that can:

1. Train a skin-lesion image classification model.
2. Serve predictions through a FastAPI backend.
3. Let a React Native mobile app send an image and display the prediction.

## 2) Dataset to Use

- Primary dataset: HAM10000 (Skin Cancer MNIST)
- Link: https://www.kaggle.com/datasets/kmader/skin-cancer-mnist-ham10000/data

Key facts from the dataset page:

1. About 10,015 dermatoscopic images.
2. 7 lesion classes: akiec, bcc, bkl, df, mel, nv, vasc.
3. Includes metadata file (HAM10000_metadata.csv).
4. Suitable for academic ML projects.

## 3) Scope and Disclaimer

Keep the scope realistic:

1. This is a decision-support demo for learning.
2. It is not approved for clinical use.
3. Add a disclaimer in both API response and app UI:
	"For educational use only. Not a medical diagnosis."

## 4) What You Need to Build

### A) Model Training (Python)

1. Prepare dataset and labels.
2. Split by train/validation/test carefully.
3. Train a baseline CNN or transfer learning model.
4. Handle class imbalance (class weights and/or augmentation).
5. Evaluate with accuracy, precision, recall, F1, confusion matrix.
6. Save the best model checkpoint.

### B) Backend API (FastAPI)

1. Create endpoint: POST /predict
2. Input: image file
3. Output: predicted class + class probabilities + disclaimer
4. Add basic validation and error handling.

### C) Mobile App (React Native)

1. Select or capture image.
2. Send image to backend.
3. Show prediction result and confidence.
4. Show educational disclaimer in result screen.

## 5) Step-by-Step Execution Plan

### Phase 1: Setup (Day 1-2)

1. Create folders:
	- ml/
	- api/
	- app/
	- docs/
2. Create environment files:
	- ml/requirements.txt
	- api/requirements.txt
3. Confirm tools installed: Python, Node.js, React Native toolchain.

### Phase 2: Data and Baseline Model (Day 3-7)

1. Download HAM10000 and organize data.
2. Inspect class distribution.
3. Build preprocessing pipeline (resize, normalize, augment).
4. Train first baseline model.
5. Record baseline metrics in docs/results.md.

### Phase 3: Improve Model (Week 2)

1. Add transfer learning (e.g., EfficientNet/ResNet).
2. Tune hyperparameters (learning rate, batch size, epochs).
3. Compare experiments in a table.
4. Select best model based on validation and test metrics.

### Phase 4: API Integration (Week 3)

1. Load trained model in FastAPI.
2. Implement /predict endpoint.
3. Test with sample images.
4. Add response schema and error responses.

### Phase 5: Mobile App Integration (Week 3-4)

1. Build upload/camera UI.
2. Connect app to API.
3. Display class + confidence + disclaimer.
4. Test on several images and screenshot results.

### Phase 6: Final Report and Demo (Final Days)

1. Document methodology.
2. Document dataset limitations (phone photo vs dermatoscopy gap).
3. Add architecture diagram and screenshots.
4. Prepare 5-10 minute demo flow.

## 6) Minimum Deliverables Checklist

- [ ] Trained model with saved weights
- [ ] Evaluation metrics and confusion matrix
- [ ] FastAPI /predict endpoint working
- [ ] React Native app sends image and receives result
- [ ] Disclaimer shown in app and API
- [ ] Final report slides/screenshots

## 7) Suggested Repository Structure

```text
graduation-project/
|-- README.md
|-- useful-resources.md
|-- ml/
|   |-- notebooks/
|   |-- src/
|   |-- models/
|   `-- requirements.txt
|-- api/
|   |-- app/
|   `-- requirements.txt
|-- app/
|   `-- (React Native project files)
`-- docs/
    |-- results.md
    `-- final-report-outline.md
```

## 8) Success Criteria for Final Project

Your project is successful if:

1. The full pipeline works end-to-end (app -> API -> model -> result).
2. You provide clear evaluation and discussion of limitations.
3. You communicate that this is an educational prototype, not a diagnosis tool.

## 9) Immediate Next 3 Tasks

1. Download dataset and create ml/data/ structure.
2. Train a baseline model and save first metrics.
3. Create FastAPI /predict endpoint stub.