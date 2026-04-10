from fastapi import APIRouter, Depends, Path
from sqlalchemy.orm import Session

from app.db import get_db
from app.dependencies import get_current_user
from app.models import User
from app.schemas import CompetitorCreateRequest
from app.services import competitor_analysis, create_competitor, delete_competitor, list_competitors

router = APIRouter(prefix="/competitors", tags=["competitors"])


@router.get("")
def get_competitors(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return list_competitors(db, user)


@router.post("", status_code=201)
def add_competitor(
    payload: CompetitorCreateRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return create_competitor(db, user, payload)


@router.delete("/{competitor_id}")
def remove_competitor(
    competitor_id: str = Path(min_length=3, max_length=64),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return delete_competitor(db, user, competitor_id)


@router.get("/{competitor_id}/analysis")
def analyze_competitor(
    competitor_id: str = Path(min_length=3, max_length=64),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return competitor_analysis(db, user, competitor_id)
