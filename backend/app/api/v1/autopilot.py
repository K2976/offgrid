from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db import get_db
from app.dependencies import get_current_user
from app.models import User
from app.schemas import AutopilotSettingsRequest
from app.services import get_autopilot_history, get_autopilot_today, update_autopilot_settings

router = APIRouter(prefix="/autopilot", tags=["autopilot"])


@router.get("/today")
def today(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return get_autopilot_today(db, user)


@router.get("/history")
def history(
    days: int = Query(default=7, ge=1, le=30),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return get_autopilot_history(db, user, days)


@router.patch("/settings")
def patch_settings(
    payload: AutopilotSettingsRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return update_autopilot_settings(db, user, payload)
