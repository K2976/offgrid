# Frontend Unit — Code Generation Plan

## Unit Context
- **Unit**: Frontend (Next.js Application)
- **Workspace Root**: /Users/kartik/Documents/offgrid
- **Code Location**: /Users/kartik/Documents/offgrid/frontend/
- **Project Type**: Greenfield

## Step Sequence

### Phase 1: Project Scaffolding
- [x] Step 1: Initialize Next.js project with TypeScript in `frontend/`
- [x] Step 2: Install dependencies (zustand, recharts, lucide-react, axios)
- [x] Step 3: Configure `next.config.js` for API proxying

### Phase 2: Design System & Layout
- [x] Step 4: Create global CSS with design tokens (colors, typography, spacing)
- [x] Step 5: Create layout components — Sidebar, Header, DashboardShell
- [x] Step 6: Create reusable UI primitives — Card, Button, Badge, Input, Select, Modal

### Phase 3: Type Definitions & API Layer
- [x] Step 7: Create TypeScript interfaces matching all API response schemas
- [x] Step 8: Create API client (axios wrapper with interceptors for JWT)
- [x] Step 9: Create Zustand stores (auth, analytics, competitors, content, alerts, autopilot)

### Phase 4: Auth Pages
- [x] Step 10: Create Login page
- [x] Step 11: Create Register page
- [x] Step 12: Create auth middleware/guard for protected routes

### Phase 5: Dashboard & Analytics
- [x] Step 13: Create main Dashboard page (overview cards + autopilot hero + alerts sidebar)
- [x] Step 14: Create chart components (EngagementTrend, FollowerGrowth, TrafficChart)
- [x] Step 15: Create Analytics page with Social / Website / SEO tabs

### Phase 6: Feature Pages
- [x] Step 16: Create Competitors page (list + add + analysis view)
- [x] Step 17: Create Content page (generation form + results cards)
- [x] Step 18: Create Alerts page (alert list + rules manager)
- [x] Step 19: Create Reports page (report list + download)
- [x] Step 20: Create Autopilot page (today's brief + history)
- [x] Step 21: Create Settings page (integrations + workspace config)

### Phase 7: Polish
- [x] Step 22: Add loading states, error boundaries, and empty states
- [x] Step 23: Verify all `data-testid` attributes on interactive elements
