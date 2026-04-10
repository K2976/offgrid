/* ============================================
   TypeScript Interfaces — API Response Schemas
   ============================================ */

// --- Auth ---
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  company_name?: string;
}

export interface AuthResponse {
  id: string;
  email: string;
  name: string;
  access_token: string;
  refresh_token: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  company_name?: string;
  website_url?: string;
  onboarding_complete: boolean;
}

export interface OnboardingRequest {
  workspace_name: string;
  mode: 'general' | 'custom';
  goals: string[];
  budget_monthly?: number;
  autopilot_enabled: boolean;
  autopilot_time: string;
  company_name?: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token?: string;
}

// --- Analytics ---
export interface AnalyticsOverview {
  period: string;
  social: {
    total_followers: number;
    follower_growth: number;
    avg_engagement_rate: number;
    total_reach: number;
    total_impressions: number;
  };
  website: {
    total_visits: number;
    bounce_rate: number;
    avg_session_duration: number;
    conversions: number;
    conversion_rate: number;
  };
  seo: {
    avg_position: number;
    top_keywords_count: number;
    position_change: number;
  };
  trends: {
    engagement_trend: 'rising' | 'stable' | 'declining';
    traffic_trend: 'rising' | 'stable' | 'declining';
    seo_trend: 'rising' | 'stable' | 'declining';
  };
}

export interface PostSummary {
  id: string;
  content_preview: string;
  engagement_score: number;
  posted_at: string;
}

export interface SocialAnalytics {
  platform: string;
  period: string;
  followers: { current: number; change: number; growth_pct: number };
  engagement: { rate: number; likes: number; comments: number; shares: number };
  reach: { total: number; avg_per_post: number };
  top_posts: PostSummary[];
  worst_posts: PostSummary[];
  daily_data: { date: string; followers: number; engagement_rate: number }[];
}

export interface WebsiteAnalytics {
  period: string;
  traffic: { total_visits: number; unique_visitors: number; page_views: number };
  bounce_rate: number;
  conversions: { total: number; rate: number; top_pages: string[] };
  sources: { source: string; visits: number; pct: number }[];
  daily_data: { date: string; visits: number; bounce_rate: number }[];
}

export interface WebsiteAudit {
  url: string;
  strategy: 'mobile' | 'desktop';
  site_profile: {
    hostname: string;
    google_analytics_connected: boolean;
    google_analytics_note?: string | null;
  };
  scores: {
    performance: number;
    seo: number;
    accessibility: number;
    best_practices: number;
  };
  api_coverage?: Record<string, boolean>;
  performance_details?: {
    first_contentful_paint?: { title?: string; value?: string; numeric_value?: number | null; description?: string };
    largest_contentful_paint?: { title?: string; value?: string; numeric_value?: number | null; description?: string };
    total_blocking_time?: { title?: string; value?: string; numeric_value?: number | null; description?: string };
    cumulative_layout_shift?: { title?: string; value?: string; numeric_value?: number | null; description?: string };
    speed_index?: { title?: string; value?: string; numeric_value?: number | null; description?: string };
    time_to_interactive?: { title?: string; value?: string; numeric_value?: number | null; description?: string };
    server_response_time?: { title?: string; value?: string; numeric_value?: number | null; description?: string };
    interactive?: { title?: string; value?: string; numeric_value?: number | null; description?: string };
  };
  opportunities?: Array<{
    id: string;
    title?: string;
    impact?: string;
    numeric_impact?: number;
    description?: string;
  }>;
  diagnostics?: Array<{
    id: string;
    title?: string;
    score?: number;
    value?: string;
  }>;
  traffic?: {
    source: 'ga4';
    property_id: string;
    range: string;
    totals: {
      users: number;
      new_users: number;
      sessions: number;
      page_views: number;
      engaged_sessions: number;
      avg_session_duration_seconds: number;
      bounce_rate: number;
      engagement_rate: number;
      conversions: number;
    };
    channels: Array<{
      channel: string;
      sessions: number;
      users: number;
      conversions: number;
    }>;
    top_pages: Array<{
      path: string;
      views: number;
      users: number;
      engagement_seconds: number;
      entrances: number;
    }>;
    daily: Array<{
      date: string;
      sessions: number;
      users: number;
      page_views: number;
    }>;
  } | null;
  core_web_vitals: {
    fcp?: string;
    lcp?: string;
    tbt?: string;
    cls?: string;
    speed_index?: string;
    tti?: string;
  };
  fetched_at: string;
}

export interface SEOKeyword {
  keyword: string;
  position: number;
  change: number;
  impressions: number;
  clicks: number;
  ctr: number;
}

export interface SEOAnalytics {
  period: string;
  keywords: SEOKeyword[];
  avg_position: number;
  total_impressions: number;
  total_clicks: number;
}

// --- AI ---
export interface AIInsight {
  id: string;
  type: 'opportunity' | 'problem' | 'trend';
  title: string;
  description: string;
  confidence: number;
  data_points: string[];
  severity: 'critical' | 'high' | 'medium' | 'low';
}

export interface AIAction {
  id: string;
  priority: 'high' | 'medium' | 'low';
  action: string;
  reasoning: string;
  expected_impact: string;
  category: string;
}

export interface AIContentIdea {
  platform: string;
  idea: string;
  tone: string;
  optimal_time: string;
  expected_engagement: string;
}

export interface AIAnalysis {
  generated_at: string;
  insights: AIInsight[];
  actions: AIAction[];
  content_ideas: AIContentIdea[];
}

export interface AIAnalyzeRequest {
  focus: 'all' | 'social' | 'website' | 'seo';
  period: '7d' | '30d';
  goals: string[];
}

// --- Competitors ---
export interface Competitor {
  id: string;
  name: string;
  platforms: Record<string, string>;
  auto_detected: boolean;
  tracking_since: string;
}

export interface CompetitorMetrics {
  posting_frequency: number;
  avg_engagement_rate: number;
  follower_growth: number;
  content_types: Record<string, number>;
}

export interface CampaignDetected {
  name: string;
  detected_at: string;
  post_count: number;
  avg_engagement: number;
}

export interface CompetitorAnalysis {
  competitor: string;
  period: string;
  metrics: CompetitorMetrics;
  campaigns_detected: CampaignDetected[];
  why_winning: string;
  counter_strategies: { strategy: string; reasoning: string; priority: string }[];
  comeback_playbook?: { phase: string; focus: string; actions: string[] }[];
  market_context_summary?: string;
  detailed_brief?: string;
  brief_model_used?: string;
}

export interface AddCompetitorRequest {
  name: string;
  platforms: Record<string, string>;
}

// --- Content ---
export interface GenerateContentRequest {
  platform: 'instagram' | 'linkedin';
  type: 'caption' | 'post_idea' | 'campaign';
  tone: 'professional' | 'genz' | 'luxury' | 'casual';
  topic: string;
  context?: string;
  count: number;
}

export interface GeneratedContent {
  id: string;
  content: string;
  hashtags: string[];
  estimated_engagement: string;
  platform_optimized: boolean;
}

// --- Alerts ---
export interface Alert {
  id: string;
  type: 'engagement_drop' | 'spike' | 'competitor_activity' | 'custom_rule';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  message: string;
  suggested_action: string;
  created_at: string;
  read: boolean;
}

export interface AlertRule {
  id: string;
  name: string;
  condition: {
    metric: string;
    operator: string;
    threshold: number;
    period: string;
  };
  actions: string[];
  enabled: boolean;
  last_triggered_at?: string;
}

// --- Reports ---
export interface Report {
  id: string;
  period: { start: string; end: string };
  generated_at: string;
  download_url: string;
  summary: { total_reach: number; engagement_rate: number; top_insight: string };
}

// --- Autopilot ---
export interface AutopilotAction {
  priority: number;
  action: string;
  reasoning: string;
}

export interface AutopilotBrief {
  date: string;
  top_actions: AutopilotAction[];
  content_idea: { platform: string; idea: string; tone: string };
  competitor_insight: { competitor: string; insight: string; counter_action: string };
}

// --- Settings ---
export interface WorkspaceSettings {
  mode: 'general' | 'custom';
  goals: string[];
  budget_monthly?: number;
  notification_channels: { telegram_chat_id?: string; email?: string };
}

export interface Integration {
  platform: string;
  status: 'active' | 'expired' | 'revoked' | 'disconnected';
  platform_username?: string;
  connected_at?: string;
}
