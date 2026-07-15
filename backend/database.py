"""
database.py — SQLAlchemy engine, session factory, and Base model.
Supports both SQLite (dev) and PostgreSQL (production).
"""
from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from config import get_settings

settings = get_settings()

# SQLite needs check_same_thread=False; Postgres does not need this arg
connect_args = (
    {"check_same_thread": False}
    if settings.database_url.startswith("sqlite")
    else {}
)

engine = create_engine(
    settings.database_url,
    connect_args=connect_args,
    echo=(settings.app_env == "development"),
)

# Enable WAL mode for SQLite for better concurrent reads
if settings.database_url.startswith("sqlite"):
    @event.listens_for(engine, "connect")
    def set_sqlite_pragma(dbapi_conn, _):
        cursor = dbapi_conn.cursor()
        cursor.execute("PRAGMA journal_mode=WAL")
        cursor.close()

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


# FastAPI dependency — yields a DB session and always closes it
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
