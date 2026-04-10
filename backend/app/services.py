from datetime import date, datetime, timedelta
from urllib.parse import quote

import httpx
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.config import settings
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
    OnboardingProfileRequest,
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
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "access_token": create_access_token(user.id),
        "refresh_token": create_refresh_token(user.id),
    }


def get_current_user_profile(user: User) -> dict:
    onboarding_complete = bool(user.company_name)
    return {
        "id": user.id,
        "email": user.email,
        "name": user.name,
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


def _call_groq_with_tokens(prompt: str, max_tokens: int) -> str | None:
    if not settings.groq_api_key:
        return None

    try:
        with httpx.Client(timeout=15.0) as client:
            response = client.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={"Authorization": f"Bearer {settings.groq_api_key}"},
                json={
                    "model": "llama-3.1-8b-instant",
                    "messages": [
                        {
                            "role": "system",
                            "content": "You are a precise growth strategist. Respond with practical, specific analysis.",
                        },
                        {"role": "user", "content": prompt},
                    ],
                    "temperature": 0.45,
                    "max_tokens": max_tokens,
                },
            )
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"].strip()
    except Exception:
        return None


def _call_gemini_with_tokens(prompt: str, max_tokens: int) -> str | None:
    if not settings.gemini_api_key:
        return None

    try:
        with httpx.Client(timeout=15.0) as client:
            response = client.post(
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
                params={"key": settings.gemini_api_key},
                json={
                    "contents": [{"parts": [{"text": prompt}]}],
                    "generationConfig": {"maxOutputTokens": max_tokens, "temperature": 0.45},
                },
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


def _generate_ai_text_fast(prompt: str, max_tokens: int = 300) -> tuple[str | None, str]:
    # Prefer Groq first for low-latency generation, then fallback to Gemini.
    groq_text = _call_groq_with_tokens(prompt, max_tokens)
    if groq_text:
        return groq_text, "groq"

    gemini_text = _call_gemini_with_tokens(prompt, max_tokens)
    if gemini_text:
        return gemini_text, "gemini"

    return None, "fallback"


def _fetch_market_context_from_wikipedia(company_name: str) -> str:
    encoded_name = quote(company_name)
    fallback_summary = ""

    try:
        with httpx.Client(timeout=8.0) as client:
            summary_resp = client.get(f"https://en.wikipedia.org/api/rest_v1/page/summary/{encoded_name}")
            if summary_resp.status_code == 200:
                summary_data = summary_resp.json()
                fallback_summary = summary_data.get("extract", "")
                if fallback_summary:
                    return fallback_summary

            search_resp = client.get(
                "https://en.wikipedia.org/w/api.php",
                params={
                    "action": "query",
                    "list": "search",
                    "srsearch": company_name,
                    "format": "json",
                    "srlimit": 1,
                },
            )
            if search_resp.status_code == 200:
                search_data = search_resp.json()
                results = search_data.get("query", {}).get("search", [])
                if results:
                    snippet = results[0].get("snippet", "")
                    return snippet.replace("<span class=\"searchmatch\">", "").replace("</span>", "")
    except Exception:
        return ""

    return fallback_summary


def _fallback_competitor_brief(competitor_name: str, niche: str, context: str) -> str:
    return (
        f"{competitor_name} operates in the {niche} niche with a strategy that balances awareness, authority, "
        "and conversion intent. The brand appears to prioritize discoverability through frequent publishing, "
        "especially in formats that algorithms currently favor, such as short-form video and educational carousel-style content. "
        "Their messaging usually combines a direct value proposition with proof signals, including concrete outcomes, customer examples, "
        "or recognizable references that increase trust quickly. This gives them an advantage in first-touch interactions because audiences "
        "can understand what they offer in seconds without needing additional context.\n\n"
        "From a channel perspective, their approach likely emphasizes consistency over sporadic spikes. Competitors in this niche that grow faster "
        "typically maintain a predictable content cadence, keep visual identity stable, and reinforce the same narrative pillars repeatedly. "
        "That repetition compounds memory and improves click-through and engagement over time. They also tend to structure content in funnel layers: "
        "top-of-funnel educational content to attract broad audiences, mid-funnel comparative or tactical posts to build consideration, and "
        "bottom-funnel offers that reduce friction to conversion.\n\n"
        "Their performance edge probably comes from three factors. First, sharper positioning: messages are framed around outcomes rather than features. "
        "Second, stronger execution speed: campaigns are launched quickly and iterated using early engagement signals. Third, tighter audience feedback loops: "
        "comments, saves, and click behavior are translated into new content themes every week. In many niches, this operational discipline outperforms "
        "creative quality alone.\n\n"
        f"Public market context indicates: {context[:400] if context else 'the category is competitive, with attention concentrated around credible, consistent educators and brands.'} "
        "To outperform this competitor, your strategy should focus on differentiated angles, higher publishing discipline, and stronger conversion architecture. "
        "Differentiation means choosing a clear stance or specialization that is easier to remember than a broad promise. Publishing discipline means shipping "
        "a weekly format mix with consistent CTAs and measurable goals for each post. Conversion architecture means every high-performing post should connect "
        "to a clear next step, such as lead capture, booking, trial, or offer page.\n\n"
        "In practical terms, winning this niche requires compounding trust faster than your competitor. Build a repeatable content engine, instrument each stage "
        "of the funnel, and aggressively iterate based on observed behavior. Over a 6- to 10-week cycle, this typically improves both engagement quality and "
        "commercial outcomes, even in saturated categories."
    )


def _build_counter_strategies(niche: str) -> list[dict]:
    return [
        {
            "strategy": f"Publish a niche authority series for {niche}",
            "reasoning": "A recurring educational series builds category ownership and improves repeat audience retention.",
            "priority": "high",
        },
        {
            "strategy": "Increase short-form distribution cadence to 4-5 posts/week",
            "reasoning": "Higher frequency improves algorithmic reach and creates more data for iterative optimization.",
            "priority": "high",
        },
        {
            "strategy": "Launch comparison content against common alternatives",
            "reasoning": "Mid-funnel comparison assets convert interest into consideration and reduce decision uncertainty.",
            "priority": "medium",
        },
        {
            "strategy": "Pair each top-performing post with a direct conversion CTA",
            "reasoning": "Connecting content engagement to a specific next action raises conversion efficiency.",
            "priority": "medium",
        },
        {
            "strategy": "Run weekly competitor-response experiments",
            "reasoning": "Fast reaction loops help neutralize competitor campaign momentum before it compounds.",
            "priority": "medium",
        },
    ]


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

    niche = str(competitor.platforms.get("niche", "general market")).strip() or "general market"
    market_context = _fetch_market_context_from_wikipedia(competitor.name)

    brief_prompt = (
        f"Write a detailed 500-word competitive brief for {competitor.name} in the {niche} niche. "
        "Explain market positioning, content strategy, growth motions, likely funnel structure, strengths, weaknesses, and tactical opportunities to beat them. "
        f"Use this market context when relevant: {market_context or 'No external context available.'}"
    )
    ai_brief, brief_model = _generate_ai_text_fast(brief_prompt, max_tokens=1100)
    detailed_brief = ai_brief or _fallback_competitor_brief(competitor.name, niche, market_context)

    if len(detailed_brief.split()) < 380:
        detailed_brief = (
            detailed_brief
            + "\n\n"
            + _fallback_competitor_brief(competitor.name, niche, market_context)
        )

    counter_strategies = _build_counter_strategies(niche)

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
        "why_winning": "They combine consistent publishing cadence, clear positioning, and stronger mid-funnel conversion content.",
        "counter_strategies": counter_strategies,
        "market_context_summary": market_context,
        "detailed_brief": detailed_brief,
        "brief_model_used": brief_model,
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
