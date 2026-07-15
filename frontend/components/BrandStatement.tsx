"use client";
// components/BrandStatement.tsx — AK2.0
// Full-width cinematic pull-quote + business positioning.

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function BrandStatement() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const opacity = useTransform(scrollYProgress, [0.1, 0.3, 0.7, 0.9], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0.1, 0.35], ["28px", "0px"]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-cream-warm py-32 md:py-48 px-8 md:px-16">

      {/* Centered radial gold glow */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div style={{
          width: "60vw", height: "60vh",
          background: "radial-gradient(ellipse at center, rgba(196,149,42,0.10) 0%, transparent 70%)",
        }} />
      </div>

      {/* Gold top/bottom rules */}
      <div className="gold-rule opacity-25 mb-20 md:mb-28" />

      <motion.div
        className="max-w-5xl mx-auto text-center"
        style={{ opacity, y }}
      >
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="w-10 h-px bg-gold opacity-60" />
          <span className="font-mono text-[10px] tracking-[0.38em] text-gold uppercase">Our Promise</span>
          <div className="w-10 h-px bg-gold opacity-60" />
        </div>

        {/* Main quote */}
        <h2 className="font-serif italic font-light text-[clamp(2.2rem,6vw,5.5rem)] leading-[1.1] text-ink mb-8 shadow-gold">
          "We don't shoot weddings.
          <br />
          <span className="text-gold-gradient not-italic">We craft heirlooms."</span>
        </h2>

        {/* Attribution */}
        <div className="flex items-center justify-center gap-5 mb-14">
          <div className="w-16 h-px bg-gold opacity-50" />
          <span className="font-mono text-[10px] tracking-[0.4em] text-ink-muted uppercase">
            Akshay Vastrad Media House
          </span>
          <div className="w-16 h-px bg-gold opacity-50" />
        </div>

        {/* Sub statement */}
        <p className="font-sans font-light text-base md:text-lg text-ink-muted leading-relaxed max-w-2xl mx-auto mb-16">
          Your wedding deserves more than a camera operator.
          It deserves a <span className="text-ink font-normal">director</span> — someone who sees the trembling hands,
          the stolen glances, the tears no one planned for —
          and <span className="text-gold font-normal">preserves them forever.</span>
        </p>

        {/* Quick stats row */}
        <div className="flex items-center justify-center gap-8 md:gap-16 flex-wrap">
          {[
            { number: "40+", label: "Happy Couples" },
            { number: "4", label: "Years Mastering" },
            { number: "100%", label: "Commitment" },
          ].map(({ number, label }) => (
            <div key={label} className="text-center">
              <p className="font-serif text-3xl md:text-4xl text-ink mb-1">{number}</p>
              <p className="font-mono text-[9px] tracking-[0.3em] text-gold uppercase">{label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="gold-rule opacity-25 mt-20 md:mt-28" />
    </section>
  );
}
