"""
routes/admin.py — Protected admin endpoints.
Covers: project CRUD, media upload (Cloudinary), stats update, contact update.

Authentication: simple Bearer token (the SECRET_KEY from .env).
In production, replace with proper JWT/OAuth.
"""
import cloudinary
import cloudinary.uploader
from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    Security,
    UploadFile,
    status,
)
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from config import get_settings
from database import get_db
from models import ContactInfo, Media, Project, Stats
from schemas import (
    ContactUpdate,
    MediaCreate,
    MediaOut,
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
    db.delete(project)
    db.commit()


# ─────────────────────────────────────────────────────────────────────────────
# Media Upload (Cloudinary)
# ─────────────────────────────────────────────────────────────────────────────
def _configure_cloudinary():
    cloudinary.config(
        cloud_name=settings.cloudinary_cloud_name,
        api_key=settings.cloudinary_api_key,
        api_secret=settings.cloudinary_api_secret,
        secure=True,
    )


@router.post("/upload", response_model=UploadOut, status_code=201)
async def upload_media(
    project_id: str,
    media_type: str = "photo",
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    _: bool = Depends(require_admin),
):
    """
    Upload a photo or video to Cloudinary and create a Media record.
    Automatically generates a thumbnail for videos.
    """
    _configure_cloudinary()

    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    resource_type = "video" if media_type == "video" else "image"
    contents = await file.read()

    result = cloudinary.uploader.upload(
        contents,
        folder=f"akkira/{project_id}",
        resource_type=resource_type,
        eager=[{"width": 600, "crop": "scale"}] if media_type == "video" else [],
    )

    url = result["secure_url"]
    thumb_url = (
        result["eager"][0]["secure_url"]
        if media_type == "video" and result.get("eager")
        else result.get("secure_url")
    )

    media_record = Media(
        project_id=project_id,
        media_type=media_type,
        url=url,
        thumbnail_url=thumb_url,
    )
    db.add(media_record)
    db.commit()

    return UploadOut(
        url=url,
        thumbnail_url=thumb_url,
        public_id=result["public_id"],
        resource_type=resource_type,
    )


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
