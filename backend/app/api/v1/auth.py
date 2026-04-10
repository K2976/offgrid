from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db import get_db
from app.schemas import LoginRequest, RefreshRequest, RegisterRequest
from app.services import login_user, refresh_access_token, register_user

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", status_code=201)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    return register_user(db, payload)


@router.post("/login")
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    return login_user(db, payload)


@router.post("/refresh")
def refresh(payload: RefreshRequest, db: Session = Depends(get_db)):
    return refresh_access_token(db, payload.refresh_token)
