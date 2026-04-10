from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db import get_db
from app.dependencies import get_current_user
from app.models import User
from app.schemas import FreelancerApplyRequest, FreelancerAssignRequest
from app.services import (
    freelancer_apply,
    freelancer_assign,
    freelancers_leaderboard,
    freelancers_list,
)

router = APIRouter(prefix="/freelancers", tags=["freelancers"])


@router.get("")
def list_all(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    _ = user
    return freelancers_list(db)


@router.post("/apply")
def apply(
    payload: FreelancerApplyRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return freelancer_apply(db, user, payload)


@router.post("/assign")
def assign(
    payload: FreelancerAssignRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return freelancer_assign(db, user, payload)


@router.get("/leaderboard")
def leaderboard(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    _ = user
    return freelancers_leaderboard(db)
