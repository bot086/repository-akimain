"use client";
// components/SignatureFilms.tsx — AK2.0
// 8-video editorial film board. Mixed vertical (9:16) + horizontal (16:9).
// Layout: Row 1 = [wide] [vert] [vert], Row 2 = [vert] [vert] [wide]

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import TheaterMode from "./TheaterMode";

// ── Types ─────────────────────────────────────────────────────────────────────
interface FilmSlot {
  id: string;
  url: string | null;           // null = placeholder
  thumbnail_url: string | null;
  alt_text: string | null;
  title: string;
  client: string;
  orientation: "horizontal" | "vertical";
}

// ── 8 placeholder slots — swap URLs when Akshay provides videos ───────────────
const FILM_SLOTS: FilmSlot[] = [
  { id: "f1", url: null, thumbnail_url: null, alt_text: null, title: "Wedding Film 01", client: "— Bride & Groom", orientation: "horizontal" },
  { id: "f2", url: null, thumbnail_url: null, alt_text: null, title: "Reel 01",          client: "— Short Form",    orientation: "vertical"   },
  { id: "f3", url: null, thumbnail_url: null, alt_text: null, title: "Reel 02",          client: "— Short Form",    orientation: "vertical"   },
  { id: "f4", url: null, thumbnail_url: null, alt_text: null, title: "Reel 03",          client: "— Short Form",    orientation: "vertical"   },
  { id: "f5", url: null, thumbnail_url: null, alt_text: null, title: "Reel 04",          client: "— Short Form",    orientation: "vertical"   },
  { id: "f6", url: null, thumbnail_url: null, alt_text: null, title: "Reel 05",          client: "— Short Form",    orientation: "vertical"   },
  { id: "f7", url: null, thumbnail_url: null, alt_text: null, title: "Reel 06",          client: "— Short Form",    orientation: "vertical"   },
  { id: "f8", url: null, thumbnail_url: null, alt_text: null, title: "Wedding Film 02", client: "— Bride & Groom", orientation: "horizontal" },
];

// ── Single film card ──────────────────────────────────────────────────────────
function FilmCard({ slot, colSpan, index }: { slot: FilmSlot; colSpan: number; index: number }) {
  const [hovered, setHovered] = useState(false);
  const [theater, setTheater] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const onHover = useCallback((on: boolean) => {
    setHovered(on);
    if (slot.url && videoRef.current) {
      if (on) videoRef.current.play().catch(() => {});
      else { videoRef.current.pause(); videoRef.current.currentTime = 0; }
    }
  }, [slot.url]);

  const aspectClass = slot.orientation === "horizontal" ? "aspect-video" : "aspect-[9/16]";

  return (
    <>
      <motion.div
        className={`relative overflow-hidden rounded-[2px] cursor-pointer group col-span-${colSpan} ${aspectClass}`}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.75, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
        onMouseEnter={() => onHover(true)}
        onMouseLeave={() => onHover(false)}
        onClick={() => slot.url && setTheater(true)}
      >
        {/* ── Media or placeholder ── */}
        {slot.url ? (
          <>
            {slot.thumbnail_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={slot.thumbnail_url} alt={slot.alt_text ?? ""} draggable={false}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${hovered ? "opacity-0" : "opacity-100"}`} />
            )}
            <video ref={videoRef} src={slot.url} muted loop playsInline preload="metadata"
              className={`w-full h-full object-cover transition-opacity duration-500 ${hovered ? "opacity-100" : "opacity-0"}`} />
          </>
        ) : (
          /* Warm placeholder */
          <div className="w-full h-full bg-gradient-to-br from-[#EDE8DF] via-[#E5DDD0] to-[#D8CFC0] flex flex-col items-center justify-center gap-3 p-6">
            <motion.div
              className="text-3xl opacity-25"
              animate={{ scale: hovered ? 1.15 : 1 }}
              transition={{ duration: 0.3 }}>
              {slot.orientation === "horizontal" ? "🎬" : "📱"}
            </motion.div>
            <div className="text-center">
              <p className="font-mono text-[9px] tracking-[0.3em] text-gold-muted uppercase opacity-70 mb-1">
                {slot.orientation === "horizontal" ? "Horizontal · 16:9" : "Vertical · 9:16"}
              </p>
              <p className="font-sans text-[10px] text-ink-faint opacity-50">{slot.title}</p>
            </div>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 transition-opacity duration-400 pointer-events-none"
          style={{ opacity: hovered ? 1 : 0,
            background: "linear-gradient(to top, rgba(28,25,22,0.65) 0%, transparent 55%)" }} />

        {/* Gold border glow */}
        <div className="absolute inset-0 pointer-events-none transition-all duration-400 rounded-[2px]"
          style={{ boxShadow: hovered
            ? "inset 0 0 0 1.5px rgba(196,149,42,0.65), 0 8px 40px rgba(196,149,42,0.12)"
            : "inset 0 0 0 0px transparent" }} />

        {/* Play badge */}
        <div className={`absolute top-4 left-4 transition-all duration-300 ${hovered ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}>
          <div className="bg-gold text-cream rounded-full w-9 h-9 flex items-center justify-center shadow-lg">
            <span className="text-xs pl-0.5">▶</span>
          </div>
        </div>

        {/* Bottom info */}
        <div className={`absolute bottom-0 inset-x-0 px-4 pb-4 pt-10 transition-all duration-400 bg-gradient-to-t from-black/60 to-transparent ${hovered ? "opacity-100" : "opacity-0"}`}>
          <p className="font-serif text-sm text-cream font-light">{slot.title}</p>
          <p className="font-mono text-[9px] tracking-widest text-gold uppercase">{slot.client}</p>
        </div>

        {/* Orientation tag — always visible, subtle */}
        {!slot.url && (
          <div className="absolute bottom-3 right-3">
            <span className="font-mono text-[8px] tracking-widest text-gold-muted uppercase opacity-40">
              Upload here
            </span>
          </div>
        )}
      </motion.div>

      {theater && slot.url && (
        <TheaterMode
          item={{ id: slot.id, project_id: "", media_type: "video", url: slot.url,
            thumbnail_url: slot.thumbnail_url, alt_text: slot.alt_text, display_order: 0 }}
          onClose={() => setTheater(false)}
        />
      )}
    </>
  );
}

// ── Main section ──────────────────────────────────────────────────────────────
export default function SignatureFilms() {
  // Row 1: slots 0,1,2 → [wide:2] [vert:1] [vert:1]
  // Row 2: slots 3,4,5,6,7 → [vert:1] [vert:1] [vert:1] [vert:1] [wide: actually only 4 cols]
  // Better: 4-column grid
  // Row 1: [H col-span-2] [V col-span-1] [V col-span-1]  → 4 cols
  // Row 2: [V col-span-1] [V col-span-1] [V col-span-1] [V col-span-1]  → 4 cols ... wait we have 8 slots
  // 8 slots: 2 horizontal + 6 vertical
  // Row 1 (4 cols): [H:col-2] [V:col-1] [V:col-1]
  // Row 2 (4 cols): [V:col-1] [V:col-1] [V:col-1] [V:col-1]

  // That's 3 + 4 = 7 cards? No — let me restructure:
  // We have 8 slots. 2 wide horizontal (f1, f8) + 6 vertical (f2-f7)
  // Row 1: f1(H, col-span-2), f2(V), f3(V) → 4 cols
  // Row 2: f4(V), f5(V), f6(V), f7(V) → 4 cols, but we want row 2 to end with wide
  // Row 2: f4(V), f5(V), f8(H, col-span-2) → 4 cols total  (we'll use f6,f7 differently)
  // Actually best: 3 rows:
  // Row 1: f1(H col-2), f2(V col-1), f3(V col-1)  [total: 4]
  // Row 2: f4(V col-1), f5(V col-1), f6(V col-1), f7(V col-1)  [total: 4]  — but f6,f7 exist? Only 6 verticals so f2-f7
  // Row 2: f4(V), f5(V), f6(V), f7(V) — yes all 4 fit
  // Then f8(H) needs a row, but row 3 would have blank space:
  // Row 3: f8(H col-2) — left-aligned
  // That's awkward. Let me do:
  // Row 1: f1(H col-2), f2(V), f3(V)  → 4 cols
  // Row 2: f4(V), f5(V), f8(H col-2)  → 4 cols [f4+f5=2, f8=2]
  // Row 3: f6(V), f7(V), padding  → just 2 verticals
  // Hmm still awkward. Let's just do:
  // 4-column grid, 8 items:
  // f1(H, col-2), f2(V,1), f3(V,1)  → row 1 = 4
  // f4(V,1), f5(V,1), f6(V,1), f7(V,1)  → row 2 = 4 (but this is just 4 verticals)
  // Nah that leaves f8 with no home. Actually I defined 8 = f1..f8. Let me count:
  // f1=H, f2=V, f3=V, f4=V, f5=V, f6=V, f7=V, f8=H
  // 2 horizontal + 6 vertical = 8. Perfect.
  // 
  // Layout (4-col grid):
  // Row1: [f1-H:col-span-2] [f2-V:col-1] [f3-V:col-1]  sum=4 ✓
  // Row2: [f4-V:col-1] [f5-V:col-1] [f8-H:col-span-2]  sum=4 ✓  
  // Row3: [f6-V:col-1] [f7-V:col-1]                    sum=2 (padding 2 right)
  //
  // We'll render them in a specific order: f1,f2,f3,f4,f5,f8,f6,f7
  // with colSpan: 2,1,1,1,1,2,1,1
  
  const orderedSlots = [
    { slot: FILM_SLOTS[0], colSpan: 2 }, // f1 H
    { slot: FILM_SLOTS[1], colSpan: 1 }, // f2 V
    { slot: FILM_SLOTS[2], colSpan: 1 }, // f3 V
    { slot: FILM_SLOTS[3], colSpan: 1 }, // f4 V
    { slot: FILM_SLOTS[4], colSpan: 1 }, // f5 V
    { slot: FILM_SLOTS[7], colSpan: 2 }, // f8 H
    { slot: FILM_SLOTS[5], colSpan: 1 }, // f6 V
    { slot: FILM_SLOTS[6], colSpan: 1 }, // f7 V
  ];

  return (
    <section id="work" className="section-pad bg-cream">
      {/* Header */}
      <div className="mb-14">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-8 h-px bg-gold" />
          <span className="font-mono text-xs tracking-[0.35em] text-gold uppercase">Signature Films</span>
        </div>
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <h2 className="font-serif font-light text-4xl md:text-6xl text-ink">
            8 <em className="text-gold-gradient not-italic">Stories</em>
          </h2>
          <p className="font-sans font-light text-sm text-ink-muted max-w-xs text-right">
            Hover to preview · Click to watch
          </p>
        </div>
      </div>

      {/* 4-column editorial grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {orderedSlots.map(({ slot, colSpan }, i) => (
          <FilmCard key={slot.id} slot={slot} colSpan={colSpan} index={i} />
        ))}
      </div>
    </section>
  );
}
