"use client";
// components/ServicePillars.tsx — AK2.0
// Three luxury pillar cards: Quality · Service · Commitment
// Elevated copy from Akshay's catalogue.

import { motion } from "framer-motion";

const PILLARS = [
  {
    number: "01",
    heading: "Quality",
    subheading: "Crafted with Intent",
    body: "Our lens finds what others miss — the trembling hands before vows, the stolen glances across the mandap, the tears no one planned for. We bring a filmmaker's eye to your wedding, treating every frame as a scene in your most important film.",
    icon: "◈",
  },
  {
    number: "02",
    heading: "Service",
    subheading: "You Are Our Lead",
    body: "We come from a filmmaking background, which means we treat your wedding like a feature production and you like our lead actor. Fast, polished delivery — because the wait for your memories should be short, even if they last forever.",
    icon: "◉",
  },
  {
    number: "03",
    heading: "Commitment",
    subheading: "Your Date Is Sacred",
    body: "The moment we shake hands and your advance is placed, your wedding date is blocked — completely and exclusively. Our full creative energy, from pre-shoot planning to final cinematic delivery, is dedicated solely to your story.",
    icon: "◎",
  },
];

export default function ServicePillars() {
  return (
    <section id="about" className="section-pad bg-cream-soft">
      {/* Header */}
      <div className="mb-16 max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-8 h-px bg-gold" />
          <span className="font-mono text-xs tracking-[0.35em] text-gold uppercase">Why Choose Us</span>
        </div>
        <h2 className="font-serif font-light text-4xl md:text-6xl text-ink">
          Our <em className="text-gold-gradient not-italic">Promise</em>
        </h2>
        <p className="font-sans font-light text-sm text-ink-muted mt-4 max-w-md">
          Built on four years of wedding films and 40+ happy couples —
          here is what you can always expect from us.
        </p>
      </div>

      {/* Pillar cards */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {PILLARS.map((pillar, i) => (
          <motion.div
            key={pillar.number}
            className="group relative p-8 bg-cream border border-cream-border hover:border-gold/40 rounded-[2px] transition-all duration-500 cursor-default"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.75, delay: i * 0.14, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -4 }}
            style={{
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            {/* Hover gold glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2px] pointer-events-none"
              style={{ boxShadow: "0 8px 40px rgba(196,149,42,0.10), inset 0 0 0 1px rgba(196,149,42,0.3)" }} />

            {/* Number + icon */}
            <div className="flex items-start justify-between mb-8">
              <span className="font-serif text-5xl text-gold/20 font-light leading-none select-none">
                {pillar.number}
              </span>
              <span className="text-gold/40 text-2xl mt-1">{pillar.icon}</span>
            </div>

            {/* Gold rule */}
            <div className="gold-rule w-12 mb-6 group-hover:w-20 transition-all duration-500" />

            {/* Heading */}
            <h3 className="font-serif text-2xl text-ink mb-1 group-hover:text-gold-dark transition-colors duration-300">
              {pillar.heading}
            </h3>
            <p className="font-mono text-[10px] tracking-[0.28em] text-gold uppercase mb-5">
              {pillar.subheading}
            </p>

            {/* Body */}
            <p className="font-sans font-light text-sm text-ink-muted leading-relaxed">
              {pillar.body}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Bottom CTA row */}
      <motion.div
        className="max-w-5xl mx-auto mt-16 pt-10 border-t border-cream-border flex items-center justify-between gap-4 flex-wrap"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.5 }}
      >
        <div>
          <p className="font-serif italic text-xl text-ink mb-1">
            "Your satisfaction is our commitment."
          </p>
          <p className="font-sans text-xs text-ink-muted">
            — Akshay Vastrad, every wedding since 2021
          </p>
        </div>
        <a href="#contact"
          className="group inline-flex items-center gap-3 font-sans text-xs tracking-[0.22em] uppercase text-ink hover:text-gold transition-colors duration-300 flex-shrink-0">
          <span className="w-8 h-px bg-ink group-hover:bg-gold transition-all duration-300 group-hover:w-14" />
          Book a Consultation
        </a>
      </motion.div>
    </section>
  );
}
