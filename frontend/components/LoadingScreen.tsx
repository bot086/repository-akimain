"use client";
// components/LoadingScreen.tsx
// The cinematic hook: counters race to 10M views, 5M subs, 8M likes.
// Hearts float up. When done → gold flash → screen fades out.

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  stats: { total_views: number; total_subscribers: number; total_likes: number };
  onComplete: () => void;
}

function formatNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
}

interface Heart {
  id: number;
  x: number;
  size: number;
}

export default function LoadingScreen({ stats, onComplete }: Props) {
  const [views, setViews] = useState(1);
  const [subs, setSubs] = useState(12_000);
  const [likes, setLikes] = useState(0);
  const [hearts, setHearts] = useState<Heart[]>([]);
  const [flash, setFlash] = useState(false);
  const [done, setDone] = useState(false);
  const heartId = useRef(0);

  // Animate all three counters simultaneously
  useEffect(() => {
    const duration = 2800; // ms
    const steps = 80;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const t = Math.pow(step / steps, 0.6); // ease-out curve

      setViews(Math.floor(t * stats.total_views));
      setSubs(Math.floor(12_000 + t * (stats.total_subscribers - 12_000)));
      setLikes(Math.floor(t * stats.total_likes));

      // Spawn hearts in the last 60% of the animation
      if (step > steps * 0.4 && step % 4 === 0) {
        const newHeart: Heart = {
          id: heartId.current++,
          x: Math.random() * 80 + 10, // 10–90%
          size: Math.random() * 16 + 16,
        };
        setHearts((h) => [...h.slice(-12), newHeart]);
      }

      if (step >= steps) {
        clearInterval(timer);
        setViews(stats.total_views);
        setSubs(stats.total_subscribers);
        setLikes(stats.total_likes);
        // Trigger gold flash then exit
        setTimeout(() => setFlash(true), 300);
        setTimeout(() => setDone(true), 1100);
        setTimeout(() => onComplete(), 1400);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [stats, onComplete]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] bg-noir flex flex-col items-center justify-center overflow-hidden grain-overlay"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Gold flash */}
          {flash && (
            <div className="absolute inset-0 animate-flash-gold pointer-events-none z-10" />
          )}

          {/* Floating hearts */}
          <div className="absolute inset-0 pointer-events-none">
            {hearts.map((h) => (
              <motion.span
                key={h.id}
                className="absolute animate-float-up select-none"
                style={{
                  left: `${h.x}%`,
                  bottom: "20%",
                  fontSize: h.size,
                }}
                initial={{ opacity: 1 }}
                animate={{ opacity: 0, y: -120, scale: 1.4 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              >
                ❤️
              </motion.span>
            ))}
          </div>

          {/* Main content */}
          <div className="flex flex-col items-center gap-10 z-10 px-6">
            {/* Name */}
            <motion.h1
              className="font-serif text-3xl md:text-5xl tracking-[0.3em] text-gold-gradient uppercase"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              AKSHAY VASTRAD
            </motion.h1>

            {/* Divider */}
            <div className="w-48 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

            {/* Counters */}
            <div className="grid grid-cols-3 gap-8 md:gap-16 text-center">
              {/* Views */}
              <div className="flex flex-col gap-1">
                <span className="text-4xl md:text-6xl font-serif font-bold text-gold-gradient tabular-nums">
                  {formatNum(views)}
                </span>
                <span className="text-xs tracking-widest text-gold/60 uppercase font-sans">
                  Views
                </span>
              </div>

              {/* Subscribers */}
              <div className="flex flex-col gap-1">
                <span className="text-4xl md:text-6xl font-serif font-bold text-gold-gradient tabular-nums">
                  {formatNum(subs)}
                </span>
                <span className="text-xs tracking-widest text-gold/60 uppercase font-sans">
                  Subscribers
                </span>
              </div>

              {/* Likes */}
              <div className="flex flex-col gap-1">
                <span className="text-4xl md:text-6xl font-serif font-bold text-gold-gradient tabular-nums">
                  {formatNum(likes)}
                </span>
                <span className="text-xs tracking-widest text-gold/60 uppercase font-sans">
                  ❤️ Likes
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-64 h-px bg-noir-border overflow-hidden relative">
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-gold-dark to-gold-light"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2.8, ease: "easeOut" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
