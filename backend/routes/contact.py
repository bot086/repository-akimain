"""
routes/contact.py — Public endpoint for contact information.
The frontend reads this to build the WhatsApp link, email, and Instagram handle.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import ContactInfo
from schemas import ContactOut

router = APIRouter(prefix="/contact", tags=["Contact"])


@router.get("", response_model=ContactOut)
def get_contact(db: Session = Depends(get_db)):
    """
    Returns the contact details including:
    - whatsapp_url: ready-to-use wa.me deep link (opens Akshay's chat directly)
    - email: copy-able email address
    - instagram_handle + instagram_url: profile link
    """
    contact = db.query(ContactInfo).filter(ContactInfo.id == 1).first()
    if not contact:
        raise HTTPException(
            status_code=503,
            detail="Contact info not seeded yet. Run seed.py first.",
        )
    return ContactOut(
        whatsapp_number=contact.whatsapp_number,
        whatsapp_url=contact.whatsapp_url,
        email=contact.email,
        instagram_handle=contact.instagram_handle,
        instagram_url=contact.instagram_url,
    )
