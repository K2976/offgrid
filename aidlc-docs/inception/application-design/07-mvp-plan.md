# 7. ⚡ MVP Plan (24–36 Hours)

---

## Milestone Breakdown

### 🔴 Phase 1: Foundation (Hours 0–8)

| Task | Details | Time |
|---|---|---|
| Project scaffolding | Next.js frontend + FastAPI backend + docker-compose (PostgreSQL + Redis) | 1h |
| Database models | Create SQLAlchemy models for: users, workspaces, analytics_snapshots, ai_analyses | 1.5h |
| Auth system | JWT login/register endpoints + middleware | 1.5h |
| LLM providers | Groq and Gemini provider wrappers with BaseAgent | 1.5h |
| Frontend shell | Dashboard layout, sidebar, routing (empty pages) | 1.5h |
| Seed data | Script to populate analytics_snapshots with realistic mock data (30 days) | 1h |

**Deliverable**: App boots, user can register/login, sees empty dashboard shell, AI providers are callable.

---

### 🟡 Phase 2: Core Brain (Hours 8–18)

| Task | Details | Time |
|---|---|---|
| Analytics API | `GET /analytics/overview` and `GET /analytics/social` with real DB queries | 2h |
| Analytics dashboard | Charts (engagement trend, follower growth, reach) using Recharts/Chart.js | 2.5h |
| Analyst Agent | Implement with Groq — accepts analytics data, returns insights | 1.5h |
| Strategist Agent | Implement with Gemini — accepts insights, returns actions + content ideas | 1.5h |
| AI Analyze endpoint | `POST /ai/analyze` — orchestrates Analyst → Strategist pipeline | 1h |
| AI Results UI | Display insights cards, action items, content ideas on dashboard | 1.5h |

**Deliverable**: User sees real analytics charts, can click "Analyze" and get AI-generated insights + strategies.

---

### 🟢 Phase 3: Differentiators (Hours 18–28)

| Task | Details | Time |
|---|---|---|
| Content Agent | `POST /content/generate` with tone + platform control | 2h |
| Content UI | Form (platform, tone, topic) + generated content cards with copy button | 1.5h |
| Competitor model + API | `POST/GET /competitors` + competitor_snapshots table + seed data | 1.5h |
| Competitor Agent | `GET /competitors/{id}/analysis` with "why winning" + counter-strategies | 2h |
| Competitor UI | Competitor list, add form, analysis view | 1.5h |
| Autopilot system | Celery task + `GET /autopilot/today` + hero card on dashboard | 1.5h |

**Deliverable**: Full content generation, competitor tracking with AI intelligence, daily autopilot working.

---

### 🔵 Phase 4: Polish (Hours 28–36)

| Task | Details | Time |
|---|---|---|
| Alert system | AnomalyDetector + alert_checker Celery task + `GET /alerts` + alerts panel | 2h |
| Telegram integration | Bot setup + AlertDispatcher for Telegram delivery | 1h |
| PDF report | ReportLab/WeasyPrint template + `POST /reports/generate` + download | 2h |
| Settings page | Workspace config, integration status, autopilot toggle | 1h |
| UI polish | Loading states, error handling, responsive design, dark mode | 2h |

**Deliverable**: Complete MVP with alerts, Telegram notifications, PDF reports, polished UI.

---

## Core vs Optional Features

### ✅ CORE (Must have in MVP)

| Feature | Why Core |
|---|---|
| Analytics dashboard with charts | Foundation — users need to see their data |
| AI Analyze (Analyst + Strategist) | This IS the product — the core brain |
| Content generation with tone control | Highest immediate value for users |
| Competitor tracking + AI analysis | Major differentiator |
| Autopilot daily brief | WOW feature — zero-effort intelligence |
| Seed data + mock integrations | Can't demo without data |

### 🔶 OPTIONAL (Nice to have, skip if behind)

| Feature | Why Optional |
|---|---|
| PDF weekly reports | Can show report data on screen instead of PDF |
| Telegram alerts | Alerts on dashboard first, notifications later |
| Custom Mode (alert rules, IF/THEN) | General Mode works for MVP |
| Email delivery | Telegram is faster to implement |
| Real API integrations (Instagram, GA) | Mock data is sufficient for demo |
| Website analytics tab | Social + AI is enough for demo |
| SEO analytics tab | Can be added post-MVP |

---

## Technical Shortcuts for MVP Speed

| Shortcut | Rationale |
|---|---|
| Seed script instead of real APIs | No OAuth flow needed, instant demo data |
| SQLite for local dev | Skip Docker PostgreSQL initially if needed |
| Single Celery worker | No need for separate queues yet |
| In-memory rate limiting | No Redis rate limiting needed |
| Hardcoded prompt templates | No prompt management UI needed |
| No unit tests | Focus on working features, add tests post-MVP |
| JWT stored in localStorage | No cookie/session complexity |

---

## Success Criteria

At hour 36, the MVP should demonstrate:

1. ✅ User logs in → sees analytics dashboard with real-looking charts
2. ✅ User clicks "Analyze" → gets AI insights + actionable strategies in < 10 sec
3. ✅ User generates content → gets platform-specific, tone-controlled captions
4. ✅ User adds competitor → gets "why they're winning" + counter-strategies
5. ✅ Autopilot card shows today's 3 actions + 1 content idea + 1 competitor insight
6. ✅ (Optional) Alert appears when engagement drops + Telegram notification sent
7. ✅ (Optional) Weekly PDF report downloadable
