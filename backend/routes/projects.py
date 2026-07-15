"""
routes/projects.py — Endpoints for Projects and Media.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from models import Project, Media
from schemas import ProjectOut, ProjectListOut, ProjectCreate, ProjectUpdate

router = APIRouter(prefix="/projects", tags=["Projects"])


@router.get("", response_model=list[ProjectListOut])
def list_projects(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    """Return all projects ordered by display_order, paginated."""
    return (
        db.query(Project)
        .order_by(Project.display_order, Project.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


@router.get("/featured", response_model=list[ProjectOut])
def get_featured(db: Session = Depends(get_db)):
    """Return only featured projects, each with their full media list.
    Used for the hero/dark-room gallery on the home page.
    """
    return (
        db.query(Project)
        .filter(Project.is_featured == True)
        .order_by(Project.display_order)
        .all()
    )


@router.get("/{project_id}", response_model=ProjectOut)
def get_project(project_id: str, db: Session = Depends(get_db)):
    """Return a single project with all its media."""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project
