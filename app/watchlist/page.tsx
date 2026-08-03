"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { movies } from "../../lib/movies";

export default function WatchlistPage() {
  const [watchlistIds, setWatchlistIds] = useState<string[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    const saved = window.localStorage.getItem("watchlist");
    if (!saved) {
      return [];
    }

    try {
      return JSON.parse(saved) as string[];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("watchlist", JSON.stringify(watchlistIds));
    }
  }, [watchlistIds]);

  const watchlistMovies = useMemo(
    () => movies.filter((movie) => watchlistIds.includes(movie.id)),
    [watchlistIds],
  );

  const toggleMovie = (id: string) => {
    setWatchlistIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-8 lg:px-8 lg:py-10">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-pink-600">Your watchlist</p>
        <h1 className="mt-3 text-3xl font-black text-slate-900">Save the movies you want to revisit.</h1>
        <p className="mt-3 max-w-2xl text-base leading-8 text-slate-600">
          Your picks stay saved in this browser so you can keep building a personal queue.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {movies.map((movie) => {
          const isSaved = watchlistIds.includes(movie.id);
          return (
            <article key={`${movie.tmdbId || movie.id}-${movie.slug}`} className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm">
              <Image src={movie.image || "/" } alt={movie.title || "Movie poster"} width={800} height={480} loading="eager" className="h-44 w-full object-cover" />
              <div className="space-y-3 p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-pink-600">{movie.genre}</p>
                  <p className="text-sm font-medium text-slate-500">★ {movie.rating}</p>
                </div>
                <h2 className="text-xl font-semibold text-slate-900">{movie.title}</h2>
                <p className="text-sm leading-7 text-slate-600">{movie.blurb}</p>
                <div className="flex items-center justify-between gap-3">
                  <Link href={`/movie/${movie.slug}`} className="text-sm font-semibold text-slate-900 hover:text-pink-600">
                    Details
                  </Link>
                  <button
                    type="button"
                    onClick={() => toggleMovie(movie.id)}
                    className={`rounded-full px-3 py-2 text-sm font-semibold transition ${
                      isSaved ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {isSaved ? "Saved" : "Save"}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {watchlistMovies.length > 0 ? (
        <section className="rounded-[2rem] border border-slate-200 bg-slate-900 p-8 text-white shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Saved right now</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {watchlistMovies.map((movie) => (
              <span key={movie.id} className="rounded-full bg-white/10 px-3 py-2 text-sm font-medium">
                {movie.title}
              </span>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
