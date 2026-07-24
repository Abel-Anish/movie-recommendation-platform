"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getLocalMovies } from "../../lib/movies";

const moods = [
  { key: "cozy", label: "Cozy nights", blurb: "Warm, comforting stories with heart." },
  { key: "adventure", label: "Adventure mode", blurb: "Big ideas and bold journeys." },
  { key: "thriller", label: "Edge-of-seat", blurb: "Fast pacing and suspenseful twists." },
  { key: "romantic", label: "Romantic escape", blurb: "Gentle chemistry and emotional payoff." },
] as const;

export default function RecommendationsPage() {
  const [activeMood, setActiveMood] = useState<(typeof moods)[number]["key"]>("cozy");
  const [movies, setMovies] = useState(getLocalMovies());

  useEffect(() => {
    fetch("/api/movies")
      .then((response) => response.json())
      .then((data) => setMovies(data.movies || getLocalMovies()))
      .catch(() => setMovies(getLocalMovies()));
  }, []);

  const recommendations = useMemo(() => {
    return movies.filter((movie) => movie.mood === activeMood);
  }, [activeMood, movies]);

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-8 lg:px-8 lg:py-10">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-pink-600">Personalized picks</p>
        <h1 className="mt-3 text-3xl font-black text-slate-900">Pick a mood and we’ll tailor the list.</h1>
        <p className="mt-3 max-w-2xl text-base leading-8 text-slate-600">
          This experience is designed to feel like a real recommendation product, with mood-based suggestions that can evolve into AI-driven picks later.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          {moods.map((mood) => (
            <button
              key={mood.key}
              type="button"
              onClick={() => setActiveMood(mood.key)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeMood === mood.key
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {mood.label}
            </button>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-slate-900 p-8 text-white shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Current mood</p>
          <h2 className="mt-3 text-2xl font-semibold">
            {moods.find((mood) => mood.key === activeMood)?.label}
          </h2>
          <p className="mt-3 text-base leading-8 text-slate-300">
            {moods.find((mood) => mood.key === activeMood)?.blurb}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {recommendations.map((movie) => (
            <article key={movie.id} className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm">
              <img src={movie.image} alt={movie.title} className="h-44 w-full object-cover" />
              <div className="space-y-3 p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-pink-600">{movie.genre}</p>
                  <p className="text-sm font-medium text-slate-500">★ {movie.rating}</p>
                </div>
                <h3 className="text-xl font-semibold text-slate-900">{movie.title}</h3>
                <p className="text-sm leading-7 text-slate-600">{movie.blurb}</p>
                <Link href={`/movie/${movie.slug}`} className="inline-flex text-sm font-semibold text-slate-900 hover:text-pink-600">
                  Why this fits →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
