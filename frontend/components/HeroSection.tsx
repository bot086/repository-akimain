"use client";
// components/HeroSection.tsx — AK2.0
// Clean 2-column grid. Name stacks tight. More gold. Role tags below name.

import { motion } from "framer-motion";

function PhotoSlot({ label, className, delay }: { label: string; className?: string; delay: number }) {
  return (
    <motion.div
      className={`relative overflow-hidden rounded-[2px] border border-gold/25 group ${className}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.012 }}
    >
      <div className="w-full h-full bg-gradient-to-br from-cream-warm via-gold-pale to-[#EDE6D5] flex flex-col items-center justify-center gap-2 p-4">
        <span className="text-xl opacity-25">📷</span>
        <span className="font-mono text-[8px] tracking-[0.28em] text-gold-muted uppercase text-center opacity-50 leading-relaxed">
          {label}
        </span>
      </div>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ boxShadow: "inset 0 0 0 1.5px rgba(196,149,42,0.55), 0 8px 32px rgba(196,149,42,0.12)" }} />
    </motion.div>
  );
}

const ROLES = ["Filmmaker", "Media House", "Editor", "Cinematographer", "Director"];

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-screen flex flex-col overflow-hidden"
      style={{ background: "linear-gradient(155deg, #F9F6F0 0%, #F3EDE0 50%, #EDE6D5 100%)" }}>

      {/* ── Strong gold ambient: right side glow ── */}
      <div className="absolute top-0 right-0 w-[50%] h-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 90% 30%, rgba(232,201,122,0.28) 0%, rgba(196,149,42,0.06) 50%, transparent 75%)" }} />
      {/* Bottom left warm */}
      <div className="absolute bottom-0 left-0 w-[40%] h-[50%] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 10% 90%, rgba(196,149,42,0.13) 0%, transparent 60%)" }} />
      {/* Gold top accent bar */}
      <div className="absolute top-0 inset-x-0 h-[2px] pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent 0%, rgba(196,149,42,0.5) 30%, rgba(232,201,122,0.8) 50%, rgba(196,149,42,0.5) 70%, transparent 100%)" }} />

      {/* ── Nav ── */}
      <motion.div className="relative z-10 flex justify-between items-center px-8 md:px-14 pt-9"
        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}>
        <div className="flex items-center gap-3">
          <span className="font-serif italic text-gold text-xl tracking-wide">AV</span>
          <span className="w-px h-4 bg-gold/30" />
          <span className="font-mono text-[9px] tracking-[0.3em] text-gold-muted uppercase">Media House</span>
        </div>
        <nav className="hidden md:flex gap-8">
          {[["Work", "#work"], ["Gallery", "#gallery"], ["About", "#about"], ["Contact", "#contact"]].map(([label, href]) => (
            <a key={label} href={href}
              className="font-sans text-[11px] tracking-[0.22em] text-ink-muted hover:text-gold uppercase transition-colors duration-300">
              {label}
            </a>
          ))}
        </nav>
      </motion.div>

      {/* ── Main 2-column body ── */}
      <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_480px] gap-0 px-8 md:px-14 pt-10 pb-12">

        {/* ── LEFT: Name block + roles + CTA ── */}
        <div className="flex flex-col justify-center pr-0 lg:pr-12">

          {/* Eyebrow */}
          <motion.div className="flex items-center gap-3 mb-8"
            initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}>
            <div className="w-8 h-px bg-gold" />
            <span className="font-mono text-[10px] tracking-[0.38em] text-gold uppercase">
              Wedding Filmmaker
            </span>
          </motion.div>

          {/* ── AKSHAY — no margin bottom ── */}
          <div className="overflow-hidden">
            <motion.h1
              className="font-serif font-light text-ink leading-[0.92] tracking-[-0.015em]"
              style={{ fontSize: "clamp(4.2rem, 11.5vw, 10rem)" }}
              initial={{ y: "105%" }} animate={{ y: 0 }}
              transition={{ duration: 1.05, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}>
              Akshay
            </motion.h1>
          </div>

          {/* ── VASTRAD — immediately after Akshay ── */}
          <div className="overflow-hidden mb-6">
            <motion.h1
              className="font-serif italic font-light leading-[0.92] tracking-[-0.015em]"
              style={{
                fontSize: "clamp(4.2rem, 11.5vw, 10rem)",
                background: "linear-gradient(120deg, #D4A843 0%, #E8C97A 35%, #C4952A 65%, #B8860B 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
              initial={{ y: "105%" }} animate={{ y: 0 }}
              transition={{ duration: 1.05, delay: 0.62, ease: [0.16, 1, 0.3, 1] }}>
              Vastrad
            </motion.h1>
          </div>

          {/* Gold rule */}
          <motion.div
            className="h-[1.5px] w-28 mb-8"
            style={{ background: "linear-gradient(90deg, #C4952A, #E8C97A 50%, transparent)", transformOrigin: "left" }}
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            transition={{ duration: 0.9, delay: 1.0, ease: [0.16, 1, 0.3, 1] }} />

          {/* ── Role tags — gold, horizontal ── */}
          <motion.div className="flex flex-wrap gap-x-5 gap-y-2 mb-8"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.05 }}>
            {ROLES.map((role, i) => (
              <span key={role} className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-gold opacity-70" />
                <span className="font-mono text-[10px] tracking-[0.28em] text-gold uppercase whitespace-nowrap">
                  {role}
                </span>
              </span>
            ))}
          </motion.div>

          {/* Tagline */}
          <motion.p className="font-sans font-light text-sm md:text-base text-ink-muted leading-relaxed mb-8 max-w-sm"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.15 }}>
            We turn your wedding into a cinematic film<br />
            <span className="text-ink-faint text-xs md:text-sm">you will cherish for the rest of your life.</span>
          </motion.p>

          {/* CTA */}
          <motion.a href="#contact"
            className="inline-flex items-center gap-3 font-sans text-xs tracking-[0.25em] uppercase group w-fit"
            style={{ color: "#1C1916" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 1.3 }}
            onMouseEnter={e => (e.currentTarget.style.color = "#C4952A")}
            onMouseLeave={e => (e.currentTarget.style.color = "#1C1916")}>
            <span className="w-8 h-px bg-current transition-all duration-300 group-hover:w-14" />
            Book Your Wedding
          </motion.a>
        </div>

        {/* ── RIGHT: Portrait collage ── */}
        <div className="hidden md:flex items-center justify-end">
          <div className="w-full max-w-sm lg:max-w-none">

            {/* Portrait grid */}
            <div className="grid grid-cols-2 gap-3 h-[460px] lg:h-[540px]">
              <PhotoSlot label="Portrait of Akshay" className="h-full" delay={0.9} />
              <div className="flex flex-col gap-3 h-full">
                <PhotoSlot label="With Camera" className="flex-1" delay={1.05} />
                <PhotoSlot label="Behind the Scenes" className="flex-1" delay={1.2} />
              </div>
            </div>

            {/* Credential badges */}
            <div className="flex justify-between gap-3 mt-3">
              <div className="flex-1 px-4 py-3 text-center border border-gold/20 rounded-[2px]"
                style={{ background: "rgba(255,251,244,0.7)" }}>
                <p className="font-mono text-[8px] tracking-widest text-gold uppercase mb-0.5">Experience</p>
                <p className="font-serif text-xl text-ink">4 <span className="text-xs font-sans font-light text-ink-muted">Years</span></p>
              </div>
              <div className="flex-1 px-4 py-3 text-center border border-gold/20 rounded-[2px]"
                style={{ background: "rgba(255,251,244,0.7)" }}>
                <p className="font-mono text-[8px] tracking-widest text-gold uppercase mb-0.5">Clients</p>
                <p className="font-serif text-xl text-ink">40+</p>
              </div>
              <div className="flex-1 px-4 py-3 text-center border border-gold/20 rounded-[2px]"
                style={{ background: "rgba(255,251,244,0.7)" }}>
                <p className="font-mono text-[8px] tracking-widest text-gold uppercase mb-0.5">Commitment</p>
                <p className="font-serif text-xl text-ink">100<span className="text-xs font-sans font-light text-ink-muted">%</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom scroll cue ── */}
      <motion.div className="relative z-10 flex justify-between items-end px-8 md:px-14 pb-8"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}>
        <div className="flex flex-col items-center gap-2">
          <span className="font-mono text-[8px] tracking-[0.38em] text-gold/50 uppercase">Scroll</span>
          <motion.div className="w-px h-9"
            style={{ background: "linear-gradient(to bottom, rgba(196,149,42,0.7), transparent)" }}
            animate={{ scaleY: [1, 0.4, 1] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }} />
        </div>
        <p className="font-mono text-[8px] tracking-[0.28em] text-gold/40 uppercase">
          Akshay Vastrad Media House
        </p>
      </motion.div>

      {/* ── Bottom gold rule ── */}
      <div className="absolute bottom-0 inset-x-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(196,149,42,0.3), transparent)" }} />
    </section>
  );
}
