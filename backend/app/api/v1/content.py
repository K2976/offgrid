from fastapi import APIRouter, Depends, Path, Query
from sqlalchemy.orm import Session

from app.db import get_db
from app.dependencies import get_current_user
from app.models import User
from app.schemas import ContentFeedbackRequest, ContentGenerateRequest
from app.services import content_feedback, content_history, generate_content

router = APIRouter(prefix="/content", tags=["content"])


@router.post("/generate")
def generate(
    payload: ContentGenerateRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return generate_content(db, user, payload)


@router.get("/history")
def history(
    platform: str | None = Query(default=None, pattern="^(instagram|linkedin)$"),
    limit: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return content_history(db, user, platform, limit)


@router.post("/{content_id}/feedback")
def feedback(
    payload: ContentFeedbackRequest,
    content_id: str = Path(min_length=3, max_length=64),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return content_feedback(db, user, content_id, payload)
