from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    name: str = Field(min_length=1, max_length=100)
    role: Literal["company", "freelancer"] = "company"
    company_name: str | None = Field(default=None, max_length=200)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class RefreshRequest(BaseModel):
    refresh_token: str = Field(min_length=20, max_length=4096)


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str


class UserAuthResponse(TokenResponse):
    id: str
    email: EmailStr
    name: str
    role: Literal["company", "freelancer"]


class UserProfileResponse(BaseModel):
    id: str
    email: EmailStr
    name: str
    role: Literal["company", "freelancer"]
    company_name: str | None = None
    onboarding_complete: bool = False


class AnalyticsOverviewResponse(BaseModel):
    period: Literal["7d", "30d", "90d"]
    social: dict
    website: dict
    seo: dict
    trends: dict


class AnalyzeRequest(BaseModel):
    focus: Literal["all", "social", "website", "seo"] = "all"
    period: Literal["7d", "30d", "90d"] = "7d"
    goals: list[str] = Field(default_factory=list, max_length=20)


class ContentGenerateRequest(BaseModel):
    platform: Literal["instagram", "linkedin"]
    type: Literal["caption", "post_idea", "campaign"]
    tone: Literal["professional", "genz", "luxury", "casual"]
    topic: str = Field(min_length=1, max_length=300)
    context: str = Field(min_length=1, max_length=3000)
    count: int = Field(ge=1, le=10)


class ContentFeedbackRequest(BaseModel):
    rating: int = Field(ge=1, le=5)
    used: bool


class CompetitorCreateRequest(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    platforms: dict[str, str] = Field(default_factory=dict)


class AlertRuleCreateRequest(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    condition: dict
    actions: list[str] = Field(min_length=1, max_length=20)
    enabled: bool = True


class ReportGenerateRequest(BaseModel):
    period_start: date
    period_end: date


class AutopilotSettingsRequest(BaseModel):
    autopilot_enabled: bool
    autopilot_time: str = Field(pattern=r"^([01]\d|2[0-3]):[0-5]\d$")


class WorkspaceSettingsResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    mode: str
    goals: list
    budget_monthly: float | None
    autopilot_enabled: bool
    autopilot_time: str


class OnboardingProfileRequest(BaseModel):
    workspace_name: str = Field(min_length=2, max_length=200)
    mode: Literal["general", "custom"] = "general"
    goals: list[str] = Field(default_factory=list, max_length=20)
    budget_monthly: float | None = Field(default=None, ge=0)
    autopilot_enabled: bool = True
    autopilot_time: str = Field(default="08:00", pattern=r"^([01]\d|2[0-3]):[0-5]\d$")
    company_name: str | None = Field(default=None, max_length=200)


class BasicMessageResponse(BaseModel):
    message: str
    created_at: datetime | None = None


class OnboardingStartRequest(BaseModel):
    business_type: Literal["product", "service", "event"]


class OnboardingBusinessInfoRequest(BaseModel):
    data: dict = Field(default_factory=dict)


class OnboardingMarketingPreferencesRequest(BaseModel):
    budget: float = Field(ge=0)
    platforms: list[str] = Field(default_factory=list, max_length=20)
    goals: list[str] = Field(default_factory=list, max_length=20)


class CampaignCreateRequest(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    goal: str = Field(min_length=1, max_length=100)
    budget: float = Field(ge=0)
    platform: str = Field(min_length=1, max_length=50)
    details: dict = Field(default_factory=dict)


class CampaignUpdateRequest(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=200)
    goal: str | None = Field(default=None, min_length=1, max_length=100)
    budget: float | None = Field(default=None, ge=0)
    platform: str | None = Field(default=None, min_length=1, max_length=50)
    status: Literal["draft", "active", "paused", "completed"] | None = None
    details: dict | None = None


class AIGenerateContentRequest(BaseModel):
    campaign_id: str | None = None
    content_type: Literal["post", "caption", "ad_copy"] = "post"
    topic: str = Field(min_length=1, max_length=300)
    tone: str = Field(default="professional", min_length=1, max_length=50)
    platform: str = Field(default="instagram", min_length=1, max_length=50)
    audience: str | None = Field(default=None, max_length=200)


class AIRegenerateRequest(BaseModel):
    previous_output: dict
    variation_note: str = Field(default="Make it more creative.", max_length=300)


class EventTrackRequest(BaseModel):
    event_type: Literal["page_view", "click", "conversion", "custom"]
    campaign_id: str | None = None
    platform: str | None = None
    value: float | None = None
    metadata: dict = Field(default_factory=dict)


class BillboardNearbyRequest(BaseModel):
    lat: float = Field(ge=-90, le=90)
    lng: float = Field(ge=-180, le=180)
    radius_meters: int = Field(default=3000, ge=500, le=15000)


class BillboardRecommendRequest(BaseModel):
    business_type: Literal["product", "service", "event"]
    audience: str = Field(min_length=1, max_length=200)
    budget: float = Field(ge=0)
    lat: float = Field(ge=-90, le=90)
    lng: float = Field(ge=-180, le=180)
    radius_meters: int = Field(default=5000, ge=500, le=20000)


class CRMGenerateMessageRequest(BaseModel):
    upload_token: str = Field(min_length=6, max_length=100)
    objective: str = Field(min_length=1, max_length=200)
    tone: str = Field(default="friendly", min_length=1, max_length=50)


class FreelancerApplyRequest(BaseModel):
    skills: list[str] = Field(default_factory=list, max_length=30)
    niche: str | None = Field(default=None, max_length=120)
    rate_per_hour: float | None = Field(default=None, ge=0)


class FreelancerAssignRequest(BaseModel):
    freelancer_id: str
    campaign_id: str


class ConversionTrackRequest(BaseModel):
    referral_id: str = Field(min_length=1, max_length=120)
    campaign_id: str
    value: float = Field(default=0, ge=0)
    metadata: dict = Field(default_factory=dict)


class SettingsUpdateRequest(BaseModel):
    role_data: dict | None = None
    integrations: dict | None = None
    preferences: dict | None = None
