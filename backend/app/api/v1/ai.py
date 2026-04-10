from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db import get_db
from app.dependencies import get_current_user
from app.models import User
from app.schemas import AnalyzeRequest
from app.services import ai_history, run_ai_analysis

router = APIRouter(prefix="/ai", tags=["ai"])


@router.post("/analyze")
def analyze(
    payload: AnalyzeRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return run_ai_analysis(db, user, payload)


@router.get("/history")
def history(
    limit: int = Query(default=10, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return ai_history(db, user, limit, offset)
