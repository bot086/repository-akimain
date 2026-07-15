# Akshay Vastrad — Filmmaker Portfolio 🎬

A cinematic, **Golden Look** filmmaker portfolio with a Python/FastAPI backend and a Next.js/TypeScript/Tailwind frontend.

---

## Project Structure

```
akkira_filmmaker/
├── backend/               ← Python FastAPI API
│   ├── main.py            ← App entry, CORS, routers
│   ├── models.py          ← SQLAlchemy DB models
│   ├── schemas.py         ← Pydantic schemas
│   ├── config.py          ← Settings (pydantic-settings)
│   ├── database.py        ← DB engine & session
│   ├── seed.py            ← Seed script (run once)
│   ├── routes/
│   │   ├── projects.py    ← GET /projects, /featured
│   │   ├── stats.py       ← GET /stats
│   │   ├── contact.py     ← GET /contact
│   │   └── admin.py       ← Protected CRUD + upload
│   ├── requirements.txt
│   ├── .env.example       ← Copy to .env and fill in
│   └── Procfile           ← Railway deployment
│
└── frontend/              ← Next.js 14 + TypeScript + Tailwind
    ├── app/
    │   ├── layout.tsx
    │   └── page.tsx       ← Server component, parallel fetches
    ├── components/
    │   ├── HomeClient.tsx  ← Client shell, orchestrates sections
    │   ├── LoadingScreen.tsx ← Counter animation + hearts
    │   ├── HeroSection.tsx
    │   ├── DarkRoom.tsx    ← Torch cursor interactive gallery
    │   ├── TheaterMode.tsx ← Full-screen video/photo viewer
    │   ├── ProjectList.tsx ← Editorial accordion
    │   └── ContactSection.tsx ← WhatsApp + long-press copy
    ├── lib/api.ts          ← Type-safe API client
    ├── hooks/useLongPress.ts
    ├── tailwind.config.js  ← Golden Look design tokens
    └── vercel.json
```

---

## 🚀 Running Locally

### Backend

```bash
cd backend

# 1. Create virtual environment
python3 -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Set up env
cp .env.example .env
# Edit .env — fill in your details

# 4. Seed the database (run once)
python seed.py

# 5. Start the server
uvicorn main:app --reload
# → API running at http://localhost:8000
# → Swagger docs at http://localhost:8000/docs
```

### Frontend

> ⚠️ **Node.js required.** Install from https://nodejs.org (LTS version)

```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Set env variable
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# 3. Start dev server
npm run dev
# → http://localhost:3000
```

---

## 📋 Things to Fill In

| File | What to update |
|---|---|
| `backend/.env` | Email, Instagram, Cloudinary keys |
| `frontend/vercel.json` | Your Railway backend URL |
| `backend/seed.py` | Akshay's real email + Instagram |

---

## ☁️ Deployment

### Backend → Railway (free)
1. Push `backend/` to a GitHub repo
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Add env variables from `.env` to Railway dashboard
4. Railway auto-reads the `Procfile` and deploys

### Frontend → Vercel (free)
1. Push `frontend/` to a GitHub repo (or same repo)
2. Go to [vercel.com](https://vercel.com) → Import Project
3. Set `NEXT_PUBLIC_API_URL` = your Railway URL in Vercel env vars
4. Deploy — done ✅

### Media → Cloudinary (free tier)
1. Sign up at [cloudinary.com](https://cloudinary.com) — free, no credit card
2. Add `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` to `.env`
3. Use `POST /api/v1/admin/upload` with your `SECRET_KEY` as Bearer token to upload media

---

## 🔐 Admin API

All admin endpoints require:
```
Authorization: Bearer <SECRET_KEY from .env>
```

Key endpoints:
- `POST /api/v1/admin/projects` — add a project
- `POST /api/v1/admin/upload?project_id=<id>&media_type=video` — upload to Cloudinary
- `PUT /api/v1/admin/stats` — update view/sub/like counts
- `PUT /api/v1/admin/contact` — update email/instagram

Full interactive docs: `http://localhost:8000/docs`
