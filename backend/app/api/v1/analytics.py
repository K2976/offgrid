from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db import get_db
from app.dependencies import get_current_user
from app.models import User
from app.schemas import WebsiteAuditRequest
from app.services import (
    analytics_overview,
    analytics_seo,
    analytics_social,
    analytics_website,
    analytics_website_audit,
)

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/overview")
def get_overview(
    period: str = Query(default="7d", pattern="^(7d|30d|90d)$"),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return analytics_overview(db, user, period)


@router.get("/social")
def get_social(
    platform: str = Query(default="instagram", pattern="^(instagram|linkedin)$"),
    period: str = Query(default="30d", pattern="^(7d|30d|90d)$"),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return analytics_social(db, user, platform, period)


@router.get("/website")
def get_website(
    period: str = Query(default="30d", pattern="^(7d|30d|90d)$"),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return analytics_website(db, user, period)


@router.post("/website-audit")
def get_website_audit(
    payload: WebsiteAuditRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return analytics_website_audit(db, user, str(payload.url), payload.strategy)


@router.get("/seo")
def get_seo(
    period: str = Query(default="30d", pattern="^(7d|30d|90d)$"),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return analytics_seo(db, user, period)
