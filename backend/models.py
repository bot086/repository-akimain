"""
models.py — SQLAlchemy ORM models (SQLAlchemy 2.0 Mapped[] style).
Tables: Project, Media, Portrait, Stats, ContactInfo
"""
import uuid
from datetime import date, datetime
from enum import Enum as PyEnum
from typing import List, Optional

from sqlalchemy import (
    BigInteger,
    Boolean,
    Date,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base


def _uuid() -> str:
    return str(uuid.uuid4())


# ─────────────────────────────────────────────────────────────────────────────
# Enum: media type
# ─────────────────────────────────────────────────────────────────────────────
class MediaType(str, PyEnum):
    video = "video"
    photo = "photo"


# ─────────────────────────────────────────────────────────────────────────────
# Project — a creative work (film, short, reel, campaign…)
# ─────────────────────────────────────────────────────────────────────────────
class Project(Base):
    __tablename__ = "projects"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=_uuid)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    client_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    release_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    display_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # One project → many media items
    media: Mapped[List["Media"]] = relationship(
        "Media",
        back_populates="project",
        cascade="all, delete-orphan",
        order_by="Media.display_order",
    )


# ─────────────────────────────────────────────────────────────────────────────
# Media — a single photo or video asset tied to a project
# ─────────────────────────────────────────────────────────────────────────────
class Media(Base):
    __tablename__ = "media"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=_uuid)
    project_id: Mapped[str] = mapped_column(
        String, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False
    )
    media_type: Mapped[MediaType] = mapped_column(
        Enum(MediaType), nullable=False, default=MediaType.photo
    )

    # URL: local path for photos (e.g. /uploads/filename.jpg), YouTube URL for videos
    url: Mapped[str] = mapped_column(String(2048), nullable=False)
    thumbnail_url: Mapped[Optional[str]] = mapped_column(String(2048), nullable=True)
    alt_text: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
    display_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    project: Mapped["Project"] = relationship("Project", back_populates="media")


# ─────────────────────────────────────────────────────────────────────────────
# Portrait — hero section portrait photos (uploaded separately)
# ─────────────────────────────────────────────────────────────────────────────
class Portrait(Base):
    __tablename__ = "portraits"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=_uuid)
    url: Mapped[str] = mapped_column(String(2048), nullable=False)
    alt_text: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
    display_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


# ─────────────────────────────────────────────────────────────────────────────
# Stats — the big numbers shown on the loading screen.
# Only ever 1 row (id=1). Use the admin endpoint to update.
# ─────────────────────────────────────────────────────────────────────────────
class Stats(Base):
    __tablename__ = "stats"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, default=1)
    total_views: Mapped[int] = mapped_column(BigInteger, default=10_000_000, nullable=False)
    total_subscribers: Mapped[int] = mapped_column(BigInteger, default=5_000_000, nullable=False)
    total_likes: Mapped[int] = mapped_column(BigInteger, default=8_000_000, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )


# ─────────────────────────────────────────────────────────────────────────────
# ContactInfo — served to the frontend for the contact section.
# Only ever 1 row. Edit via /admin/contact endpoint.
# ─────────────────────────────────────────────────────────────────────────────
class ContactInfo(Base):
    __tablename__ = "contact_info"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, default=1)
    # WhatsApp number in international format, no +, no spaces (e.g. 918660976964)
    whatsapp_number: Mapped[str] = mapped_column(String(20), nullable=False)
    whatsapp_greeting: Mapped[str] = mapped_column(
        String(512),
        default="Hi+Akshay%2C+I+saw+your+portfolio+and+would+love+to+collaborate%21",
    )
    email: Mapped[str] = mapped_column(String(255), nullable=False)
    instagram_handle: Mapped[str] = mapped_column(String(100), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    @property
    def whatsapp_url(self) -> str:
        """Returns the deep link that opens directly into Akshay's WhatsApp chat."""
        return f"https://wa.me/{self.whatsapp_number}?text={self.whatsapp_greeting}"

    @property
    def instagram_url(self) -> str:
        handle = self.instagram_handle.lstrip("@")
        return f"https://instagram.com/{handle}"
