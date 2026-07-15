"use client";
// components/TheaterMode.tsx
// Full-screen cream/dark overlay for video or photo — luxury styling.

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { MediaItem } from "@/lib/api";

interface Props {
  item: MediaItem;
  onClose: () => void;
}

export default function TheaterMode({ item, onClose }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handler);
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[300] flex items-center justify-center theater-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      onClick={onClose}
    >
      {/* Close */}
      <button
        className="absolute top-6 right-8 font-sans text-xs tracking-[0.3em] text-cream/50 hover:text-gold uppercase transition-colors duration-300 z-10"
        onClick={onClose}
      >
        ✕ &nbsp;Close
      </button>

      {/* Gold top rule */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent opacity-40" />

      {/* Media content */}
      <motion.div
        className="relative max-w-5xl w-full mx-6 md:mx-12"
        initial={{ scale: 0.96, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.96, y: 20 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        {item.media_type === "video" ? (
          <video
            src={item.url}
            controls
            autoPlay
            className="w-full max-h-[80vh] rounded-sm"
            style={{ boxShadow: "0 0 80px rgba(196,149,42,0.15), 0 40px 80px rgba(0,0,0,0.5)" }}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.url}
            alt={item.alt_text ?? ""}
            className="w-full max-h-[85vh] object-contain rounded-sm"
            style={{ boxShadow: "0 0 80px rgba(196,149,42,0.15), 0 40px 80px rgba(0,0,0,0.5)" }}
          />
        )}

        {item.alt_text && (
          <p className="mt-5 text-center font-sans font-light text-xs tracking-widest text-cream/40 uppercase">
            {item.alt_text}
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}
