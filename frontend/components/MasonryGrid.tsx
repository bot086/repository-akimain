"use client";
// components/MasonryGrid.tsx
// Option B: Pinterest-style masonry grid.
// Photos → golden border glow on hover, high-res reveal.
// Videos → silent auto-play on hover, theater on click.

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import type { Project, MediaItem } from "@/lib/api";
import TheaterMode from "./TheaterMode";

interface Props {
  projects: Project[];
}

function MediaCard({ item, i }: { item: MediaItem & { projectTitle: string }; i: number }) {
  const [hovered, setHovered] = useState(false);
  const [theater, setTheater] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const onHover = useCallback((on: boolean) => {
    setHovered(on);
    if (item.media_type === "video" && videoRef.current) {
      if (on) videoRef.current.play().catch(() => {});
      else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [item.media_type]);

  // Vary heights for true masonry feel
  const heightClasses = ["aspect-[3/4]", "aspect-square", "aspect-[4/5]", "aspect-[2/3]", "aspect-[3/4]", "aspect-[4/3]"];
  const heightClass = heightClasses[i % heightClasses.length];

  return (
    <>
      <motion.div
        className={`relative overflow-hidden rounded-[2px] cursor-pointer group ${heightClass}`}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, delay: (i % 4) * 0.08, ease: [0.16, 1, 0.3, 1] }}
        onMouseEnter={() => onHover(true)}
        onMouseLeave={() => onHover(false)}
        onClick={() => setTheater(true)}
      >
        {/* Media */}
        {item.media_type === "video" ? (
          <>
            {/* Poster image shown when not hovered */}
            {item.thumbnail_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.thumbnail_url}
                alt={item.alt_text ?? ""}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${hovered ? "opacity-0" : "opacity-100"}`}
                draggable={false}
              />
            )}
            <video
              ref={videoRef}
              src={item.url}
              muted
              loop
              playsInline
              preload="metadata"
              className={`w-full h-full object-cover transition-opacity duration-500 ${hovered ? "opacity-100" : "opacity-0"}`}
            />
          </>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.thumbnail_url || item.url}
            alt={item.alt_text ?? ""}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            draggable={false}
          />
        )}

        {/* Hover overlay — cream-gold gradient */}
        <div
          className={`absolute inset-0 transition-opacity duration-400 pointer-events-none`}
          style={{
            opacity: hovered ? 1 : 0,
            background:
              "linear-gradient(to top, rgba(196,149,42,0.35) 0%, rgba(247,243,236,0.10) 50%, transparent 100%)",
          }}
        />

        {/* Gold border glow on hover */}
        <div
          className="absolute inset-0 pointer-events-none transition-all duration-400 rounded-[2px]"
          style={{
            boxShadow: hovered
              ? "inset 0 0 0 1.5px rgba(196,149,42,0.7), 0 8px 40px rgba(196,149,42,0.15)"
              : "inset 0 0 0 0px transparent",
          }}
        />

        {/* Bottom label on hover */}
        <div
          className={`absolute bottom-0 inset-x-0 px-4 pb-4 pt-8 transition-all duration-400 ${
            hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        >
          <p className="font-sans text-xs tracking-wider text-cream font-medium truncate">
            {item.alt_text || item.projectTitle}
          </p>
          {item.media_type === "video" && (
            <p className="font-mono text-[10px] text-gold tracking-widest uppercase mt-0.5">
              ▶ Play
            </p>
          )}
        </div>
      </motion.div>

      {theater && <TheaterMode item={item} onClose={() => setTheater(false)} />}
    </>
  );
}

export default function MasonryGrid({ projects }: Props) {
  // Flatten all media from all projects, attach project title
  const allMedia = projects.flatMap((p) =>
    (p.media ?? []).map((m) => ({ ...m, projectTitle: p.title }))
  );

  if (!allMedia.length) return null;

  return (
    <section id="gallery" className="section-pad bg-cream-warm">
      {/* Header */}
      <div className="mb-16">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-8 h-px bg-gold" />
          <span className="font-mono text-xs tracking-[0.35em] text-gold uppercase">
            Gallery
          </span>
        </div>
        <h2 className="font-serif font-light text-4xl md:text-6xl text-ink">
          The <em className="text-gold-gradient not-italic">Archive</em>
        </h2>
        <p className="font-sans font-light text-sm text-ink-muted mt-4 max-w-xs">
          Hover to preview. Click to open.
        </p>
      </div>

      {/* Masonry CSS columns — most performant, true stagger */}
      <div
        className="gap-3 md:gap-4"
        style={{
          columnCount: "var(--col-count, 2)",
          columnGap: "inherit",
        } as React.CSSProperties}
      >
        <style>{`
          @media (min-width: 640px)  { :root { --col-count: 2 } }
          @media (min-width: 768px)  { :root { --col-count: 3 } }
          @media (min-width: 1024px) { :root { --col-count: 4 } }
        `}</style>

        {allMedia.map((item, i) => (
          <div key={item.id} className="break-inside-avoid mb-3 md:mb-4">
            <MediaCard item={item} i={i} />
          </div>
        ))}
      </div>
    </section>
  );
}
