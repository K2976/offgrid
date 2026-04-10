# 1. 📁 Project Folder Structure

```
offgrid/
├── frontend/                          # Next.js Frontend
│   ├── public/
│   │   └── assets/
│   ├── src/
│   │   ├── app/                       # Next.js App Router
│   │   │   ├── (auth)/               # Auth route group
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   ├── (dashboard)/          # Dashboard route group
│   │   │   │   ├── analytics/
│   │   │   │   ├── competitors/
│   │   │   │   ├── content/
│   │   │   │   ├── alerts/
│   │   │   │   ├── reports/
│   │   │   │   ├── autopilot/
│   │   │   │   └── settings/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── components/
│   │   │   ├── ui/                    # Reusable UI primitives
│   │   │   ├── charts/               # Chart components
│   │   │   ├── analytics/            # Analytics widgets
│   │   │   ├── competitors/          # Competitor cards/tables
│   │   │   ├── content/              # Content generation UI
│   │   │   └── layout/               # Shell, Sidebar, Header
│   │   ├── hooks/                     # Custom React hooks
│   │   ├── lib/                       # Client utilities
│   │   │   ├── api.ts                # API client (axios/fetch wrapper)
│   │   │   └── utils.ts
│   │   ├── stores/                    # Zustand state stores
│   │   └── types/                     # TypeScript interfaces
│   ├── next.config.js
│   ├── package.json
│   └── tsconfig.json
│
├── backend/                           # FastAPI Backend
│   ├── app/
│   │   ├── main.py                    # FastAPI app entry point
│   │   ├── config.py                  # Settings & env vars
│   │   ├── dependencies.py           # Dependency injection
│   │   │
│   │   ├── api/                       # API Layer (routes)
│   │   │   ├── __init__.py
│   │   │   ├── v1/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── router.py          # Main v1 router
│   │   │   │   ├── analytics.py       # /api/v1/analytics/*
│   │   │   │   ├── competitors.py     # /api/v1/competitors/*
│   │   │   │   ├── content.py         # /api/v1/content/*
│   │   │   │   ├── alerts.py          # /api/v1/alerts/*
│   │   │   │   ├── reports.py         # /api/v1/reports/*
│   │   │   │   ├── autopilot.py       # /api/v1/autopilot/*
│   │   │   │   ├── auth.py            # /api/v1/auth/*
│   │   │   │   └── settings.py        # /api/v1/settings/*
│   │   │
│   │   ├── services/                  # Business Logic Layer
│   │   │   ├── __init__.py
│   │   │   ├── analytics_service.py
│   │   │   ├── competitor_service.py
│   │   │   ├── content_service.py
│   │   │   ├── alert_service.py
│   │   │   ├── report_service.py
│   │   │   ├── autopilot_service.py
│   │   │   └── auth_service.py
│   │   │
│   │   ├── ai/                        # AI Agents Layer
│   │   │   ├── __init__.py
│   │   │   ├── base_agent.py          # Abstract base agent
│   │   │   ├── analyst_agent.py       # Data analysis agent
│   │   │   ├── strategist_agent.py    # Strategy & recommendations
│   │   │   ├── content_agent.py       # Content generation
│   │   │   ├── competitor_agent.py    # Competitor intelligence
│   │   │   ├── prompts/               # Prompt templates
│   │   │   │   ├── analyst.py
│   │   │   │   ├── strategist.py
│   │   │   │   ├── content.py
│   │   │   │   └── competitor.py
│   │   │   └── providers/             # LLM Provider wrappers
│   │   │       ├── __init__.py
│   │   │       ├── groq_provider.py   # Groq API client
│   │   │       └── gemini_provider.py # Gemini API client
│   │   │
│   │   ├── integrations/             # External API integrations
│   │   │   ├── __init__.py
│   │   │   ├── instagram.py
│   │   │   ├── linkedin.py
│   │   │   ├── google_analytics.py
│   │   │   ├── google_search.py       # SEO data
│   │   │   ├── telegram.py            # Alert delivery
│   │   │   └── email.py               # Email delivery
│   │   │
│   │   ├── jobs/                      # Celery Background Tasks
│   │   │   ├── __init__.py
│   │   │   ├── celery_app.py          # Celery config
│   │   │   ├── data_collection.py     # Scheduled data pulls
│   │   │   ├── alert_checker.py       # Anomaly detection
│   │   │   ├── report_generator.py    # Weekly PDF generation
│   │   │   └── autopilot_runner.py    # Daily autopilot
│   │   │
│   │   ├── models/                    # SQLAlchemy ORM Models
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── workspace.py
│   │   │   ├── analytics.py
│   │   │   ├── competitor.py
│   │   │   ├── content.py
│   │   │   ├── alert.py
│   │   │   └── report.py
│   │   │
│   │   ├── schemas/                   # Pydantic Request/Response
│   │   │   ├── __init__.py
│   │   │   ├── analytics.py
│   │   │   ├── competitors.py
│   │   │   ├── content.py
│   │   │   ├── alerts.py
│   │   │   ├── reports.py
│   │   │   └── auth.py
│   │   │
│   │   └── utils/                     # Shared utilities
│   │       ├── __init__.py
│   │       ├── pdf_generator.py
│   │       ├── date_utils.py
│   │       └── validators.py
│   │
│   ├── alembic/                       # DB migrations
│   ├── tests/
│   ├── requirements.txt
│   └── Dockerfile
│
├── docker-compose.yml                 # PostgreSQL + Redis + App
├── .env.example
└── README.md
```
