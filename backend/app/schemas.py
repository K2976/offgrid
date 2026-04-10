from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    name: str = Field(min_length=1, max_length=100)
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


class UserProfileResponse(BaseModel):
    id: str
    email: EmailStr
    name: str
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
