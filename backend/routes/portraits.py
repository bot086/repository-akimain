"""
routes/portraits.py — Public endpoint to fetch hero portraits.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import Portrait
from schemas import PortraitOut

router = APIRouter(prefix="/portraits", tags=["Portraits"])


@router.get("", response_model=list[PortraitOut])
def list_portraits(db: Session = Depends(get_db)):
    """Return all portraits ordered by display_order."""
    return (
        db.query(Portrait)
        .order_by(Portrait.display_order, Portrait.created_at)
        .all()
    )
