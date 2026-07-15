# Akshay Vastrad - Filmmaker Portfolio Planning

## Project Overview
This project is a high-end, aesthetic filmmaker portfolio for **Akshay Vastrad**. The website will showcase a series of videos and photographs with a luxurious, cinematic **"Golden Look"** format. 

## Tech Stack
- **Backend**: Python (FastAPI recommended for performance and async capabilities)
- **Frontend**: TypeScript, React (Next.js or Vite), and Tailwind CSS
- **Database**: PostgreSQL (or SQLite for initial development)
- **ORM**: SQLAlchemy / SQLModel

---

## 1. Frontend & Design Requirements

### Theme: "The Golden Look"
- **Color Palette**: Deep blacks, charcoal grays, and rich golden accents (#D4AF37, #FFDF00, #DAA520).
- **Typography**: Elegant serif fonts for headings (e.g., Playfair Display or Cinzel) and clean sans-serif for body text (e.g., Inter or Montserrat).
- **Vibe**: Premium, cinematic, and immersive. 

### The Loading Screen (Hook)
Before the main site loads, an engaging, number-counting animation will hook the user:
- **Viewer Count**: Rapidly counting from `1` up to `10,000,000` (10M+).
- **Subscriber Count**: Counting from `12,000` up to `5,000,000` (5M+).
- **Likes (Instagram Hearts)**: A flurry of golden and red hearts floating up while a counter shoots up into the millions.
- *Once counters hit the max, they explode into a golden flash, revealing the hero section of the portfolio.*

### Display Options for Videos & Photographs
*Here are the best options for displaying the visual work. You can choose one or combine them!*

#### Option A: The "Cinematic Film Strip" (Horizontal Scroll)
- A side-scrolling section that mimics a physical film strip.
- Perfect for a filmmaker. As the user scrolls down, the page translates it to horizontal movement, showing videos and photos side-by-side.

#### Option B: The "Masonry Grid with Hover-Play"
- A staggered, Pinterest-style grid. 
- Photos display in high resolution with a subtle golden hover state.
- Video thumbnails silently auto-play when hovered over. Clicking them opens a full-screen, distraction-free theater mode.

#### Option C: "Editorial Spotlight" (Parallax Scroll)
- As the user scrolls, one massive project takes up the entire screen.
- Smooth parallax effects make the images feel deep and 3D. 
- Text fades in with a golden glow. Best for highlighting a few, very high-quality flagship projects.

#### Option D: "The Dark Room" (Interactive Gallery)
- The screen goes completely dark. 
- The user moves their mouse like a flashlight to reveal high-quality photographs and video snippets hidden in the dark, before clicking to expand them.

---

## 2. Backend Architecture Plan (Python)

To the AI (Claude) building this backend: The backend should serve as a headless CMS that provides media data, statistics, and project details to the TypeScript frontend.

### A. Core Tools
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy
- **Storage**: AWS S3 / Cloudinary (for hosting high-res videos and photos)

### B. Database Schema (Models)
1. **Project Model**
   - `id`: UUID
   - `title`: String
   - `description`: Text
   - `client_name`: String (Optional)
   - `release_date`: Date
   - `is_featured`: Boolean

2. **Media Model** (Photos & Videos)
   - `id`: UUID
   - `project_id`: UUID (Foreign Key)
   - `media_type`: Enum ('video', 'photo')
   - `url`: String (S3/Cloudinary Link)
   - `thumbnail_url`: String
   - `display_order`: Integer

3. **Stats Model** (For the loading screen or footer)
   - `id`: Integer
   - `total_views`: BigInteger
   - `total_subscribers`: BigInteger
   - `total_likes`: BigInteger

### C. API Endpoints
- `GET /api/v1/projects` - Fetch all projects with their media.
- `GET /api/v1/projects/{id}` - Fetch details for a specific project.
- `GET /api/v1/featured` - Fetch only featured videos/photos for the home page.
- `GET /api/v1/stats` - Fetch the live metrics (views, subs, likes) to populate the frontend loading screen.
- `POST /api/v1/admin/upload` - Secure endpoint to upload new media.

---

## 3. Prompt for Claude (Antigravity generation)
*Copy and paste the prompt below into Claude/Antigravity to start building the backend.*

```text
Act as a Senior Python Backend Architect. I am building a highly aesthetic "Golden Look" Filmmaker Portfolio for Akshay Vastrad. The frontend will be built with TypeScript and Tailwind CSS, and I need you to develop the complete backend architecture using Python.

Please build a FastAPI backend with the following requirements:
1. **Setup & Configuration**: Provide the initial project structure, `requirements.txt`, and FastAPI setup.
2. **Database Models (SQLAlchemy)**: Create models for `Project`, `Media` (handling both photos and videos via S3/Cloudinary links), and `Stats` (to store millions of views/likes/subscribers).
3. **API Routes**: Create robust RESTful endpoints to fetch the featured projects, media galleries, and the live statistics used for a massive loading screen animation.
4. **CORS & Integration**: Ensure the API is configured with CORS to talk to a Next.js/React frontend.

Please output the code modularly (e.g., `main.py`, `models.py`, `routes.py`, `schemas.py`) so I can drop it directly into my workspace.
```
