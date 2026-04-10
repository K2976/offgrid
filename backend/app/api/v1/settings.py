from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db import get_db
from app.dependencies import get_current_user
from app.models import User
from app.schemas import OnboardingProfileRequest, WebsiteUrlRequest
from app.services import get_workspace_settings, update_user_website_url, upsert_onboarding_profile

router = APIRouter(prefix="/settings", tags=["settings"])


@router.get("/workspace")
def workspace_settings(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return get_workspace_settings(db, user)


@router.patch("/onboarding")
def onboarding_profile_update(
    payload: OnboardingProfileRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return upsert_onboarding_profile(db, user, payload)


@router.patch("/website-url")
def update_website_url(
    payload: WebsiteUrlRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return update_user_website_url(db, user, payload.website_url)
