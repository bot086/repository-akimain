"use client";
// components/EditorialSpotlight.tsx
// Option C: As the user scrolls, each project fills the entire screen.
// Smooth CSS parallax — image moves at 0.4x speed, text fades in with golden glow.
// Butter smooth via will-change + transform3d.

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import type { Project } from "@/lib/api";
import { useState } from "react";
import TheaterMode from "./TheaterMode";
import type { MediaItem } from "@/lib/api";

interface Props {
  projects: Project[];
}

function SpotlightSlide({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [theater, setTheater] = useState<MediaItem | null>(null);

  // Scroll-driven parallax
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Soft spring for butter-smooth parallax
  const rawY = useTransform(scrollYProgress, [0, 1], ["12%", "-12%"]);
  const y = useSpring(rawY, { stiffness: 60, damping: 20, mass: 0.5 });

  // Text fade-in as section enters
  const textOpacity = useTransform(scrollYProgress, [0.15, 0.35, 0.65, 0.85], [0, 1, 1, 0]);
  const textY       = useTransform(scrollYProgress, [0.15, 0.35], ["30px", "0px"]);

  const primaryMedia = project.media[0] ?? null;
  const isEven = index % 2 === 0;

  return (
    <>
      <div
        ref={ref}
        className="relative w-full h-screen overflow-hidden"
        id={`project-${project.id}`}
      >
        {/* ── Background image / video with parallax ── */}
        <motion.div
          className="absolute inset-0 will-parallax"
          style={{ y, scale: 1.15 }}
        >
          {primaryMedia?.media_type === "video" ? (
            <video
              src={primaryMedia.url}
              poster={primaryMedia.thumbnail_url ?? undefined}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          ) : primaryMedia ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={primaryMedia.url}
              alt={primaryMedia.alt_text ?? project.title}
              className="w-full h-full object-cover"
              draggable={false}
            />
          ) : (
            /* Fallback — warm gradient when no media yet */
            <div className="w-full h-full bg-gradient-to-br from-cream-warm via-gold-pale to-cream" />
          )}

          {/* Overlay — cream-tinted vignette so text is always legible */}
          <div
            className={`absolute inset-0 ${
              isEven
                ? "bg-gradient-to-r from-[rgba(247,243,236,0.80)] via-[rgba(247,243,236,0.30)] to-transparent"
                : "bg-gradient-to-l from-[rgba(247,243,236,0.80)] via-[rgba(247,243,236,0.30)] to-transparent"
            }`}
          />
          {/* Bottom fade for seamless section blending */}
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-cream to-transparent" />
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-cream to-transparent" />
        </motion.div>

        {/* ── Text content ── */}
        <motion.div
          className={`absolute inset-0 flex flex-col justify-center px-10 md:px-20 lg:px-32 ${
            isEven ? "items-start text-left" : "items-end text-right"
          }`}
          style={{ opacity: textOpacity, y: textY }}
        >
          {/* Index number */}
          <p className="font-mono text-xs tracking-[0.4em] text-gold mb-4 uppercase">
            {String(index + 1).padStart(2, "0")} / {project.client_name ?? "Personal"}
          </p>

          {/* Title */}
          <h2 className="font-serif font-light text-[clamp(2.5rem,6vw,6rem)] leading-tight text-ink mb-4 shadow-gold max-w-2xl">
            {project.title}
          </h2>

          {/* Gold rule */}
          <div className={`gold-rule w-20 mb-6 ${isEven ? "" : "ml-auto"}`} />

          {/* Description */}
          <p className="font-sans font-light text-sm md:text-base text-ink-soft leading-relaxed max-w-xs md:max-w-sm mb-8">
            {project.description}
          </p>

          {/* CTA button */}
          {primaryMedia && (
            <button
              onClick={() => setTheater(primaryMedia)}
              className="group inline-flex items-center gap-3 font-sans text-xs tracking-[0.2em] uppercase text-ink hover:text-gold transition-colors duration-300"
            >
              <span className="w-8 h-px bg-ink group-hover:bg-gold transition-colors duration-300 group-hover:w-12" />
              {primaryMedia.media_type === "video" ? "Watch Film" : "View Work"}
            </button>
          )}
        </motion.div>

        {/* Year tag */}
        {project.release_date && (
          <div className="absolute bottom-8 right-8 md:right-16 font-mono text-xs text-ink-faint tracking-widest">
            {new Date(project.release_date).getFullYear()}
          </div>
        )}
      </div>

      {/* Theater modal */}
      {theater && (
        <TheaterMode item={theater} onClose={() => setTheater(null)} />
      )}
    </>
  );
}

export default function EditorialSpotlight({ projects }: Props) {
  if (!projects.length) return null;

  return (
    <section id="work" className="relative">
      {/* Section header */}
      <div className="section-pad pb-0">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-8 h-px bg-gold" />
          <span className="font-mono text-xs tracking-[0.35em] text-gold uppercase">
            Featured Projects
          </span>
        </div>
        <h2 className="font-serif font-light text-4xl md:text-6xl text-ink">
          Selected <em className="text-gold-gradient not-italic">Works</em>
        </h2>
      </div>

      {/* Full-screen slides */}
      {projects.map((project, i) => (
        <SpotlightSlide key={project.id} project={project} index={i} />
      ))}
    </section>
  );
}
