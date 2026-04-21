# How to Start the Project and API Server

This guide starts both parts of your graduation project:
- Mobile app (Expo React Native): `skin-cancer-detection`
- Backend API (FastAPI): `api`

## Prerequisites

- Node.js + npm installed
- Python 3.10+ installed
- Two terminals (one for API, one for app)

## 1) Start the FastAPI Server

Open Terminal 1 from `graduation-project` root:

```bash
cd api
```

First time only: you already did this so skipe it 

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

Every run: on a terminal 

```bash
.venv\Scripts\activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Check health endpoint in browser:

- Local machine: `http://127.0.0.1:8000/health`
- Phone on same Wi-Fi: `http://<YOUR_PC_LAN_IP>:8000/health`

Get your LAN IP on Windows:

```bash
ipconfig
```

Use the `IPv4 Address` of your active Wi-Fi adapter.

## 2) Configure Mobile App API URL

In `skin-cancer-detection/.env.local`, set:

```env
EXPO_PUBLIC_API_BASE_URL=http://<YOUR_PC_LAN_IP>:8000
```

For emulator or same machine testing, you can also use:

```env
EXPO_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

## 3) Start the Expo App

Open Terminal 2 from `graduation-project` root:

```bash
cd skin-cancer-detection
```

First time only:

```bash
npm install
```

Start app:

```bash
npm start
```

Optional shortcuts:

```bash
npm run android
npm run ios
npm run web
```

## 4) Quick End-to-End Check

1. Ensure API terminal shows Uvicorn running on port `8000`.
2. Ensure Expo terminal is running.
3. Open app on device/emulator.
4. Upload/select an image in the scan flow.
5. Confirm prediction response appears.

## Common Issues

- API not reachable from phone:
  - Make sure phone and PC are on the same Wi-Fi.
  - Use PC LAN IP in `.env.local` (not `127.0.0.1`).
  - Allow Python/Uvicorn through firewall if prompted.
- Changed `.env.local` but app still uses old URL:
  - Stop Expo and run `npm start` again.
- Model file missing in API:
  - Place model artifacts in `scanModel/` as expected by API.
