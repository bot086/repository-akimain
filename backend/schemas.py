"""
schemas.py — Pydantic v2 request/response models.
These are what the API actually sends and receives as JSON.
"""
from datetime import date, datetime
from typing import Optional
from enum import Enum

from pydantic import BaseModel


# ─────────────────────────────────────────────────────────────────────────────
# Enums
# ─────────────────────────────────────────────────────────────────────────────
class MediaTypeEnum(str, Enum):
    video = "video"
    photo = "photo"


# ─────────────────────────────────────────────────────────────────────────────
# Media Schemas
# ─────────────────────────────────────────────────────────────────────────────
class MediaBase(BaseModel):
    media_type: MediaTypeEnum
    url: str
    thumbnail_url: Optional[str] = None
    alt_text: Optional[str] = None
    display_order: int = 0


class MediaCreate(MediaBase):
    project_id: str


class MediaUpdate(BaseModel):
    alt_text: Optional[str] = None
    display_order: Optional[int] = None


class MediaOut(MediaBase):
    id: str
    project_id: str
    created_at: datetime

    model_config = {"from_attributes": True}


# ─────────────────────────────────────────────────────────────────────────────
# Portrait Schemas
# ─────────────────────────────────────────────────────────────────────────────
class PortraitOut(BaseModel):
    id: str
    url: str
    alt_text: Optional[str] = None
    display_order: int = 0
    created_at: datetime

    model_config = {"from_attributes": True}


# ─────────────────────────────────────────────────────────────────────────────
# Project Schemas
# ─────────────────────────────────────────────────────────────────────────────
class ProjectBase(BaseModel):
    title: str
    description: Optional[str] = None
    client_name: Optional[str] = None
    release_date: Optional[date] = None
    is_featured: bool = False
    display_order: int = 0


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    client_name: Optional[str] = None
    release_date: Optional[date] = None
    is_featured: Optional[bool] = None
    display_order: Optional[int] = None


class ProjectOut(ProjectBase):
    id: str
    media: list[MediaOut] = []
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ProjectListOut(ProjectBase):
    """Lightweight version for list views — no nested media."""
    id: str
    created_at: datetime

    model_config = {"from_attributes": True}


# ─────────────────────────────────────────────────────────────────────────────
# Stats Schemas
# ─────────────────────────────────────────────────────────────────────────────
class StatsOut(BaseModel):
    total_views: int
    total_subscribers: int
    total_likes: int
    updated_at: datetime

    model_config = {"from_attributes": True}


class StatsUpdate(BaseModel):
    total_views: Optional[int] = None
    total_subscribers: Optional[int] = None
    total_likes: Optional[int] = None


# ─────────────────────────────────────────────────────────────────────────────
# Contact Schemas
# ─────────────────────────────────────────────────────────────────────────────
class ContactOut(BaseModel):
    """
    What the frontend receives.
    whatsapp_url is the ready-to-use wa.me deep link.
    """
    whatsapp_number: str
    whatsapp_url: str          # computed by model property
    email: str
    instagram_handle: str
    instagram_url: str         # computed by model property

    model_config = {"from_attributes": True}


class ContactUpdate(BaseModel):
    whatsapp_number: Optional[str] = None
    whatsapp_greeting: Optional[str] = None
    email: Optional[str] = None
    instagram_handle: Optional[str] = None


# ─────────────────────────────────────────────────────────────────────────────
# Upload Response
# ─────────────────────────────────────────────────────────────────────────────
class UploadOut(BaseModel):
    url: str
    thumbnail_url: Optional[str]
    public_id: str
    resource_type: str
