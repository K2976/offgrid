# OffGrid Backend

FastAPI backend for the OffGrid AI marketing co-pilot.

## Quick start

1. Copy environment template:
   - `cp ../.env.example .env`
2. Install dependencies:
   - `pip install -r requirements.txt`
3. Run API:
   - `uvicorn app.main:app --reload --port 8000`

## Base URL

- `http://localhost:8000/api/v1`


cd backend
source ../.venv/bin/activate
uvicorn app.main:app --reload --port 8000



cd frontend
npm install
npm run dev



### clean and restrt 

pkill -f "uvicorn app.main:app" || true
cd backend
source ../.venv/bin/activate
uvicorn app.main:app --reload --port 8000