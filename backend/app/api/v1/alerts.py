from fastapi import APIRouter, Depends, Path, Query
from sqlalchemy.orm import Session

from app.db import get_db
from app.dependencies import get_current_user
from app.models import User
from app.schemas import AlertRuleCreateRequest
from app.services import create_alert_rule, list_alert_rules, list_alerts, mark_alert_read

router = APIRouter(prefix="/alerts", tags=["alerts"])


@router.get("")
def get_alerts(
    status: str = Query(default="all", pattern="^(unread|read|all)$"),
    severity: str | None = Query(default=None, pattern="^(critical|high|medium|low)$"),
    limit: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return list_alerts(db, user, status, severity, limit)


@router.patch("/{alert_id}/read")
def read_alert(
    alert_id: str = Path(min_length=3, max_length=64),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return mark_alert_read(db, user, alert_id)


@router.post("/rules", status_code=201)
def create_rule(
    payload: AlertRuleCreateRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return create_alert_rule(db, user, payload)


@router.get("/rules")
def get_rules(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return list_alert_rules(db, user)
