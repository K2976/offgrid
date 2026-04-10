from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db import get_db
from app.dependencies import get_current_user
from app.models import User
from app.schemas import (
    OnboardingBusinessInfoRequest,
    OnboardingMarketingPreferencesRequest,
    OnboardingStartRequest,
)
from app.services import (
    onboarding_business_info,
    onboarding_complete,
    onboarding_marketing_preferences,
    onboarding_start,
    onboarding_status,
)

router = APIRouter(prefix="/onboarding", tags=["onboarding"])


@router.post("/start")
def start(
    payload: OnboardingStartRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return onboarding_start(db, user, payload)


@router.post("/business-info")
def business_info(
    payload: OnboardingBusinessInfoRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return onboarding_business_info(db, user, payload)


@router.post("/marketing-preferences")
def marketing_preferences(
    payload: OnboardingMarketingPreferencesRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return onboarding_marketing_preferences(db, user, payload)


@router.get("/status")
def status(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return onboarding_status(db, user)


@router.post("/complete")
def complete(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return onboarding_complete(db, user)
