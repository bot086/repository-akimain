"""
routes/admin.py — Protected admin endpoints.
Covers: project CRUD, local file upload (photos), YouTube URL (videos),
        portrait upload, stats update, contact update.

Authentication: simple Bearer token (the SECRET_KEY from .env).
"""
import os
import shutil
import uuid

from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    HTTPException,
    Security,
    UploadFile,
    status,
)
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from config import get_settings
from database import get_db
from models import ContactInfo, Media, Portrait, Project, Stats
from schemas import (
    ContactUpdate,
    MediaCreate,
    MediaOut,
    MediaUpdate,
    PortraitOut,
    ProjectCreate,
    ProjectOut,
    ProjectUpdate,
    StatsUpdate,
    UploadOut,
)

router = APIRouter(prefix="/admin", tags=["Admin"])
bearer = HTTPBearer()
settings = get_settings()

# ─────────────────────────────────────────────────────────────────────────────
# Upload directory — use /data/uploads on Render (persistent disk), else local
# ─────────────────────────────────────────────────────────────────────────────
UPLOAD_DIR = os.environ.get("UPLOAD_DIR", os.path.join(os.path.dirname(__file__), "..", "uploads"))
os.makedirs(UPLOAD_DIR, exist_ok=True)


# ─────────────────────────────────────────────────────────────────────────────
# Auth guard — checks Bearer token matches SECRET_KEY
# ─────────────────────────────────────────────────────────────────────────────
def require_admin(credentials: HTTPAuthorizationCredentials = Security(bearer)):
    if credentials.credentials != settings.secret_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid admin token",
        )
    return True


# ─────────────────────────────────────────────────────────────────────────────
# Token Verify — used by the frontend admin login to validate the secret key
# ─────────────────────────────────────────────────────────────────────────────
@router.get("/verify")
def verify_token(_: bool = Depends(require_admin)):
    return {"ok": True}


# ─────────────────────────────────────────────────────────────────────────────
# Projects
# ─────────────────────────────────────────────────────────────────────────────
@router.post("/projects", response_model=ProjectOut, status_code=201)
def create_project(
    body: ProjectCreate,
    db: Session = Depends(get_db),
    _: bool = Depends(require_admin),
):
    project = Project(**body.model_dump())
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


@router.put("/projects/{project_id}", response_model=ProjectOut)
def update_project(
    project_id: str,
    body: ProjectUpdate,
    db: Session = Depends(get_db),
    _: bool = Depends(require_admin),
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    for field, value in body.model_dump(exclude_none=True).items():
        setattr(project, field, value)
    db.commit()
    db.refresh(project)
    return project


@router.delete("/projects/{project_id}", status_code=204)
def delete_project(
    project_id: str,
    db: Session = Depends(get_db),
    _: bool = Depends(require_admin),
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    # Also delete associated local files
    for media in project.media:
        if media.media_type == "photo" and media.url.startswith("/uploads/"):
            file_path = os.path.join(UPLOAD_DIR, media.url.replace("/uploads/", ""))
            if os.path.exists(file_path):
                os.remove(file_path)
    db.delete(project)
    db.commit()


@router.delete("/media/{media_id}", status_code=204)
def delete_media(
    media_id: str,
    db: Session = Depends(get_db),
    _: bool = Depends(require_admin),
):
    media = db.query(Media).filter(Media.id == media_id).first()
    if not media:
        raise HTTPException(status_code=404, detail="Media not found")
    
    # Delete the file from disk if it's a local upload
    if media.media_type == "photo" and media.url.startswith("/uploads/"):
        file_path = os.path.join(UPLOAD_DIR, media.url.replace("/uploads/", ""))
        if os.path.exists(file_path):
            os.remove(file_path)
            
    db.delete(media)
    db.commit()


@router.put("/media/{media_id}", response_model=MediaOut)
def update_media(
    media_id: str,
    body: MediaUpdate,
    db: Session = Depends(get_db),
    _: bool = Depends(require_admin),
):
    media = db.query(Media).filter(Media.id == media_id).first()
    if not media:
        raise HTTPException(status_code=404, detail="Media not found")
    
    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(media, field, value)
        
    db.commit()
    db.refresh(media)
    return media


# ─────────────────────────────────────────────────────────────────────────────
# Photo Upload — saves file locally, no Cloudinary
# ─────────────────────────────────────────────────────────────────────────────
@router.post("/upload/photo", response_model=UploadOut, status_code=201)
async def upload_photo(
    project_id: str = Form(...),
    alt_text: str = Form(""),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    _: bool = Depends(require_admin),
):
    """Upload a photo. Saved to the local uploads directory, served as a static file."""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # Generate a unique filename preserving the original extension
    ext = os.path.splitext(file.filename or "photo.jpg")[1].lower() or ".jpg"
    filename = f"{uuid.uuid4().hex}{ext}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    url = f"/uploads/{filename}"

    media_record = Media(
        project_id=project_id,
        media_type="photo",
        url=url,
        thumbnail_url=url,
        alt_text=alt_text or None,
    )
    db.add(media_record)
    db.commit()

    return UploadOut(url=url, thumbnail_url=url, public_id=filename, resource_type="image")


# ─────────────────────────────────────────────────────────────────────────────
# YouTube Video — saves URL directly, no file upload
# ─────────────────────────────────────────────────────────────────────────────
@router.post("/upload/video", response_model=UploadOut, status_code=201)
def add_youtube_video(
    project_id: str = Form(...),
    youtube_url: str = Form(...),
    alt_text: str = Form(""),
    db: Session = Depends(get_db),
    _: bool = Depends(require_admin),
):
    """Add a YouTube video link to a project. No file upload needed."""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # Derive the YouTube video ID for the thumbnail
    video_id = None
    for pattern in ["v=", "youtu.be/", "embed/"]:
        if pattern in youtube_url:
            part = youtube_url.split(pattern)[-1]
            video_id = part.split("&")[0].split("?")[0]
            break

    thumbnail_url = f"https://img.youtube.com/vi/{video_id}/hqdefault.jpg" if video_id else None

    media_record = Media(
        project_id=project_id,
        media_type="video",
        url=youtube_url,
        thumbnail_url=thumbnail_url,
        alt_text=alt_text or None,
    )
    db.add(media_record)
    db.commit()

    return UploadOut(
        url=youtube_url,
        thumbnail_url=thumbnail_url,
        public_id=video_id or youtube_url,
        resource_type="video",
    )


# ─────────────────────────────────────────────────────────────────────────────
# Portrait Upload — for the Hero section (saved locally)
# ─────────────────────────────────────────────────────────────────────────────
@router.post("/portraits", response_model=PortraitOut, status_code=201)
async def upload_portrait(
    alt_text: str = Form(""),
    display_order: int = Form(0),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    _: bool = Depends(require_admin),
):
    """Upload a portrait photo for the Hero section."""
    ext = os.path.splitext(file.filename or "portrait.jpg")[1].lower() or ".jpg"
    filename = f"portrait_{uuid.uuid4().hex}{ext}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    url = f"/uploads/{filename}"
    portrait = Portrait(url=url, alt_text=alt_text or None, display_order=display_order)
    db.add(portrait)
    db.commit()
    db.refresh(portrait)
    return portrait


@router.delete("/portraits/{portrait_id}", status_code=204)
def delete_portrait(
    portrait_id: str,
    db: Session = Depends(get_db),
    _: bool = Depends(require_admin),
):
    portrait = db.query(Portrait).filter(Portrait.id == portrait_id).first()
    if not portrait:
        raise HTTPException(status_code=404, detail="Portrait not found")
    # Remove file from disk
    filename = portrait.url.lstrip("/uploads/")
    file_path = os.path.join(UPLOAD_DIR, filename)
    if os.path.exists(file_path):
        os.remove(file_path)
    db.delete(portrait)
    db.commit()


# ─────────────────────────────────────────────────────────────────────────────
# Stats Update
# ─────────────────────────────────────────────────────────────────────────────
@router.put("/stats")
def update_stats(
    body: StatsUpdate,
    db: Session = Depends(get_db),
    _: bool = Depends(require_admin),
):
    stats = db.query(Stats).filter(Stats.id == 1).first()
    if not stats:
        raise HTTPException(status_code=404, detail="Stats row missing. Run seed.py.")
    for field, value in body.model_dump(exclude_none=True).items():
        setattr(stats, field, value)
    db.commit()
    db.refresh(stats)
    return {"message": "Stats updated", "total_views": stats.total_views}


# ─────────────────────────────────────────────────────────────────────────────
# Contact Info Update
# ─────────────────────────────────────────────────────────────────────────────
@router.put("/contact")
def update_contact(
    body: ContactUpdate,
    db: Session = Depends(get_db),
    _: bool = Depends(require_admin),
):
    contact = db.query(ContactInfo).filter(ContactInfo.id == 1).first()
    if not contact:
        raise HTTPException(
            status_code=404, detail="Contact row missing. Run seed.py."
        )
    for field, value in body.model_dump(exclude_none=True).items():
        setattr(contact, field, value)
    db.commit()
    return {"message": "Contact info updated"}
