from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db import get_db
from app.dependencies import get_current_user
from app.models import User
from app.schemas import ConversionTrackRequest
from app.services import track_conversion

router = APIRouter(prefix="/conversion", tags=["conversion"])


@router.post("/track")
def track(
    payload: ConversionTrackRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    _ = user
    return track_conversion(db, payload)
