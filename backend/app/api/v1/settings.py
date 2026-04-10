from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db import get_db
from app.dependencies import get_current_user
from app.models import User
from app.schemas import OnboardingProfileRequest, SettingsUpdateRequest
from app.services import get_settings, get_workspace_settings, update_settings, upsert_onboarding_profile

router = APIRouter(prefix="/settings", tags=["settings"])


@router.get("")
def get_all_settings(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return get_settings(db, user)


@router.put("/update")
def put_settings_update(
    payload: SettingsUpdateRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return update_settings(db, user, payload)


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
