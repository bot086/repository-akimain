"use client";
// components/DarkRoom.tsx
// Option D: The Dark Room — cursor acts as a torch.
// Media tiles hide in darkness and reveal only under the light beam.
// On mobile, tiles are tap-to-reveal (gold bloom on tap).

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Project, MediaItem } from "@/lib/api";
import TheaterMode from "./TheaterMode";

interface Props {
  projects: Project[];
}

interface TorchPos {
  x: number;
  y: number;
}

function MediaTile({ item, index, torch }: {
  item: MediaItem;
  index: number;
  torch: TorchPos | null;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);       // mobile: tap-to-reveal
  const [openInTheater, setOpenInTheater] = useState(false);
  const [proximity, setProximity] = useState(0);         // 0–1, how close the torch is

  // Compute proximity from torch position to tile centre
  useEffect(() => {
    if (!torch || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dist = Math.hypot(torch.x - cx, torch.y - cy);
    const radius = 180; // px
    setProximity(Math.max(0, 1 - dist / radius));
  }, [torch]);

  const opacity = revealed ? 1 : Math.pow(proximity, 1.5);
  const glowIntensity = Math.floor(proximity * 40);

  return (
    <>
      <div
        ref={ref}
        className="relative aspect-[4/3] overflow-hidden cursor-pointer group"
        style={{ borderRadius: 4 }}
        onClick={() => {
          if (!revealed && proximity < 0.1) {
            // Mobile: first tap reveals
            setRevealed(true);
          } else {
            setOpenInTheater(true);
          }
        }}
      >
        {/* Dark overlay — fades out based on proximity */}
        <div
          className="absolute inset-0 bg-noir z-10 pointer-events-none transition-opacity duration-75"
          style={{ opacity: Math.max(0, 1 - opacity) }}
        />

        {/* Gold border glow on reveal */}
        <div
          className="absolute inset-0 z-20 pointer-events-none transition-all duration-75"
          style={{
            boxShadow: proximity > 0.1
              ? `inset 0 0 ${glowIntensity}px rgba(212,175,55,${proximity * 0.3})`
              : "none",
          }}
        />

        {/* Media content */}
        {item.media_type === "video" ? (
          <video
            src={item.url}
            poster={item.thumbnail_url || undefined}
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            ref={(el) => {
              if (!el) return;
              if (proximity > 0.4 || revealed) el.play().catch(() => {});
              else el.pause();
            }}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.thumbnail_url || item.url}
            alt={item.alt_text || ""}
            className="w-full h-full object-cover transition-all duration-150"
            style={{
              filter: `brightness(${0.1 + opacity * 0.9}) saturate(${0.2 + opacity * 0.8})`,
            }}
          />
        )}

        {/* Click-to-expand hint */}
        {(proximity > 0.5 || revealed) && (
          <motion.div
            className="absolute inset-0 z-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="text-gold text-xs tracking-widest uppercase font-sans bg-noir/60 px-3 py-1 rounded-full">
              {item.media_type === "video" ? "▶ Play" : "⊕ View"}
            </span>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {openInTheater && (
          <TheaterMode item={item} onClose={() => setOpenInTheater(false)} />
        )}
      </AnimatePresence>
    </>
  );
}

export default function DarkRoom({ projects }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [torch, setTorch] = useState<TorchPos | null>(null);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    setTorch({ x: e.clientX, y: e.clientY });
  }, []);

  // Flatten all media from featured projects
  const allMedia: MediaItem[] = projects.flatMap((p) =>
    p.media.map((m) => ({ ...m, _projectTitle: p.title }))
  );

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen bg-noir py-24 px-6 md:px-16 torch-cursor"
      onMouseMove={onMouseMove}
      onMouseLeave={() => setTorch(null)}
    >
      {/* Torch — follows cursor */}
      {torch && (
        <div
          className="pointer-events-none fixed z-50"
          style={{
            left: torch.x,
            top: torch.y,
            transform: "translate(-50%, -50%)",
            width: 360,
            height: 360,
            background:
              "radial-gradient(circle, rgba(212,175,55,0.12) 0%, rgba(212,175,55,0.04) 40%, transparent 70%)",
            borderRadius: "50%",
            mixBlendMode: "screen",
          }}
        />
      )}

      {/* Custom cursor dot */}
      {torch && (
        <div
          className="pointer-events-none fixed z-[60] rounded-full"
          style={{
            left: torch.x,
            top: torch.y,
            transform: "translate(-50%, -50%)",
            width: 8,
            height: 8,
            background: "#D4AF37",
            boxShadow: "0 0 10px 4px rgba(212,175,55,0.5)",
          }}
        />
      )}

      {/* Section label */}
      <div className="mb-16 text-center">
        <p className="text-xs tracking-[0.5em] text-gold/40 uppercase font-sans mb-3">
          — The Work —
        </p>
        <h2 className="font-serif text-2xl md:text-4xl text-gold-gradient">
          Move your light
        </h2>
        <p className="text-gold/30 text-sm font-sans mt-2">
          Drag your cursor to reveal what lives in the dark.
        </p>
      </div>

      {/* Media grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 max-w-7xl mx-auto">
        {allMedia.map((item, i) => (
          <MediaTile key={item.id} item={item} index={i} torch={torch} />
        ))}
      </div>
    </section>
  );
}
