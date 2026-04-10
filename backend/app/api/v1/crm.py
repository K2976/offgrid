from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session

from app.db import get_db
from app.dependencies import get_current_user
from app.models import User
from app.schemas import CRMGenerateMessageRequest
from app.services import crm_generate_message, crm_suggestions, crm_upload_csv

router = APIRouter(prefix="/crm", tags=["crm"])


@router.post("/upload")
async def upload_csv(
    file: UploadFile = File(...),
    user: User = Depends(get_current_user),
):
    content = await file.read()
    return crm_upload_csv(user, content.decode("utf-8", errors="ignore"))


@router.post("/generate-message")
def generate_message(
    payload: CRMGenerateMessageRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return crm_generate_message(db, user, payload)


@router.get("/suggestions")
def suggestions(user: User = Depends(get_current_user)):
    return crm_suggestions(user)
