"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { MediaCard } from "../../components/movie/media-card";
import { getLocalMovies } from "../../lib/movies";
import type { Movie } from "../../types/movie";

const genres = [
  "All",
  "Action",
  "Adventure",
  "Sci-Fi",
  "Thriller",
  "Drama",
  "Comedy",
  "Horror",
  "Mystery",
  "Family",
  "Fantasy",
  "Animation",
  "Crime",
  "Romance",
];

const languageShortcuts = [
  { code: "", label: "ALL LANGUAGES" },
  { code: "ml", label: "MALAYALAM" },
  { code: "ko", label: "KOREAN" },
  { code: "ja", label: "JAPANESE" },
  { code: "fr", label: "FRENCH" },
  { code: "es", label: "SPANISH" },
  { code: "hi", label: "HINDI" },
  { code: "ta", label: "TAMIL" },
];

const moodShortcuts = [
  "ALL MOODS",
  "DARK",
  "MIND-BENDING",
  "EMOTIONAL",
  "INTENSE",
  "ROMANTIC",
  "ADVENTUROUS",
];

const quickSuggestions = [
  "Inception",
  "Interstellar",
  "Parasite",
  "Premam",
  "Arrival",
  "Blade Runner 2049",
  "Oppenheimer",
  "Dune",
];

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || searchParams.get("search") || "";
  const initialGenre = searchParams.get("genre") || "All";
  const initialLang = searchParams.get("language") || "";

  const [query, setQuery] = useState(initialQuery);
  const [activeGenre, setActiveGenre] = useState(initialGenre);
  const [activeLanguage, setActiveLanguage] = useState(initialLang);
  const [activeMood, setActiveMood] = useState("ALL MOODS");
  const [movies, setMovies] = useState<Movie[]>(() => getLocalMovies());
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const requestPage = page;

    const timeout = window.setTimeout(() => {
      setIsLoading(true);
      const params = new URLSearchParams({
        search: query,
        genre: activeGenre,
        language: activeLanguage,
        page: String(requestPage),
      });

      if (activeMood !== "ALL MOODS") {
        params.set("mood", activeMood.toLowerCase());
      }

      fetch(`/api/movies?${params.toString()}`, { signal: controller.signal })
        .then((response) => response.json())
        .then((data) => {
          if (!active) return;
          const results: Movie[] = data.movies || [];
          if (requestPage > 1) {
            setMovies((prev) => {
              const seen = new Set(prev.map((m) => m.id));
              const newItems = results.filter((m) => !seen.has(m.id));
              return [...prev, ...newItems];
            });
          } else {
            setMovies(results);
          }
          setHasMore(results.length >= 12);
          setHasSearched(Boolean(query.trim() || activeGenre !== "All" || activeLanguage || activeMood !== "ALL MOODS"));
        })
        .catch((err) => {
          if (!active || err.name === "AbortError") return;
          if (requestPage === 1) {
            setMovies(getLocalMovies());
          }
          setHasMore(false);
        })
        .finally(() => {
          if (active) {
            setIsLoading(false);
          }
        });
    }, 250);

    return () => {
      active = false;
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [activeGenre, activeLanguage, activeMood, page, query]);

  const handleReset = () => {
    setQuery("");
    setActiveGenre("All");
    setActiveLanguage("");
    setActiveMood("ALL MOODS");
    setPage(1);
  };

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-10 px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* ─── SEARCH HEADER PANEL ────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-2xl border-2 border-white/15 bg-[#0d0f17] p-6 sm:p-10 shadow-2xl">
        <div className="absolute inset-0 bg-halftone-accent opacity-25 pointer-events-none" />
        <div className="film-strip-edge" />

        <div className="relative space-y-6 pt-2">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="comic-badge comic-badge-red text-[10px]">
                DATABASE ACCESS
              </span>
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">
                TMDB ARCHIVE DISCOVERY CONSOLE
              </span>
            </div>
            <h1 className="font-sans text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
              SEARCH THE MOVIE UNIVERSE
            </h1>
            <p className="max-w-2xl text-xs sm:text-sm leading-relaxed text-slate-300">
              Query cinematic entries by title, language, genre, or mood across the entire TMDb global registry.
            </p>
          </div>

          {/* Large Styled Search Input */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400">
              🔍
            </div>
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search by title (e.g. Inception, Parasite, Premam, Interstellar...)"
              className="w-full rounded-xl border-2 border-white/20 bg-black/70 py-4 pl-12 pr-16 text-sm sm:text-base font-semibold text-white placeholder-slate-500 shadow-inner outline-none transition focus:border-[#e50914] focus:bg-black/90 focus:shadow-[0_0_25px_rgba(229,9,20,0.2)]"
            />
            {query ? (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setPage(1);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 px-2.5 py-1 text-xs font-bold text-slate-400 hover:bg-white/20 hover:text-white"
              >
                CLEAR
              </button>
            ) : null}
          </div>

          {/* Quick Search Suggestion Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="font-mono font-bold uppercase tracking-wider text-slate-400">
              SUGGESTED SIGNALS:
            </span>
            {quickSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => {
                  setQuery(suggestion);
                  setPage(1);
                }}
                className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-bold text-slate-300 hover:border-[#f5c518] hover:text-[#f5c518] transition"
              >
                {suggestion}
              </button>
            ))}
          </div>

          {/* Language Shortcuts Row */}
          <div className="space-y-2 border-t border-white/10 pt-4">
            <span className="block text-[10px] font-mono font-bold uppercase tracking-widest text-[#e50914]">
              GLOBAL LANGUAGE LANES:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {languageShortcuts.map((lang) => (
                <button
                  key={lang.label}
                  type="button"
                  onClick={() => {
                    setActiveLanguage(lang.code);
                    setPage(1);
                  }}
                  className={`rounded px-3 py-1 text-xs font-bold uppercase tracking-wider transition ${
                    activeLanguage === lang.code
                      ? "bg-[#e50914] text-white shadow"
                      : "border border-white/10 bg-black/40 text-slate-400 hover:border-white/25 hover:text-white"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mood Shortcuts Row */}
          <div className="space-y-2 border-t border-white/10 pt-4">
            <span className="block text-[10px] font-mono font-bold uppercase tracking-widest text-[#f5c518]">
              NARRATIVE MOOD SHORTCUTS:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {moodShortcuts.map((mood) => (
                <button
                  key={mood}
                  type="button"
                  onClick={() => {
                    setActiveMood(mood);
                    setPage(1);
                  }}
                  className={`rounded px-3 py-1 text-xs font-bold uppercase tracking-wider transition ${
                    activeMood === mood
                      ? "bg-[#f5c518] text-black font-black shadow"
                      : "border border-white/10 bg-black/40 text-slate-400 hover:border-white/25 hover:text-white"
                  }`}
                >
                  {mood}
                </button>
              ))}
            </div>
          </div>

          {/* Genre Filters Row */}
          <div className="space-y-2 border-t border-white/10 pt-4">
            <span className="block text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">
              GENRE SELECTION:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {genres.map((genre) => (
                <button
                  key={genre}
                  type="button"
                  onClick={() => {
                    setActiveGenre(genre);
                    setPage(1);
                  }}
                  className={`rounded px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition ${
                    activeGenre === genre
                      ? "border border-white/40 bg-white/15 text-white"
                      : "border border-white/10 bg-black/40 text-slate-400 hover:border-white/25 hover:text-white"
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Results Header Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="comic-badge comic-badge-dark text-[10px]">
            STATUS
          </span>
          {isLoading ? (
            <span className="text-slate-400">Scanning satellite archive…</span>
          ) : (
            <span className="text-slate-300">
              Showing {movies.length} {movies.length === 1 ? "record" : "records"}
              {query ? ` for "${query}"` : ""}
              {activeGenre !== "All" ? ` in ${activeGenre}` : ""}
              {activeLanguage ? ` (${activeLanguage.toUpperCase()})` : ""}
              {activeMood !== "ALL MOODS" ? ` • ${activeMood}` : ""}
            </span>
          )}
        </div>

        {hasSearched ? (
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-bold uppercase tracking-wider text-[#e50914] hover:underline"
          >
            RESET SEARCH FILTERS ✕
          </button>
        ) : null}
      </div>

      {/* Loading Skeleton */}
      {isLoading && movies.length === 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={`skel-${n}`}
              className="h-80 rounded-xl border border-white/10 bg-[#12151e] p-4 animate-pulse space-y-4"
            >
              <div className="h-44 w-full rounded-lg bg-white/5" />
              <div className="h-5 w-3/4 rounded bg-white/5" />
              <div className="h-4 w-1/2 rounded bg-white/5" />
            </div>
          ))}
        </div>
      ) : null}

      {/* Empty State Concept: "No signal found in this universe" */}
      {!isLoading && movies.length === 0 ? (
        <section className="rounded-2xl border-2 border-dashed border-white/15 bg-[#0e1017] p-10 sm:p-16 text-center space-y-5">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-[#e50914] bg-black text-3xl shadow-[4px_4px_0px_#e50914]">
            📡
          </div>
          <div className="space-y-2">
            <span className="comic-badge comic-badge-red text-xs">
              NO SIGNAL FOUND IN THIS UNIVERSE
            </span>
            <h2 className="font-sans text-2xl sm:text-3xl font-black uppercase text-white">
              ZERO MATCHES RETURNED
            </h2>
            <p className="mx-auto max-w-md text-xs sm:text-sm text-slate-400">
              No matching records found for your query. Try broadening your keywords, clearing filters, or browsing by popular categories below.
            </p>
          </div>

          <div className="pt-4 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="comic-btn-primary text-xs"
            >
              RESET FILTERS
            </button>
            <Link href="/recommendations" className="comic-btn-secondary text-xs">
              TRY AI RECOMMENDATIONS →
            </Link>
          </div>
        </section>
      ) : null}

      {/* Results Grid */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {movies.map((movie, idx) => (
          <MediaCard
            key={`search-${movie.tmdbId || movie.id}-${idx}`}
            movie={movie}
            issueNumber={idx + 1}
          />
        ))}
      </section>

      {/* Pagination / Load More Action */}
      {hasMore ? (
        <div className="flex justify-center pt-6">
          <button
            type="button"
            onClick={() => setPage((current) => current + 1)}
            disabled={isLoading}
            className="comic-btn-secondary text-xs px-8 py-3"
          >
            {isLoading ? "LOADING MORE PANELS…" : "LOAD NEXT PANEL BATCH →"}
          </button>
        </div>
      ) : null}
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-7xl px-4 py-12 text-center text-xs font-mono text-slate-400">
          INITIALIZING ARCHIVE CONSOLE…
        </main>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
