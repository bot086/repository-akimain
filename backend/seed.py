"""
seed.py — Populate the database with initial data.
Run once: python seed.py

Creates:
  - Stats row (10M views, 5M subs, 8M likes)
  - ContactInfo row (Akshay's real WhatsApp, placeholder email/instagram)
  - 3 sample projects with photo/video media placeholders
"""
from database import SessionLocal, Base, engine
from models import Stats, ContactInfo, Project, Media

Base.metadata.create_all(bind=engine)
db = SessionLocal()


def seed_stats():
    existing = db.query(Stats).filter(Stats.id == 1).first()
    if existing:
        print("✅  Stats already seeded — skipping.")
        return
    stats = Stats(
        id=1,
        total_views=10_000_000,
        total_subscribers=5_000_000,
        total_likes=8_000_000,
    )
    db.add(stats)
    db.commit()
    print("🌱  Stats seeded: 10M views · 5M subs · 8M likes")


def seed_contact():
    existing = db.query(ContactInfo).filter(ContactInfo.id == 1).first()
    if existing:
        print("✅  Contact info already seeded — skipping.")
        return
    contact = ContactInfo(
        id=1,
        # ─── UPDATE THESE before going live ───────────────────────────────
        whatsapp_number="918660976964",          # Akshay's number ✅
        whatsapp_greeting="Hi+Akshay%2C+I+saw+your+portfolio+and+would+love+to+collaborate%21",
        email="akshay@youremail.com",            # ← fill in
        instagram_handle="@akshay.vastrad",      # ← fill in
        # ──────────────────────────────────────────────────────────────────
    )
    db.add(contact)
    db.commit()
    print("🌱  Contact info seeded.")


def seed_projects():
    if db.query(Project).count() > 0:
        print("✅  Projects already seeded — skipping.")
        return

    # ── Project 1 ────────────────────────────────────────────────────────────
    p1 = Project(
        title="Fragments of Light",
        description="A short film exploring solitude through the lens of urban architecture.",
        client_name="Independent",
        is_featured=True,
        display_order=1,
    )
    db.add(p1)
    db.flush()

    db.add_all([
        Media(
            project_id=p1.id, media_type="video",
            url="https://res.cloudinary.com/demo/video/upload/dog.mp4",
            thumbnail_url="https://res.cloudinary.com/demo/video/upload/dog.jpg",
            alt_text="Fragments of Light — main film",
            display_order=1,
        ),
        Media(
            project_id=p1.id, media_type="photo",
            url="https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=1200",
            thumbnail_url="https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=600",
            alt_text="Behind the scenes still",
            display_order=2,
        ),
    ])

    # ── Project 2 ────────────────────────────────────────────────────────────
    p2 = Project(
        title="Golden Hour Sessions",
        description="Portrait photography series shot during the golden hour across Bengaluru.",
        client_name="Self",
        is_featured=True,
        display_order=2,
    )
    db.add(p2)
    db.flush()

    db.add_all([
        Media(
            project_id=p2.id, media_type="photo",
            url="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1200",
            thumbnail_url="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600",
            alt_text="Portrait — golden hour",
            display_order=1,
        ),
        Media(
            project_id=p2.id, media_type="photo",
            url="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1200",
            thumbnail_url="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600",
            alt_text="Portrait — silhouette",
            display_order=2,
        ),
    ])

    # ── Project 3 ────────────────────────────────────────────────────────────
    p3 = Project(
        title="Neon Drift",
        description="Cinematic reel shot at night — neon lights, rain, and motion.",
        client_name="Brand Campaign",
        is_featured=False,
        display_order=3,
    )
    db.add(p3)
    db.flush()

    db.add(
        Media(
            project_id=p3.id, media_type="video",
            url="https://res.cloudinary.com/demo/video/upload/cld-sample.mp4",
            thumbnail_url="https://res.cloudinary.com/demo/image/upload/cld-sample.jpg",
            alt_text="Neon Drift — campaign reel",
            display_order=1,
        )
    )

    db.commit()
    print("🌱  3 sample projects seeded with placeholder media.")


if __name__ == "__main__":
    print("\n── Seeding Akshay Vastrad Portfolio DB ──\n")
    seed_stats()
    seed_contact()
    seed_projects()
    db.close()
    print("\n✨  Done. Run: uvicorn main:app --reload\n")
