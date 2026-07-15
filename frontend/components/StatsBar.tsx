"use client";
// components/StatsBar.tsx — AK2.0
// Animated count-up stats: 40+ Weddings · 4 Years · 100% Commitment
// Triggers once when section enters viewport.

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface Stat {
  target: number;
  suffix: string;
  label: string;
  sublabel: string;
}

const STATS: Stat[] = [
  { target: 40,  suffix: "+", label: "Weddings",    sublabel: "Stories Told" },
  { target: 4,   suffix: "",  label: "Years",        sublabel: "Mastering the Craft" },
  { target: 100, suffix: "%", label: "Commitment",   sublabel: "Every Single Wedding" },
];

function CountUp({ target, suffix, started }: { target: number; suffix: string; started: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const duration = 1800;
    const step = 16;
    const increment = target / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, step);
    return () => clearInterval(timer);
  }, [started, target]);

  return (
    <span className="font-serif text-[clamp(3rem,6vw,5rem)] text-ink tabular-nums">
      {count}{suffix}
    </span>
  );
}

export default function StatsBar() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="bg-cream-warm py-20 md:py-28 px-8 overflow-hidden">
      {/* Subtle gold strip top */}
      <div className="gold-rule opacity-20 mb-16" />

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-0">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="relative flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: i * 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Vertical gold separator (not on last) */}
            {i < STATS.length - 1 && (
              <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-16 bg-gradient-to-b from-transparent via-gold/30 to-transparent" />
            )}

            <CountUp target={stat.target} suffix={stat.suffix} started={inView} />
            <p className="font-mono text-[10px] tracking-[0.38em] text-gold uppercase mt-2 mb-1">
              {stat.label}
            </p>
            <p className="font-sans font-light text-xs text-ink-faint">
              {stat.sublabel}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="gold-rule opacity-20 mt-16" />
    </section>
  );
}
