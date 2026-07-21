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
      "Akkira captured every single emotion of our wedding day. The film made us cry the second time watching it — and the third, and the fourth. Pure magic.",
    name: "Priya & Rohan Mehta",
    event: "Destination Wedding · Goa",
    initials: "PR",
    stars: 5,
  },
  {
    id: 2,
    quote:
      "The pre-wedding film in Coorg was beyond anything we imagined. Akshay sees frames that don't exist until he finds them. Absolutely cinematic.",
    name: "Ananya & Karthik S.",
    event: "Pre-Wedding Film · Coorg",
    initials: "AK",
    stars: 5,
  },
  {
    id: 3,
    quote:
      "We had four photographers at our wedding. Akkira's video is the only thing we watch on our anniversary. That says everything.",
    name: "Fatima & Arjun Nair",
    event: "Wedding Film · Bengaluru",
    initials: "FA",
    stars: 5,
  },
  {
    id: 4,
    quote:
      "Our corporate launch film went viral internally. The team understood our brand voice without us having to explain it twice. Incredible efficiency.",
    name: "Siddharth Rao",
    event: "Corporate Launch · Mumbai",
    initials: "SR",
    stars: 5,
  },
  {
    id: 5,
    quote:
      "I've attended hundreds of weddings as a decorator. Akkira is the first team I've personally recommended to every single bride I work with. Exceptional.",
    name: "Deepa Krishnan",
    event: "Wedding Decor Partner · Chennai",
    initials: "DK",
    stars: 5,
  },
  {
    id: 6,
    quote:
      "Fast, professional, and impossibly talented. Our film was delivered in under three weeks and it looked like a Bollywood production. Blown away.",
    name: "Neha & Vivek Sharma",
    event: "Wedding Film · Jaipur",
    initials: "NV",
    stars: 5,
  },
  {
    id: 7,
    quote:
      "Akshay has a rare quality — he disappears into the background but his camera sees everything. We forgot he was there; the film remembered it all.",
    name: "Riya & Sameer Joshi",
    event: "Candid Wedding · Pune",
    initials: "RS",
    stars: 5,
  },
  {
    id: 8,
    quote:
      "The highlight reel they made for our product launch brought tears to our board of directors. I didn't think a 3-minute film could do that. Now I know.",
    name: "Meera Iyer",
    event: "Product Launch Film · Bengaluru",
    initials: "MI",
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
