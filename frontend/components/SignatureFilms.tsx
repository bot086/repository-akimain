"use client";
// components/SignatureFilms.tsx — AK2.0  10 Stories
// 
// 4-column, 11 CSS-row grid. Each CSS row = 1 unit.
// Reels span 2 rows (1×), Wedding Films span 3 rows (1.5×).
//
// LAYOUT (CSS grid lines 1-indexed):
//  WF1  col 1-3  row 1-4  │  R1 col 3-4 row 1-3  │  R2 col 4-5 row 1-3
//  WF1  cont.             │  R3 col 1-2 row 4-6  │  R4 col 2-3 row 4-6
//                           WF2 col 3-5 row 3-6
//  WF3  col 1-3 row 6-9   │  R5 col 3-4 row 6-8  │  R6 col 4-5 row 6-8
//  WF4  col 1-3 row 9-12  │  QUOTE col 3-5 row 8-12

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import TheaterMode from "./TheaterMode";

interface FilmSlot {
  id: string;
  url: string | null;
  thumbnail_url: string | null;
  alt_text: string | null;
  title: string;
  client: string;
  orientation: "horizontal" | "vertical";
}

const FILM_SLOTS: FilmSlot[] = [
  { id: "wf1", url: null, thumbnail_url: null, alt_text: null, title: "Wedding Film 01", client: "Bride & Groom",   orientation: "horizontal" },
  { id: "r1",  url: null, thumbnail_url: null, alt_text: null, title: "Reel 01",          client: "Short Form",     orientation: "vertical"   },
  { id: "r2",  url: null, thumbnail_url: null, alt_text: null, title: "Reel 02",          client: "Short Form",     orientation: "vertical"   },
  { id: "r3",  url: null, thumbnail_url: null, alt_text: null, title: "Reel 03",          client: "Short Form",     orientation: "vertical"   },
  { id: "r4",  url: null, thumbnail_url: null, alt_text: null, title: "Reel 04",          client: "Short Form",     orientation: "vertical"   },
  { id: "wf2", url: null, thumbnail_url: null, alt_text: null, title: "Wedding Film 02",  client: "Bride & Groom",  orientation: "horizontal" },
  { id: "wf3", url: null, thumbnail_url: null, alt_text: null, title: "Wedding Film 03",  client: "Bride & Groom",  orientation: "horizontal" },
  { id: "r5",  url: null, thumbnail_url: null, alt_text: null, title: "Reel 05",          client: "Short Form",     orientation: "vertical"   },
  { id: "r6",  url: null, thumbnail_url: null, alt_text: null, title: "Reel 06",          client: "Short Form",     orientation: "vertical"   },
  { id: "wf4", url: null, thumbnail_url: null, alt_text: null, title: "Wedding Film 04",  client: "Cinematic Cover", orientation: "horizontal" },
];

// col-start / col-end / row-start / row-end  (all 1-indexed CSS grid lines)
const PLACEMENT: Record<string, [number,number,number,number]> = {
  wf1: [1, 3, 1, 4],  // 2 cols × 3 rows = 1.5× tall
  r1:  [3, 4, 1, 3],  // 1 col × 2 rows  = 1× tall
  r2:  [4, 5, 1, 3],
  r3:  [1, 2, 4, 6],  // starts after wf1 ends at row 4
  r4:  [2, 3, 4, 6],
  wf2: [3, 5, 3, 6],  // 2 cols × 3 rows — starts at row 3 (overlaps with tail of r1/r2 row)
  wf3: [1, 3, 6, 9],
  r5:  [3, 4, 6, 8],
  r6:  [4, 5, 6, 8],
  wf4: [1, 3, 9, 12],
  // quote: col 3-5, row 8-12 (covers below r5/r6 and alongside wf4)
};

// ── Film card ─────────────────────────────────────────────────────────────────
function FilmCard({ slot, index }: { slot: FilmSlot; index: number }) {
  const [hovered, setHovered] = useState(false);
  const [theater, setTheater] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cs, ce, rs, re] = PLACEMENT[slot.id];

  const onHover = useCallback((on: boolean) => {
    setHovered(on);
    if (slot.url && videoRef.current) {
      if (on) videoRef.current.play().catch(() => {});
      else { videoRef.current.pause(); videoRef.current.currentTime = 0; }
    }
  }, [slot.url]);

  return (
    <>
      <motion.div
        className="relative overflow-hidden rounded-[2px] cursor-pointer group"
        style={{ gridColumn: `${cs} / ${ce}`, gridRow: `${rs} / ${re}` }}
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.75, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
        onMouseEnter={() => onHover(true)}
        onMouseLeave={() => onHover(false)}
        onClick={() => slot.url && setTheater(true)}
      >
        {slot.url ? (
          <>
            {slot.thumbnail_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={slot.thumbnail_url} alt={slot.alt_text ?? ""} draggable={false}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${hovered ? "opacity-0" : "opacity-100"}`} />
            )}
            <video ref={videoRef} src={slot.url} muted loop playsInline preload="metadata"
              className={`w-full h-full object-cover transition-opacity duration-500 ${hovered ? "opacity-100" : "opacity-0"}`} />
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-6"
            style={{ background: slot.orientation === "horizontal"
              ? "linear-gradient(135deg, #E8E1D4 0%, #DDD5C4 100%)"
              : "linear-gradient(180deg, #E8E1D4 0%, #D8CFC0 100%)" }}>
            <span className="opacity-20 text-3xl">{slot.orientation === "horizontal" ? "🎬" : "📱"}</span>
            <div className="text-center">
              <p className="font-mono text-[9px] tracking-[0.32em] text-gold-muted uppercase opacity-60 mb-1">
                {slot.orientation === "horizontal" ? "16:9 Film" : "9:16 Reel"}
              </p>
              <p className="font-sans text-xs text-ink-soft opacity-40">{slot.title}</p>
            </div>
          </div>
        )}

        {/* Hover gradient */}
        <div className="absolute inset-0 pointer-events-none transition-opacity duration-400"
          style={{ opacity: hovered ? 1 : 0,
            background: "linear-gradient(to top, rgba(20,17,14,0.7) 0%, transparent 55%)" }} />

        {/* Gold border glow */}
        <div className="absolute inset-0 pointer-events-none transition-all duration-400"
          style={{ boxShadow: hovered ? "inset 0 0 0 1.5px rgba(196,149,42,0.6)" : "none" }} />

        {/* Play badge */}
        <div className={`absolute top-4 left-4 transition-all duration-300 ${hovered ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}>
          <div className="w-9 h-9 rounded-full bg-gold flex items-center justify-center shadow-lg">
            <span className="text-xs text-cream pl-0.5">▶</span>
          </div>
        </div>

        {/* Info */}
        <div className={`absolute bottom-0 inset-x-0 px-4 pb-4 transition-opacity duration-400 ${hovered ? "opacity-100" : "opacity-0"}`}>
          <p className="font-serif text-sm text-cream">{slot.title}</p>
          <p className="font-mono text-[9px] tracking-widest text-gold uppercase">{slot.client}</p>
        </div>

        {!slot.url && (
          <span className="absolute bottom-3 right-3 font-mono text-[8px] tracking-widest text-gold-muted uppercase opacity-30">
            Upload here
          </span>
        )}
      </motion.div>

      {theater && slot.url && (
        <TheaterMode
          item={{ id: slot.id, project_id: "", media_type: "video", url: slot.url,
            thumbnail_url: slot.thumbnail_url, alt_text: slot.alt_text, display_order: 0 }}
          onClose={() => setTheater(false)}
        />
      )}
    </>
  );
}

// ── Quote — no box, just text floating in the grid cell ──────────────────────
function QuoteCell() {
  return (
    <motion.div
      className="flex flex-col justify-center px-8 py-6"
      style={{ gridColumn: "3 / 5", gridRow: "8 / 12" }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1, delay: 0.5 }}
    >
      <div className="w-8 h-px mb-6" style={{ background: "linear-gradient(90deg, #C4952A, transparent)" }} />
      <p className="font-serif italic text-xl md:text-2xl lg:text-3xl text-ink leading-snug mb-5">
        "Every wedding is a once-in-a-lifetime story.
        <br />
        <span style={{ color: "#C4952A" }}>We make sure it's told beautifully."</span>
      </p>
      <p className="font-mono text-[10px] tracking-[0.35em] text-gold-muted uppercase">
        — Akshay Vastrad Media House
      </p>
    </motion.div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function SignatureFilms() {
  // Row height: each CSS row = 1 unit. Reels = 2 rows. WFs = 3 rows.
  // Unit size = ~160px on desktop, scales down.
  const ROW_HEIGHT = "clamp(90px, 10vw, 160px)";

  return (
    <section id="work" className="section-pad bg-cream">
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-8 h-px bg-gold" />
          <span className="font-mono text-xs tracking-[0.35em] text-gold uppercase">Signature Films</span>
        </div>
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <h2 className="font-serif font-light text-4xl md:text-6xl text-ink">
            10 <em className="text-gold-gradient not-italic">Stories</em>
          </h2>
          <p className="font-sans font-light text-sm text-ink-muted">
            Hover to preview · Click to watch
          </p>
        </div>
      </div>

      <div
        className="gap-3 md:gap-4"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gridTemplateRows: `repeat(11, ${ROW_HEIGHT})`,
        }}
      >
        {FILM_SLOTS.map((slot, i) => (
          <FilmCard key={slot.id} slot={slot} index={i} />
        ))}
        <QuoteCell />
      </div>
    </section>
  );
}
