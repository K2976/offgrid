from datetime import date, datetime, timedelta

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models import (
    AIAnalysis,
    Alert,
    AlertRule,
    AnalyticsSnapshot,
    AutopilotBrief,
    Competitor,
    GeneratedContent,
    Report,
    User,
    Workspace,
)
from app.schemas import (
    AlertRuleCreateRequest,
    AnalyzeRequest,
    AutopilotSettingsRequest,
    CompetitorCreateRequest,
    ContentFeedbackRequest,
    ContentGenerateRequest,
    LoginRequest,
    RegisterRequest,
    ReportGenerateRequest,
)
from app.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)


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
        company_name=payload.company_name,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    _get_or_create_default_workspace(db, user)

    return {
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "access_token": create_access_token(user.id),
        "refresh_token": create_refresh_token(user.id),
    }


def login_user(db: Session, payload: LoginRequest) -> dict:
    user = db.query(User).filter(User.email == payload.email.lower()).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    return {
        "access_token": create_access_token(user.id),
        "refresh_token": create_refresh_token(user.id),
    }


def refresh_access_token(db: Session, refresh_token: str) -> dict:
    payload = decode_token(refresh_token)
    if payload.get("type") != "refresh":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

    user_id = payload.get("sub")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

    return {"access_token": create_access_token(user.id), "refresh_token": refresh_token}


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

    response = {
        "generated_at": datetime.utcnow().isoformat() + "Z",
        "insights": [
            {
                "id": "insight-1",
                "type": "opportunity",
                "title": "Weekend posts outperform weekdays",
                "description": "Your weekend content consistently outperforms weekday posts.",
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
        model_used="groq+gemini",
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
    }


def generate_content(db: Session, user: User, payload: ContentGenerateRequest) -> dict:
    workspace = _get_or_create_default_workspace(db, user)
    generated = []
    for index in range(payload.count):
        text = (
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
