"use client";
// components/ClientTestimonials.tsx — AK2.0
// Dual-row horizontally scrolling testimonial panel.
// Row 1 scrolls left → Row 2 scrolls right for cinematic depth.
// Pause-on-hover via CSS animation-play-state.
// Zero JS animation — pure CSS @keyframes via Tailwind.

import { useRef } from "react";

/* ── Testimonial data ───────────────────────────────────────────────────── */
interface Testimonial {
  id: number;
  quote: string;
  name: string;
  event: string;
  initials: string;
  stars: number;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    quote:
      "Akshay and his crew captured our ceremony at The Tamarind Tree so poetically. The vintage color tones and sound design brought back all the goosebumps. Absolutely priceless.",
    name: "Aishwarya & Gautham Hegde",
    event: "Wedding Film · Bengaluru",
    initials: "AG",
    stars: 5,
  },
  {
    id: 2,
    quote:
      "From our grand reception at Jayamahal Palace to intimate candid moments with our grandparents, Akshay missed nothing. His storytelling feels like pure cinema, not just a routine wedding video.",
    name: "Dr. Sahana & Varun Rao",
    event: "Royal Wedding · Bengaluru",
    initials: "SV",
    stars: 5,
  },
  {
    id: 3,
    quote:
      "Our pre-wedding shoot amidst the misty coffee plantations of Coorg was magical. Akshay sees frames that don't exist until he finds them. The drone angles and music sync were top tier.",
    name: "Ananya & Karthik Somanna",
    event: "Pre-Wedding Film · Coorg",
    initials: "AK",
    stars: 5,
  },
  {
    id: 4,
    quote:
      "The heritage grandeur of Mysuru was translated into a royal masterpiece by Akkira. Every ritual, laughter, and tear was woven into a teaser that our family replays every week.",
    name: "Tejaswini & Nikhil Urs",
    event: "Heritage Wedding · Mysuru",
    initials: "TN",
    stars: 5,
  },
  {
    id: 5,
    quote:
      "We wanted an unscripted, candid wedding film at Temple Tree Leisure without forced poses. Akkira delivered beyond expectations. He blends into the crowd so seamlessly you forget there’s a camera.",
    name: "Meghana & Siddharth Pai",
    event: "Candid Wedding · Bengaluru",
    initials: "MS",
    stars: 5,
  },
  {
    id: 6,
    quote:
      "The sunset vows in the Western Ghats felt like a scene straight out of an international film festival. The attention to natural audio and emotional cues is what sets Akshay apart.",
    name: "Pooja & Chetan Gowda",
    event: "Estate Wedding · Chikmagalur",
    initials: "PC",
    stars: 5,
  },
  {
    id: 7,
    quote:
      "Our 3-day sunset beach wedding in Goa was high-energy, and Akkira captured the madness and romance flawlessly. The after-movie still gives everyone nostalgia.",
    name: "Priya & Rohan Fernandes",
    event: "Destination Wedding · Goa",
    initials: "PR",
    stars: 5,
  },
  {
    id: 8,
    quote:
      "Delivered a cinematic masterpiece for our destination wedding in Udaipur. Flawless 4K color grading, emotional pacing, and quick turnaround time. Blown away by their dedication.",
    name: "Neha & Aditya Sharma",
    event: "Palace Wedding · Udaipur",
    initials: "NA",
    stars: 5,
  },
];

/* ── Star component ─────────────────────────────────────────────────────── */
function Stars({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5 mb-4">
      {Array.from({ length: count }).map((_, i) => (
        <svg
          key={i}
          className="w-3.5 h-3.5"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 1.5l1.854 3.756 4.146.602-3 2.924.708 4.128L8 10.75l-3.708 1.96.708-4.128L2 5.858l4.146-.602L8 1.5z"
            fill="url(#starGrad)"
          />
          <defs>
            <linearGradient id="starGrad" x1="2" y1="1.5" x2="14" y2="12" gradientUnits="userSpaceOnUse">
              <stop stopColor="#E8C97A" />
              <stop offset="1" stopColor="#C4952A" />
            </linearGradient>
          </defs>
        </svg>
      ))}
    </div>
  );
}

/* ── Single card ────────────────────────────────────────────────────────── */
function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div
      className="group relative flex-shrink-0 w-[340px] md:w-[400px] mx-3 p-7 rounded-[3px] cursor-default select-none"
      style={{
        background: "linear-gradient(145deg, #211e1a 0%, #1a1714 100%)",
        border: "1px solid rgba(196,149,42,0.18)",
        boxShadow: "0 2px 20px rgba(0,0,0,0.35)",
      }}
    >
      {/* Gold top-border accent */}
      <div
        className="absolute top-0 left-6 right-6 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, #C4952A 30%, #E8C97A 60%, #C4952A 80%, transparent)",
        }}
      />

      {/* Subtle hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[3px] pointer-events-none"
        style={{ boxShadow: "inset 0 0 0 1px rgba(196,149,42,0.35), 0 8px 40px rgba(196,149,42,0.08)" }}
      />

      {/* Stars */}
      <Stars count={t.stars} />

      {/* Quote */}
      <blockquote
        className="font-serif italic font-light text-base leading-relaxed mb-6"
        style={{ color: "#EDE8DF" }}
      >
        &ldquo;{t.quote}&rdquo;
      </blockquote>

      {/* Footer */}
      <div className="flex items-center gap-3 mt-auto">
        {/* Avatar */}
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-mono font-medium tracking-wider"
          style={{
            background: "linear-gradient(135deg, #E8C97A 0%, #C4952A 100%)",
            color: "#1C1916",
          }}
        >
          {t.initials}
        </div>

        <div>
          <p className="font-sans font-medium text-sm" style={{ color: "#F0EAE0" }}>
            {t.name}
          </p>
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase" style={{ color: "#7A6B56" }}>
            {t.event}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Marquee row ────────────────────────────────────────────────────────── */
function MarqueeRow({
  items,
  direction,
  speed = 40,
}: {
  items: Testimonial[];
  direction: "left" | "right";
  speed?: number;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  const animationName = direction === "left" ? "marquee-left" : "marquee-right";

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => {
        if (trackRef.current) {
          trackRef.current.style.animationPlayState = "paused";
        }
      }}
      onMouseLeave={() => {
        if (trackRef.current) {
          trackRef.current.style.animationPlayState = "running";
        }
      }}
    >
      {/* Edge fade masks */}
      <div
        className="absolute inset-y-0 left-0 w-24 z-10 pointer-events-none"
        style={{
          background: "linear-gradient(90deg, #0E0C0A 0%, transparent 100%)",
        }}
      />
      <div
        className="absolute inset-y-0 right-0 w-24 z-10 pointer-events-none"
        style={{
          background: "linear-gradient(270deg, #0E0C0A 0%, transparent 100%)",
        }}
      />

      {/* Track — contains items × 2 for seamless loop */}
      <div
        ref={trackRef}
        className="flex py-3 will-change-transform"
        style={{
          animation: `${animationName} ${speed}s linear infinite`,
          width: "max-content",
        }}
      >
        {/* Original set */}
        {items.map((t) => (
          <TestimonialCard key={t.id} t={t} />
        ))}
        {/* Duplicate set — aria-hidden for seamless loop */}
        {items.map((t) => (
          <TestimonialCard key={`dup-${t.id}`} t={t} />
        ))}
      </div>
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────────────── */
export default function ClientTestimonials() {
  // Split into two rows for the dual-direction effect
  const rowA = TESTIMONIALS.slice(0, 5);      // 5 cards → scroll left
  const rowB = TESTIMONIALS.slice(3);          // 5 cards (overlapping) → scroll right

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden py-24 md:py-32"
      style={{ background: "linear-gradient(180deg, #0E0C0A 0%, #141210 50%, #0E0C0A 100%)" }}
    >
      {/* Keyframe injection */}
      <style>{`
        @keyframes marquee-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>

      {/* Ambient gold glow top */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, rgba(196,149,42,0.5) 40%, rgba(232,201,122,0.6) 50%, rgba(196,149,42,0.5) 60%, transparent)" }}
      />

      {/* Decorative background grain texture */}
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "128px",
        }}
      />

      <div className="relative z-10">
        {/* ── Section header ─────────────────────────────────────────────── */}
        <div className="px-6 md:px-12 lg:px-24 mb-14 max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-8 h-px" style={{ background: "#C4952A" }} />
            <span
              className="font-mono text-[10px] tracking-[0.38em] uppercase"
              style={{ color: "#C4952A" }}
            >
              Words From Our Clients
            </span>
          </div>
          <h2 className="font-serif font-light text-4xl md:text-6xl" style={{ color: "#EDE8DF" }}>
            They Trusted{" "}
            <em
              className="not-italic"
              style={{
                background: "linear-gradient(135deg, #E8C97A 0%, #C4952A 45%, #A07830 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              the Frame
            </em>
          </h2>
          <p
            className="font-sans font-light text-sm mt-4 max-w-md leading-relaxed"
            style={{ color: "#7A746E" }}
          >
            Over 40 couples and counting — every film a lifetime in minutes.
          </p>
        </div>

        {/* ── Row 1 — scrolls left ────────────────────────────────────────── */}
        <MarqueeRow items={rowA} direction="left" speed={38} />

        {/* ── Spacer ────────────────────────────────────────────────────── */}
        <div className="h-4" />

        {/* ── Row 2 — scrolls right ──────────────────────────────────────── */}
        <MarqueeRow items={rowB} direction="right" speed={44} />

        {/* ── Bottom label ───────────────────────────────────────────────── */}
        <div className="mt-14 px-6 md:px-12 lg:px-24 max-w-5xl mx-auto flex items-center gap-4">
          <div className="gold-rule flex-1" />
          <span
            className="font-mono text-[10px] tracking-[0.3em] uppercase flex-shrink-0"
            style={{ color: "#4A4540" }}
          >
            Hover to pause
          </span>
          <div className="gold-rule flex-1" />
        </div>
      </div>

      {/* Ambient gold glow bottom */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, rgba(196,149,42,0.5) 40%, rgba(232,201,122,0.6) 50%, rgba(196,149,42,0.5) 60%, transparent)" }}
      />
    </section>
  );
}
