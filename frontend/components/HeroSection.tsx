"use client";
// components/HeroSection.tsx — AK2.0
// Clean 2-column grid. Name stacks tight. More gold. Role tags below name.

import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { getPortraits, resolveMediaUrl, type Portrait } from "@/lib/api";

// ── Interactive Ambient Vectors ───────────────────────────────────────────────
function InteractiveVectors() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0, y: 0, clicked: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      baseX: number;
      baseY: number;
    }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const particleCount = window.innerWidth < 768 ? 40 : 80;
      for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        particles.push({
          x,
          y,
          baseX: x,
          baseY: y,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 2 + 0.5,
        });
      }
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    });
    window.addEventListener("mousedown", () => {
      mouse.current.clicked = true;
    });
    window.addEventListener("mouseup", () => {
      mouse.current.clicked = false;
    });

    // Initial setup
    resize();

    let animationFrame: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const interactionRadius = mouse.current.clicked ? 250 : 120;
      const repelForce = mouse.current.clicked ? 3 : 1;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Normal drifting motion
        p.x += p.vx;
        p.y += p.vy;

        // Mouse interaction
        const dx = mouse.current.x - p.x;
        const dy = mouse.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < interactionRadius) {
          const forceDirectionX = dx / dist;
          const forceDirectionY = dy / dist;
          const force = (interactionRadius - dist) / interactionRadius;

          // Push particles away
          p.x -= forceDirectionX * force * repelForce * 2;
          p.y -= forceDirectionY * force * repelForce * 2;
        }

        // Return slowly to base positions or stay in bounds
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(196, 149, 42, ${mouse.current.clicked ? 0.4 : 0.15})`;
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dpX = p.x - p2.x;
          const dpY = p.y - p2.y;
          const distP = Math.sqrt(dpX * dpX + dpY * dpY);

          if (distP < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(196, 149, 42, ${(100 - distP) * 0.002})`;
            ctx.stroke();
          }
        }
      }

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
      style={{ opacity: 0.8 }}
    />
  );
}

function PhotoSlot({ portrait, label, delay }: { portrait?: Portrait; label: string; delay: number }) {
  if (!portrait) return null;

  return (
    <motion.div
      className="relative overflow-hidden rounded-[30px] border border-gold/25 group w-full flex-shrink-0"
      style={{ aspectRatio: "9/16" }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.012 }}
    >
      {portrait ? (
        <Image
          src={resolveMediaUrl(portrait.url)}
          alt={portrait.alt_text ?? label}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 150px"
        />
      ) : null}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ boxShadow: "inset 0 0 0 1.5px rgba(196,149,42,0.55), 0 8px 32px rgba(196,149,42,0.12)" }} />
    </motion.div>
  );
}

const ROLES = ["Filmmaker", "Media House", "Editor", "Cinematographer", "Director"];

const PORTRAIT_LABELS = ["Portrait of Akshay", "With Camera", "Behind the Scenes"];

export default function HeroSection() {
  const [portraits, setPortraits] = useState<Portrait[]>([]);

  useEffect(() => {
    getPortraits().then(setPortraits).catch(() => { });
  }, []);

  return (
    <section className="relative w-full min-h-screen flex flex-col overflow-hidden"
      style={{ background: "linear-gradient(155deg, #F9F6F0 0%, #F3EDE0 50%, #EDE6D5 100%)" }}>

      {/* ── Interactive Vectors ── */}
      <InteractiveVectors />

      {/* ── Strong gold ambient: right side glow ── */}
      <div className="absolute top-0 right-0 w-[50%] h-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 90% 30%, rgba(232,201,122,0.28) 0%, rgba(196,149,42,0.06) 50%, transparent 75%)" }} />
      {/* Bottom left warm */}
      <div className="absolute bottom-0 left-0 w-[40%] h-[50%] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 10% 90%, rgba(196,149,42,0.13) 0%, transparent 60%)" }} />
      {/* Gold top accent bar */}
      <div className="absolute top-0 inset-x-0 h-[2px] pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent 0%, rgba(196,149,42,0.5) 30%, rgba(232,201,122,0.8) 50%, rgba(196,149,42,0.5) 70%, transparent 100%)" }} />

      {/* ── Main 2-column body — pt-24 clears the fixed Navbar ── */}
      <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-0 px-8 md:px-14 pt-28 pb-12">

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

          {/* ── Name + Service Provider Aesthetic Portrait Showcase ── */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-6 mb-6">
            <div className="flex flex-col">
              {/* ── AKSHAY — no margin bottom ── */}
              <div className="overflow-hidden">
                <motion.h1
                  className="font-serif font-light text-ink leading-[0.92] tracking-[-0.015em]"
                  style={{ fontSize: "clamp(3.8rem, 10.5vw, 9.5rem)" }}
                  initial={{ y: "105%" }} animate={{ y: 0 }}
                  transition={{ duration: 1.05, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}>
                  Akshay
                </motion.h1>
              </div>

              {/* ── VASTRAD — immediately after Akshay ── */}
              <div className="overflow-hidden">
                <motion.h1
                  className="font-serif italic font-light leading-[0.92] tracking-[-0.015em]"
                  style={{
                    fontSize: "clamp(3.8rem, 10.5vw, 9.5rem)",
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
            </div>

            {/* ── Multi-Photo Aesthetic Collage (4-5 Frames) ── */}
            <motion.div
              className="flex items-center gap-1.5 sm:gap-2 self-start lg:self-center mt-3 lg:mt-0 lg:ml-5 flex-wrap sm:flex-nowrap"
              initial={{ opacity: 0, scale: 0.92, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Frame 1 - Tall Main Editorial */}
              {portraits[0] && (
                <div
                  className="relative group cursor-pointer overflow-hidden rounded-lg shadow-lg hover:z-20 transition-all duration-300"
                  style={{
                    width: "clamp(55px, 6vw, 75px)",
                    height: "clamp(80px, 9vw, 110px)",
                    border: "2px solid rgba(232,201,122,0.45)",
                    boxShadow: "0 6px 20px rgba(196,149,42,0.25)"
                  }}
                >
                  <Image
                    src={resolveMediaUrl(portraits[0].url)}
                    alt="Akshay Vastrad"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="80px"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
                </div>
              )}

              {/* Frame 2 - Slight negative tilt */}
              {portraits[1] && (
                <div
                  className="relative group cursor-pointer overflow-hidden rounded-md shadow-md rotate-[-3deg] hover:rotate-0 hover:z-20 transition-all duration-300"
                  style={{
                    width: "clamp(50px, 5.5vw, 68px)",
                    height: "clamp(70px, 8vw, 95px)",
                    border: "1.5px solid rgba(232,201,122,0.35)",
                    boxShadow: "0 4px 16px rgba(196,149,42,0.2)"
                  }}
                >
                  <Image
                    src={resolveMediaUrl(portraits[1].url)}
                    alt="Behind the lens"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="70px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/30 opacity-50" />
                </div>
              )}

              {/* Frame 3 - Slight positive tilt */}
              {portraits[2] && (
                <div
                  className="relative group cursor-pointer overflow-hidden rounded-md shadow-md rotate-[3deg] hover:rotate-0 hover:z-20 transition-all duration-300"
                  style={{
                    width: "clamp(46px, 5vw, 62px)",
                    height: "clamp(64px, 7.5vw, 88px)",
                    border: "1.5px solid rgba(232,201,122,0.35)",
                    boxShadow: "0 4px 14px rgba(196,149,42,0.18)"
                  }}
                >
                  <Image
                    src={resolveMediaUrl(portraits[2].url)}
                    alt="Directing"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="65px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tl from-black/30 via-transparent to-transparent opacity-40" />
                </div>
              )}

              {/* Frame 4 - Compact Polaroid */}
              {(portraits[3] || portraits[0]) && (
                <div
                  className="hidden sm:block relative group cursor-pointer overflow-hidden rounded-md shadow-md rotate-[-2deg] hover:rotate-0 hover:z-20 transition-all duration-300"
                  style={{
                    width: "clamp(42px, 4.5vw, 56px)",
                    height: "clamp(58px, 6.8vw, 78px)",
                    border: "1.5px solid rgba(232,201,122,0.3)",
                    boxShadow: "0 3px 12px rgba(196,149,42,0.15)"
                  }}
                >
                  <Image
                    src={resolveMediaUrl(portraits[3]?.url || portraits[0].url)}
                    alt="Cinematographer"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="60px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-40" />
                </div>
              )}

              {/* Frame 5 - Accent Mini Card */}
              {(portraits[4] || portraits[1]) && (
                <div
                  className="hidden md:block relative group cursor-pointer overflow-hidden rounded-md shadow-md rotate-[4deg] hover:rotate-0 hover:z-20 transition-all duration-300"
                  style={{
                    width: "clamp(38px, 4vw, 50px)",
                    height: "clamp(52px, 6vw, 70px)",
                    border: "1.5px solid rgba(232,201,122,0.25)",
                    boxShadow: "0 3px 10px rgba(196,149,42,0.12)"
                  }}
                >
                  <Image
                    src={resolveMediaUrl(portraits[4]?.url || portraits[1]?.url || portraits[0].url)}
                    alt="On set"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="50px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40 opacity-40" />
                </div>
              )}
            </motion.div>
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

        {/* ── RIGHT: Portrait reels — 1 col × 3 rows @ true 9:16 ── */}
        <div className="hidden md:flex flex-col items-end justify-between pb-0 pt-2">

          {/* Reel column: fixed width so 9:16 slots stack at natural height */}
          <div
            className="flex flex-col gap-1.5 overflow-hidden"
            style={{ width: "clamp(90px, 8.5vw, 115px)", maxHeight: "calc(100vh - 200px)" }}
          >
            <PhotoSlot portrait={portraits[0]} label={PORTRAIT_LABELS[0]} delay={0.9} />
            <PhotoSlot portrait={portraits[1]} label={PORTRAIT_LABELS[1]} delay={1.05} />
            <PhotoSlot portrait={portraits[2]} label={PORTRAIT_LABELS[2]} delay={1.2} />
          </div>

          {/* Credential badges: wide bar that extends left toward the name */}
          <div
            className="flex gap-2 self-end"
            style={{
              width: "clamp(340px, 38vw, 480px)",
              marginBottom: "4px",
            }}
          >
            <div className="flex-1 px-4 py-3 text-center border border-gold/20 rounded-[2px] backdrop-blur-sm"
              style={{ background: "rgba(255,251,244,0.88)" }}>
              <p className="font-mono text-[9px] tracking-widest text-gold uppercase mb-1">Experience</p>
              <p className="font-serif text-2xl text-ink leading-none">4 <span className="text-sm font-sans font-light text-ink-muted">Yrs</span></p>
            </div>
            <div className="flex-1 px-4 py-3 text-center border border-gold/20 rounded-[2px] backdrop-blur-sm"
              style={{ background: "rgba(255,251,244,0.88)" }}>
              <p className="font-mono text-[9px] tracking-widest text-gold uppercase mb-1">Clients</p>
              <p className="font-serif text-2xl text-ink leading-none">40+</p>
            </div>
            <div className="flex-1 px-4 py-3 text-center border border-gold/20 rounded-[2px] backdrop-blur-sm"
              style={{ background: "rgba(255,251,244,0.88)" }}>
              <p className="font-mono text-[9px] tracking-widest text-gold uppercase mb-1">Commitment</p>
              <p className="font-serif text-2xl text-ink leading-none">100<span className="text-sm font-sans font-light text-ink-muted">%</span></p>
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
