"use client";
// components/ProjectList.tsx — Luxury editorial accordion list.

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Project } from "@/lib/api";

interface Props { projects: Project[] }

export default function ProjectList({ projects }: Props) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section id="about" className="section-pad bg-cream-soft">
      {/* Header */}
      <div className="mb-16 max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-8 h-px bg-gold" />
          <span className="font-mono text-xs tracking-[0.35em] text-gold uppercase">
            All Works
          </span>
        </div>
        <h2 className="font-serif font-light text-4xl md:text-6xl text-ink">
          Project <em className="text-gold-gradient not-italic">Index</em>
        </h2>
      </div>

      <div className="max-w-5xl mx-auto">
        {/* Column headers */}
        <div className="hidden md:grid grid-cols-[3rem_1fr_auto] gap-8 pb-4 mb-2 border-b border-cream-border">
          <span className="font-mono text-[10px] tracking-widest text-ink-faint uppercase">No.</span>
          <span className="font-mono text-[10px] tracking-widest text-ink-faint uppercase">Project</span>
          <span className="font-mono text-[10px] tracking-widest text-ink-faint uppercase">Year</span>
        </div>

        {projects.map((project, i) => (
          <div key={project.id} className="border-b border-cream-border">
            <button
              className="w-full text-left py-6 md:py-8 grid grid-cols-[1fr_auto] md:grid-cols-[3rem_1fr_auto] gap-4 md:gap-8 group items-start"
              onClick={() => setOpen(open === project.id ? null : project.id)}
            >
              {/* Number */}
              <span className="hidden md:block font-mono text-xs text-ink-faint pt-1 tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* Title & client */}
              <div>
                <h3 className="font-serif font-light text-xl md:text-3xl text-ink group-hover:text-gold-dark transition-colors duration-300">
                  {project.title}
                </h3>
                {project.client_name && (
                  <p className="font-sans text-xs text-ink-muted mt-1 tracking-wide">
                    {project.client_name}
                  </p>
                )}
              </div>

              {/* Year + chevron */}
              <div className="flex items-center gap-4 pt-1">
                <span className="font-mono text-xs text-ink-faint tabular-nums">
                  {project.release_date
                    ? new Date(project.release_date).getFullYear()
                    : "—"}
                </span>
                <motion.span
                  className="text-gold-dark text-sm"
                  animate={{ rotate: open === project.id ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                >
                  ↓
                </motion.span>
              </div>
            </button>

            {/* Description expand */}
            <AnimatePresence initial={false}>
              {open === project.id && (
                <motion.div
                  key="body"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="pb-8 md:pl-[calc(3rem+2rem)] font-sans font-light text-sm text-ink-muted leading-relaxed max-w-2xl">
                    {project.description ?? "No description available."}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}
