from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db import get_db
from app.dependencies import get_current_user
from app.models import User
from app.services import get_workspace_settings

router = APIRouter(prefix="/settings", tags=["settings"])


@router.get("/workspace")
def workspace_settings(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return get_workspace_settings(db, user)
