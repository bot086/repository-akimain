"use client";
// components/HeroSection.tsx
// Luxury cream hero — gold shimmer name, editorial tagline, buttery entrance.

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden bg-cream-soft">

      {/* Subtle cream-to-gold radial vignette — top right */}
      <div
        className="absolute top-0 right-0 w-[60vw] h-[60vh] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at top right, rgba(232,201,122,0.18) 0%, transparent 70%)",
        }}
      />
      {/* Bottom left warmth */}
      <div
        className="absolute bottom-0 left-0 w-[40vw] h-[40vh] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at bottom left, rgba(196,149,42,0.10) 0%, transparent 70%)",
        }}
      />

      {/* ── Top nav bar ── */}
      <motion.div
        className="relative z-10 flex justify-between items-start px-8 md:px-16 pt-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        {/* Logo mark */}
        <span className="font-serif text-sm tracking-[0.3em] text-gold uppercase">
          AV
        </span>
        {/* Nav links */}
        <nav className="hidden md:flex gap-10">
          {["Work", "About", "Contact"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="font-sans text-xs tracking-[0.2em] text-ink-muted hover:text-gold uppercase transition-colors duration-300"
            >
              {item}
            </a>
          ))}
        </nav>
      </motion.div>

      {/* ── Main hero copy ── */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 pb-16">

        {/* Eyebrow line */}
        <motion.div
          className="flex items-center gap-4 mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="w-12 h-px bg-gold" />
          <span className="font-mono text-xs tracking-[0.35em] text-gold uppercase">
            Filmmaker · Photographer
          </span>
        </motion.div>

        {/* Name */}
        <div className="overflow-hidden mb-2">
          <motion.h1
            className="font-serif font-light text-[clamp(3.5rem,10vw,9rem)] leading-[0.9] tracking-tight text-ink"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            Akshay
          </motion.h1>
        </div>
        <div className="overflow-hidden mb-8">
          <motion.h1
            className="font-serif italic font-light text-[clamp(3.5rem,10vw,9rem)] leading-[0.9] tracking-tight text-gold-gradient"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            Vastrad
          </motion.h1>
        </div>

        {/* Gold rule */}
        <motion.div
          className="gold-rule w-32 mb-8"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          style={{ transformOrigin: "left" }}
          transition={{ duration: 0.9, delay: 1, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Tagline */}
        <motion.p
          className="font-sans font-light text-base md:text-lg text-ink-muted max-w-sm leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
        >
          Every frame tells a story.
          <br />
          Every story deserves to be seen.
        </motion.p>
      </div>

      {/* ── Bottom row ── */}
      <motion.div
        className="relative z-10 flex justify-between items-end px-8 md:px-16 pb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.3 }}
      >
        {/* Scroll cue */}
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[10px] tracking-[0.3em] text-ink-faint uppercase">
            Scroll
          </span>
          <motion.div
            className="w-px h-10 bg-gradient-to-b from-gold to-transparent mx-auto"
            animate={{ scaleY: [1, 0.5, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          />
        </div>

        {/* Side label */}
        <p className="font-mono text-[10px] tracking-[0.25em] text-ink-faint uppercase">
          Visual Storytelling
        </p>
      </motion.div>
    </section>
  );
}
