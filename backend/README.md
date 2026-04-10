# OffGrid Backend

FastAPI backend for an AI-powered marketing SaaS (hackathon-ready), with modular REST APIs, JWT auth, PostgreSQL support, and lightweight background jobs.

## Quick start

1. Configure environment (`backend/.env`), especially:
   - `DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/offgrid`
   - `JWT_SECRET_KEY=<secure-secret>`
   - `GROQ_API_KEY=<key>`
2. Install dependencies:
   - `pip install -r requirements.txt`
3. Run API:
   - `uvicorn app.main:app --reload --port 8000`

## Base URL

- `http://localhost:8000/api/v1`

## Core modules and endpoints

### Authentication
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`

### Onboarding (company)
- `POST /onboarding/start`
- `POST /onboarding/business-info`
- `POST /onboarding/marketing-preferences`
- `GET /onboarding/status`
- `POST /onboarding/complete`

### Campaigns
- `POST /campaigns/create`
- `GET /campaigns`
- `GET /campaigns/{id}`
- `PUT /campaigns/{id}`
- `DELETE /campaigns/{id}`

### Content AI
- `POST /ai/generate-content`
- `POST /ai/regenerate`
- `POST /ai/generate-strategy`

### Analytics
- `POST /analytics/track-event`
- `GET /analytics/summary`
- `GET /analytics/insights`

### Billboards (OpenStreetMap/Overpass)
- `GET /billboards/nearby`
- `POST /billboards/recommend`

### CRM (temporary ingestion)
- `POST /crm/upload`
- `POST /crm/generate-message`
- `GET /crm/suggestions`

### Freelancers and Conversions
- `GET /freelancers`
- `POST /freelancers/apply`
- `POST /freelancers/assign`
- `GET /freelancers/leaderboard`
- `POST /conversion/track`

### Settings
- `GET /settings`
- `PUT /settings/update`

## Database tables

- `users`
- `profiles`
- `onboarding_data`
- `campaigns`
- `analytics_events`
- `ai_insights`
- `freelancers`
- `conversions`

## Background jobs

Started on app startup with lightweight async loops:
- analytics aggregation every few hours
- daily AI insight generation
- optional campaign performance refresh

## Product loop

Generate content → user posts → system tracks events → backend summarizes performance → AI produces insights/suggestions → repeat.
