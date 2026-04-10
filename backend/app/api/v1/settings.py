from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db import get_db
from app.dependencies import get_current_user
from app.models import User
from app.schemas import OnboardingProfileRequest
from app.services import get_workspace_settings, upsert_onboarding_profile

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
