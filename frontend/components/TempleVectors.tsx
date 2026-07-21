"use client";
/**
 * TempleVectors.tsx — AK2.0
 *
 * Decorative architectural pencil-sketch overlays inspired by South Indian
 * temple gopurams, mandap arches, lotus motifs, and kalash silhouettes.
 *
 * All elements are:
 *   - Absolutely positioned, pointer-events-none, z-0
 *   - Stroke-only (pencil sketch feel), no fill
 *   - Animated: slow floating (framer-motion) + scroll parallax
 *   - Colour: very faint gold/warm-grey so they don't compete with content
 */

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

// ── Shared stroke style ────────────────────────────────────────────────────────
const STROKE_GOLD   = "rgba(196,149,42,0.10)";
const STROKE_GREY   = "rgba(28,25,22,0.06)";
const STROKE_LIGHT  = "rgba(196,149,42,0.055)";

// ── Float keyframe helper ─────────────────────────────────────────────────────
function FloatBox({
  children,
  duration = 7,
  yAmp = 14,
  delay = 0,
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  duration?: number;
  yAmp?: number;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <motion.div
      className={`pointer-events-none absolute ${className}`}
      style={style}
      animate={{ y: [0, -yAmp, 0], rotate: [0, 0.8, 0] }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
        repeatType: "mirror",
      }}
    >
      {children}
    </motion.div>
  );
}

// ── SVG: Gopuram (Temple Tower) ───────────────────────────────────────────────
function GopuramSVG({ color = STROKE_GOLD, size = 320 }: { color?: string; size?: number }) {
  const w = size;
  const h = size * 2.2;
  return (
    <svg width={w} height={h} viewBox="0 0 160 352" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Base platform */}
      <rect x="10" y="330" width="140" height="18" rx="1" stroke={color} strokeWidth="0.7" />
      <rect x="18" y="318" width="124" height="14" rx="1" stroke={color} strokeWidth="0.6" />
      {/* Stacked tiers — gopuram body */}
      {[0,1,2,3,4,5,6,7].map((i) => {
        const shrink = i * 7;
        const y = 316 - i * 34;
        const w2 = 124 - shrink * 2;
        const x2 = 18 + shrink;
        return (
          <g key={i}>
            <rect x={x2} y={y} width={w2} height={28} rx="1" stroke={color} strokeWidth="0.55" />
            {/* Horizontal detail lines on each tier */}
            <line x1={x2+4} y1={y+9} x2={x2+w2-4} y2={y+9} stroke={color} strokeWidth="0.35" />
            <line x1={x2+4} y1={y+18} x2={x2+w2-4} y2={y+18} stroke={color} strokeWidth="0.35" />
            {/* Miniature pilasters */}
            {Array.from({length: Math.max(2, Math.floor((w2-8)/18))}).map((_,j) => (
              <line
                key={j}
                x1={x2+8 + j*18} y1={y+2}
                x2={x2+8 + j*18} y2={y+26}
                stroke={color} strokeWidth="0.28"
              />
            ))}
          </g>
        );
      })}
      {/* Top kalash / finial */}
      <ellipse cx="80" cy="50" rx="14" ry="9" stroke={color} strokeWidth="0.7" />
      <path d="M66 50 Q80 22 94 50" stroke={color} strokeWidth="0.6" fill="none" />
      <circle cx="80" cy="20" r="6" stroke={color} strokeWidth="0.7" />
      <line x1="80" y1="14" x2="80" y2="5" stroke={color} strokeWidth="0.6" />
      <circle cx="80" cy="4" r="2.5" stroke={color} strokeWidth="0.6" />
      {/* Side decorative nubs */}
      {[-22,-12,12,22].map((dx,i) => (
        <circle key={i} cx={80+dx} cy={54} r="3" stroke={color} strokeWidth="0.45" />
      ))}
      {/* Arch windows on mid section */}
      {[1,2,3].map(ti => {
        const shrink2 = ti * 7;
        const yy = 316 - ti * 34 + 4;
        const cx = 80;
        return (
          <path key={ti}
            d={`M${cx-8} ${yy+18} L${cx-8} ${yy+8} Q${cx} ${yy+2} ${cx+8} ${yy+8} L${cx+8} ${yy+18}`}
            stroke={color} strokeWidth="0.45" fill="none"
          />
        );
      })}
    </svg>
  );
}

// ── SVG: Mandap Arch ─────────────────────────────────────────────────────────
function MandapArchSVG({ color = STROKE_GREY, size = 220 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size * 1.4} viewBox="0 0 220 310" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Two pillars */}
      <rect x="20" y="60" width="28" height="240" rx="2" stroke={color} strokeWidth="0.65" />
      <rect x="172" y="60" width="28" height="240" rx="2" stroke={color} strokeWidth="0.65" />
      {/* Pillar fluting */}
      {[0,1,2].map(i => (
        <g key={i}>
          <line x1={28+i*7} y1="65" x2={28+i*7} y2="295" stroke={color} strokeWidth="0.3" />
          <line x1={180+i*7} y1="65" x2={180+i*7} y2="295" stroke={color} strokeWidth="0.3" />
        </g>
      ))}
      {/* Capital tops */}
      <rect x="14" y="50" width="40" height="14" rx="1" stroke={color} strokeWidth="0.6" />
      <rect x="166" y="50" width="40" height="14" rx="1" stroke={color} strokeWidth="0.6" />
      {/* Grand arch */}
      <path d="M20 62 Q20 8 110 8 Q200 8 200 62" stroke={color} strokeWidth="0.75" fill="none" />
      {/* Inner arch */}
      <path d="M38 62 Q38 26 110 26 Q182 26 182 62" stroke={color} strokeWidth="0.5" fill="none" />
      {/* Keystone detail */}
      <path d="M100 8 L100 24 M110 5 L110 26 M120 8 L120 24" stroke={color} strokeWidth="0.35" />
      {/* Arch ornaments */}
      {[0,1,2,3,4].map(i => {
        const angle = (Math.PI * i) / 4;
        const r = 85;
        const cx = 110 + r * Math.cos(Math.PI + angle * 0.5);
        const cy = 62 + r * Math.sin(Math.PI + angle * 0.5) + 85;
        return <circle key={i} cx={cx} cy={cy} r="2.5" stroke={color} strokeWidth="0.4" />;
      })}
      {/* Base */}
      <rect x="10" y="296" width="200" height="12" rx="1" stroke={color} strokeWidth="0.6" />
      <rect x="0" y="304" width="220" height="6" rx="1" stroke={color} strokeWidth="0.5" />
    </svg>
  );
}

// ── SVG: Lotus Flower ─────────────────────────────────────────────────────────
function LotusSVG({ color = STROKE_GOLD, size = 80 }: { color?: string; size?: number }) {
  const petals = 8;
  const r1 = size * 0.38;
  const r2 = size * 0.22;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer petals */}
      {Array.from({ length: petals }).map((_, i) => {
        const angle = (i * Math.PI * 2) / petals;
        const cx = size / 2 + r1 * Math.cos(angle);
        const cy = size / 2 + r1 * Math.sin(angle);
        const cx2 = size / 2 + r1 * 0.5 * Math.cos(angle - 0.5);
        const cy2 = size / 2 + r1 * 0.5 * Math.sin(angle - 0.5);
        const cx3 = size / 2 + r1 * 0.5 * Math.cos(angle + 0.5);
        const cy3 = size / 2 + r1 * 0.5 * Math.sin(angle + 0.5);
        return (
          <path
            key={i}
            d={`M${size/2} ${size/2} Q${cx2} ${cy2} ${cx} ${cy} Q${cx3} ${cy3} ${size/2} ${size/2}`}
            stroke={color} strokeWidth="0.65" fill="none"
          />
        );
      })}
      {/* Inner petals */}
      {Array.from({ length: petals }).map((_, i) => {
        const angle = (i * Math.PI * 2) / petals + Math.PI / petals;
        const cx = size / 2 + r2 * Math.cos(angle);
        const cy = size / 2 + r2 * Math.sin(angle);
        return (
          <path
            key={i}
            d={`M${size/2} ${size/2} Q${cx} ${cy} ${size/2 + r2*0.6*Math.cos(angle+0.6)} ${size/2 + r2*0.6*Math.sin(angle+0.6)}`}
            stroke={color} strokeWidth="0.45" fill="none"
          />
        );
      })}
      {/* Centre circle */}
      <circle cx={size/2} cy={size/2} r={size * 0.08} stroke={color} strokeWidth="0.6" />
    </svg>
  );
}

// ── SVG: Kalash (Sacred Pot) ──────────────────────────────────────────────────
function KalashSVG({ color = STROKE_GOLD, size = 60 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size * 1.6} viewBox="0 0 60 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Base */}
      <rect x="15" y="88" width="30" height="6" rx="1" stroke={color} strokeWidth="0.6" />
      <rect x="18" y="83" width="24" height="7" rx="1" stroke={color} strokeWidth="0.55" />
      {/* Pot body */}
      <path d="M22 82 Q10 65 12 48 Q14 30 30 26 Q46 30 48 48 Q50 65 38 82 Z" stroke={color} strokeWidth="0.65" fill="none" />
      {/* Pot decorative band */}
      <path d="M16 58 Q30 54 44 58" stroke={color} strokeWidth="0.4" fill="none" />
      <path d="M14 64 Q30 60 46 64" stroke={color} strokeWidth="0.4" fill="none" />
      {/* Neck */}
      <rect x="22" y="18" width="16" height="10" rx="2" stroke={color} strokeWidth="0.6" />
      {/* Coconut on top */}
      <ellipse cx="30" cy="13" rx="9" ry="10" stroke={color} strokeWidth="0.65" />
      {/* Mango leaves */}
      <path d="M21 18 Q14 10 18 5" stroke={color} strokeWidth="0.5" fill="none" />
      <path d="M39 18 Q46 10 42 5" stroke={color} strokeWidth="0.5" fill="none" />
      <path d="M25 18 Q22 8 26 3" stroke={color} strokeWidth="0.45" fill="none" />
      <path d="M35 18 Q38 8 34 3" stroke={color} strokeWidth="0.45" fill="none" />
      {/* Coconut top tuft */}
      <line x1="30" y1="3" x2="30" y2="-2" stroke={color} strokeWidth="0.5" />
      <line x1="28" y1="4" x2="25" y2="-1" stroke={color} strokeWidth="0.45" />
      <line x1="32" y1="4" x2="35" y2="-1" stroke={color} strokeWidth="0.45" />
    </svg>
  );
}

// ── SVG: Decorative Floral Corner ────────────────────────────────────────────
function FloralCornerSVG({ color = STROKE_LIGHT, size = 140, flip = false }: { color?: string; size?: number; flip?: boolean }) {
  return (
    <svg
      width={size} height={size}
      viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={flip ? { transform: "scaleX(-1)" } : {}}
    >
      {/* Quarter arch spine */}
      <path d="M0 140 Q0 0 140 0" stroke={color} strokeWidth="0.7" fill="none" />
      <path d="M0 120 Q20 20 120 0" stroke={color} strokeWidth="0.45" fill="none" />
      {/* Vine tendrils */}
      <path d="M0 100 Q30 80 45 55 Q55 35 80 20 Q100 8 120 0" stroke={color} strokeWidth="0.5" fill="none" strokeDasharray="3 4" />
      {/* Floral nodes along main arc */}
      {[[10,118],[30,88],[55,58],[82,30],[112,10]].map(([x,y],i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="4" stroke={color} strokeWidth="0.5" />
          <line x1={x-5} y1={y} x2={x+5} y2={y} stroke={color} strokeWidth="0.35" />
          <line x1={x} y1={y-5} x2={x} y2={y+5} stroke={color} strokeWidth="0.35" />
        </g>
      ))}
      {/* Leaf pairs */}
      {[[20,104],[50,70],[90,38]].map(([x,y],i) => (
        <g key={i}>
          <path d={`M${x} ${y} Q${x-10} ${y-15} ${x-4} ${y-20}`} stroke={color} strokeWidth="0.4" fill="none" />
          <path d={`M${x} ${y} Q${x+10} ${y+12} ${x+18} ${y+5}`} stroke={color} strokeWidth="0.4" fill="none" />
        </g>
      ))}
    </svg>
  );
}

// ── SVG: Temple Bell ──────────────────────────────────────────────────────────
function TempleBellSVG({ color = STROKE_GREY, size = 44 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size * 1.5} viewBox="0 0 44 66" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Hook */}
      <path d="M22 0 Q22 8 22 10" stroke={color} strokeWidth="0.7" />
      <circle cx="22" cy="4" r="3" stroke={color} strokeWidth="0.6" />
      {/* Bell body */}
      <path d="M22 10 Q8 14 6 32 Q5 44 10 50 L34 50 Q39 44 38 32 Q36 14 22 10Z" stroke={color} strokeWidth="0.65" fill="none" />
      {/* Decorative bands */}
      <path d="M11 30 Q22 27 33 30" stroke={color} strokeWidth="0.4" fill="none" />
      <path d="M9 38 Q22 35 35 38" stroke={color} strokeWidth="0.4" fill="none" />
      {/* Bell mouth */}
      <path d="M10 50 Q22 56 34 50" stroke={color} strokeWidth="0.6" fill="none" />
      {/* Clapper */}
      <line x1="22" y1="44" x2="22" y2="62" stroke={color} strokeWidth="0.55" />
      <circle cx="22" cy="63" r="3" stroke={color} strokeWidth="0.55" />
    </svg>
  );
}

// ── SVG: Rangoli / Geometric Pattern ─────────────────────────────────────────
function RangoliSVG({ color = STROKE_LIGHT, size = 110 }: { color?: string; size?: number }) {
  const c = size / 2;
  const radii = [size * 0.46, size * 0.35, size * 0.22, size * 0.12];
  const points = 8;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      {/* Concentric circles */}
      {radii.map((r, i) => (
        <circle key={i} cx={c} cy={c} r={r} stroke={color} strokeWidth="0.45" />
      ))}
      {/* Star lines */}
      {Array.from({ length: points }).map((_, i) => {
        const a = (i * Math.PI * 2) / points;
        const x2 = c + radii[0] * Math.cos(a);
        const y2 = c + radii[0] * Math.sin(a);
        return <line key={i} x1={c} y1={c} x2={x2} y2={y2} stroke={color} strokeWidth="0.4" />;
      })}
      {/* Diamond connectors */}
      {Array.from({ length: points }).map((_, i) => {
        const a1 = (i * Math.PI * 2) / points;
        const a2 = ((i + 1) * Math.PI * 2) / points;
        const x1 = c + radii[1] * Math.cos(a1);
        const y1 = c + radii[1] * Math.sin(a1);
        const x2b = c + radii[1] * Math.cos(a2);
        const y2b = c + radii[1] * Math.sin(a2);
        return <line key={i} x1={x1} y1={y1} x2={x2b} y2={y2b} stroke={color} strokeWidth="0.4" />;
      })}
      {/* Inner lotus */}
      {Array.from({ length: points }).map((_, i) => {
        const a = (i * Math.PI * 2) / points + Math.PI / points;
        const x = c + radii[2] * Math.cos(a);
        const y = c + radii[2] * Math.sin(a);
        return <circle key={i} cx={x} cy={y} r="2.2" stroke={color} strokeWidth="0.4" />;
      })}
      <circle cx={c} cy={c} r="3.5" stroke={color} strokeWidth="0.5" />
    </svg>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function TempleVectors() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();

  // Parallax transforms — different elements move at different speeds
  const ySlowUp   = useTransform(scrollYProgress, [0,1], ["0%",  "-18%"]);
  const yMedUp    = useTransform(scrollYProgress, [0,1], ["0%",  "-32%"]);
  const yFastUp   = useTransform(scrollYProgress, [0,1], ["0%",  "-50%"]);
  const ySlowDown = useTransform(scrollYProgress, [0,1], ["0%",  "+20%"]);
  const opacityFade = useTransform(scrollYProgress, [0, 0.15], [1, 0.5]);

  // Spring-smooth the parallax
  const y1 = useSpring(ySlowUp,   { stiffness: 40, damping: 25 });
  const y2 = useSpring(yMedUp,    { stiffness: 40, damping: 25 });
  const y3 = useSpring(yFastUp,   { stiffness: 40, damping: 25 });
  const y4 = useSpring(ySlowDown, { stiffness: 40, damping: 25 });

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >

      {/* ── RIGHT EDGE: Large Gopuram — fades with scroll ──────────────────── */}
      <motion.div
        className="absolute right-0 bottom-0"
        style={{ y: y1, opacity: opacityFade }}
      >
        <FloatBox yAmp={18} duration={11} delay={0}>
          <GopuramSVG size={260} color="rgba(196,149,42,0.065)" />
        </FloatBox>
      </motion.div>

      {/* ── LEFT EDGE: Mandap arch — tall, very faint ─────────────────────── */}
      <motion.div
        className="absolute left-0 top-[20vh]"
        style={{ y: y2 }}
      >
        <FloatBox yAmp={10} duration={13} delay={1.5}>
          <MandapArchSVG size={180} color="rgba(28,25,22,0.05)" />
        </FloatBox>
      </motion.div>

      {/* ── TOP RIGHT: Floral corner ornament ─────────────────────────────── */}
      <motion.div
        className="absolute top-0 right-0"
        style={{ y: y3 }}
      >
        <FloatBox yAmp={8} duration={9} delay={0.5} style={{ top: 0, right: 0 }}>
          <FloralCornerSVG size={200} color="rgba(196,149,42,0.07)" flip />
        </FloatBox>
      </motion.div>

      {/* ── TOP LEFT: Floral corner ornament ──────────────────────────────── */}
      <motion.div
        className="absolute top-0 left-0"
        style={{ y: y3 }}
      >
        <FloatBox yAmp={8} duration={9} delay={1} style={{ top: 0, left: 0 }}>
          <FloralCornerSVG size={200} color="rgba(196,149,42,0.06)" />
        </FloatBox>
      </motion.div>

      {/* ── CENTRE LEFT: Lotus — mid scroll ───────────────────────────────── */}
      <motion.div
        className="absolute left-[4vw] top-[55vh]"
        style={{ y: y2 }}
      >
        <FloatBox yAmp={20} duration={8} delay={2}>
          <LotusSVG size={90} color="rgba(196,149,42,0.09)" />
        </FloatBox>
      </motion.div>

      {/* ── RIGHT MID: Kalash ─────────────────────────────────────────────── */}
      <motion.div
        className="absolute right-[5vw] top-[38vh]"
        style={{ y: y2 }}
      >
        <FloatBox yAmp={16} duration={10} delay={0.8}>
          <KalashSVG size={55} color="rgba(196,149,42,0.08)" />
        </FloatBox>
      </motion.div>

      {/* ── CENTRE: Rangoli — large, very faint background ────────────────── */}
      <motion.div
        className="absolute left-1/2 top-[30vh]"
        style={{ y: y1, x: "-50%" }}
      >
        <FloatBox yAmp={6} duration={15} delay={3} style={{ rotate: "15deg" }}>
          <RangoliSVG size={180} color="rgba(196,149,42,0.04)" />
        </FloatBox>
      </motion.div>

      {/* ── BOTTOM LEFT: Small lotus ───────────────────────────────────────── */}
      <motion.div
        className="absolute left-[12vw] bottom-[25vh]"
        style={{ y: y4 }}
      >
        <FloatBox yAmp={14} duration={7.5} delay={1.2}>
          <LotusSVG size={55} color="rgba(196,149,42,0.075)" />
        </FloatBox>
      </motion.div>

      {/* ── BOTTOM RIGHT: Small lotus ─────────────────────────────────────── */}
      <motion.div
        className="absolute right-[14vw] bottom-[40vh]"
        style={{ y: y4 }}
      >
        <FloatBox yAmp={12} duration={9.5} delay={2.5}>
          <LotusSVG size={45} color="rgba(28,25,22,0.06)" />
        </FloatBox>
      </motion.div>

      {/* ── RIGHT: Temple bell pair ────────────────────────────────────────── */}
      <motion.div
        className="absolute right-[8vw] top-[65vh]"
        style={{ y: y2 }}
      >
        <FloatBox yAmp={22} duration={6} delay={0.3} style={{ display: "flex", gap: "12px" }}>
          <TempleBellSVG size={36} color="rgba(196,149,42,0.09)" />
          <TempleBellSVG size={30} color="rgba(196,149,42,0.07)" />
        </FloatBox>
      </motion.div>

      {/* ── LEFT: Temple bell ─────────────────────────────────────────────── */}
      <motion.div
        className="absolute left-[6vw] top-[80vh]"
        style={{ y: y3 }}
      >
        <FloatBox yAmp={18} duration={8} delay={1.8}>
          <TempleBellSVG size={40} color="rgba(28,25,22,0.055)" />
        </FloatBox>
      </motion.div>

      {/* ── MID RIGHT: Kalash smaller ─────────────────────────────────────── */}
      <motion.div
        className="absolute right-[18vw] top-[75vh]"
        style={{ y: y1 }}
      >
        <FloatBox yAmp={12} duration={12} delay={4}>
          <KalashSVG size={38} color="rgba(196,149,42,0.065)" />
        </FloatBox>
      </motion.div>

      {/* ── BOTTOM CENTRE: Rangoli ────────────────────────────────────────── */}
      <motion.div
        className="absolute left-[65%] bottom-[10vh]"
        style={{ y: y4 }}
      >
        <FloatBox yAmp={10} duration={14} delay={2} style={{ rotate: "-8deg" }}>
          <RangoliSVG size={120} color="rgba(196,149,42,0.038)" />
        </FloatBox>
      </motion.div>

      {/* ── HERO AREA: Second smaller gopuram (left) ──────────────────────── */}
      <motion.div
        className="absolute left-[2vw] top-[5vh]"
        style={{ y: y3, opacity: opacityFade }}
      >
        <FloatBox yAmp={14} duration={13} delay={3.5}>
          <GopuramSVG size={140} color="rgba(28,25,22,0.04)" />
        </FloatBox>
      </motion.div>

    </div>
  );
}
