"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type HeroPanelProps = {
  badge?: string;
  title: string;
  subtitle?: string;
  backdropUrl?: string;
  posterUrl?: string;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
};

export function HeroBanner({
  badge = "ISSUE #01 • FEATURED RELEASE",
  title,
  subtitle,
  actions,
  children,
  className = "",
}: HeroPanelProps) {
  return (
    <section
      className={`relative overflow-hidden rounded-2xl border border-white/15 bg-[#0d0f16] shadow-[0_24px_60px_-15px_rgba(0,0,0,0.9)] ${className}`}
    >
      {/* Background radial glow & halftone accents */}
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 0.35, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute inset-0 bg-halftone-accent pointer-events-none"
      />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#e50914]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#f5c518]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Film-strip perforation motif */}
      <div className="film-strip-edge" />

      <div className="relative p-6 sm:p-8 lg:p-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-5">
            {/* Comic Issue Badge Reveal */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className="flex items-center gap-2"
            >
              <span className="comic-badge comic-badge-red text-xs">
                {badge}
              </span>
              <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400">
                ACT I • SCENE 01
              </span>
            </motion.div>

            {/* Dramatic Editorial Title Reveal */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="space-y-3"
            >
              <h1 className="font-sans text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white drop-shadow-md">
                {title}
              </h1>
              {subtitle ? (
                <p className="max-w-xl text-base sm:text-lg leading-relaxed text-slate-300">
                  {subtitle}
                </p>
              ) : null}
            </motion.div>

            {/* CTA Actions Reveal Last */}
            {actions ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.3 }}
                className="pt-2"
              >
                {actions}
              </motion.div>
            ) : null}
          </div>

          {/* Floating Poster / Featured Frame Slide-In */}
          {children ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
              className="w-full max-w-lg shrink-0"
            >
              {children}
            </motion.div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
