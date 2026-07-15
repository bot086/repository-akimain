"use client";
// components/MasonryGrid.tsx — AK2.0
// Pinterest masonry for up to 30 photos — 12 shown initially, load more button.
// Arrow-key navigable lightbox. FilmReel is a separate component below this section.

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Project, MediaItem } from "@/lib/api";

interface Props { projects: Project[] }

// ── 30 photo placeholder slots (replaced by real data from API) ───────────────
const PHOTO_PLACEHOLDERS: Array<{ id: string; label: string }> = Array.from({ length: 30 }, (_, i) => ({
  id: `ph-${i + 1}`,
  label: `Wedding Photo ${String(i + 1).padStart(2, "0")}`,
}));

// ── Lightbox ──────────────────────────────────────────────────────────────────
function Lightbox({
  items, index, onClose,
}: {
  items: (MediaItem & { projectTitle: string })[],
  index: number,
  onClose: () => void,
}) {
  const [current, setCurrent] = useState(index);

  const prev = useCallback(() => setCurrent(c => Math.max(0, c - 1)), []);
  const next = useCallback(() => setCurrent(c => Math.min(items.length - 1, c + 1)), [items.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handler);
    };
  }, [onClose, prev, next]);

  const item = items[current];
  if (!item) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[300] theater-backdrop flex flex-col items-center justify-center"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      {/* Gold top rule */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent opacity-40" />

      {/* Controls bar */}
      <div className="absolute top-0 inset-x-0 flex justify-between items-center px-8 py-5 z-10">
        <p className="font-mono text-[10px] tracking-widest text-cream/40 uppercase">
          {current + 1} / {items.length}
        </p>
        <button onClick={onClose}
          className="font-sans text-xs tracking-[0.3em] text-cream/40 hover:text-gold uppercase transition-colors duration-300">
          ✕ Close
        </button>
      </div>

      {/* Image */}
      <motion.div
        key={current}
        className="relative max-w-5xl max-h-[80vh] w-full mx-6 md:mx-12"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        onClick={e => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.url} alt={item.alt_text ?? ""} loading="lazy"
          className="max-h-[80vh] max-w-full mx-auto object-contain rounded-[2px]"
          style={{ boxShadow: "0 0 80px rgba(196,149,42,0.12), 0 40px 80px rgba(0,0,0,0.6)" }} />
        {item.alt_text && (
          <p className="mt-5 text-center font-sans font-light text-xs tracking-widest text-cream/35 uppercase">
            {item.alt_text}
          </p>
        )}
      </motion.div>

      {/* Prev / Next arrows */}
      <div className="absolute inset-y-0 left-4 flex items-center" onClick={e => e.stopPropagation()}>
        <button onClick={prev} disabled={current === 0}
          className="w-10 h-10 rounded-full border border-cream/10 hover:border-gold/50 flex items-center justify-center text-cream/40 hover:text-gold transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed">
          ←
        </button>
      </div>
      <div className="absolute inset-y-0 right-4 flex items-center" onClick={e => e.stopPropagation()}>
        <button onClick={next} disabled={current === items.length - 1}
          className="w-10 h-10 rounded-full border border-cream/10 hover:border-gold/50 flex items-center justify-center text-cream/40 hover:text-gold transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed">
          →
        </button>
      </div>
    </motion.div>
  );
}

// ── Photo card ────────────────────────────────────────────────────────────────
function PhotoCard({
  item, index, onClick,
}: {
  item: MediaItem & { projectTitle: string },
  index: number,
  onClick: () => void,
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="relative overflow-hidden rounded-[2px] cursor-pointer group break-inside-avoid mb-3 md:mb-4"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.65, delay: (index % 4) * 0.06, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.thumbnail_url || item.url}
        alt={item.alt_text ?? ""}
        loading="lazy"
        className="w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        draggable={false}
      />

      {/* Hover overlay */}
      <div className="absolute inset-0 transition-opacity duration-400 pointer-events-none"
        style={{
          opacity: hovered ? 1 : 0,
          background: "linear-gradient(to top, rgba(196,149,42,0.28) 0%, transparent 50%)",
        }} />

      {/* Gold border glow */}
      <div className="absolute inset-0 pointer-events-none transition-all duration-400 rounded-[2px]"
        style={{ boxShadow: hovered
          ? "inset 0 0 0 1.5px rgba(196,149,42,0.65)"
          : "inset 0 0 0 0px transparent" }} />

      {/* Caption */}
      <div className={`absolute bottom-0 inset-x-0 px-3 pb-3 transition-all duration-350 ${hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"}`}>
        <p className="font-sans text-[10px] text-cream font-medium truncate">{item.alt_text || item.projectTitle}</p>
      </div>
    </motion.div>
  );
}

// ── Placeholder photo card ────────────────────────────────────────────────────
function PlaceholderCard({ label, index }: { label: string; index: number }) {
  const heights = ["aspect-[3/4]", "aspect-square", "aspect-[4/5]", "aspect-[2/3]", "aspect-[3/4]", "aspect-[4/3]"];
  const h = heights[index % heights.length];

  return (
    <div className={`break-inside-avoid mb-3 md:mb-4 rounded-[2px] overflow-hidden ${h} bg-gradient-to-br from-[#EDE8DF] via-[#E5DDD0] to-[#D8CFC0] flex flex-col items-center justify-center gap-2 p-4`}>
      <span className="text-xl opacity-20">🖼</span>
      <span className="font-mono text-[8px] tracking-[0.28em] text-gold-muted uppercase text-center opacity-50">{label}</span>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
const INITIAL_SHOW = 12;

export default function MasonryGrid({ projects }: Props) {
  const [showAll, setShowAll] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const allMedia = projects.flatMap(p =>
    (p.media ?? [])
      .filter(m => m.media_type === "photo")
      .map(m => ({ ...m, projectTitle: p.title }))
  );

  const hasRealMedia = allMedia.length > 0;
  const photosToShow = hasRealMedia ? allMedia : [];
  const placeholders = !hasRealMedia ? PHOTO_PLACEHOLDERS : [];

  const visiblePhotos = showAll ? photosToShow : photosToShow.slice(0, INITIAL_SHOW);
  const visiblePlaceholders = showAll ? placeholders : placeholders.slice(0, INITIAL_SHOW);
  const totalCount = hasRealMedia ? photosToShow.length : placeholders.length;

  return (
    <>
      <section id="gallery" className="section-pad bg-cream-warm">
        {/* Header */}
        <div className="mb-14">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-8 h-px bg-gold" />
            <span className="font-mono text-xs tracking-[0.35em] text-gold uppercase">Photo Archive</span>
          </div>
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <h2 className="font-serif font-light text-4xl md:text-6xl text-ink">
              The <em className="text-gold-gradient not-italic">Gallery</em>
            </h2>
            <p className="font-sans font-light text-sm text-ink-muted text-right">
              {totalCount} photographs · click to open
            </p>
          </div>
        </div>

        {/* Masonry grid */}
        <div style={{ columnCount: "var(--photo-cols, 2)", columnGap: "12px" } as React.CSSProperties}>
          <style>{`
            :root { --photo-cols: 2 }
            @media (min-width: 640px)  { :root { --photo-cols: 3 } }
            @media (min-width: 1024px) { :root { --photo-cols: 4 } }
          `}</style>

          {hasRealMedia
            ? visiblePhotos.map((item, i) => (
                <PhotoCard key={item.id} item={item} index={i}
                  onClick={() => setLightboxIndex(i)} />
              ))
            : visiblePlaceholders.map((ph, i) => (
                <PlaceholderCard key={ph.id} label={ph.label} index={i} />
              ))
          }
        </div>

        {/* Load More */}
        {!showAll && totalCount > INITIAL_SHOW && (
          <div className="flex justify-center mt-14">
            <motion.button
              onClick={() => setShowAll(true)}
              className="group inline-flex items-center gap-4 font-sans text-xs tracking-[0.28em] uppercase text-ink hover:text-gold transition-colors duration-300 border border-cream-border hover:border-gold/40 px-8 py-4 rounded-[2px]"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="w-6 h-px bg-ink group-hover:bg-gold transition-colors duration-300" />
              View All {totalCount} Photos
              <span className="w-6 h-px bg-ink group-hover:bg-gold transition-colors duration-300" />
            </motion.button>
          </div>
        )}
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && hasRealMedia && (
          <Lightbox
            items={allMedia}
            index={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
