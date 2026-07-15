"""
routes/stats.py — Endpoint for the loading screen statistics.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Stats
from schemas import StatsOut

router = APIRouter(prefix="/stats", tags=["Stats"])


@router.get("", response_model=StatsOut)
def get_stats(db: Session = Depends(get_db)):
    """
    Returns the big numbers (views, subscribers, likes) that the
    loading screen animation counts up to.
    There is always exactly one row (id=1). The seed script creates it.
    """
    stats = db.query(Stats).filter(Stats.id == 1).first()
    if not stats:
        raise HTTPException(
            status_code=503,
            detail="Stats not seeded yet. Run seed.py first.",
        )
    return stats
