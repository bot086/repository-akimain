"use client";
// components/HeroSection.tsx — AK2.0
// Left: Name + tagline. Right: Akshay's portrait collage (3 photo slots).

import { motion } from "framer-motion";

// ── Placeholder image slot ────────────────────────────────────────────────────
function PhotoSlot({
  label,
  className,
  delay,
}: {
  label: string;
  className?: string;
  delay: number;
}) {
  return (
    <motion.div
      className={`relative overflow-hidden rounded-[2px] border border-gold/25 group ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.015 }}
    >
      {/* Warm placeholder gradient */}
      <div className="w-full h-full bg-gradient-to-br from-cream-warm via-gold-pale to-cream-warm flex flex-col items-center justify-center gap-2 p-4">
        <span className="text-2xl opacity-40">📷</span>
        <span className="font-mono text-[9px] tracking-[0.25em] text-gold-muted uppercase text-center leading-relaxed opacity-60">
          {label}
        </span>
      </div>
      {/* Hover gold glow border */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-500 rounded-[2px]"
        style={{
          boxShadow: "inset 0 0 0 0px transparent",
        }}
      />
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[2px]"
        style={{ boxShadow: "inset 0 0 0 1.5px rgba(196,149,42,0.6), 0 12px 40px rgba(196,149,42,0.12)" }} />
    </motion.div>
  );
}

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden bg-cream-soft">

      {/* ── Ambient gold vignettes ── */}
      <div className="absolute top-0 right-0 w-[55vw] h-[65vh] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 80% 10%, rgba(232,201,122,0.16) 0%, transparent 65%)" }} />
      <div className="absolute bottom-0 left-0 w-[35vw] h-[35vh] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 10% 90%, rgba(196,149,42,0.09) 0%, transparent 65%)" }} />

      {/* ── Top nav ── */}
      <motion.div
        className="relative z-10 flex justify-between items-center px-8 md:px-16 pt-10"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <span className="font-serif italic text-gold text-lg tracking-wide">AV</span>
        <nav className="hidden md:flex gap-10">
          {[["Work", "#work"], ["Gallery", "#gallery"], ["About", "#about"], ["Contact", "#contact"]].map(([label, href]) => (
            <a key={label} href={href}
              className="font-sans text-[11px] tracking-[0.22em] text-ink-muted hover:text-gold uppercase transition-colors duration-300">
              {label}
            </a>
          ))}
        </nav>
      </motion.div>

      {/* ── Main content: two-column ── */}
      <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-0 items-center px-8 md:px-16 lg:px-0 py-16">

        {/* Left: Text */}
        <div className="lg:pl-24 lg:pr-12 flex flex-col justify-center">
          {/* Eyebrow */}
          <motion.div className="flex items-center gap-4 mb-8"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}>
            <div className="w-10 h-px bg-gold" />
            <span className="font-mono text-[10px] tracking-[0.35em] text-gold uppercase">
              Wedding Filmmaker · Media House
            </span>
          </motion.div>

          {/* Name */}
          <div className="overflow-hidden mb-1">
            <motion.h1
              className="font-serif font-light text-[clamp(3.2rem,8vw,7.5rem)] leading-[0.88] tracking-tight text-ink"
              initial={{ y: "105%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1.05, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}>
              Akshay
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-10">
            <motion.h1
              className="font-serif italic font-light text-[clamp(3.2rem,8vw,7.5rem)] leading-[0.88] tracking-tight text-gold-gradient"
              initial={{ y: "105%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1.05, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}>
              Vastrad
            </motion.h1>
          </div>

          {/* Gold rule */}
          <motion.div className="gold-rule w-24 mb-8"
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            style={{ transformOrigin: "left" }}
            transition={{ duration: 0.9, delay: 1, ease: [0.16, 1, 0.3, 1] }} />

          {/* Tagline */}
          <motion.p
            className="font-sans font-light text-base md:text-lg text-ink-muted max-w-xs leading-relaxed mb-10"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}>
            We turn your wedding into a cinematic film<br />
            <span className="text-ink-faint text-sm">you will cherish for the rest of your life.</span>
          </motion.p>

          {/* CTA */}
          <motion.a href="#contact"
            className="inline-flex items-center gap-3 font-sans text-xs tracking-[0.22em] uppercase text-ink hover:text-gold transition-colors duration-300 group w-fit"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 1.3 }}>
            <span className="w-8 h-px bg-ink group-hover:bg-gold transition-all duration-300 group-hover:w-14" />
            Book Your Wedding
          </motion.a>
        </div>

        {/* Right: Portrait Collage */}
        <div className="lg:pr-16 hidden md:flex items-center justify-center">
          <div className="relative w-full max-w-md lg:max-w-none">
            {/* 3-photo editorial layout */}
            <div className="grid grid-cols-2 gap-3 h-[520px] lg:h-[600px]">

              {/* Left column — one tall portrait */}
              <PhotoSlot
                label="Portrait of Akshay"
                className="h-full"
                delay={0.9}
              />

              {/* Right column — two stacked */}
              <div className="flex flex-col gap-3 h-full">
                <PhotoSlot
                  label="Akshay with Camera"
                  className="flex-1"
                  delay={1.05}
                />
                <PhotoSlot
                  label="Behind the Scenes"
                  className="flex-1"
                  delay={1.2}
                />
              </div>
            </div>

            {/* Floating credential badge */}
            <motion.div
              className="absolute -bottom-4 -left-4 card-cream px-5 py-3 rounded-sm"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.5 }}>
              <p className="font-mono text-[9px] tracking-[0.3em] text-gold uppercase mb-0.5">Experience</p>
              <p className="font-serif text-2xl text-ink">4 <span className="text-sm font-sans font-light text-ink-muted">Years</span></p>
            </motion.div>

            <motion.div
              className="absolute -top-4 -right-4 card-cream px-5 py-3 rounded-sm"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.65 }}>
              <p className="font-mono text-[9px] tracking-[0.3em] text-gold uppercase mb-0.5">Happy Clients</p>
              <p className="font-serif text-2xl text-ink">40+</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Scroll cue ── */}
      <motion.div
        className="relative z-10 flex justify-between items-end px-8 md:px-16 pb-10"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.6 }}>
        <div className="flex flex-col items-center gap-2">
          <span className="font-mono text-[9px] tracking-[0.35em] text-ink-faint uppercase">Scroll</span>
          <motion.div className="w-px h-10 bg-gradient-to-b from-gold to-transparent"
            animate={{ scaleY: [1, 0.45, 1] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }} />
        </div>
        <p className="font-mono text-[9px] tracking-[0.28em] text-ink-faint uppercase">
          Akshay Vastrad Media House
        </p>
      </motion.div>
    </section>
  );
}
