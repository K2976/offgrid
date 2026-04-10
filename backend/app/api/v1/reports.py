from datetime import datetime

from fastapi import APIRouter, Depends, Path, Query
from sqlalchemy.orm import Session

from app.db import get_db
from app.dependencies import get_current_user
from app.models import User
from app.schemas import ReportGenerateRequest
from app.services import generate_report, list_reports, report_by_id

router = APIRouter(prefix="/reports", tags=["reports"])


@router.get("")
def get_reports(
    limit: int = Query(default=10, ge=1, le=100),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return list_reports(db, user, limit)


@router.get("/{report_id}")
def get_report(
    report_id: str = Path(min_length=3, max_length=64),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return report_by_id(db, user, report_id)


@router.get("/{report_id}/download")
def download_report(
    report_id: str = Path(min_length=3, max_length=64),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    report = report_by_id(db, user, report_id)
    report["download_url"] = f"/files/reports/{report_id}.pdf"
    return report


@router.post("/generate", status_code=201)
def generate(
    payload: ReportGenerateRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return generate_report(db, user, payload)
