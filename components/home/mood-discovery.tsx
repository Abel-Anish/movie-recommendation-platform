"use client";

import Link from "next/link";

const moodChips = [
  { key: "dark", label: "DARK & NOIR", icon: "🌑", desc: "Brooding mysteries & moral ambiguity" },
  { key: "mind-bending", label: "MIND-BENDING", icon: "🌀", desc: "Existential puzzles & reality twists" },
  { key: "emotional", label: "EMOTIONAL", icon: "💧", desc: "Heart-wrenching human drama" },
  { key: "intense", label: "INTENSE", icon: "⚡", desc: "High-octane adrenaline & survival" },
  { key: "fun", label: "FUN & WITTY", icon: "🍿", desc: "Charismatic comedy & banter" },
  { key: "romantic", label: "ROMANTIC", icon: "🌹", desc: "Magnetic passion & human connection" },
  { key: "late-night", label: "LATE NIGHT", icon: "🌙", desc: "Neon noir & hypnotic slow burns" },
  { key: "unsettling", label: "UNSETTLING", icon: "👁️", desc: "Creeping psychological dread" },
  { key: "inspiring", label: "INSPIRING", icon: "✨", desc: "Triumphant human spirit" },
  { key: "adventure", label: "ADVENTUROUS", icon: "🚀", desc: "High-concept journeys & cosmos" },
] as const;

export function MoodDiscovery() {
  return (
    <section className="relative overflow-hidden rounded-2xl border-2 border-white/15 bg-[#0b0d14] p-6 sm:p-8 shadow-xl">
      <div className="film-strip-edge" />
      <div className="relative space-y-6 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-white/10 pb-4">
          <div>
            <span className="comic-badge comic-badge-gold text-[10px]">
              AUDIENCE STATE OF MIND
            </span>
            <h2 className="font-sans text-2xl sm:text-3xl font-black uppercase text-white mt-1">
              WHAT ARE YOU IN THE MOOD FOR?
            </h2>
          </div>
          <p className="text-xs font-mono text-slate-400">
            CONNECTS DIRECTLY TO TMDB NARRATIVE ENGINE
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {moodChips.map((mood) => (
            <Link
              key={mood.key}
              href={`/recommendations?mood=${mood.key}`}
              className="group flex flex-col justify-between rounded-xl border border-white/10 bg-[#121520] p-4 transition-all duration-200 hover:-translate-y-1 hover:border-[#e50914] hover:bg-[#161a28] hover:shadow-lg"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xl">{mood.icon}</span>
                  <span className="text-[10px] font-mono text-slate-500 group-hover:text-[#f5c518] transition">
                    EXPLORE →
                  </span>
                </div>
                <h3 className="text-xs font-black uppercase tracking-wider text-white group-hover:text-[#e50914] transition">
                  {mood.label}
                </h3>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                {mood.desc}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
