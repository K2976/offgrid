from fastapi import APIRouter, Depends, Path
from sqlalchemy.orm import Session

from app.db import get_db
from app.dependencies import get_current_user
from app.models import User
from app.schemas import CampaignCreateRequest, CampaignUpdateRequest
from app.services import create_campaign, delete_campaign, get_campaign, list_campaigns, update_campaign

router = APIRouter(prefix="/campaigns", tags=["campaigns"])


@router.post("/create", status_code=201)
def create(
    payload: CampaignCreateRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return create_campaign(db, user, payload)


@router.get("")
def list_all(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return list_campaigns(db, user)


@router.get("/{campaign_id}")
def get_one(
    campaign_id: str = Path(min_length=3, max_length=64),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return get_campaign(db, user, campaign_id)


@router.put("/{campaign_id}")
def update_one(
    payload: CampaignUpdateRequest,
    campaign_id: str = Path(min_length=3, max_length=64),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return update_campaign(db, user, campaign_id, payload)


@router.delete("/{campaign_id}")
def delete_one(
    campaign_id: str = Path(min_length=3, max_length=64),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return delete_campaign(db, user, campaign_id)
