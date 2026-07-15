"""
main.py — FastAPI application entry point.
Mounts all routers, configures CORS, and creates DB tables on startup.
"""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import get_settings
from database import Base, engine
from routes import admin, contact, projects, stats

settings = get_settings()


# ─────────────────────────────────────────────────────────────────────────────
# Lifespan: create tables on startup (no Alembic needed for SQLite dev)
# ─────────────────────────────────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create all tables if they don't exist yet
    Base.metadata.create_all(bind=engine)
    yield
    # Shutdown logic (if needed) goes here


# ─────────────────────────────────────────────────────────────────────────────
# App instance
# ─────────────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="Akshay Vastrad — Filmmaker Portfolio API",
    description="Headless CMS backend serving projects, media, stats, and contact info.",
    version="1.0.0",
    docs_url="/docs",          # Swagger UI at /docs
    redoc_url="/redoc",        # ReDoc at /redoc
    lifespan=lifespan,
    redirect_slashes=False,    # Don't 307-redirect /stats → /stats/
)

# ─────────────────────────────────────────────────────────────────────────────
# CORS — allow the Next.js frontend (and localhost in dev)
# ─────────────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────────────────────────────────────────
# Routers
# ─────────────────────────────────────────────────────────────────────────────
API_PREFIX = "/api/v1"

app.include_router(projects.router, prefix=API_PREFIX)
app.include_router(stats.router, prefix=API_PREFIX)
app.include_router(contact.router, prefix=API_PREFIX)
app.include_router(admin.router, prefix=API_PREFIX)


# ─────────────────────────────────────────────────────────────────────────────
# Health check
# ─────────────────────────────────────────────────────────────────────────────
@app.get("/health", tags=["Health"])
def health():
    return {"status": "ok", "env": settings.app_env}


# ─────────────────────────────────────────────────────────────────────────────
# Run with: uvicorn main:app --reload
# ─────────────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
