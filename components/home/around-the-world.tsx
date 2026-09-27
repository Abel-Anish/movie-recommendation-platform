"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MediaCard } from "../movie/media-card";
import type { GlobalDiscoveryLane } from "../../types/movie";

export function AroundTheWorld({ lanes }: { lanes: GlobalDiscoveryLane[] }) {
  const [activeLaneId, setActiveLaneId] = useState<string>(lanes[0]?.id || "kerala");
  const activeLane = lanes.find((l) => l.id === activeLaneId) || lanes[0];

  if (!lanes || lanes.length === 0) return null;

  return (
    <section className="relative overflow-hidden rounded-2xl border-2 border-white/15 bg-[#0e111a] p-6 sm:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.85)]">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#e50914]/8 rounded-full blur-3xl pointer-events-none" />
      <div className="film-strip-edge" />

      <div className="relative space-y-6 pt-2">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="comic-badge comic-badge-red text-[10px]">
                SPECIAL FEATURE • GLOBAL CINEMA MATRIX
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                REAL TMDB REGIONAL SIGNALS
              </span>
            </div>
            <h2 className="font-sans text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
              AROUND THE WORLD TONIGHT
            </h2>
            <p className="max-w-2xl text-xs sm:text-sm text-slate-300">
              Break past standard algorithms and explore rich cinematic storytelling from master filmmakers across the globe.
            </p>
          </div>

          <Link
            href="/recommendations?mode=international"
            className="text-xs font-black uppercase tracking-widest text-[#f5c518] hover:underline shrink-0"
          >
            INTERNATIONAL MODE →
          </Link>
        </div>

        {/* Lane Selector Buttons */}
        <div className="flex flex-wrap gap-2 pt-1">
          {lanes.map((lane) => (
            <button
              key={lane.id}
              type="button"
              onClick={() => setActiveLaneId(lane.id)}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-black uppercase tracking-wider transition ${
                activeLane?.id === lane.id
                  ? "bg-[#e50914] text-white shadow-[2px_2px_0px_#000000]"
                  : "border border-white/12 bg-black/40 text-slate-300 hover:border-white/30 hover:text-white"
              }`}
            >
              <span>{lane.flagOrIcon || "🌐"}</span>
              <span>{lane.title}</span>
            </button>
          ))}
        </div>

        {/* Editorial Narrative Callout */}
        {activeLane ? (
          <div className="rounded-xl border border-white/10 bg-black/50 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="block text-[10px] font-mono font-bold uppercase tracking-widest text-[#f5c518]">
                {activeLane.editorialNote}
              </span>
              <p className="text-xs text-slate-300">
                {activeLane.subtitle}
              </p>
            </div>
            <Link
              href={`/search?language=${activeLane.languageCode}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white shrink-0"
            >
              VIEW ALL {activeLane.title} →
            </Link>
          </div>
        ) : null}

        {/* Animated Lane Movie Grid */}
        <AnimatePresence mode="wait">
          {activeLane ? (
            <motion.div
              key={activeLane.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {activeLane.movies.slice(0, 6).map((movie, idx) => (
                <MediaCard
                  key={`global-${activeLane.id}-${movie.tmdbId || movie.id}-${idx}`}
                  movie={movie}
                  issueNumber={idx + 1}
                />
              ))}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </section>
  );
}
