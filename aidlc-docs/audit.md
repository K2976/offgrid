# OffGrid Full Audit

## Scope
- Workspace reviewed: backend FastAPI app, frontend Next.js app, shared types, environment configuration, and AI-DLC state.
- This audit describes the implemented product surface, the main data and service layers, the visible UI flows, and the current gaps between mock UI and backend capability.

## Product Summary
- OffGrid is an AI marketing copilot.
- The product is aimed at two user roles: company users and freelancers.
- The current product shape combines marketing analytics, AI content generation, campaign management, audience management, billboard discovery, freelancer management, reports, alerts, autopilot briefs, and workspace settings.

## Frontend Feature Audit

### Global shell and navigation
- The app uses a dark-first Next.js App Router layout.
- The landing route redirects users to either login or dashboard based on local storage state.
- The dashboard shell uses a fixed sidebar and a sticky header.
- The sidebar exposes the main product areas: Dashboard, Campaigns, Content AI, Analytics, Billboards, Audience / CRM, Freelancers, and Settings.
- The sidebar supports collapse and logout.
- The header includes search, notifications, and the active user avatar.

### Authentication and access flow
- Login supports a role toggle between company and freelancer.
- Registration supports company and freelancer paths.
- Freelancer registration collects skills and experience level.
- Company registration routes into onboarding.
- Company onboarding is a 3-step wizard covering business type, business details, and marketing preferences.
- The onboarding flow supports product, service, and event business types.
- Marketing preferences include budget, platforms, and primary goal.
- Auth state is currently stored in localStorage through Zustand.
- Dashboard access is gated client-side by the local auth store.

### Dashboard overview
- The dashboard shows KPI cards for engagement, visits, conversions, and active campaigns.
- It shows AI insights with live status styling.
- It shows suggested actions ranked by priority.
- It includes traffic and engagement charts.
- It includes a recent activity feed.
- The data shown on this page is hard-coded sample data rather than live backend data.

### Campaigns
- The campaigns page provides search and status filtering.
- Campaigns are grouped by active, paused, completed, and draft states.
- A create-campaign dialog is present.
- The campaigns table shows name, platform, budget, status, performance, and schedule.
- Each campaign includes a progress-style performance bar.
- The UI is present, but the create flow is still mock-driven.

### Content AI
- The content page lets the user set business type, target audience, platform, and tone.
- It generates a mock post, caption, hashtags, and best time to post.
- Users can copy the generated post, caption, or hashtags to the clipboard.
- There are regenerate and save actions.
- The page presents generated output in separate cards for readability.
- The actual screen is currently backed by static mock content, not the backend generator.

### Analytics
- The analytics page supports date range filters and platform filters.
- It shows traffic, conversions, and engagement charts.
- It includes AI insight cards that summarize performance trends.
- The visible analytics data is mocked in the frontend.
- The backend, however, does expose richer analytics endpoints that could power this page.

### Audience / CRM
- The audience page supports CSV upload input.
- It shows audience segments for new, returning, and inactive users.
- It shows AI re-engagement ideas.
- It shows a contacts table with segment, last active, and total spend.
- The page is currently UI-only and does not connect to a live CRM backend.

### Billboards
- The billboards page uses a client-side Leaflet map.
- It shows candidate outdoor advertising locations across major US cities.
- It displays a selected billboard detail panel with AI score, nearby places, rate, size, and recommendation.
- It surfaces a top recommended locations section.
- The map integration is client-only and depends on external map tiles.

### Freelancers
- The freelancers area is split into two tabs: businesses and freelancers.
- The businesses tab shows freelancer cards with skills, rating, hourly rate, availability, and an assign-campaign action.
- The businesses tab also shows a leaderboard.
- The freelancer tab shows earnings summary cards.
- The freelancer tab shows a campaign table with referral links, conversions, and earnings.
- The content is currently static sample data.

### Settings
- The settings page is split into profile, integrations, billing, and privacy tabs.
- Business profile includes company information and notification toggles.
- Integrations show connected and disconnected services.
- Billing shows the current plan, usage counters, and billing actions.
- Privacy exposes data retention, export, and account deletion actions.
- The page is largely presentational and not fully wired to backend mutations.

## Backend API Audit

### Authentication API
- POST /api/v1/auth/register registers a user and creates a default workspace.
- POST /api/v1/auth/login authenticates a user.
- POST /api/v1/auth/refresh refreshes access tokens.
- GET /api/v1/auth/me returns the current user profile and onboarding state.

### Analytics API
- GET /api/v1/analytics/overview returns summary metrics across social, website, SEO, and trend categories.
- GET /api/v1/analytics/social returns platform-specific social metrics.
- GET /api/v1/analytics/website returns website traffic and conversion metrics.
- POST /api/v1/analytics/website-audit runs a PageSpeed-based audit for a URL.
- GET /api/v1/analytics/seo returns SEO metrics.

### AI API
- POST /api/v1/ai/analyze runs a marketing analysis and stores the result.
- GET /api/v1/ai/history returns stored analyses with pagination.
- The AI flow can use Groq or Gemini and falls back to generated text when providers are unavailable.

### Competitors API
- GET /api/v1/competitors lists tracked competitors.
- POST /api/v1/competitors adds a competitor.
- DELETE /api/v1/competitors/{competitor_id} removes a competitor.
- GET /api/v1/competitors/{competitor_id}/analysis generates a competitor brief and counter-strategy plan.
- The competitor analysis path can use Wikipedia context and AI fallback text.

### Content API
- POST /api/v1/content/generate generates marketing content.
- GET /api/v1/content/history returns generated content history.
- POST /api/v1/content/{content_id}/feedback stores rating and usage feedback.
- The content flow persists generated items to the database.

### Alerts API
- GET /api/v1/alerts returns alerts filtered by read state and severity.
- PATCH /api/v1/alerts/{alert_id}/read marks an alert as read.
- POST /api/v1/alerts/rules creates an alert rule.
- GET /api/v1/alerts/rules lists alert rules.

### Reports API
- GET /api/v1/reports returns recent reports.
- GET /api/v1/reports/{report_id} returns a single report.
- GET /api/v1/reports/{report_id}/download returns a report payload with a download URL.
- POST /api/v1/reports/generate creates a new report record.
- The download URL currently points to a synthetic file path pattern.

### Autopilot API
- GET /api/v1/autopilot/today returns the current daily autopilot brief.
- GET /api/v1/autopilot/history returns brief history over a date range.
- PATCH /api/v1/autopilot/settings updates autopilot enablement and send time.

### Settings API
- GET /api/v1/settings/workspace returns workspace settings.
- PATCH /api/v1/settings/onboarding upserts the onboarding profile.
- PATCH /api/v1/settings/website-url updates the user website URL.

## Data Model Audit
- User stores email, password hash, name, company name, website URL, and timestamps.
- Workspace stores ownership, name, mode, goals, budget, notification settings, autopilot settings, and timestamps.
- AnalyticsSnapshot stores platform metrics by date.
- Competitor stores platform metadata, auto-detection state, tracking date, and status.
- AIAnalysis stores focus, period, insights, actions, content ideas, model used, and token usage.
- GeneratedContent stores platform, type, tone, content body, hashtags, rating, and usage flag.
- AlertRule stores conditions, actions, enabled state, and last triggered time.
- Alert stores severity, title, message, suggested action, read state, and optional rule linkage.
- Report stores reporting period, file path, summary, and generation timestamp.
- AutopilotBrief stores daily recommendations, content ideas, competitor insight, delivery channels, and timestamp.

## Service Layer and Integration Audit
- The backend is built around FastAPI, SQLAlchemy, and Pydantic.
- The backend adds CORS, JSON logging, request body size protection, and security headers.
- The auth layer uses bearer tokens and token validation in a dependency.
- The system can call Groq and Gemini for text generation.
- The competitor analysis flow can pull public context from Wikipedia.
- The analytics audit flow integrates with PageSpeed Insights.
- The website analytics path can connect to Google Analytics 4 if credentials are configured.
- The environment file includes placeholders for Instagram, LinkedIn, Google Analytics, Google Search Console, PageSpeed, Telegram, SMTP, Redis, JWT, and database connectivity.
- The backend startup path creates database tables on launch.

## Frontend and Product Architecture
- The frontend uses Next.js, React, Tailwind, shadcn-based UI primitives, Zustand, Recharts, Lucide icons, and Leaflet.
- The styling system is dark, gradient-heavy, and intentionally marketing-focused.
- The UI includes custom animation classes for fade, float, slide, and glow effects.
- The design language is cohesive across login, onboarding, dashboard, and settings.
- The frontend currently uses mock/local state for many core workflows even though backend endpoints exist.

## Current Gaps and Risks
- The frontend dashboard is not yet wired to the backend API for most screens.
- Authentication is localStorage-backed in the UI instead of fully token-driven against the backend.
- The onboarding journey is not yet persisted through the backend settings endpoint from the UI.
- Campaigns, content generation, analytics, audience, billboards, freelancers, settings, and dashboard views are mostly static or simulated.
- Report download handling appears placeholder-based rather than file-serving based.
- Integration toggles are visual at present and do not prove connection-state management end to end.
- The system contains strong backend capability, but the user experience still behaves like a polished prototype rather than a fully integrated production system.

## Overall Assessment
- The codebase already contains a broad AI marketing product surface.
- The backend is more complete than the frontend integration layer.
- The highest-value next step is wiring the visible UI to the available API endpoints and replacing the remaining mock data paths with real workspace-backed data.

## Prompt Audit
- Timestamp: 2026-04-10T20:06:37Z
- User Input: "generate full deatiled audit mentioning all the features and everything"
- AI Response: Created the audit document with the full feature, API, model, integration, and risk inventory.
- Context: Initial audit generation request.

- Timestamp: 2026-04-10T20:06:37Z
- User Input: "continue"
- AI Response: Continued the audit generation after gathering additional context from the repository.
- Context: Continuation request.
