"use client";
// components/ContactSection.tsx — AK2.0
// Real contact details. WhatsApp tap-to-chat. Long-press copy for email + Instagram.

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLongPress } from "@/hooks/useLongPress";
import type { ContactInfo } from "@/lib/api";

interface Props { contact: ContactInfo }

function CopyItem({
  icon, label, value, href, copyValue,
}: {
  icon: string; label: string; value: string; href?: string; copyValue: string;
}) {
  const [copied, setCopied] = useState(false);
  const [bubble, setBubble] = useState(false);

  const longPress = useLongPress({ onLongPress: () => setBubble(true), delay: 500 });

  const doCopy = async () => {
    await navigator.clipboard.writeText(copyValue);
    setCopied(true);
    setBubble(false);
    setTimeout(() => setCopied(false), 2500);
  };

  const Inner = (
    <div className="flex items-center gap-4 w-full">
      <span className="text-xl flex-shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="font-mono text-[9px] tracking-[0.32em] text-gold uppercase mb-0.5">{label}</p>
        <p className="font-sans text-sm text-ink font-medium truncate">{value}</p>
      </div>
      {href && <span className="text-gold-muted text-xs opacity-50 group-hover:opacity-100 transition-opacity">↗</span>}
      {!href && <span className="hidden md:block font-mono text-[8px] text-ink-faint tracking-widest uppercase opacity-30 flex-shrink-0">hold to copy</span>}
    </div>
  );

  return (
    <div className="relative">
      <AnimatePresence>
        {bubble && (
          <motion.div className="absolute -top-16 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.85, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.2 }}>
            <button onClick={doCopy}
              className="bg-gold text-cream font-sans font-semibold text-xs tracking-wider px-5 py-2.5 rounded-full shadow-lg flex items-center gap-2 whitespace-nowrap">
              📋 Copy
            </button>
            <div className="w-2.5 h-2.5 bg-gold rotate-45 -mt-1.5" />
          </motion.div>
        )}
      </AnimatePresence>

      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" {...longPress}
          className="group flex items-center border border-cream-border hover:border-gold/50 bg-cream-soft hover:bg-gold-pale/20 px-6 py-5 rounded-[2px] transition-all duration-300 w-full">
          {Inner}
        </a>
      ) : (
        <div {...longPress}
          className="flex items-center border border-cream-border hover:border-gold/30 bg-cream-soft px-6 py-5 rounded-[2px] transition-all duration-300 cursor-default select-none w-full">
          {Inner}
        </div>
      )}

      <AnimatePresence>
        {copied && (
          <motion.p className="absolute -bottom-6 left-0 right-0 text-center font-sans text-xs text-gold"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            ✓ Copied
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ContactSection({ contact }: Props) {
  return (
    <section id="contact" className="bg-cream-soft">
      {/* Gold top rule */}
      <div className="gold-rule opacity-30" />

      <div className="section-pad">
        <div className="max-w-lg mx-auto">
          {/* Header */}
          <div className="mb-14">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-px bg-gold" />
              <span className="font-mono text-xs tracking-[0.35em] text-gold uppercase">Get in Touch</span>
            </div>
            <h2 className="font-serif font-light text-4xl md:text-6xl text-ink mb-5">
              Let's Create <em className="text-gold-gradient not-italic">Together</em>
            </h2>
            <p className="font-sans font-light text-sm text-ink-muted leading-relaxed">
              For cinematic wedding coverage, enquiries and collaborations.
            </p>
            <p className="font-serif italic text-gold mt-3 text-base">
              "Limited dates available. Book your consultation early."
            </p>
          </div>

          {/* Contact cards */}
          <div className="flex flex-col gap-4 mb-16">
            <CopyItem
              icon="💬" label="WhatsApp"
              value={`+${contact.whatsapp_number}`}
              href={contact.whatsapp_url}
              copyValue={contact.whatsapp_number}
            />
            <CopyItem
              icon="✉️" label="Email"
              value={contact.email}
              copyValue={contact.email}
            />
            <CopyItem
              icon="📸" label="Instagram"
              value={contact.instagram_handle}
              href={contact.instagram_url}
              copyValue={contact.instagram_handle}
            />
          </div>

          {/* Gold rule */}
          <div className="gold-rule opacity-20 mb-10" />

          {/* Footer */}
          <div className="flex justify-between items-center">
            <div>
              <span className="font-serif italic text-gold text-xl block mb-0.5">AV</span>
              <p className="font-mono text-[9px] tracking-widest text-ink-faint uppercase">
                Akshay Vastrad Media House
              </p>
            </div>
            <p className="font-mono text-[9px] tracking-widest text-ink-faint uppercase">
              © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
