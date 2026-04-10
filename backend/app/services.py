from datetime import date, datetime, timedelta
import csv
import io
import uuid
from urllib.parse import quote

import httpx
from fastapi import HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.config import settings
from app.models import (
    AIAnalysis,
    AIInsight,
    Alert,
    AlertRule,
    AnalyticsSnapshot,
    AnalyticsEvent,
    AutopilotBrief,
    Campaign,
    Competitor,
    Conversion,
    Freelancer,
    GeneratedContent,
    OnboardingData,
    Profile,
    Report,
    User,
    Workspace,
)
from app.schemas import (
    AIGenerateContentRequest,
    AIRegenerateRequest,
    AlertRuleCreateRequest,
    AnalyzeRequest,
    OnboardingProfileRequest,
    OnboardingBusinessInfoRequest,
    OnboardingMarketingPreferencesRequest,
    OnboardingStartRequest,
    AutopilotSettingsRequest,
    BillboardRecommendRequest,
    CampaignCreateRequest,
    CampaignUpdateRequest,
    CRMGenerateMessageRequest,
    CompetitorCreateRequest,
    ConversionTrackRequest,
    ContentFeedbackRequest,
    ContentGenerateRequest,
    EventTrackRequest,
    FreelancerApplyRequest,
    FreelancerAssignRequest,
    LoginRequest,
    RegisterRequest,
    ReportGenerateRequest,
    SettingsUpdateRequest,
)
from app.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)


TEMP_CRM_UPLOADS: dict[str, dict] = {}


def _get_or_create_default_workspace(db: Session, user: User) -> Workspace:
    workspace = db.query(Workspace).filter(Workspace.user_id == user.id).first()
    if workspace:
        return workspace

    workspace = Workspace(user_id=user.id, name=f"{user.name} Workspace")
    db.add(workspace)
    db.commit()
    db.refresh(workspace)
    return workspace


def register_user(db: Session, payload: RegisterRequest) -> dict:
    existing = db.query(User).filter(User.email == payload.email.lower()).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

    user = User(
        email=payload.email.lower(),
        password_hash=hash_password(payload.password),
        name=payload.name,
        role=payload.role,
        company_name=payload.company_name,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    profile = Profile(
        user_id=user.id,
        role=user.role,
        role_data={"company_name": payload.company_name} if payload.company_name else {},
        integrations={},
        preferences={},
    )
    db.add(profile)
    db.commit()

    _get_or_create_default_workspace(db, user)

    return {
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "role": user.role,
        "access_token": create_access_token(user.id, user.role),
        "refresh_token": create_refresh_token(user.id, user.role),
    }


def login_user(db: Session, payload: LoginRequest) -> dict:
    user = db.query(User).filter(User.email == payload.email.lower()).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    return {
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "role": user.role,
        "access_token": create_access_token(user.id, user.role),
        "refresh_token": create_refresh_token(user.id, user.role),
    }


def get_current_user_profile(user: User) -> dict:
    onboarding_complete = bool(user.company_name) if user.role == "company" else True
    return {
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "role": user.role,
        "company_name": user.company_name,
        "onboarding_complete": onboarding_complete,
    }


def _call_groq(prompt: str) -> str | None:
    if not settings.groq_api_key:
        return None

    try:
        with httpx.Client(timeout=12.0) as client:
            response = client.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={"Authorization": f"Bearer {settings.groq_api_key}"},
                json={
                    "model": "llama-3.1-8b-instant",
                    "messages": [
                        {
                            "role": "system",
                            "content": "You are a concise growth-marketing analyst. Respond in plain text.",
                        },
                        {"role": "user", "content": prompt},
                    ],
                    "temperature": 0.4,
                    "max_tokens": 280,
                },
            )
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"].strip()
    except Exception:
        return None


def _call_gemini(prompt: str) -> str | None:
    if not settings.gemini_api_key:
        return None

    try:
        with httpx.Client(timeout=12.0) as client:
            response = client.post(
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
                params={"key": settings.gemini_api_key},
                json={"contents": [{"parts": [{"text": prompt}]}]},
            )
            response.raise_for_status()
            data = response.json()
            candidates = data.get("candidates", [])
            if not candidates:
                return None
            parts = candidates[0].get("content", {}).get("parts", [])
            text_parts = [part.get("text", "") for part in parts if part.get("text")]
            return "\n".join(text_parts).strip() or None
    except Exception:
        return None


def _generate_ai_text(prompt: str) -> tuple[str | None, str]:
    groq_text = _call_groq(prompt)
    if groq_text:
        return groq_text, "groq"

    gemini_text = _call_gemini(prompt)
    if gemini_text:
        return gemini_text, "gemini"

    return None, "fallback"


def refresh_access_token(db: Session, refresh_token: str) -> dict:
    payload = decode_token(refresh_token)
    if payload.get("type") != "refresh":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

    user_id = payload.get("sub")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

    return {"access_token": create_access_token(user.id, user.role), "refresh_token": refresh_token}


def analytics_overview(db: Session, user: User, period: str) -> dict:
    _get_or_create_default_workspace(db, user)

    # Fallback values keep dashboard stable even before platform integrations are connected.
    return {
        "period": period,
        "social": {
            "total_followers": 12540,
            "follower_growth": 3.2,
            "avg_engagement_rate": 4.7,
            "total_reach": 89000,
            "total_impressions": 145000,
        },
        "website": {
            "total_visits": 23400,
            "bounce_rate": 42.1,
            "avg_session_duration": 185,
            "conversions": 312,
            "conversion_rate": 1.33,
        },
        "seo": {
            "avg_position": 14.3,
            "top_keywords_count": 45,
            "position_change": -2.1,
        },
        "trends": {
            "engagement_trend": "rising",
            "traffic_trend": "stable",
            "seo_trend": "declining",
        },
    }


def analytics_social(db: Session, user: User, platform: str, period: str) -> dict:
    _get_or_create_default_workspace(db, user)
    return {
        "platform": platform,
        "period": period,
        "followers": {"current": 8500, "change": 320, "growth_pct": 3.9},
        "engagement": {"rate": 5.1, "likes": 4200, "comments": 680, "shares": 190},
        "reach": {"total": 67000, "avg_per_post": 3350},
        "top_posts": [],
        "worst_posts": [],
        "daily_data": [],
    }


def analytics_website(db: Session, user: User, period: str) -> dict:
    _get_or_create_default_workspace(db, user)
    return {
        "period": period,
        "traffic": {"total_visits": 23400, "unique_visitors": 18200, "page_views": 67800},
        "bounce_rate": 42.1,
        "conversions": {"total": 312, "rate": 1.33, "top_pages": []},
        "sources": [],
        "daily_data": [],
    }


def analytics_seo(db: Session, user: User, period: str) -> dict:
    _get_or_create_default_workspace(db, user)
    return {
        "period": period,
        "keywords": [],
        "avg_position": 14.3,
        "total_impressions": 45000,
        "total_clicks": 3200,
    }


def run_ai_analysis(db: Session, user: User, payload: AnalyzeRequest) -> dict:
    workspace = _get_or_create_default_workspace(db, user)
    goals_line = ", ".join(payload.goals) if payload.goals else "general growth"
    prompt = (
        f"Analyze marketing performance focus={payload.focus}, period={payload.period}, "
        f"goals={goals_line}. Provide one concise key insight and one action."
    )
    model_text, model_used = _generate_ai_text(prompt)
    generated_description = (
        model_text
        if model_text
        else "Your strongest performance appears on weekends; replicate high-performing patterns there."
    )

    response = {
        "generated_at": datetime.utcnow().isoformat() + "Z",
        "insights": [
            {
                "id": "insight-1",
                "type": "opportunity",
                "title": "Weekend posts outperform weekdays",
                "description": generated_description[:500],
                "confidence": 0.87,
                "data_points": ["weekday_engagement: 3.2%", "weekend_engagement: 5.4%"],
                "severity": "medium",
            }
        ],
        "actions": [
            {
                "id": "action-1",
                "priority": "high",
                "action": "Shift 60% of content to weekend slots",
                "reasoning": "Weekend posts generate significantly more reach.",
                "expected_impact": "+25% engagement within 2 weeks",
                "category": "scheduling",
            }
        ],
        "content_ideas": [
            {
                "platform": "instagram",
                "idea": "Behind-the-scenes team culture reel",
                "tone": "casual",
                "optimal_time": "Saturday 11AM",
                "expected_engagement": "above_average",
            }
        ],
    }

    analysis = AIAnalysis(
        workspace_id=workspace.id,
        focus=payload.focus,
        period=payload.period,
        insights=response["insights"],
        actions=response["actions"],
        content_ideas=response["content_ideas"],
        model_used=model_used,
        tokens_used=0,
    )
    db.add(analysis)
    db.commit()
    return response


def ai_history(db: Session, user: User, limit: int, offset: int) -> dict:
    workspace = _get_or_create_default_workspace(db, user)
    query = (
        db.query(AIAnalysis)
        .filter(AIAnalysis.workspace_id == workspace.id)
        .order_by(AIAnalysis.created_at.desc())
    )
    total = query.count()
    rows = query.offset(offset).limit(limit).all()
    analyses = [
        {
            "id": row.id,
            "focus": row.focus,
            "period": row.period,
            "created_at": row.created_at.isoformat() + "Z",
            "insights": row.insights,
            "actions": row.actions,
            "content_ideas": row.content_ideas,
        }
        for row in rows
    ]
    return {"total": total, "analyses": analyses}


def list_competitors(db: Session, user: User) -> dict:
    workspace = _get_or_create_default_workspace(db, user)
    competitors = db.query(Competitor).filter(Competitor.workspace_id == workspace.id).all()
    return {
        "competitors": [
            {
                "id": c.id,
                "name": c.name,
                "platforms": c.platforms,
                "auto_detected": c.auto_detected,
                "tracking_since": c.tracking_since.isoformat() + "Z",
            }
            for c in competitors
        ]
    }


def create_competitor(db: Session, user: User, payload: CompetitorCreateRequest) -> dict:
    workspace = _get_or_create_default_workspace(db, user)
    competitor = Competitor(workspace_id=workspace.id, name=payload.name, platforms=payload.platforms)
    db.add(competitor)
    db.commit()
    db.refresh(competitor)
    return {"id": competitor.id, "name": competitor.name, "status": "tracking_started"}


def delete_competitor(db: Session, user: User, competitor_id: str) -> dict:
    workspace = _get_or_create_default_workspace(db, user)
    competitor = (
        db.query(Competitor)
        .filter(Competitor.id == competitor_id, Competitor.workspace_id == workspace.id)
        .first()
    )
    if not competitor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Competitor not found")

    db.delete(competitor)
    db.commit()
    return {"message": "Competitor removed"}


def competitor_analysis(db: Session, user: User, competitor_id: str) -> dict:
    workspace = _get_or_create_default_workspace(db, user)
    competitor = (
        db.query(Competitor)
        .filter(Competitor.id == competitor_id, Competitor.workspace_id == workspace.id)
        .first()
    )
    if not competitor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Competitor not found")

    wiki_summary = ""
    wiki_url = f"https://en.wikipedia.org/wiki/{quote(competitor.name.replace(' ', '_'))}"
    try:
        with httpx.Client(timeout=8.0) as client:
            wiki_resp = client.get(
                f"https://en.wikipedia.org/api/rest_v1/page/summary/{quote(competitor.name)}"
            )
            if wiki_resp.status_code == 200:
                wiki_data = wiki_resp.json()
                wiki_summary = wiki_data.get("extract", "")
                wiki_url = wiki_data.get("content_urls", {}).get("desktop", {}).get("page", wiki_url)
    except Exception:
        wiki_summary = ""

    return {
        "competitor": competitor.name,
        "period": "30d",
        "metrics": {
            "posting_frequency": 4.2,
            "avg_engagement_rate": 6.1,
            "follower_growth": 5.3,
            "content_types": {"reels": 45, "carousels": 30, "static": 25},
        },
        "campaigns_detected": [],
        "why_winning": "Higher short-form video frequency is driving better reach.",
        "counter_strategies": [
            {
                "strategy": "Increase reel production to 4/week",
                "reasoning": "Short-form content has higher distribution priority.",
                "priority": "high",
            }
        ],
        "wikipedia_summary": wiki_summary,
        "wikipedia_url": wiki_url,
        "external_sources": ["wikipedia"],
    }


def generate_content(db: Session, user: User, payload: ContentGenerateRequest) -> dict:
    workspace = _get_or_create_default_workspace(db, user)
    generated = []
    for index in range(payload.count):
        prompt = (
            f"Create one {payload.type} for {payload.platform} in {payload.tone} tone about '{payload.topic}'. "
            f"Context: {payload.context}. Keep it under 90 words."
        )
        model_text, _ = _generate_ai_text(prompt)
        text = model_text or (
            f"{payload.topic} - {payload.platform} draft {index + 1}. "
            f"Tone: {payload.tone}. Context: {payload.context[:120]}"
        )
        row = GeneratedContent(
            workspace_id=workspace.id,
            platform=payload.platform,
            type=payload.type,
            tone=payload.tone,
            content=text,
            hashtags=["#AI", "#Marketing", "#OffGrid"],
        )
        db.add(row)
        db.flush()
        generated.append(
            {
                "id": row.id,
                "content": text,
                "hashtags": row.hashtags,
                "estimated_engagement": "medium",
                "platform_optimized": True,
            }
        )

    db.commit()
    return {"generated": generated}


def content_history(db: Session, user: User, platform: str | None, limit: int) -> dict:
    workspace = _get_or_create_default_workspace(db, user)
    query = db.query(GeneratedContent).filter(GeneratedContent.workspace_id == workspace.id)
    if platform:
        query = query.filter(GeneratedContent.platform == platform)

    rows = query.order_by(GeneratedContent.created_at.desc()).limit(limit).all()
    return {
        "items": [
            {
                "id": row.id,
                "platform": row.platform,
                "type": row.type,
                "tone": row.tone,
                "content": row.content,
                "hashtags": row.hashtags,
                "rating": row.rating,
                "used": row.was_used,
            }
            for row in rows
        ]
    }


def content_feedback(db: Session, user: User, content_id: str, payload: ContentFeedbackRequest) -> dict:
    workspace = _get_or_create_default_workspace(db, user)
    row = (
        db.query(GeneratedContent)
        .filter(GeneratedContent.id == content_id, GeneratedContent.workspace_id == workspace.id)
        .first()
    )
    if not row:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Content not found")

    row.rating = payload.rating
    row.was_used = payload.used
    db.commit()
    return {"message": "Feedback recorded"}


def list_alerts(db: Session, user: User, status_filter: str, severity: str | None, limit: int) -> dict:
    workspace = _get_or_create_default_workspace(db, user)
    query = db.query(Alert).filter(Alert.workspace_id == workspace.id)

    if status_filter == "unread":
        query = query.filter(Alert.read.is_(False))
    elif status_filter == "read":
        query = query.filter(Alert.read.is_(True))

    if severity:
        query = query.filter(Alert.severity == severity)

    rows = query.order_by(Alert.created_at.desc()).limit(limit).all()
    return {
        "alerts": [
            {
                "id": row.id,
                "type": row.type,
                "severity": row.severity,
                "title": row.title,
                "message": row.message,
                "suggested_action": row.suggested_action,
                "created_at": row.created_at.isoformat() + "Z",
                "read": row.read,
            }
            for row in rows
        ]
    }


def mark_alert_read(db: Session, user: User, alert_id: str) -> dict:
    workspace = _get_or_create_default_workspace(db, user)
    row = db.query(Alert).filter(Alert.id == alert_id, Alert.workspace_id == workspace.id).first()
    if not row:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Alert not found")

    row.read = True
    db.commit()
    return {"message": "Alert marked as read"}


def create_alert_rule(db: Session, user: User, payload: AlertRuleCreateRequest) -> dict:
    workspace = _get_or_create_default_workspace(db, user)
    row = AlertRule(
        workspace_id=workspace.id,
        name=payload.name,
        condition=payload.condition,
        actions=payload.actions,
        enabled=payload.enabled,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return {
        "id": row.id,
        "name": row.name,
        "condition": row.condition,
        "actions": row.actions,
        "enabled": row.enabled,
    }


def list_alert_rules(db: Session, user: User) -> dict:
    workspace = _get_or_create_default_workspace(db, user)
    rows = db.query(AlertRule).filter(AlertRule.workspace_id == workspace.id).order_by(AlertRule.created_at.desc()).all()
    return {
        "rules": [
            {
                "id": row.id,
                "name": row.name,
                "condition": row.condition,
                "actions": row.actions,
                "enabled": row.enabled,
            }
            for row in rows
        ]
    }


def list_reports(db: Session, user: User, limit: int) -> dict:
    workspace = _get_or_create_default_workspace(db, user)
    rows = db.query(Report).filter(Report.workspace_id == workspace.id).order_by(Report.generated_at.desc()).limit(limit).all()
    return {
        "reports": [
            {
                "id": row.id,
                "period": {"start": row.period_start.isoformat(), "end": row.period_end.isoformat()},
                "generated_at": row.generated_at.isoformat() + "Z",
                "download_url": f"/api/v1/reports/{row.id}/download",
                "summary": row.summary,
            }
            for row in rows
        ]
    }


def report_by_id(db: Session, user: User, report_id: str) -> dict:
    workspace = _get_or_create_default_workspace(db, user)
    row = db.query(Report).filter(Report.id == report_id, Report.workspace_id == workspace.id).first()
    if not row:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report not found")

    return {
        "id": row.id,
        "period": {"start": row.period_start.isoformat(), "end": row.period_end.isoformat()},
        "generated_at": row.generated_at.isoformat() + "Z",
        "download_url": f"/api/v1/reports/{row.id}/download",
        "summary": row.summary,
    }


def generate_report(db: Session, user: User, payload: ReportGenerateRequest) -> dict:
    workspace = _get_or_create_default_workspace(db, user)
    row = Report(
        workspace_id=workspace.id,
        period_start=payload.period_start,
        period_end=payload.period_end,
        file_path=f"reports/{workspace.id}/{payload.period_start}-{payload.period_end}.pdf",
        summary={"top_insight": "Engagement increased after weekend schedule shift."},
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return report_by_id(db, user, row.id)


def get_autopilot_today(db: Session, user: User) -> dict:
    workspace = _get_or_create_default_workspace(db, user)
    today = date.today()
    row = (
        db.query(AutopilotBrief)
        .filter(AutopilotBrief.workspace_id == workspace.id, AutopilotBrief.date == today)
        .first()
    )

    if not row:
        row = AutopilotBrief(
            workspace_id=workspace.id,
            date=today,
            top_actions=[
                {"priority": 1, "action": "Post one reel at 11 AM", "reasoning": "Best recent performance window."},
                {"priority": 2, "action": "Reply to top 20 comments", "reasoning": "Boosts post longevity and trust."},
                {"priority": 3, "action": "Refresh CTA in bio", "reasoning": "Improve conversion path clarity."},
            ],
            content_idea={"platform": "instagram", "idea": "Mini case study carousel", "tone": "professional"},
            competitor_insight={"competitor": "Sample Competitor", "insight": "Increased reel cadence", "counter_action": "Publish 3 short videos this week"},
        )
        db.add(row)
        db.commit()
        db.refresh(row)

    return {
        "date": row.date.isoformat(),
        "top_actions": row.top_actions,
        "content_idea": row.content_idea,
        "competitor_insight": row.competitor_insight,
    }


def get_autopilot_history(db: Session, user: User, days: int) -> dict:
    workspace = _get_or_create_default_workspace(db, user)
    start_date = date.today() - timedelta(days=days)
    rows = (
        db.query(AutopilotBrief)
        .filter(AutopilotBrief.workspace_id == workspace.id, AutopilotBrief.date >= start_date)
        .order_by(AutopilotBrief.date.desc())
        .all()
    )
    return {
        "items": [
            {
                "id": row.id,
                "date": row.date.isoformat(),
                "top_actions": row.top_actions,
                "content_idea": row.content_idea,
                "competitor_insight": row.competitor_insight,
            }
            for row in rows
        ]
    }


def update_autopilot_settings(db: Session, user: User, payload: AutopilotSettingsRequest) -> dict:
    workspace = _get_or_create_default_workspace(db, user)
    workspace.autopilot_enabled = payload.autopilot_enabled
    workspace.autopilot_time = payload.autopilot_time
    db.commit()
    db.refresh(workspace)
    return {
        "id": workspace.id,
        "name": workspace.name,
        "mode": workspace.mode,
        "goals": workspace.goals,
        "budget_monthly": workspace.budget_monthly,
        "autopilot_enabled": workspace.autopilot_enabled,
        "autopilot_time": workspace.autopilot_time,
    }


def get_workspace_settings(db: Session, user: User) -> dict:
    workspace = _get_or_create_default_workspace(db, user)
    return {
        "id": workspace.id,
        "name": workspace.name,
        "mode": workspace.mode,
        "goals": workspace.goals,
        "budget_monthly": workspace.budget_monthly,
        "autopilot_enabled": workspace.autopilot_enabled,
        "autopilot_time": workspace.autopilot_time,
    }


def upsert_onboarding_profile(db: Session, user: User, payload: OnboardingProfileRequest) -> dict:
    workspace = _get_or_create_default_workspace(db, user)

    workspace.name = payload.workspace_name
    workspace.mode = payload.mode
    workspace.goals = payload.goals
    workspace.budget_monthly = payload.budget_monthly
    workspace.autopilot_enabled = payload.autopilot_enabled
    workspace.autopilot_time = payload.autopilot_time
    user.company_name = payload.company_name

    db.commit()
    db.refresh(workspace)
    db.refresh(user)

    return {
        "message": "Profile setup completed",
        "workspace": {
            "id": workspace.id,
            "name": workspace.name,
            "mode": workspace.mode,
            "goals": workspace.goals,
            "budget_monthly": workspace.budget_monthly,
            "autopilot_enabled": workspace.autopilot_enabled,
            "autopilot_time": workspace.autopilot_time,
        },
        "user": get_current_user_profile(user),
    }


def _require_company(user: User) -> None:
    if user.role != "company":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Company role required")


def _get_or_create_profile(db: Session, user: User) -> Profile:
    profile = db.query(Profile).filter(Profile.user_id == user.id).first()
    if profile:
        return profile
    profile = Profile(user_id=user.id, role=user.role, role_data={}, integrations={}, preferences={})
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile


def _get_or_create_onboarding(db: Session, user: User) -> OnboardingData:
    row = db.query(OnboardingData).filter(OnboardingData.user_id == user.id).first()
    if row:
        return row
    row = OnboardingData(user_id=user.id)
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


def _call_groq_json(prompt: str, fallback: dict) -> tuple[dict, str]:
    text = _call_groq(prompt)
    if not text:
        return fallback, "fallback"
    try:
        import json

        return json.loads(text), "groq"
    except Exception:
        return fallback, "groq"


def onboarding_start(db: Session, user: User, payload: OnboardingStartRequest) -> dict:
    _require_company(user)
    row = _get_or_create_onboarding(db, user)
    row.business_type = payload.business_type
    row.current_step = max(row.current_step, 1)
    row.started_at = row.started_at or datetime.utcnow()
    row.is_completed = False
    db.commit()
    return {"message": "Onboarding started", "business_type": row.business_type, "current_step": row.current_step}


def onboarding_business_info(db: Session, user: User, payload: OnboardingBusinessInfoRequest) -> dict:
    _require_company(user)
    row = _get_or_create_onboarding(db, user)
    if not row.business_type:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Start onboarding first")
    row.business_info = payload.data
    row.current_step = max(row.current_step, 2)
    db.commit()
    return {"message": "Business info saved", "current_step": row.current_step}


def onboarding_marketing_preferences(
    db: Session,
    user: User,
    payload: OnboardingMarketingPreferencesRequest,
) -> dict:
    _require_company(user)
    row = _get_or_create_onboarding(db, user)
    if not row.business_type:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Start onboarding first")
    row.marketing_preferences = {
        "budget": payload.budget,
        "platforms": payload.platforms,
        "goals": payload.goals,
    }
    row.current_step = max(row.current_step, 3)
    db.commit()
    return {"message": "Marketing preferences saved", "current_step": row.current_step}


def onboarding_status(db: Session, user: User) -> dict:
    _require_company(user)
    row = _get_or_create_onboarding(db, user)
    return {
        "business_type": row.business_type,
        "current_step": row.current_step,
        "is_completed": row.is_completed,
        "has_business_info": bool(row.business_info),
        "has_marketing_preferences": bool(row.marketing_preferences),
    }


def generate_strategy(db: Session, user: User) -> dict:
    _require_company(user)
    onboarding = _get_or_create_onboarding(db, user)
    if not onboarding.business_type:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Complete onboarding first")

    fallback = {
        "channels": onboarding.marketing_preferences.get("platforms", ["instagram", "linkedin"]),
        "content_pillars": ["education", "social-proof", "offer-driven"],
        "cadence": {"posts_per_week": 4, "stories_per_week": 5},
        "kpis": ["reach", "clicks", "conversions"],
        "next_actions": ["Launch campaign", "Track CTR", "Iterate weekly"],
    }
    prompt = (
        "Return ONLY strict JSON with keys channels, content_pillars, cadence, kpis, next_actions. "
        f"Business type: {onboarding.business_type}. "
        f"Business info: {onboarding.business_info}. "
        f"Preferences: {onboarding.marketing_preferences}."
    )
    plan, model_used = _call_groq_json(prompt, fallback)

    row = AIInsight(
        user_id=user.id,
        category="strategy",
        title="Initial marketing strategy",
        content=plan,
        model_used=model_used,
    )
    db.add(row)
    db.commit()
    return {"strategy": plan, "model": model_used}


def onboarding_complete(db: Session, user: User) -> dict:
    _require_company(user)
    row = _get_or_create_onboarding(db, user)
    if row.current_step < 3:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Complete all onboarding steps first")
    row.is_completed = True
    row.completed_at = datetime.utcnow()
    db.commit()
    strategy = generate_strategy(db, user)
    return {"message": "Onboarding completed", "strategy": strategy["strategy"]}


def create_campaign(db: Session, user: User, payload: CampaignCreateRequest) -> dict:
    _require_company(user)
    row = Campaign(
        user_id=user.id,
        name=payload.name,
        goal=payload.goal,
        budget=payload.budget,
        platform=payload.platform,
        details=payload.details,
        status="active",
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return {
        "id": row.id,
        "name": row.name,
        "goal": row.goal,
        "budget": row.budget,
        "platform": row.platform,
        "status": row.status,
        "details": row.details,
    }


def list_campaigns(db: Session, user: User) -> dict:
    rows = db.query(Campaign).filter(Campaign.user_id == user.id).order_by(Campaign.created_at.desc()).all()
    return {
        "campaigns": [
            {
                "id": c.id,
                "name": c.name,
                "goal": c.goal,
                "budget": c.budget,
                "platform": c.platform,
                "status": c.status,
                "details": c.details,
                "performance_metrics": c.performance_metrics,
            }
            for c in rows
        ]
    }


def get_campaign(db: Session, user: User, campaign_id: str) -> dict:
    row = db.query(Campaign).filter(Campaign.id == campaign_id, Campaign.user_id == user.id).first()
    if not row:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Campaign not found")
    return {
        "id": row.id,
        "name": row.name,
        "goal": row.goal,
        "budget": row.budget,
        "platform": row.platform,
        "status": row.status,
        "details": row.details,
        "performance_metrics": row.performance_metrics,
    }


def update_campaign(db: Session, user: User, campaign_id: str, payload: CampaignUpdateRequest) -> dict:
    row = db.query(Campaign).filter(Campaign.id == campaign_id, Campaign.user_id == user.id).first()
    if not row:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Campaign not found")

    if payload.name is not None:
        row.name = payload.name
    if payload.goal is not None:
        row.goal = payload.goal
    if payload.budget is not None:
        row.budget = payload.budget
    if payload.platform is not None:
        row.platform = payload.platform
    if payload.status is not None:
        row.status = payload.status
    if payload.details is not None:
        row.details = payload.details

    db.commit()
    db.refresh(row)
    return get_campaign(db, user, row.id)


def delete_campaign(db: Session, user: User, campaign_id: str) -> dict:
    row = db.query(Campaign).filter(Campaign.id == campaign_id, Campaign.user_id == user.id).first()
    if not row:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Campaign not found")
    db.delete(row)
    db.commit()
    return {"message": "Campaign removed"}


def ai_generate_content(db: Session, user: User, payload: AIGenerateContentRequest) -> dict:
    onboarding = db.query(OnboardingData).filter(OnboardingData.user_id == user.id).first()
    campaign = None
    if payload.campaign_id:
        campaign = db.query(Campaign).filter(Campaign.id == payload.campaign_id, Campaign.user_id == user.id).first()

    fallback = {
        "post": f"{payload.topic}: practical tips and a clear CTA.",
        "caption": f"{payload.topic} in {payload.tone} tone for {payload.platform}.",
        "hashtags": ["#marketing", "#growth", "#ai"],
        "best_time": "18:30",
    }
    prompt = (
        "Return ONLY strict JSON with keys post, caption, hashtags (array), best_time. "
        f"Generate {payload.content_type} for platform {payload.platform}, tone {payload.tone}, topic {payload.topic}. "
        f"Audience: {payload.audience}. Campaign: {campaign.details if campaign else {}}. "
        f"Onboarding: {onboarding.business_info if onboarding else {}}"
    )
    output, model = _call_groq_json(prompt, fallback)

    if campaign:
        campaign.performance_metrics = {
            **campaign.performance_metrics,
            "last_generated_content_at": datetime.utcnow().isoformat() + "Z",
        }
        db.commit()

    return {"result": output, "model": model}


def ai_regenerate_content(db: Session, user: User, payload: AIRegenerateRequest) -> dict:
    prompt = (
        "Return ONLY strict JSON with keys post, caption, hashtags (array), best_time. "
        f"Regenerate a variation for this previous output: {payload.previous_output}. "
        f"Variation request: {payload.variation_note}"
    )
    fallback = {
        "post": "Variation with sharper hook and clearer CTA.",
        "caption": "Try this fresh angle to improve engagement.",
        "hashtags": ["#brand", "#campaign", "#offgrid"],
        "best_time": "12:15",
    }
    output, model = _call_groq_json(prompt, fallback)
    return {"result": output, "model": model}


def track_analytics_event(db: Session, user: User, payload: EventTrackRequest) -> dict:
    row = AnalyticsEvent(
        user_id=user.id,
        campaign_id=payload.campaign_id,
        event_type=payload.event_type,
        platform=payload.platform,
        value=payload.value,
        event_metadata=payload.metadata,
    )
    db.add(row)
    db.commit()
    return {"message": "Event tracked", "event_id": row.id}


def analytics_summary(db: Session, user: User) -> dict:
    rows = db.query(AnalyticsEvent).filter(AnalyticsEvent.user_id == user.id).all()
    total_visits = sum(1 for r in rows if r.event_type == "page_view")
    total_clicks = sum(1 for r in rows if r.event_type == "click")
    total_conversions = sum(1 for r in rows if r.event_type == "conversion")
    conversion_rate = (total_conversions / total_visits * 100) if total_visits else 0
    return {
        "total_events": len(rows),
        "total_visits": total_visits,
        "total_clicks": total_clicks,
        "conversions": total_conversions,
        "conversion_rate": round(conversion_rate, 2),
    }


def analytics_insights(db: Session, user: User) -> dict:
    summary = analytics_summary(db, user)
    fallback = {
        "insights": [
            "Clicks are healthy but conversion can improve with stronger CTA.",
            "Run A/B tests on headline and first 3 lines.",
        ],
        "suggestions": ["Post at peak times", "Retarget users who clicked but did not convert"],
    }
    prompt = (
        "Return ONLY strict JSON with keys insights (array), suggestions (array). "
        f"Generate concise AI insights from this analytics summary: {summary}"
    )
    content, model_used = _call_groq_json(prompt, fallback)
    row = AIInsight(
        user_id=user.id,
        category="analytics",
        title="Analytics insights",
        content=content,
        model_used=model_used,
    )
    db.add(row)
    db.commit()
    return {"summary": summary, "insights": content, "model": model_used}


def _fetch_billboards(lat: float, lng: float, radius: int) -> list[dict]:
    query = f"""
    [out:json][timeout:15];
    (
      node(around:{radius},{lat},{lng})[\"advertising\"=\"billboard\"];
      node(around:{radius},{lat},{lng})[\"amenity\"=\"advertising\"];
    );
    out center 40;
    """
    try:
        with httpx.Client(timeout=15.0) as client:
            resp = client.post("https://overpass-api.de/api/interpreter", data=query)
            resp.raise_for_status()
            data = resp.json()
        items = []
        for el in data.get("elements", []):
            tags = el.get("tags", {})
            items.append(
                {
                    "id": str(el.get("id")),
                    "name": tags.get("name", "Unnamed Billboard"),
                    "lat": el.get("lat"),
                    "lng": el.get("lon"),
                    "address": tags.get("addr:full") or tags.get("addr:street") or "",
                }
            )
        return items
    except Exception:
        return []


def billboards_nearby(lat: float, lng: float, radius_meters: int) -> dict:
    rows = _fetch_billboards(lat, lng, radius_meters)
    if not rows:
        rows = [
            {"id": "sample-1", "name": "Downtown Junction Board", "lat": lat + 0.01, "lng": lng + 0.01, "address": "Downtown"},
            {"id": "sample-2", "name": "Transit Hub Digital Board", "lat": lat - 0.008, "lng": lng + 0.012, "address": "Transit Hub"},
        ]
    return {"count": len(rows), "locations": rows}


def recommend_billboards(db: Session, user: User, payload: BillboardRecommendRequest) -> dict:
    nearby = billboards_nearby(payload.lat, payload.lng, payload.radius_meters)["locations"]
    scored = []
    for i, row in enumerate(nearby[:10]):
        score = 100 - i * 6
        if payload.business_type == "event":
            score += 5
        if payload.budget < 1000:
            score -= 10
        scored.append({**row, "score": max(score, 1)})
    top = sorted(scored, key=lambda x: x["score"], reverse=True)[:5]

    reasoning_prompt = (
        "Provide 1-line reasoning for each billboard recommendation based on audience and budget. "
        f"Audience={payload.audience}, budget={payload.budget}, locations={top}"
    )
    reasoning_text, _ = _generate_ai_text(reasoning_prompt)
    return {"recommendations": top, "reasoning": reasoning_text or "Top spots maximize visibility and commute traffic."}


def crm_upload_csv(user: User, csv_text: str) -> dict:
    reader = csv.DictReader(io.StringIO(csv_text))
    rows = [row for row in reader][:500]
    token = f"crm-{user.id[:8]}-{uuid.uuid4().hex[:10]}"
    TEMP_CRM_UPLOADS[token] = {"user_id": user.id, "rows": rows, "created_at": datetime.utcnow()}
    return {"upload_token": token, "rows_parsed": len(rows), "columns": reader.fieldnames or []}


def crm_generate_message(db: Session, user: User, payload: CRMGenerateMessageRequest) -> dict:
    cached = TEMP_CRM_UPLOADS.get(payload.upload_token)
    if not cached or cached.get("user_id") != user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Upload token not found")

    sample = cached.get("rows", [])[:5]
    prompt = (
        "Generate short personalized outreach messages for these contacts. "
        f"Objective={payload.objective}, tone={payload.tone}, sample_rows={sample}."
    )
    text, model = _generate_ai_text(prompt)
    if not text:
        text = "Hi {{name}}, we noticed your interest and prepared a special offer for you."
    return {"message_template": text, "model": model, "sample_size": len(sample)}


def crm_suggestions(user: User) -> dict:
    recent = [v for v in TEMP_CRM_UPLOADS.values() if v.get("user_id") == user.id]
    audience_size = sum(len(v.get("rows", [])) for v in recent)
    return {
        "suggestions": [
            "Segment contacts by interest tags before sending campaigns.",
            "Use urgency-based CTA for users inactive >14 days.",
            "Run a 3-message drip sequence and track click-through.",
        ],
        "audience_size_in_temp_uploads": audience_size,
    }


def freelancers_list(db: Session) -> dict:
    rows = db.query(Freelancer).order_by(Freelancer.score.desc(), Freelancer.completed_jobs.desc()).all()
    return {
        "freelancers": [
            {
                "id": f.id,
                "name": f.name,
                "email": f.email,
                "skills": f.skills,
                "niche": f.niche,
                "rate_per_hour": f.rate_per_hour,
                "score": f.score,
                "completed_jobs": f.completed_jobs,
            }
            for f in rows
        ]
    }


def freelancer_apply(db: Session, user: User, payload: FreelancerApplyRequest) -> dict:
    if user.role != "freelancer":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Freelancer role required")

    row = db.query(Freelancer).filter(Freelancer.user_id == user.id).first()
    if not row:
        row = Freelancer(
            user_id=user.id,
            name=user.name,
            email=user.email,
            skills=payload.skills,
            niche=payload.niche,
            rate_per_hour=payload.rate_per_hour,
        )
        db.add(row)
    else:
        row.skills = payload.skills
        row.niche = payload.niche
        row.rate_per_hour = payload.rate_per_hour
    db.commit()
    db.refresh(row)
    return {"message": "Freelancer profile active", "freelancer_id": row.id}


def freelancer_assign(db: Session, user: User, payload: FreelancerAssignRequest) -> dict:
    _require_company(user)
    campaign = db.query(Campaign).filter(Campaign.id == payload.campaign_id, Campaign.user_id == user.id).first()
    if not campaign:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Campaign not found")

    freelancer = db.query(Freelancer).filter(Freelancer.id == payload.freelancer_id).first()
    if not freelancer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Freelancer not found")

    campaign.assigned_freelancer_id = freelancer.id
    db.commit()
    return {
        "message": "Freelancer assigned",
        "campaign_id": campaign.id,
        "freelancer_id": freelancer.id,
    }


def freelancers_leaderboard(db: Session) -> dict:
    rows = (
        db.query(
            Freelancer.id,
            Freelancer.name,
            func.count(Conversion.id).label("conversions"),
            func.coalesce(func.sum(Conversion.value), 0).label("revenue"),
        )
        .outerjoin(Conversion, Conversion.freelancer_id == Freelancer.id)
        .group_by(Freelancer.id, Freelancer.name)
        .order_by(func.count(Conversion.id).desc(), func.sum(Conversion.value).desc())
        .limit(20)
        .all()
    )
    return {
        "leaderboard": [
            {"freelancer_id": r.id, "name": r.name, "conversions": int(r.conversions), "revenue": float(r.revenue or 0)}
            for r in rows
        ]
    }


def track_conversion(db: Session, payload: ConversionTrackRequest) -> dict:
    campaign = db.query(Campaign).filter(Campaign.id == payload.campaign_id).first()
    if not campaign:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Campaign not found")

    row = Conversion(
        campaign_id=campaign.id,
        freelancer_id=campaign.assigned_freelancer_id,
        referral_id=payload.referral_id,
        value=payload.value,
        conversion_metadata=payload.metadata,
    )
    db.add(row)

    if campaign.assigned_freelancer_id:
        freelancer = db.query(Freelancer).filter(Freelancer.id == campaign.assigned_freelancer_id).first()
        if freelancer:
            freelancer.completed_jobs += 1
            freelancer.score = round(freelancer.score + 1.0, 2)

    db.commit()
    return {"message": "Conversion tracked", "conversion_id": row.id}


def get_settings(db: Session, user: User) -> dict:
    profile = _get_or_create_profile(db, user)
    return {
        "profile": get_current_user_profile(user),
        "role_data": profile.role_data,
        "integrations": profile.integrations,
        "preferences": profile.preferences,
    }


def update_settings(db: Session, user: User, payload: SettingsUpdateRequest) -> dict:
    profile = _get_or_create_profile(db, user)
    if payload.role_data is not None:
        profile.role_data = {**profile.role_data, **payload.role_data}
    if payload.integrations is not None:
        profile.integrations = {**profile.integrations, **payload.integrations}
    if payload.preferences is not None:
        profile.preferences = {**profile.preferences, **payload.preferences}
    db.commit()
    db.refresh(profile)
    return get_settings(db, user)


def run_periodic_analytics_aggregation(db: Session) -> None:
    user_ids = [u.id for u in db.query(User.id).all()]
    for user_id in user_ids:
        rows = db.query(AnalyticsEvent).filter(AnalyticsEvent.user_id == user_id).all()
        summary = {
            "events": len(rows),
            "visits": sum(1 for r in rows if r.event_type == "page_view"),
            "clicks": sum(1 for r in rows if r.event_type == "click"),
            "conversions": sum(1 for r in rows if r.event_type == "conversion"),
        }
        db.add(
            AIInsight(
                user_id=user_id,
                category="aggregation",
                title="Periodic analytics aggregation",
                content=summary,
                model_used="aggregator",
            )
        )
    db.commit()


def run_daily_ai_insight_generation(db: Session) -> None:
    users = db.query(User).all()
    for user in users:
        summary = analytics_summary(db, user)
        db.add(
            AIInsight(
                user_id=user.id,
                category="daily_insight",
                title="Daily insight",
                content={
                    "summary": summary,
                    "suggestion": "Double down on best-performing platform and adjust CTA wording.",
                },
                model_used="scheduler",
            )
        )
    db.commit()


def run_campaign_performance_updates(db: Session) -> None:
    campaigns = db.query(Campaign).all()
    for c in campaigns:
        conversion_count = db.query(func.count(Conversion.id)).filter(Conversion.campaign_id == c.id).scalar() or 0
        c.performance_metrics = {
            **c.performance_metrics,
            "conversion_count": int(conversion_count),
            "updated_at": datetime.utcnow().isoformat() + "Z",
        }
    db.commit()
