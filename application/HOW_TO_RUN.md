

## 1) Start the FastAPI Server

Open Terminal 1 from `graduation-project` root:

```bash
cd api
```


First time only:

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
when the applicaiton in terminal says Application startup complete then follow below 
to :
## to get the ipv4 run the command below 
```bash
ipconfig
```
## check the ipv4 from the results you get : and copy it 
then paste the below but replace the delete with the ipv4:

EXPO_PUBLIC_API_BASE_URL=http://192.168.1.197:8000
then copy this line above and create the .env.local file inside the graduation project in the application folder

paste the line you copied and place it inside the folder you created


## note 
for the app to work be on the same network 

## congratulations the fastapi is now configured you may proceed to another terminal and run the command from below 

## 3) Start the Expo App

Open new Terminal  from `graduation-project` root:

```bash
cd application
```

First time only:

```bash
npm install
```

Start app:

```bash
npx expo start -c
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
  - Place model artifacts in `Model/` as expected by API.
