# AK2.0 — Akshay Vastrad Media House
## Complete Rebuild Plan · Planning Document Only

> **STATUS: PLAN ONLY — do not build until user types GO**

---

## What AK2.0 Is

AK2.0 transforms the portfolio from a "filmmaker's showreel" into a **luxury wedding media house website** — the kind of site a premium client lands on and immediately thinks: *"I have to hire this person for my wedding."*

Every word, every pixel, every interaction sells **cinematic wedding films** as a premium, once-in-a-lifetime investment.

---

## Business Context (from catalogue)

| Field | Detail |
|---|---|
| **Brand** | Akshay Vastrad Media House |
| **Service** | Cinematic Wedding Films |
| **Experience** | 4 years |
| **Happy Clients** | 40+ |
| **Phone** | +91 86609 76964 |
| **Instagram** | @Akshay_bsa_official |
| **Email** | Akshayvastradmedia@gmail.com |
| **Core Promise** | "We turn your wedding into a cinematic film you will cherish for life" |

### Three Pillars (from catalogue → elevated)
| Pillar | Original | AK2.0 Elevated Copy |
|---|---|---|
| **Quality** | Genuine emotions, candid moments | *"We don't shoot weddings. We craft heirlooms."* |
| **Service** | Excellent service, fast edits | *"From our lens to your screen — because the wait should end, not the memory."* |
| **Commitment** | Dates blocked, full commitment | *"Once we're booked, we're yours. Completely."* |

---

## AK2.0 Page Architecture

```
[ Hero — Akshay's name LEFT · Portrait photos RIGHT ]
         ↓ scroll
[ Brand Statement — "We Turn Weddings Into Cinema" ]
         ↓ scroll
[ 8 Signature Films — Mixed Vertical/Horizontal Grid ]
         ↓ scroll
[ Stats Bar — 40+ Clients · 4 Years · 100% Commitment ]
         ↓ scroll
[ 3 Pillars — Quality · Service · Commitment ]
         ↓ scroll
[ 30-Photo Archive — Pinterest Masonry Grid ]
         ↓ scroll
[ Contact Section ]
```

---

## Section-by-Section Plan

---

### 1. Hero — `HeroSection.tsx` (MODIFY)

**Left side (text, unchanged structure):**
- "Akshay / Vastrad" in large Cormorant Garamond
- Gold subtitle: *Media House · Wedding Filmmaker*
- Tagline: *"We Turn Your Wedding Into Cinema"*

**Right side — NEW: Portrait Collage (3 photo slots)**
- 3 placeholder slots: Portrait headshot · Camera in hand · BTS working
- Layout: Two stacked right + one large left in a 2-panel editorial collage
- Thin gold frame border on each photo
- On hover: subtle scale-up + gold border glow

```
┌──────────────────┬─────────────────┐
│                  │  [Portrait]     │
│  AKSHAY          ├─────────────────┤
│  VASTRAD         │  [With Camera]  │
│                  │                 │
│  Media House     ├─────────────────┤
│                  │  [BTS Shot]     │
└──────────────────┴─────────────────┘
```

---

### 2. Brand Statement — NEW `BrandStatement.tsx`

Full-width cinematic pull-quote section:

> *"We don't shoot weddings. We craft heirlooms."*

- Cream background, very large Cormorant Garamond (italic)
- Slow parallax fade-in on scroll entry
- Gold thin rule under quote, centered
- Subtext: *"Your wedding deserves more than a camera. It deserves a director."*
- 40+ clients · 4 years in one line below

---

### 3. Signature Films — NEW `SignatureFilms.tsx` (8 Videos)

**Challenge:** Mix of verticals (9:16 Reels/Shorts) + horizontals (16:9 films)

**Best layout: Editorial Film Board** — deliberate CSS Grid:

```
Row 1:  [ HORIZONTAL — big, col-span-2 ] [ Vert 1 ] [ Vert 2 ]
Row 2:  [ Vert 3 ] [ Vert 4 ]  [ HORIZONTAL — big, col-span-2 ]
```

- 4-column CSS Grid
- Horizontal cards: `col-span-2`, `aspect-video (16:9)`
- Vertical cards: `col-span-1`, `aspect-[9/16]`
- Hover: thumbnail fades → silent video plays
- Click: full Theater Mode
- Gold "▶" play badge, title + client fade on hover

**8 slots:** 2 large horizontals + 6 verticals

---

### 4. Stats Bar — NEW `StatsBar.tsx`

Full-width strip, animated count-up on scroll entry:

```
  40+         ·      4 Years     ·     100%
  Weddings         Experience       Commitment
```

- Animated numbers (0 → final) triggered once on viewport enter
- Thin gold vertical separators
- Mono font numbers, serif for labels

---

### 5. Service Pillars — NEW `ServicePillars.tsx`

Three equal luxury cards, stagger-animated in on scroll:

| 01 · Quality | 02 · Service | 03 · Commitment |
|---|---|---|
| "We don't shoot weddings. We craft heirlooms. Our lens finds the genuine moments — the trembling hands, the stolen glances, the tears no one planned for." | "Filmmaking background means we treat your wedding like a feature film and you like our lead actor. Fast delivery, no compromises." | "Once we block your date, it's sacred. Our complete creative energy — from pre-shoot to final delivery — is dedicated solely to your story." |

- Large gold serif numbers (01, 02, 03)
- Cream cards with thin border, hover → gold border glow + slight lift
- Short gold rule under each heading

---

### 6. Photo Archive — `MasonryGrid.tsx` (UPGRADE)

Scaling to 30 photos, same masonry system with upgrades:
- `loading="lazy"` on all images for performance
- **Arrow-key navigable lightbox** (← / → keys + buttons)
- "View All" expand button (show 12 → load rest on click)
- Caption area on hover with photo title

---

### 7. Contact — `ContactSection.tsx` (UPDATE)

Update with confirmed real details:
- WhatsApp: `+91 86609 76964`
- Email: `Akshayvastradmedia@gmail.com`
- Instagram: `@Akshay_bsa_official`
- Closing line: *"Limited dates available. Book your consultation early."*

---

## Files Impacted

| Action | File |
|---|---|
| MODIFY | `components/HeroSection.tsx` — portrait collage right side |
| NEW | `components/BrandStatement.tsx` — cinematic pull quote |
| NEW | `components/SignatureFilms.tsx` — 8-video editorial board |
| NEW | `components/StatsBar.tsx` — animated 40+/4yr/100% |
| NEW | `components/ServicePillars.tsx` — three pillar luxury cards |
| MODIFY | `components/MasonryGrid.tsx` — lightbox, lazy load, load more |
| MODIFY | `components/ContactSection.tsx` — real email/Instagram |
| MODIFY | `components/HomeClient.tsx` — new section order |
| MODIFY | `backend/seed.py` — video + photo placeholder slots |

---

## Photo/Video Placeholder Strategy

Until real media is uploaded, every slot will render a **warm cream placeholder** with a centered label describing exactly what goes there:
- `[Portrait of Akshay]`
- `[Wedding Film — Horizontal]`
- `[Wedding Reel — Vertical]`

This lets you see the exact layout and just swap URLs later.

---

## Git Push Commands

```bash
cd /Users/botgotmac/Documents/PROJECTS\ 25-26/akkira_filmmaker
git add .
git commit -m "feat: AK2.0 luxury redesign — cream/gold theme, parallax, masonry grid"
git push origin akiraa
```

---

> **Type GO when you are ready to build.**
