"use client";
// components/SignatureFilms.tsx — AK2.0  10 Stories
//
// 4-column, 11 CSS-row grid. Each CSS row = 1 unit.
// Reels span 2 rows (9:16). Wedding Films span 3 rows (16:9).
//
// VIDEO MAPPING:
//   Reels 1-6  → first 6 video media items across all projects where alt_text starts with "reel"
//             OR in order of upload if not tagged
//   Wedding Films 1-4 → first 4 video media items tagged "wf" or next in order
//
// The admin uploads videos tagged with alt_text like "reel_01", "wf_01" etc.
// If no tag, they fill in upload order: first 6 go to reels, next 4 to wedding films.

import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { getAllProjects, type MediaItem } from "@/lib/api";

interface FilmSlot {
  id: string;
  media: MediaItem | null;
  title: string;
  client: string;
  orientation: "horizontal" | "vertical";
}

const SLOT_DEFS = [
  { id: "wf1", title: "Wedding Film 01", client: "Bride & Groom",   orientation: "horizontal" as const },
  { id: "r1",  title: "Reel 01",          client: "Short Form",     orientation: "vertical"   as const },
  { id: "r2",  title: "Reel 02",          client: "Short Form",     orientation: "vertical"   as const },
  { id: "r3",  title: "Reel 03",          client: "Short Form",     orientation: "vertical"   as const },
  { id: "r4",  title: "Reel 04",          client: "Short Form",     orientation: "vertical"   as const },
  { id: "wf2", title: "Wedding Film 02",  client: "Bride & Groom",  orientation: "horizontal" as const },
  { id: "wf3", title: "Wedding Film 03",  client: "Bride & Groom",  orientation: "horizontal" as const },
  { id: "r5",  title: "Reel 05",          client: "Short Form",     orientation: "vertical"   as const },
  { id: "r6",  title: "Reel 06",          client: "Short Form",     orientation: "vertical"   as const },
  { id: "wf4", title: "Wedding Film 04",  client: "Cinematic Cover", orientation: "horizontal" as const },
];

// CSS grid placement — col-start / col-end / row-start / row-end
const PLACEMENT: Record<string, [number,number,number,number]> = {
  wf1: [1, 3, 1, 4],
  r1:  [3, 4, 1, 3],
  r2:  [4, 5, 1, 3],
  r3:  [1, 2, 4, 6],
  r4:  [2, 3, 4, 6],
  wf2: [3, 5, 3, 6],
  wf3: [1, 3, 6, 9],
  r5:  [3, 4, 6, 8],
  r6:  [4, 5, 6, 8],
  wf4: [1, 3, 9, 12],
};

// ── YouTube embed helper ───────────────────────────────────────────────────────
function getYouTubeId(url: string): string | null {
  for (const pattern of ["v=", "youtu.be/", "embed/"]) {
    if (url.includes(pattern)) {
      const part = url.split(pattern).pop() || "";
      return part.split("&")[0].split("?")[0] || null;
    }
  }
  return null;
}

function isYouTube(url: string): boolean {
  return url.includes("youtube.com") || url.includes("youtu.be");
}

// ── Film card ──────────────────────────────────────────────────────────────────
function FilmCard({ slot, index }: { slot: FilmSlot; index: number }) {
  const [hovered, setHovered] = useState(false);
  const [theater, setTheater] = useState(false);
  const [cs, ce, rs, re] = PLACEMENT[slot.id];
  const m = slot.media;

  const thumbnailSrc = m?.thumbnail_url || (
    m?.url && isYouTube(m.url) && getYouTubeId(m.url)
      ? `https://img.youtube.com/vi/${getYouTubeId(m.url)}/hqdefault.jpg`
      : null
  );

  return (
    <>
      <motion.div
        className="relative overflow-hidden rounded-[2px] cursor-pointer group"
        style={{ gridColumn: `${cs} / ${ce}`, gridRow: `${rs} / ${re}` }}
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.75, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => m && setTheater(true)}
      >
        {m ? (
          <>
            {/* Thumbnail */}
            {thumbnailSrc && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={thumbnailSrc} alt={m.alt_text ?? ""}
                draggable={false}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${hovered ? "opacity-70" : "opacity-100"}`} />
            )}
            {/* Play overlay */}
            <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${hovered ? "opacity-100" : "opacity-0"}`}
              style={{ background: "rgba(20,17,14,0.35)" }}>
              <div className="w-14 h-14 rounded-full bg-gold/90 flex items-center justify-center shadow-xl">
                <span className="text-lg text-cream pl-1">▶</span>
              </div>
            </div>
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

        {/* Info label on hover */}
        <div className={`absolute bottom-0 inset-x-0 px-4 pb-4 transition-opacity duration-400 ${hovered && m ? "opacity-100" : "opacity-0"}`}>
          <p className="font-serif text-sm text-cream">{m?.alt_text || slot.title}</p>
          <p className="font-mono text-[9px] tracking-widest text-gold uppercase">{slot.client}</p>
        </div>

        {!m && (
          <span className="absolute bottom-3 right-3 font-mono text-[8px] tracking-widest text-gold-muted uppercase opacity-30">
            Upload here
          </span>
        )}
      </motion.div>

      {/* Theater/Lightbox — YouTube iframe */}
      {theater && m && (
        <YouTubeTheater url={m.url} title={m.alt_text || slot.title} onClose={() => setTheater(false)} />
      )}
    </>
  );
}

// ── YouTube Theater ───────────────────────────────────────────────────────────
function YouTubeTheater({ url, title, onClose }: { url: string; title: string; onClose: () => void }) {
  const videoId = isYouTube(url) ? getYouTubeId(url) : null;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handler);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", handler); };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[300] theater-backdrop flex flex-col items-center justify-center"
      onClick={onClose}>
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent opacity-40" />
      <button onClick={onClose}
        className="absolute top-6 right-8 font-sans text-xs tracking-[0.3em] text-cream/50 hover:text-gold uppercase transition-colors z-10">
        ✕ &nbsp;Close
      </button>

      <div className="relative max-w-5xl w-full mx-6 md:mx-12"
        style={{ aspectRatio: "16/9" }}
        onClick={e => e.stopPropagation()}>
        {videoId ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            allow="autoplay; fullscreen"
            allowFullScreen
            className="w-full h-full rounded-sm"
            style={{ boxShadow: "0 0 80px rgba(196,149,42,0.15), 0 40px 80px rgba(0,0,0,0.5)" }}
            title={title}
          />
        ) : (
          <video src={url} controls autoPlay
            className="w-full h-full rounded-sm"
            style={{ boxShadow: "0 0 80px rgba(196,149,42,0.15), 0 40px 80px rgba(0,0,0,0.5)" }} />
        )}
      </div>

      {title && (
        <p className="mt-5 text-center font-sans font-light text-xs tracking-widest text-cream/40 uppercase">
          {title}
        </p>
      )}
    </div>
  );
}

// ── Quote cell ────────────────────────────────────────────────────────────────
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

// ── Main ───────────────────────────────────────────────────────────────────────
export default function SignatureFilms() {
  const ROW_HEIGHT = "clamp(90px, 10vw, 160px)";
  const [slots, setSlots] = useState<FilmSlot[]>(
    SLOT_DEFS.map(s => ({ ...s, media: null }))
  );

  useEffect(() => {
    getAllProjects().then(projects => {
      // Collect ALL video media items across all projects, in upload order
      const allVideos: MediaItem[] = projects.flatMap(p =>
        (p.media ?? []).filter(m => m.media_type === "video")
      );

      // Split: items with alt_text starting with "wf" or "wedding" → wedding films
      //        items with alt_text starting with "reel" or "r" → reels
      //        untagged → fill reels first, then wedding films
      const reelVideos: MediaItem[] = [];
      const wfVideos: MediaItem[] = [];
      const untagged: MediaItem[] = [];

      for (const v of allVideos) {
        const tag = (v.alt_text || "").toLowerCase();
        if (tag.startsWith("wf") || tag.startsWith("wedding")) wfVideos.push(v);
        else if (tag.startsWith("reel") || tag.startsWith("r")) reelVideos.push(v);
        else untagged.push(v);
      }

      // Fill untagged: reels first (need 6), then wedding films (need 4)
      for (const v of untagged) {
        if (reelVideos.length < 6) reelVideos.push(v);
        else if (wfVideos.length < 4) wfVideos.push(v);
      }

      // Map to slots
      const reelSlotIds = ["r1","r2","r3","r4","r5","r6"];
      const wfSlotIds   = ["wf1","wf2","wf3","wf4"];

      setSlots(SLOT_DEFS.map(def => {
        const reelIdx = reelSlotIds.indexOf(def.id);
        const wfIdx   = wfSlotIds.indexOf(def.id);
        const media = reelIdx >= 0 ? (reelVideos[reelIdx] ?? null)
                    : wfIdx >= 0   ? (wfVideos[wfIdx] ?? null)
                    : null;
        return { ...def, media };
      }));
    }).catch(() => {});
  }, []);

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
        {slots.map((slot, i) => (
          <FilmCard key={slot.id} slot={slot} index={i} />
        ))}
        <QuoteCell />
      </div>
    </section>
  );
}
