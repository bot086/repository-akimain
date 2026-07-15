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
  icon: React.ReactNode; label: string; value: string; href?: string; copyValue: string;
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
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1C1916] text-[#C4952A] group-hover:scale-110 transition-transform duration-500 shadow-sm border border-gold/10">
        {icon}
      </div>
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
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.06-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              }
              label="WhatsApp"
              value={`+${contact.whatsapp_number}`}
              href={contact.whatsapp_url}
              copyValue={contact.whatsapp_number}
            />
            <CopyItem
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              }
              label="Email"
              value={contact.email}
              copyValue={contact.email}
            />
            <CopyItem
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              }
              label="Instagram"
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
