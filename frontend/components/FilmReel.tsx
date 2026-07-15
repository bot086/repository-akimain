"use client";
// components/FilmReel.tsx — AK2.0
// Actual cinematic 35mm film reel scrolling L→R.
// • Dark film strip background with sprocket holes top & bottom
// • Photos inside film frames, looping infinitely
// • CENTER photo is flat (rotateY 0°) — the further from center, the more it bends
// • Smooth requestAnimationFrame scroll — butter smooth, GPU composited

import { useEffect, useRef, useState } from "react";
import type { Project, MediaItem } from "@/lib/api";
import { resolveMediaUrl } from "@/lib/api";

// 30 placeholder frames (replaced by real photos)
const PLACEHOLDER_FRAMES = Array.from({ length: 30 }, (_, i) => ({
  id: `ph-${i + 1}`,
  url: null as string | null,
  alt: `Wedding Photo ${String(i + 1).padStart(2, "0")}`,
}));

interface Props {
  projects: Project[];
}

type Frame = { id: string; url: string | null; alt: string };

export default function FilmReel({ projects }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const scrollX = useRef(0);
  const isPaused = useRef(false);
  const [ready, setReady] = useState(false);

  // Collect real photos or fall back to placeholders
  const realPhotos: Frame[] = projects.flatMap(p =>
    (p.media ?? [])
      .filter(m => m.media_type === "photo")
      .map(m => ({ id: m.id, url: m.url, alt: m.alt_text ?? p.title }))
  );
  const frames: Frame[] = realPhotos.length >= 8 ? realPhotos : PLACEHOLDER_FRAMES;

  // Triple the frames for seamless infinite loop
  const tripled = [...frames, ...frames, ...frames];

  const FRAME_W = 224; // px (each frame width including gap)
  const TOTAL_ONE_SET = frames.length * FRAME_W;
  const SPEED = 0.6; // px per frame

  useEffect(() => {
    setReady(true);
    const track = trackRef.current;
    if (!track) return;

    // Reset to middle set so we can loop back to start seamlessly
    scrollX.current = TOTAL_ONE_SET;
    track.style.transform = `translateX(-${scrollX.current}px)`;

    const animate = () => {
      if (!isPaused.current) {
        scrollX.current += SPEED;
        // When we've scrolled one full set, jump back (seamless loop)
        if (scrollX.current >= TOTAL_ONE_SET * 2) {
          scrollX.current -= TOTAL_ONE_SET;
        }

        if (track) {
          track.style.transform = `translateX(-${scrollX.current}px)`;

          // ── 3D bend: calculate rotateY per frame based on distance from center ──
          const viewportCx = window.innerWidth / 2;
          const items = track.querySelectorAll<HTMLElement>(".reel-frame");
          items.forEach(item => {
            const rect = item.getBoundingClientRect();
            const itemCx = rect.left + rect.width / 2;
            const dist = itemCx - viewportCx;
            const maxDist = window.innerWidth * 0.55;
            const rotateY = Math.max(-38, Math.min(38, (dist / maxDist) * 38));
            const scale = 1 - Math.abs(rotateY) * 0.006;
            const zTranslate = -Math.abs(rotateY) * 1.2;
            item.style.transform = `perspective(900px) rotateY(${rotateY}deg) translateZ(${zTranslate}px) scale(${scale})`;
          });
        }
      }
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [frames.length, TOTAL_ONE_SET]);

  return (
    <div className="relative w-full overflow-hidden select-none"
      style={{ background: "#0D0B09" }}>

      {/* ── Top sprocket holes ── */}
      <div className="relative h-7 flex items-center" style={{ background: "#111009" }}>
        <div className="flex gap-0 w-full">
          {Array.from({ length: 60 }).map((_, i) => (
            <div key={i} className="flex-shrink-0"
              style={{ width: "3.5%", display: "flex", justifyContent: "center" }}>
              <div className="w-4 h-4 rounded-[2px] bg-[#0D0B09] border border-[#2a2620]" />
            </div>
          ))}
        </div>
        {/* Thin gold edge */}
        <div className="absolute bottom-0 inset-x-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(196,149,42,0.3), transparent)" }} />
      </div>

      {/* ── Film frame area ── */}
      <div className="relative py-4 overflow-hidden"
        onMouseEnter={() => { isPaused.current = true; }}
        onMouseLeave={() => { isPaused.current = false; }}
        style={{ background: "#0D0B09" }}>

        {/* Track */}
        <div
          ref={trackRef}
          className="flex gap-3 will-change-transform"
          style={{
            width: "max-content",
            transform: "translateX(0px)",
          }}
        >
          {tripled.map((frame, i) => (
            <div
              key={`${frame.id}-${i}`}
              className="reel-frame flex-shrink-0 overflow-hidden rounded-[1px] cursor-pointer"
              style={{
                width: "200px",
                height: "140px",
                border: "2px solid #2a2520",
                transformOrigin: "center center",
                willChange: "transform",
              }}
            >
              {frame.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={resolveMediaUrl(frame.url)} alt={frame.alt} loading="lazy"
                  className="w-full h-full object-cover"
                  draggable={false} />
              ) : (
                /* Placeholder frame */
                <div className="w-full h-full flex flex-col items-center justify-center gap-2"
                  style={{ background: "linear-gradient(135deg, #1a1710 0%, #221e16 100%)" }}>
                  <span className="opacity-20 text-xl">🖼</span>
                  <span className="font-mono text-[7px] tracking-[0.3em] uppercase opacity-25"
                    style={{ color: "#C4952A" }}>
                    {frame.alt}
                  </span>
                </div>
              )}

              {/* Frame edge marks (film perforations simulation) */}
              <div className="absolute left-0 inset-y-0 w-[3px] flex flex-col justify-around pointer-events-none">
                {[0, 1, 2].map(n => (
                  <div key={n} className="w-[3px] h-2 rounded-full" style={{ background: "#2a2520" }} />
                ))}
              </div>
              <div className="absolute right-0 inset-y-0 w-[3px] flex flex-col justify-around pointer-events-none">
                {[0, 1, 2].map(n => (
                  <div key={n} className="w-[3px] h-2 rounded-full" style={{ background: "#2a2520" }} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Left + right fade vignette so it looks like it runs off the edge of the reel */}
        <div className="absolute inset-y-0 left-0 w-24 pointer-events-none"
          style={{ background: "linear-gradient(90deg, #0D0B09 0%, transparent 100%)" }} />
        <div className="absolute inset-y-0 right-0 w-24 pointer-events-none"
          style={{ background: "linear-gradient(270deg, #0D0B09 0%, transparent 100%)" }} />
      </div>

      {/* ── Bottom sprocket holes ── */}
      <div className="relative h-7 flex items-center" style={{ background: "#111009" }}>
        {/* Thin gold edge */}
        <div className="absolute top-0 inset-x-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(196,149,42,0.3), transparent)" }} />
        <div className="flex gap-0 w-full">
          {Array.from({ length: 60 }).map((_, i) => (
            <div key={i} className="flex-shrink-0"
              style={{ width: "3.5%", display: "flex", justifyContent: "center" }}>
              <div className="w-4 h-4 rounded-[2px] bg-[#0D0B09] border border-[#2a2620]" />
            </div>
          ))}
        </div>
      </div>

      {/* Label */}
      <div className="absolute bottom-7 right-5 pointer-events-none">
        <span className="font-mono text-[8px] tracking-[0.4em] uppercase"
          style={{ color: "rgba(196,149,42,0.4)" }}>
          AKSHAY VASTRAD · 35MM
        </span>
      </div>
    </div>
  );
}
