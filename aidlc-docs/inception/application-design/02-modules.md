# 2. 🧠 Module Breakdown

---

## Module 1: Analytics Engine

**Purpose**: Collect, normalize, and aggregate marketing performance data from social media, website, and SEO sources.

**Inputs**:
- Platform API credentials (Instagram, LinkedIn, Google Analytics, Google Search Console)
- Date ranges for queries
- User-configured workspace settings

**Outputs**:
- Normalized `AnalyticsSnapshot` records per platform per day
- Computed metrics: engagement rate, growth rate, bounce rate, conversion rate
- Trend data (7d / 30d / 90d comparisons)
- Best/worst performing posts ranked by engagement

**Internal Components**:

| Component | Responsibility |
|---|---|
| `DataCollector` | Calls platform APIs via `integrations/` layer, handles pagination & rate limits |
| `MetricsNormalizer` | Converts platform-specific data into unified `AnalyticsSnapshot` schema |
| `TrendCalculator` | Computes period-over-period deltas, moving averages, growth rates |
| `PerformanceRanker` | Ranks posts by composite score (engagement × reach) |
| `AggregationEngine` | Rolls up daily → weekly → monthly summaries |

---

## Module 2: AI Engine (Core Brain)

**Purpose**: Consume all analytics, competitor, and historical data to produce structured insights, problems, opportunities, and actionable recommendations.

**Inputs**:
- `AnalyticsSnapshot[]` from Analytics Engine
- `CompetitorProfile[]` from Competitor Engine
- User goals & configuration (growth mode, engagement mode, traffic mode)
- Historical AI outputs for learning context

**Outputs**:
```json
{
  "insights": [
    { "type": "opportunity", "title": "...", "description": "...", "confidence": 0.87, "data_points": [...] }
  ],
  "actions": [
    { "priority": "high", "action": "...", "reasoning": "...", "expected_impact": "..." }
  ],
  "content_ideas": [
    { "platform": "instagram", "idea": "...", "tone": "professional", "timing": "..." }
  ]
}
```

**Internal Components**:

| Component | Responsibility |
|---|---|
| `AnalystAgent` | Processes raw data → identifies patterns, anomalies, trends (uses **Groq** for speed) |
| `StrategistAgent` | Takes analyst output → produces strategies with reasoning (uses **Gemini** for depth) |
| `PromptBuilder` | Constructs context-aware prompts by injecting real data into templates |
| `ResponseParser` | Validates & parses LLM JSON output, handles retries on malformed responses |
| `ContextManager` | Manages sliding window of historical context for continuity |

---

## Module 3: Competitor Engine

**Purpose**: Track competitor marketing activity, detect campaigns, and generate competitive intelligence.

**Inputs**:
- Manually added competitor handles/domains
- Auto-detected competitors (via AI Engine suggestions)
- Platform API data for competitor public profiles

**Outputs**:
- `CompetitorProfile` with posting frequency, engagement trends, content type breakdown
- Campaign detection events (new campaign, product launch, viral content)
- "Why competitor is winning" analysis
- Counter-strategy recommendations

**Internal Components**:

| Component | Responsibility |
|---|---|
| `CompetitorTracker` | Scheduled scraping/API polling of competitor public data |
| `ActivityAnalyzer` | Detects posting frequency changes, engagement shifts |
| `CampaignDetector` | Identifies coordinated posting patterns indicating campaigns |
| `CompetitorAgent` | AI agent that analyzes competitor data and generates strategic counter-responses (uses **Gemini**) |
| `BenchmarkEngine` | Compares user's metrics against competitor baselines |

---

## Module 4: Content Engine

**Purpose**: Generate platform-specific marketing content with tone control and campaign awareness.

**Inputs**:
- Target platform (Instagram, LinkedIn)
- Desired tone (professional, GenZ, luxury, casual)
- Campaign context (from AI Engine insights)
- User's brand guidelines (from settings)
- Top-performing content patterns (from Analytics Engine)

**Outputs**:
- Generated captions with hashtags
- Post ideas with visual direction
- Campaign concepts (multi-post series)
- A/B variant suggestions

**Internal Components**:

| Component | Responsibility |
|---|---|
| `ContentAgent` | AI agent for content generation (uses **Groq** for quick drafts, **Gemini** for campaign plans) |
| `ToneAdapter` | Adjusts prompt templates per tone setting |
| `PlatformFormatter` | Enforces platform constraints (char limits, hashtag counts, media specs) |
| `ContentLibrary` | Stores generated content with performance feedback loop |

---

## Module 5: Alert System

**Purpose**: Detect anomalous events in real-time and deliver actionable alerts.

**Inputs**:
- Latest `AnalyticsSnapshot` (compared against rolling baseline)
- Competitor activity events from Competitor Engine
- User-defined alert rules (Custom Mode workflows)

**Outputs**:
- Alert objects: `{ type, severity, message, suggested_action, timestamp }`
- Delivery via Telegram bot and/or email

**Internal Components**:

| Component | Responsibility |
|---|---|
| `AnomalyDetector` | Statistical detection: z-score against 30d rolling average for engagement/traffic drops/spikes |
| `RuleEngine` | Evaluates user-defined IF/THEN rules (Custom Mode) |
| `AlertDispatcher` | Routes alerts to configured channels (Telegram, Email) |
| `ActionSuggester` | Quick AI call (uses **Groq**) to generate 1-line action suggestion per alert |
| `AlertThrottler` | Prevents alert fatigue: deduplication + cooldown periods |

---

## Module 6: Reporting System

**Purpose**: Generate comprehensive weekly PDF reports with AI-driven insights.

**Inputs**:
- Full week's `AnalyticsSnapshot[]`
- AI Engine insights for the week
- Competitor Engine intelligence
- Autopilot outputs

**Outputs**:
- PDF report containing:
  - Performance summary with charts
  - Key insights (top 5)
  - Competitor analysis table
  - Next week plan with priorities
  - AI-generated recommendations

**Internal Components**:

| Component | Responsibility |
|---|---|
| `ReportDataAggregator` | Collects and structures all data needed for the report period |
| `ReportNarrativeGenerator` | AI-generated narrative sections (uses **Gemini** for deep reasoning) |
| `ChartRenderer` | Generates chart images (matplotlib/plotly) for embedding in PDF |
| `PDFBuilder` | Assembles final PDF using template (ReportLab/WeasyPrint) |
| `ReportScheduler` | Celery beat task: triggers every Sunday at midnight |

---

## Module 7: Autopilot System

**Purpose**: Daily autonomous intelligence briefing — zero user input required.

**Inputs**:
- Previous 24h analytics data
- Latest competitor intelligence
- Pending/unresolved alerts

**Outputs**:
```json
{
  "date": "2026-04-10",
  "top_actions": [
    { "priority": 1, "action": "...", "reasoning": "..." },
    { "priority": 2, "action": "...", "reasoning": "..." },
    { "priority": 3, "action": "...", "reasoning": "..." }
  ],
  "content_idea": { "platform": "...", "idea": "...", "tone": "..." },
  "competitor_insight": { "competitor": "...", "insight": "...", "counter_action": "..." }
}
```

**Internal Components**:

| Component | Responsibility |
|---|---|
| `DailyOrchestrator` | Celery beat task that runs at 8 AM daily, coordinates all agents |
| `PriorityRanker` | Ranks all possible actions by impact × urgency |
| `AutopilotFormatter` | Structures output into the fixed 3+1+1 format |
| `DeliveryManager` | Pushes autopilot brief to dashboard + optional Telegram/email |
