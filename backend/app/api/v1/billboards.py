from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db import get_db
from app.dependencies import get_current_user
from app.models import User
from app.schemas import BillboardRecommendRequest
from app.services import billboards_nearby, recommend_billboards

router = APIRouter(prefix="/billboards", tags=["billboards"])


@router.get("/nearby")
def nearby(
    lat: float = Query(..., ge=-90, le=90),
    lng: float = Query(..., ge=-180, le=180),
    radius_meters: int = Query(default=3000, ge=500, le=15000),
    user: User = Depends(get_current_user),
):
    _ = user
    return billboards_nearby(lat, lng, radius_meters)


@router.post("/recommend")
def recommend(
    payload: BillboardRecommendRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return recommend_billboards(db, user, payload)
