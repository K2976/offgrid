# Build Instructions

## Prerequisites
- Python 3.13+
- Virtual environment at .venv (or your preferred env)

## Steps
1. Install backend dependencies:
   - cd backend
   - pip install -r requirements.txt
2. Copy environment template:
   - cp ../.env.example .env
3. Run backend API:
   - uvicorn app.main:app --reload --port 8000

## Expected Output
- Service available at http://localhost:8000
- API base path at http://localhost:8000/api/v1
- Health endpoint at /health returns status ok
