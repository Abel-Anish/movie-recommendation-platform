"use client";

import Link from "next/link";
import { MediaCard } from "../../components/movie/media-card";
import { useWatchlist } from "../../hooks/use-watchlist";
import { saveStoredWatchlist } from "../../lib/watchlist";

export default function WatchlistPage() {
  const { watchlist } = useWatchlist();

  const handleClearAll = () => {
    saveStoredWatchlist([]);
  };

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-10 px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Watchlist Header Panel */}
      <section className="relative overflow-hidden rounded-2xl border-2 border-white/15 bg-[#0d0f17] p-6 sm:p-10 shadow-2xl">
        <div className="absolute inset-0 bg-halftone-accent opacity-20 pointer-events-none" />
        <div className="relative space-y-4">
          <div className="flex items-center gap-2">
            <span className="comic-badge comic-badge-red text-[10px]">
              PERSONAL ARCHIVE
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              SAVED ISSUES
            </span>
          </div>
          <h1 className="font-sans text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            MY COLLECTION
          </h1>
          <p className="max-w-2xl text-xs sm:text-sm leading-relaxed text-slate-300">
            Your personal queue of stories saved across the platform. Stored in your local registry for instant recall anytime.
          </p>
        </div>
      </section>

      {/* Collection Stats Bar */}
      <section className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#0c0e15] px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="comic-badge comic-badge-gold text-xs">
            {watchlist.length} {watchlist.length === 1 ? "STORY SAVED" : "STORIES SAVED"}
          </span>
          <span className="hidden sm:inline text-xs font-mono text-slate-400">
            LOCALLY PERSISTED
          </span>
        </div>

        {watchlist.length > 0 ? (
          <button
            type="button"
            onClick={handleClearAll}
            className="rounded-md border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-300 hover:bg-[#e50914] hover:text-white hover:border-[#e50914] transition"
          >
            CLEAR COLLECTION
          </button>
        ) : null}
      </section>

      {/* Empty State */}
      {watchlist.length === 0 ? (
        <section className="rounded-2xl border-2 border-dashed border-white/15 bg-[#0e1017] p-10 sm:p-16 text-center space-y-5">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-[#f5c518] bg-black text-3xl shadow-[4px_4px_0px_#f5c518]">
            📂
          </div>
          <div className="space-y-2">
            <span className="comic-badge comic-badge-gold text-xs">
              NO ISSUES IN ARCHIVE
            </span>
            <h2 className="font-sans text-2xl sm:text-3xl font-black uppercase text-white">
              YOUR COLLECTION IS EMPTY
            </h2>
            <p className="mx-auto max-w-md text-xs sm:text-sm text-slate-400">
              Save films while browsing the homepage, search universe, or movie detail pages to build your curated personal queue.
            </p>
          </div>

          <div className="pt-4 flex flex-wrap justify-center gap-3">
            <Link href="/" className="comic-btn-primary text-xs">
              START EXPLORING →
            </Link>
            <Link href="/search" className="comic-btn-secondary text-xs">
              SEARCH DATABASE
            </Link>
          </div>
        </section>
      ) : null}

      {/* Saved Movies Storyboard Grid */}
      {watchlist.length > 0 ? (
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {watchlist.map((movie, idx) => (
            <MediaCard
              key={`watchlist-${movie.tmdbId || movie.id}-${idx}`}
              movie={movie}
              issueNumber={idx + 1}
            />
          ))}
        </section>
      ) : null}
    </main>
  );
}
