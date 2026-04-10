from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db import get_db
from app.dependencies import get_current_user
from app.models import User
from app.schemas import AIGenerateContentRequest, AIRegenerateRequest, AnalyzeRequest
from app.services import ai_generate_content, ai_regenerate_content, ai_history, generate_strategy, run_ai_analysis

router = APIRouter(prefix="/ai", tags=["ai"])


@router.post("/analyze")
def analyze(
    payload: AnalyzeRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return run_ai_analysis(db, user, payload)


@router.post("/generate-content")
def generate_content(
    payload: AIGenerateContentRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return ai_generate_content(db, user, payload)


@router.post("/regenerate")
def regenerate(
    payload: AIRegenerateRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return ai_regenerate_content(db, user, payload)


@router.post("/generate-strategy")
def generate_full_strategy(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return generate_strategy(db, user)


@router.get("/history")
def history(
    limit: int = Query(default=10, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return ai_history(db, user, limit, offset)
