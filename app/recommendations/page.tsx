"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MediaCard } from "../../components/movie/media-card";
import { WatchlistToggleButton } from "../../components/movie/watchlist-toggle-button";
import { fallbackBackdrop, fallbackPoster } from "../../services/image.service";
import { getLocalMovies } from "../../lib/movies";
import type { CinemaDnaProfile, Movie, SpecialPick } from "../../types/movie";

type RecommendationMovie = Movie & {
  reason?: string;
  score?: number;
};

const starterInputs = ["Interstellar", "Parasite", "Premam"];

const moodProfiles = [
  { key: "adventure", label: "ADVENTURE & SCI-FI", blurb: "High-concept journeys, space, mind-bending discoveries." },
  { key: "thriller", label: "EDGE-OF-SEAT THRILLER", blurb: "Fast pacing, psychological tension, suspenseful twists." },
  { key: "dark", label: "DARK & ATMOSPHERIC", blurb: "Noir mysteries, brooding antiheroes, moral ambiguity." },
  { key: "mind-bending", label: "MIND-BENDING", blurb: "Reality distortions, nested narratives, existential puzzles." },
  { key: "emotional", label: "EMOTIONAL & MOVING", blurb: "Heart-wrenching human drama, tearjerkers, catharsis." },
  { key: "intense", label: "INTENSE & VISCERAL", blurb: "High-octane adrenaline, survival, breathless stakes." },
  { key: "fun", label: "FUN & CHARISMATIC", blurb: "Energetic comedy, witty banter, delightful spectacle." },
  { key: "romantic", label: "ROMANTIC & POETIC", blurb: "Magnetic chemistry, deep passion, artistic payoffs." },
  { key: "late-night", label: "LATE NIGHT NOIR", blurb: "Hypnotic neon, slow burns, midnight insomnia vibes." },
  { key: "unsettling", label: "UNSETTLING & DREAD", blurb: "Psychological horror, creeping unease, chilling climaxes." },
  { key: "inspiring", label: "INSPIRING & TRIUMPHANT", blurb: "Triumph against odds, historic bravery, human spirit." },
] as const;

const promptShortcuts = [
  "I want a Malayalam psychological thriller like Drishyam",
  "Mind-bending space sci-fi like Interstellar but more emotional",
  "Korean dark thrillers with sharp dialogue and twists",
  "Movies like Premam but from European cinema",
  "High-stakes neo-noir crime with shocking endings",
  "Uplifting animated stories with breathtaking art",
];

const modes = [
  { key: "best_match", label: "BEST MATCH" },
  { key: "hidden_gems", label: "HIDDEN GEMS" },
  { key: "international", label: "INTERNATIONAL" },
  { key: "different_language", label: "DIFFERENT LANGUAGE" },
  { key: "highly_rated", label: "HIGHLY RATED" },
  { key: "classics", label: "CLASSICS" },
  { key: "surprise", label: "SURPRISE ME" },
] as const;

export default function RecommendationsPage() {
  const [activeMood, setActiveMood] = useState<(typeof moodProfiles)[number]["key"]>("adventure");
  const [activeMode, setActiveMode] = useState<(typeof modes)[number]["key"]>("best_match");
  const [prompt, setPrompt] = useState<string>("");
  const [inputs, setInputs] = useState<string[]>(starterInputs);
  const [newSeedInput, setNewSeedInput] = useState<string>("");
  const [movies, setMovies] = useState<RecommendationMovie[]>(() => getLocalMovies() as RecommendationMovie[]);
  const [recommendations, setRecommendations] = useState<RecommendationMovie[]>([]);
  const [cinemaDna, setCinemaDna] = useState<CinemaDnaProfile | null>(null);
  const [unexpectedGem, setUnexpectedGem] = useState<SpecialPick | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(12);

  // Fetch base movie catalog for fallback
  useEffect(() => {
    let active = true;
    fetch("/api/movies")
      .then((res) => res.json())
      .then((data) => {
        if (active && data?.movies?.length) {
          setMovies(data.movies);
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  // Synchronize recommendations from API
  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const trimmedInputs = inputs.map((input) => input.trim()).filter(Boolean);
    const seeds = trimmedInputs.length ? trimmedInputs : starterInputs;

    const timer = setTimeout(() => {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams({
        mood: activeMood,
        seed: seeds.join(","),
        mode: activeMode,
        prompt: prompt.trim(),
      });

      fetch(`/api/movies/recommendations?${params.toString()}`, { signal: controller.signal })
        .then((response) => response.json())
        .then((data) => {
          if (!active) return;
          if (data.recommendations && data.recommendations.length > 0) {
            setRecommendations(data.recommendations);
          } else {
            setRecommendations([]);
          }
          if (data.cinemaDna) {
            setCinemaDna(data.cinemaDna);
          }
          if (data.unexpectedGem) {
            setUnexpectedGem(data.unexpectedGem);
          }
        })
        .catch((err) => {
          if (!active || err.name === "AbortError") return;
          setError("TMDb signals synchronizing. Displaying local curated catalog.");
          setRecommendations(getLocalMovies().slice(0, 12));
        })
        .finally(() => {
          if (active) {
            setIsLoading(false);
          }
        });
    }, 300);

    return () => {
      active = false;
      controller.abort();
      clearTimeout(timer);
    };
  }, [activeMood, activeMode, inputs, prompt]);

  const displayRecommendations = useMemo(() => {
    if (recommendations.length) {
      return recommendations.slice(0, visibleCount);
    }

    const fallback = movies.filter(
      (movie) => movie.mood === activeMood || movie.genre === "Sci-Fi" || movie.genre === "Drama",
    );
    return fallback.length ? fallback.slice(0, visibleCount) : movies.slice(0, visibleCount);
  }, [activeMood, movies, recommendations, visibleCount]);

  const activeProfile = moodProfiles.find((m) => m.key === activeMood);

  const handleAddSeed = () => {
    const val = newSeedInput.trim();
    if (val && !inputs.includes(val) && inputs.length < 6) {
      setInputs([...inputs, val]);
      setNewSeedInput("");
    }
  };

  const handleRemoveSeed = (indexToRemove: number) => {
    if (inputs.length > 1) {
      setInputs(inputs.filter((_, idx) => idx !== indexToRemove));
    }
  };

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-12 px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* ─── HEADER & INTELLIGENT DISCOVERY CONSOLE ────────────────────────── */}
      <section className="relative overflow-hidden rounded-2xl border-2 border-white/15 bg-[#0d0f17] p-6 sm:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.85)]">
        <div className="absolute inset-0 bg-halftone-accent opacity-20 pointer-events-none" />
        <div className="film-strip-edge" />

        <div className="relative space-y-8 pt-2">
          {/* Header Title */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="comic-badge comic-badge-red text-[10px]">
                CHAPTER 02 • THE WRITERS ROOM
              </span>
              <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400">
                MULTI-SEED & NATURAL PROMPT ENGINE
              </span>
            </div>
            <h1 className="font-sans text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
              YOUR NEXT ISSUE
            </h1>
            <p className="max-w-3xl text-xs sm:text-sm leading-relaxed text-slate-300">
              Enter your favorite movie seeds or describe your desired cinematic mood in plain language. Our engine computes your multi-seed crossover, enforces global diversity, and maps your Cinema DNA.
            </p>
          </div>

          {/* 1. Freeform Natural Language Prompt Bar */}
          <div className="space-y-2.5 rounded-xl border border-white/12 bg-black/40 p-4 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <label htmlFor="prompt-input" className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#f5c518]">
                NATURAL LANGUAGE DIRECTIVE (WIRED ENGINE):
              </label>
              {prompt ? (
                <button
                  type="button"
                  onClick={() => setPrompt("")}
                  className="text-[10px] font-mono text-slate-400 hover:text-white"
                >
                  CLEAR DIRECTIVE ✕
                </button>
              ) : null}
            </div>
            <div className="relative">
              <input
                id="prompt-input"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. 'I want a Malayalam psychological thriller' or 'Something like Interstellar but from Korea'..."
                className="w-full rounded-lg border border-white/20 bg-black/70 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-[#e50914] focus:bg-black/90 focus:ring-1 focus:ring-[#e50914]"
              />
            </div>

            {/* Quick Prompt Descriptors */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mr-1">
                QUICK DIRECTIVES:
              </span>
              {promptShortcuts.map((shortcut) => (
                <button
                  key={shortcut}
                  type="button"
                  onClick={() => setPrompt(shortcut)}
                  className="rounded-md border border-white/10 bg-white/4 px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:border-[#f5c518] hover:text-[#f5c518] hover:bg-white/8 transition"
                >
                  &ldquo;{shortcut}&rdquo;
                </button>
              ))}
            </div>
          </div>

          {/* 2. Multi-Seed Movie Pills Input */}
          <div className="space-y-3 border-t border-white/10 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#e50914]">
                YOUR SEED MOVIES ({inputs.length}/5 ANALYZED):
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                BALANCED COVERAGE GUARANTEED
              </span>
            </div>

            {/* Existing Seed Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {inputs.map((seed, index) => (
                <div
                  key={`seed-pill-${seed}-${index}`}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-black/60 px-3.5 py-2 text-xs font-bold text-white shadow"
                >
                  <span className="text-[10px] font-mono text-[#f5c518]">#{index + 1}</span>
                  <span>{seed}</span>
                  {inputs.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => handleRemoveSeed(index)}
                      className="ml-1 text-slate-400 hover:text-[#e50914] transition"
                      aria-label={`Remove ${seed}`}
                    >
                      ✕
                    </button>
                  ) : null}
                </div>
              ))}

              {/* Add New Seed Pill */}
              {inputs.length < 5 ? (
                <div className="flex items-center gap-1.5">
                  <input
                    value={newSeedInput}
                    onChange={(e) => setNewSeedInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSeed();
                      }
                    }}
                    placeholder="+ Add another movie..."
                    className="w-44 rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-[#f5c518]"
                  />
                  <button
                    type="button"
                    onClick={handleAddSeed}
                    className="rounded-lg border border-white/20 bg-white/8 px-3 py-2 text-xs font-bold uppercase text-slate-200 hover:bg-white/15 transition"
                  >
                    ADD
                  </button>
                </div>
              ) : null}
            </div>
          </div>

          {/* 3. Recommendation Mode Selector Tabs */}
          <div className="space-y-2 border-t border-white/10 pt-4">
            <span className="block text-[10px] font-mono font-bold uppercase tracking-widest text-[#f5c518]">
              DISCOVERY STRATEGY / MODE:
            </span>
            <div className="flex flex-wrap gap-2">
              {modes.map((m) => (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => setActiveMode(m.key)}
                  className={`rounded-lg px-3.5 py-2 text-xs font-black uppercase tracking-wider transition ${
                    activeMode === m.key
                      ? "bg-[#e50914] text-white shadow-[2px_2px_0px_#000000]"
                      : "border border-white/10 bg-black/40 text-slate-300 hover:border-white/25 hover:text-white"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Mood Profile Chips */}
          <div className="space-y-2 border-t border-white/10 pt-4">
            <span className="block text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">
              TARGET NARRATIVE MOOD:
            </span>
            <div className="flex flex-wrap gap-2">
              {moodProfiles.map((mood) => (
                <button
                  key={mood.key}
                  type="button"
                  onClick={() => setActiveMood(mood.key)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition ${
                    activeMood === mood.key
                      ? "border border-[#f5c518] bg-[#f5c518]/15 text-[#f5c518] shadow"
                      : "border border-white/8 bg-black/30 text-slate-400 hover:border-white/20 hover:text-slate-200"
                  }`}
                >
                  {mood.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATUS & ACTIVE PROFILE BAR ───────────────────────────────────── */}
      <section className="rounded-xl border border-white/12 bg-[#0c0e15] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="comic-badge comic-badge-dark text-[10px]">ACTIVE NARRATIVE</span>
            <span className="text-xs font-black uppercase tracking-wide text-[#f5c518]">
              {activeProfile?.label}
            </span>
            <span className="text-xs font-mono text-slate-500">•</span>
            <span className="comic-badge comic-badge-red text-[10px]">
              MODE: {activeMode.replace("_", " ")}
            </span>
          </div>
          <p className="text-xs text-slate-300">{activeProfile?.blurb}</p>
        </div>

        {isLoading ? (
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 shrink-0">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#e50914] animate-ping" />
            SYNCHRONIZING TMDB SIGNALS…
          </div>
        ) : (
          <span className="text-xs font-mono text-slate-400 shrink-0">
            ✓ {recommendations.length} CANDIDATES CROSS-REFERENCED
          </span>
        )}
      </section>

      {/* ─── "CINEMA DNA" TASTE VISUALIZATION SECTION ─────────────────────── */}
      {cinemaDna ? (
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden rounded-2xl border-2 border-white/15 bg-[#0e111a] p-6 sm:p-8 shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#f5c518]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="comic-badge comic-badge-gold text-[10px]">
                    SIGNATURE VISUALIZATION
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    DERIVED FROM {cinemaDna.totalSeedsAnalyzed} SEEDS + TMDB METADATA
                  </span>
                </div>
                <h2 className="font-sans text-2xl sm:text-3xl font-black uppercase text-white mt-1">
                  CINEMA DNA TASTE PROFILE
                </h2>
              </div>
              <div className="text-xs font-mono text-slate-400">
                {cinemaDna.ratingPreference}
              </div>
            </div>

            {/* Dimensional Score Bars */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#e50914]">
                  EMOTIONAL & THEMATIC SPECTRUM:
                </span>
                <div className="space-y-3">
                  {cinemaDna.dimensions.map((dim) => (
                    <div key={dim.label} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-slate-300">
                        <span>{dim.label}</span>
                        <span className="font-mono text-[#f5c518]">{dim.score}%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-black/60 border border-white/10">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${dim.score}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className="h-full rounded-full bg-gradient-to-r from-[#e50914] to-[#f5c518]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Global Taste & Dominant Signals */}
              <div className="flex flex-col justify-between gap-6 rounded-xl border border-white/10 bg-black/40 p-5">
                <div className="space-y-3">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#f5c518]">
                    GLOBAL CINEMA FOOTPRINT:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {cinemaDna.globalTaste.map((country) => (
                      <span
                        key={country}
                        className="rounded-md border border-white/15 bg-white/6 px-3 py-1 text-xs font-semibold text-white"
                      >
                        🌍 {country}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-white/8 pt-3 text-xs">
                  <div>
                    <span className="block text-[10px] font-mono uppercase text-slate-500">
                      DOMINANT GENRES
                    </span>
                    <p className="font-bold text-slate-200 mt-0.5">
                      {cinemaDna.dominantGenres.slice(0, 3).join(" • ")}
                    </p>
                  </div>
                  <div>
                    <span className="block text-[10px] font-mono uppercase text-slate-500">
                      CULTURE & CURATION
                    </span>
                    <span className="inline-block mt-0.5 comic-badge comic-badge-dark text-[10px]">
                      {cinemaDna.mainstreamTendency}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      ) : null}

      {/* ─── "THE MOVIE YOU DIDN'T KNOW YOU NEEDED" ───────────────────────── */}
      {unexpectedGem ? (
        <section className="relative overflow-hidden rounded-2xl border-2 border-[#f5c518]/40 bg-[#12141f] shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
          <div className="relative h-60 sm:h-72 w-full overflow-hidden bg-black">
            <Image
              src={unexpectedGem.movie.backdrop || unexpectedGem.movie.image || fallbackBackdrop}
              alt={`${unexpectedGem.movie.title} backdrop`}
              fill
              sizes="100vw"
              className="object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#12141f] via-[#12141f]/50 to-transparent" />
            <div className="film-strip-edge" />

            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="comic-badge comic-badge-gold">
                ★ {unexpectedGem.headline}
              </span>
              {unexpectedGem.matchPercentage ? (
                <span className="comic-badge comic-badge-red">
                  {unexpectedGem.matchPercentage}% RESONANCE
                </span>
              ) : null}
            </div>

            {/* Bottom floating details */}
            <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="flex items-end gap-4">
                <div className="relative hidden sm:block h-32 w-22 shrink-0 overflow-hidden rounded-lg border-2 border-white/20 bg-black shadow-xl">
                  <Image
                    src={unexpectedGem.movie.image || fallbackPoster}
                    alt={`${unexpectedGem.movie.title} poster`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="comic-badge comic-badge-dark text-[10px]">
                      {unexpectedGem.movie.genre}
                    </span>
                    <span className="text-xs font-bold text-slate-300">
                      {unexpectedGem.movie.year} • ★ {unexpectedGem.movie.rating}
                    </span>
                  </div>
                  <h3 className="font-sans text-2xl sm:text-3xl font-black uppercase text-white">
                    {unexpectedGem.movie.title}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <WatchlistToggleButton movie={unexpectedGem.movie} className="text-xs" />
                <Link
                  href={`/movie/${unexpectedGem.movie.slug}`}
                  className="comic-btn-primary text-xs"
                >
                  ENTER STORY →
                </Link>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6 bg-[#0c0e15] border-t border-white/10">
            <div className="caption-box caption-box-gold text-xs leading-relaxed text-slate-200">
              <span className="block font-black uppercase tracking-widest text-[#f5c518] mb-1">
                WHY THIS MOVIE (DEFENSIBLE DISCOVERY):
              </span>
              {unexpectedGem.reason}
            </div>
          </div>
        </section>
      ) : null}

      {/* ─── RECOMMENDATIONS STORYBOARD GRID ──────────────────────────────── */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="comic-badge comic-badge-red text-[10px]">
                BASED ON {inputs.length} SEED FILMS
              </span>
              <span className="text-[11px] font-mono text-slate-400 uppercase">
                {activeMode.replace("_", " ")} STRATEGY
              </span>
            </div>
            <h2 className="font-sans text-2xl sm:text-3xl font-black uppercase text-white mt-1">
              YOUR {displayRecommendations.length} BEST MATCHES
            </h2>
          </div>

          <div className="text-xs font-mono text-slate-400">
            SHOWING {displayRecommendations.length} OF {recommendations.length} CANDIDATES
          </div>
        </div>

        {error ? (
          <div className="caption-box caption-box-gold text-xs text-amber-200">
            {error}
          </div>
        ) : null}

        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeMood}-${activeMode}-${prompt}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {displayRecommendations.map((movie, idx) => (
              <MediaCard
                key={`rec-page-${movie.tmdbId || movie.id}-${idx}`}
                movie={movie}
                variant="recommendation"
                reason={movie.reason}
                score={movie.score}
                issueNumber={idx + 1}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Load More Button */}
        {recommendations.length > visibleCount ? (
          <div className="flex justify-center pt-6">
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => Math.min(recommendations.length, prev + 12))}
              className="comic-btn-secondary text-xs px-8 py-3.5 shadow-lg"
            >
              LOAD MORE CANDIDATES ({recommendations.length - visibleCount} REMAINING) ↓
            </button>
          </div>
        ) : null}
      </section>
    </main>
  );
}
