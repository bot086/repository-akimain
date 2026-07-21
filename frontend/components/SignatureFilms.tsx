"use client";
// components/SignatureFilms.tsx — AK2.0  Redesigned
//
// Layout:
//   TOP ROW    — 6 × Reels   (9:16, horizontally scrollable)
//   BOTTOM ROW — 4 × Wedding Films (16:9, 2-col grid)
//
// VIDEO MAPPING (same tag logic as before):
//   reel_01…reel_06  → Reel slots
//   wf_01…wf_04      → Wedding Film slots
//   untagged          → fills reels first, then wedding films

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getAllProjects, type MediaItem } from "@/lib/api";

// ── YouTube helpers ───────────────────────────────────────────────────────────
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

// ── Theater modal ─────────────────────────────────────────────────────────────
function YouTubeTheater({
  url,
  title,
  onClose,
}: {
  url: string;
  title: string;
  onClose: () => void;
}) {
  const videoId = isYouTube(url) ? getYouTubeId(url) : null;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handler);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[300] flex flex-col items-center justify-center"
      style={{ background: "rgba(20,17,14,0.93)", backdropFilter: "blur(12px)" }}
      onClick={onClose}
    >
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent opacity-40" />
      <button
        onClick={onClose}
        className="absolute top-6 right-8 font-sans text-xs tracking-[0.3em] text-cream/50 hover:text-gold uppercase transition-colors z-10"
      >
        ✕ &nbsp;Close
      </button>

      <div
        className="relative max-w-5xl w-full mx-6 md:mx-12"
        style={{ aspectRatio: "16/9" }}
        onClick={(e) => e.stopPropagation()}
      >
        {videoId ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            allow="autoplay; fullscreen"
            allowFullScreen
            className="w-full h-full rounded-sm"
            style={{
              boxShadow:
                "0 0 80px rgba(196,149,42,0.15), 0 40px 80px rgba(0,0,0,0.5)",
            }}
            title={title}
          />
        ) : (
          <video
            src={url}
            controls
            autoPlay
            className="w-full h-full rounded-sm"
            style={{
              boxShadow:
                "0 0 80px rgba(196,149,42,0.15), 0 40px 80px rgba(0,0,0,0.5)",
            }}
          />
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

// ── Reel Card (9:16 portrait) ─────────────────────────────────────────────────
function ReelCard({
  media,
  index,
  slotLabel,
}: {
  media: MediaItem | null;
  index: number;
  slotLabel: string;
}) {
  const [hovered, setHovered] = useState(false);
  const [theater, setTheater] = useState(false);

  const thumbnailSrc =
    media?.thumbnail_url ||
    (media?.url && isYouTube(media.url) && getYouTubeId(media.url)
      ? `https://img.youtube.com/vi/${getYouTubeId(media.url)}/maxresdefault.jpg`
      : null);
  const thumbnailFallback =
    media?.url && isYouTube(media.url) && getYouTubeId(media.url)
      ? `https://img.youtube.com/vi/${getYouTubeId(media.url)}/hqdefault.jpg`
      : undefined;

  return (
    <>
      <motion.div
        className="relative overflow-hidden rounded-[3px] cursor-pointer group flex-shrink-0"
        style={{
          // Fixed width, natural 9:16 height via aspect-ratio
          width: "clamp(110px, 13vw, 170px)",
          aspectRatio: "9/16",
        }}
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.75, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => media && setTheater(true)}
      >
        {media ? (
          <>
            {thumbnailSrc && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={thumbnailSrc}
                alt={media.alt_text ?? ""}
                draggable={false}
                onError={(e) => {
                  if (thumbnailFallback)
                    (e.target as HTMLImageElement).src = thumbnailFallback;
                }}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${hovered ? "opacity-70" : "opacity-100"}`}
              />
            )}
            {/* Play overlay */}
            <div
              className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${hovered ? "opacity-100" : "opacity-0"}`}
              style={{ background: "rgba(20,17,14,0.35)" }}
            >
              <div className="w-12 h-12 rounded-full bg-gold/90 flex items-center justify-center shadow-xl">
                <span className="text-base text-cream pl-1">▶</span>
              </div>
            </div>
          </>
        ) : (
          <div
            className="w-full h-full flex flex-col items-center justify-center gap-2 p-3"
            style={{
              background: "linear-gradient(180deg, #E8E1D4 0%, #D8CFC0 100%)",
            }}
          >
            <span className="opacity-20 text-2xl">📱</span>
            <p className="font-mono text-[8px] tracking-[0.28em] text-gold-muted uppercase opacity-50 text-center">
              9:16 Reel
            </p>
            <p className="font-sans text-[10px] text-ink-soft opacity-35 text-center">
              {slotLabel}
            </p>
          </div>
        )}

        {/* Hover gradient */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-400"
          style={{
            opacity: hovered ? 1 : 0,
            background: "linear-gradient(to top, rgba(20,17,14,0.75) 0%, transparent 50%)",
          }}
        />
        {/* Gold border glow */}
        <div
          className="absolute inset-0 pointer-events-none transition-all duration-400"
          style={{
            boxShadow: hovered ? "inset 0 0 0 1.5px rgba(196,149,42,0.65)" : "none",
          }}
        />
        {/* Info label */}
        {hovered && media && (
          <div className="absolute bottom-0 inset-x-0 px-3 pb-3">
            <p className="font-serif text-xs text-cream leading-snug">
              {media.alt_text || slotLabel}
            </p>
            <p className="font-mono text-[8px] tracking-widest text-gold uppercase mt-0.5">
              Reel
            </p>
          </div>
        )}
      </motion.div>

      {theater && media && (
        <YouTubeTheater
          url={media.url}
          title={media.alt_text || slotLabel}
          onClose={() => setTheater(false)}
        />
      )}
    </>
  );
}

// ── Wedding Film Card (16:9) ───────────────────────────────────────────────────
function WeddingFilmCard({
  media,
  index,
  slotLabel,
}: {
  media: MediaItem | null;
  index: number;
  slotLabel: string;
}) {
  const [hovered, setHovered] = useState(false);
  const [theater, setTheater] = useState(false);

  const thumbnailSrc =
    media?.thumbnail_url ||
    (media?.url && isYouTube(media.url) && getYouTubeId(media.url)
      ? `https://img.youtube.com/vi/${getYouTubeId(media.url)}/maxresdefault.jpg`
      : null);
  const thumbnailFallback =
    media?.url && isYouTube(media.url) && getYouTubeId(media.url)
      ? `https://img.youtube.com/vi/${getYouTubeId(media.url)}/hqdefault.jpg`
      : undefined;

  return (
    <>
      <motion.div
        className="relative overflow-hidden rounded-[3px] cursor-pointer group w-full"
        style={{ aspectRatio: "16/9" }}
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.75, delay: index * 0.09, ease: [0.16, 1, 0.3, 1] }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => media && setTheater(true)}
      >
        {media ? (
          <>
            {thumbnailSrc && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={thumbnailSrc}
                alt={media.alt_text ?? ""}
                draggable={false}
                onError={(e) => {
                  if (thumbnailFallback)
                    (e.target as HTMLImageElement).src = thumbnailFallback;
                }}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${hovered ? "opacity-70" : "opacity-100"}`}
              />
            )}
            {/* Play overlay */}
            <div
              className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${hovered ? "opacity-100" : "opacity-0"}`}
              style={{ background: "rgba(20,17,14,0.35)" }}
            >
              <div className="w-14 h-14 rounded-full bg-gold/90 flex items-center justify-center shadow-xl">
                <span className="text-lg text-cream pl-1">▶</span>
              </div>
            </div>
          </>
        ) : (
          <div
            className="w-full h-full flex flex-col items-center justify-center gap-3 p-6"
            style={{
              background: "linear-gradient(135deg, #E8E1D4 0%, #DDD5C4 100%)",
            }}
          >
            <span className="opacity-20 text-4xl">🎬</span>
            <div className="text-center">
              <p className="font-mono text-[9px] tracking-[0.32em] text-gold-muted uppercase opacity-60 mb-1">
                16:9 Film
              </p>
              <p className="font-sans text-xs text-ink-soft opacity-40">
                {slotLabel}
              </p>
            </div>
          </div>
        )}

        {/* Hover gradient */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-400"
          style={{
            opacity: hovered ? 1 : 0,
            background: "linear-gradient(to top, rgba(20,17,14,0.7) 0%, transparent 55%)",
          }}
        />
        {/* Gold border glow */}
        <div
          className="absolute inset-0 pointer-events-none transition-all duration-400"
          style={{
            boxShadow: hovered ? "inset 0 0 0 1.5px rgba(196,149,42,0.6)" : "none",
          }}
        />
        {/* Info label */}
        {hovered && media && (
          <div className="absolute bottom-0 inset-x-0 px-4 pb-4">
            <p className="font-serif text-sm text-cream">
              {media.alt_text || slotLabel}
            </p>
            <p className="font-mono text-[9px] tracking-widest text-gold uppercase mt-0.5">
              Wedding Film
            </p>
          </div>
        )}
      </motion.div>

      {theater && media && (
        <YouTubeTheater
          url={media.url}
          title={media.alt_text || slotLabel}
          onClose={() => setTheater(false)}
        />
      )}
    </>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function SignatureFilms() {
  const [reels, setReels] = useState<(MediaItem | null)[]>(Array(6).fill(null));
  const [wfs, setWfs] = useState<(MediaItem | null)[]>(Array(4).fill(null));

  useEffect(() => {
    getAllProjects()
      .then((projects) => {
        const allVideos: MediaItem[] = projects.flatMap((p) =>
          (p.media ?? []).filter((m) => m.media_type === "video")
        );

        const reelVideos: MediaItem[] = [];
        const wfVideos: MediaItem[] = [];
        const untagged: MediaItem[] = [];

        for (const v of allVideos) {
          const tag = (v.alt_text || "").toLowerCase();
          if (tag.startsWith("wf") || tag.startsWith("wedding")) wfVideos.push(v);
          else if (tag.startsWith("reel") || tag.startsWith("r_")) reelVideos.push(v);
          else untagged.push(v);
        }

        for (const v of untagged) {
          if (reelVideos.length < 6) reelVideos.push(v);
          else if (wfVideos.length < 4) wfVideos.push(v);
        }

        setReels(Array.from({ length: 6 }, (_, i) => reelVideos[i] ?? null));
        setWfs(Array.from({ length: 4 }, (_, i) => wfVideos[i] ?? null));
      })
      .catch(() => {});
  }, []);

  const reelLabels = ["Reel 01", "Reel 02", "Reel 03", "Reel 04", "Reel 05", "Reel 06"];
  const wfLabels = ["Wedding Film 01", "Wedding Film 02", "Wedding Film 03", "Wedding Film 04"];

  return (
    <section id="work" className="section-pad bg-cream overflow-hidden">
      {/* Section header */}
      <div className="mb-10">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-8 h-px bg-gold" />
          <span className="font-mono text-xs tracking-[0.35em] text-gold uppercase">
            Signature Films
          </span>
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

      {/* ── REELS ROW (9:16 cards, horizontal scroll) ── */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="font-mono text-[10px] tracking-[0.3em] text-gold-muted uppercase">
            📱 Reels
          </span>
          <div className="flex-1 h-px bg-gold/15" />
        </div>
        <div
          className="flex gap-3 overflow-x-auto pb-3"
          style={{
            scrollSnapType: "x mandatory",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {/* Hide scrollbar on webkit */}
          <style>{`.reel-row::-webkit-scrollbar { display: none; }`}</style>
          {reels.map((media, i) => (
            <div key={i} style={{ scrollSnapAlign: "start" }}>
              <ReelCard media={media} index={i} slotLabel={reelLabels[i]} />
            </div>
          ))}
        </div>
      </div>

      {/* ── WEDDING FILMS (16:9 cards, 2-col grid) ── */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <span className="font-mono text-[10px] tracking-[0.3em] text-gold-muted uppercase">
            🎬 Wedding Films
          </span>
          <div className="flex-1 h-px bg-gold/15" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          {wfs.map((media, i) => (
            <WeddingFilmCard key={i} media={media} index={i} slotLabel={wfLabels[i]} />
          ))}
        </div>
      </div>

      {/* Quote */}
      <motion.div
        className="mt-12 flex flex-col items-center text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.4 }}
      >
        <div
          className="w-12 h-px mb-5"
          style={{ background: "linear-gradient(90deg, transparent, #C4952A, transparent)" }}
        />
        <p className="font-serif italic text-xl md:text-2xl text-ink leading-snug max-w-lg">
          "Every wedding is a once-in-a-lifetime story.{" "}
          <span style={{ color: "#C4952A" }}>We make sure it's told beautifully."</span>
        </p>
        <p className="font-mono text-[10px] tracking-[0.35em] text-gold-muted uppercase mt-4">
          — Akshay Vastrad Media House
        </p>
      </motion.div>
    </section>
  );
}
