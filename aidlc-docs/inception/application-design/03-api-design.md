# 3. 🔌 API Design

Base URL: `/api/v1`

---

## 🔐 Auth Endpoints

### `POST /auth/register`
Create a new user account.

**Request**:
```json
{
  "email": "user@example.com",
  "password": "securePass123",
  "name": "Kartik",
  "company_name": "OffGrid Inc."
}
```
**Response** `201`:
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "Kartik",
  "access_token": "eyJ...",
  "refresh_token": "eyJ..."
}
```

### `POST /auth/login`
**Request**: `{ "email": "...", "password": "..." }`
**Response** `200`: `{ "access_token": "...", "refresh_token": "..." }`

### `POST /auth/refresh`
**Request**: `{ "refresh_token": "..." }`
**Response** `200`: `{ "access_token": "..." }`

---

## 📊 Analytics Endpoints

### `GET /analytics/overview`
Dashboard summary across all connected platforms.

**Query Params**: `?period=7d|30d|90d`

**Response** `200`:
```json
{
  "period": "7d",
  "social": {
    "total_followers": 12540,
    "follower_growth": 3.2,
    "avg_engagement_rate": 4.7,
    "total_reach": 89000,
    "total_impressions": 145000
  },
  "website": {
    "total_visits": 23400,
    "bounce_rate": 42.1,
    "avg_session_duration": 185,
    "conversions": 312,
    "conversion_rate": 1.33
  },
  "seo": {
    "avg_position": 14.3,
    "top_keywords_count": 45,
    "position_change": -2.1
  },
  "trends": {
    "engagement_trend": "rising",
    "traffic_trend": "stable",
    "seo_trend": "declining"
  }
}
```

### `GET /analytics/social`
Detailed social media metrics per platform.

**Query Params**: `?platform=instagram|linkedin&period=7d|30d|90d`

**Response** `200`:
```json
{
  "platform": "instagram",
  "period": "30d",
  "followers": { "current": 8500, "change": 320, "growth_pct": 3.9 },
  "engagement": { "rate": 5.1, "likes": 4200, "comments": 680, "shares": 190 },
  "reach": { "total": 67000, "avg_per_post": 3350 },
  "top_posts": [
    { "id": "...", "content_preview": "...", "engagement_score": 8.7, "posted_at": "..." }
  ],
  "worst_posts": [
    { "id": "...", "content_preview": "...", "engagement_score": 1.2, "posted_at": "..." }
  ],
  "daily_data": [ { "date": "2026-04-09", "followers": 8480, "engagement_rate": 4.9 } ]
}
```

### `GET /analytics/website`
Website traffic & conversion data.

**Query Params**: `?period=7d|30d|90d`

**Response** `200`:
```json
{
  "period": "30d",
  "traffic": { "total_visits": 23400, "unique_visitors": 18200, "page_views": 67800 },
  "bounce_rate": 42.1,
  "conversions": { "total": 312, "rate": 1.33, "top_pages": [...] },
  "sources": [ { "source": "organic", "visits": 9800, "pct": 41.8 } ],
  "daily_data": [ { "date": "...", "visits": 780, "bounce_rate": 40.2 } ]
}
```

### `GET /analytics/seo`
SEO keyword performance & rankings.

**Query Params**: `?period=7d|30d|90d`

**Response** `200`:
```json
{
  "period": "30d",
  "keywords": [
    { "keyword": "ai marketing tool", "position": 8, "change": -3, "impressions": 1200, "clicks": 89, "ctr": 7.4 }
  ],
  "avg_position": 14.3,
  "total_impressions": 45000,
  "total_clicks": 3200
}
```

---

## 🧠 AI Copilot Endpoints

### `POST /ai/analyze`
Trigger AI analysis on current data. Returns structured insights.

**Request**:
```json
{
  "focus": "all|social|website|seo",
  "period": "7d|30d",
  "goals": ["growth", "engagement"]
}
```

**Response** `200`:
```json
{
  "generated_at": "2026-04-10T10:00:00Z",
  "insights": [
    {
      "id": "uuid",
      "type": "opportunity|problem|trend",
      "title": "Instagram engagement dropping on weekday posts",
      "description": "Your weekday posts (Mon-Fri) show 40% lower engagement than weekend posts...",
      "confidence": 0.87,
      "data_points": ["avg_weekday_engagement: 3.2%", "avg_weekend_engagement: 5.4%"],
      "severity": "medium"
    }
  ],
  "actions": [
    {
      "id": "uuid",
      "priority": "high",
      "action": "Shift 60% of posting schedule to Sat-Sun 10AM-2PM",
      "reasoning": "Weekend posts generate 68% more reach. Moving budget here maximizes ROI.",
      "expected_impact": "+25% engagement rate within 2 weeks",
      "category": "scheduling"
    }
  ],
  "content_ideas": [
    {
      "platform": "instagram",
      "idea": "Behind-the-scenes team culture reel",
      "tone": "casual",
      "optimal_time": "Saturday 11AM",
      "expected_engagement": "above_average"
    }
  ]
}
```

### `GET /ai/history`
Retrieve past AI analyses.

**Query Params**: `?limit=10&offset=0`

**Response** `200`: `{ "total": 42, "analyses": [...] }`

---

## ⚔️ Competitor Endpoints

### `GET /competitors`
List all tracked competitors.

**Response** `200`:
```json
{
  "competitors": [
    {
      "id": "uuid",
      "name": "CompetitorX",
      "platforms": { "instagram": "@competitorx", "linkedin": "company/competitorx" },
      "auto_detected": false,
      "tracking_since": "2026-03-01"
    }
  ]
}
```

### `POST /competitors`
Add a new competitor to track.

**Request**:
```json
{
  "name": "CompetitorX",
  "platforms": { "instagram": "@competitorx", "website": "https://competitorx.com" }
}
```
**Response** `201`: `{ "id": "uuid", "name": "CompetitorX", "status": "tracking_started" }`

### `DELETE /competitors/{id}`
Stop tracking a competitor.

### `GET /competitors/{id}/analysis`
Get AI-powered competitive intelligence.

**Response** `200`:
```json
{
  "competitor": "CompetitorX",
  "period": "30d",
  "metrics": {
    "posting_frequency": 4.2,
    "avg_engagement_rate": 6.1,
    "follower_growth": 5.3,
    "content_types": { "reels": 45, "carousels": 30, "static": 25 }
  },
  "campaigns_detected": [
    { "name": "Spring Sale Campaign", "detected_at": "...", "post_count": 8, "avg_engagement": 7.2 }
  ],
  "why_winning": "CompetitorX uses 3x more reels than you, driving 2x higher reach...",
  "counter_strategies": [
    { "strategy": "Increase reel production to 4/week", "reasoning": "...", "priority": "high" }
  ]
}
```

---

## 📝 Content Endpoints

### `POST /content/generate`
Generate marketing content.

**Request**:
```json
{
  "platform": "instagram|linkedin",
  "type": "caption|post_idea|campaign",
  "tone": "professional|genz|luxury|casual",
  "topic": "Product launch announcement",
  "context": "We're launching a new AI feature next Monday",
  "count": 3
}
```

**Response** `200`:
```json
{
  "generated": [
    {
      "id": "uuid",
      "content": "🚀 Something big is coming...\n\nNext Monday, we're unveiling...",
      "hashtags": ["#AI", "#ProductLaunch", "#Innovation"],
      "estimated_engagement": "high",
      "platform_optimized": true
    }
  ]
}
```

### `GET /content/history`
Past generated content. **Query Params**: `?platform=instagram&limit=20`

### `POST /content/{id}/feedback`
Rate generated content for learning. **Request**: `{ "rating": 1-5, "used": true|false }`

---

## 🔔 Alert Endpoints

### `GET /alerts`
List alerts. **Query Params**: `?status=unread|read|all&severity=critical|high|medium|low&limit=20`

**Response** `200`:
```json
{
  "alerts": [
    {
      "id": "uuid",
      "type": "engagement_drop|spike|competitor_activity",
      "severity": "high",
      "title": "Instagram engagement dropped 35% in 24h",
      "message": "Your last 3 posts averaged 2.1% engagement vs your 30d average of 4.7%...",
      "suggested_action": "Post a high-engagement format (reel/carousel) within the next 4 hours",
      "created_at": "2026-04-10T08:00:00Z",
      "read": false
    }
  ]
}
```

### `PATCH /alerts/{id}/read`
Mark alert as read.

### `POST /alerts/rules`
Create custom alert rule (Custom Mode).

**Request**:
```json
{
  "name": "Engagement Guard",
  "condition": { "metric": "engagement_rate", "operator": "drops_below", "threshold": 3.0, "period": "24h" },
  "actions": ["notify_telegram", "suggest_action"],
  "enabled": true
}
```

### `GET /alerts/rules`
List all custom alert rules.

---

## 📄 Report Endpoints

### `GET /reports`
List generated reports. **Query Params**: `?limit=10`

### `GET /reports/{id}`
Get report metadata + download URL.

**Response** `200`:
```json
{
  "id": "uuid",
  "period": { "start": "2026-04-01", "end": "2026-04-07" },
  "generated_at": "2026-04-08T00:05:00Z",
  "download_url": "/api/v1/reports/uuid/download",
  "summary": { "total_reach": 89000, "engagement_rate": 4.7, "top_insight": "..." }
}
```

### `GET /reports/{id}/download`
Download the PDF report file.

### `POST /reports/generate`
Trigger manual report generation. **Request**: `{ "period_start": "...", "period_end": "..." }`

---

## 🤖 Autopilot Endpoints

### `GET /autopilot/today`
Get today's autopilot briefing. Response matches the Autopilot Module output schema above.

### `GET /autopilot/history`
Past autopilot briefings. **Query Params**: `?days=7`

### `PATCH /autopilot/settings`
Configure autopilot.

**Request**:
```json
{
  "enabled": true,
  "delivery_time": "08:00",
  "delivery_channels": ["dashboard", "telegram"],
  "focus_areas": ["engagement", "growth"]
}
```

---

## ⚙️ Settings Endpoints

### `GET /settings/integrations`
List connected platform integrations with status.

### `POST /settings/integrations/{platform}/connect`
Connect a new platform (OAuth flow initiation).

### `DELETE /settings/integrations/{platform}/disconnect`
Disconnect a platform.

### `GET /settings/workspace`
Get workspace config (mode, goals, etc.)

### `PATCH /settings/workspace`
Update workspace config.

**Request**:
```json
{
  "mode": "general|custom",
  "goals": ["growth", "engagement"],
  "budget_monthly": 5000,
  "notification_channels": { "telegram_chat_id": "...", "email": "..." }
}
```
