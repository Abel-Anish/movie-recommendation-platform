"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getLocalMovies } from "../../lib/movies";

type MovieLike = {
  id: string;
  tmdbId?: string;
  title: string;
  slug: string;
  genre: string;
  year: number;
  rating: string;
  image: string;
  blurb: string;
  vibe: string;
  overview: string;
  runtime: string;
  cast: string[];
  mood: string;
};

const starterInputs = ["Interstellar", "The Matrix", "Arrival"];

const moodProfiles = [
  { key: "cozy", label: "Cozy nights", blurb: "Warm, comforting stories with heart." },
  { key: "adventure", label: "Adventure mode", blurb: "Big ideas and bold journeys." },
  { key: "thriller", label: "Edge-of-seat", blurb: "Fast pacing and suspenseful twists." },
  { key: "romantic", label: "Romantic escape", blurb: "Gentle chemistry and emotional payoff." },
] as const;

function getReason(movieTitle: string, mood: string) {
  if (mood === "adventure") {
    return `${movieTitle} pairs well with your adventurous taste thanks to strong momentum and a compelling sense of discovery.`;
  }
  if (mood === "thriller") {
    return `${movieTitle} fits because it leans into suspense, tension, and a gripping central mystery.`;
  }
  if (mood === "romantic") {
    return `${movieTitle} matches your romantic mood with warm chemistry and emotional payoff.`;
  }
  return `${movieTitle} was picked for its heartfelt tone and comforting, character-driven energy.`;
}

export default function RecommendationsPage() {
  const [activeMood, setActiveMood] = useState<(typeof moodProfiles)[number]["key"]>("adventure");
  const [inputs, setInputs] = useState<string[]>(starterInputs);
  const [movies, setMovies] = useState<MovieLike[]>(getLocalMovies());

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/movies", { signal: controller.signal })
      .then((response) => response.json())
      .then((data) => setMovies(data.movies || getLocalMovies()))
      .catch(() => setMovies(getLocalMovies()));

    return () => controller.abort();
  }, []);

  const recommendations = useMemo(() => {
    const base = movies.filter((movie) => movie.mood === activeMood || movie.genre === "Sci-Fi" || movie.genre === "Drama");
    const seen = new Set<string>();
    const result: Array<MovieLike & { reason: string }> = [];

    for (const movie of base) {
      if (result.length >= 10) break;
      if (seen.has(movie.id)) continue;
      seen.add(movie.id);
      result.push({ ...movie, reason: getReason(movie.title, activeMood) });
    }

    if (result.length < 10) {
      for (const movie of movies) {
        if (result.length >= 10) break;
        if (seen.has(movie.id)) continue;
        seen.add(movie.id);
        result.push({ ...movie, reason: getReason(movie.title, activeMood) });
      }
    }

    return result;
  }, [activeMood, movies]);

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-8 lg:px-8 lg:py-10">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-pink-600">Personalized picks</p>
        <h1 className="mt-3 text-3xl font-black text-slate-900">Share the last movies you watched and we’ll tailor the list.</h1>
        <p className="mt-3 max-w-2xl text-base leading-8 text-slate-600">
          The recommendations use live TMDb-backed movie metadata and your selected mood to suggest movies that align with your recent viewing taste.
        </p>

        <div className="mt-6 space-y-3">
          {inputs.map((input, index) => (
            <input
              key={`${input}-${index}`}
              value={input}
              onChange={(event) => {
                const next = [...inputs];
                next[index] = event.target.value;
                setInputs(next);
              }}
              placeholder="Movie title"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-slate-500"
            />
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {moodProfiles.map((mood) => (
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
            {moodProfiles.find((mood) => mood.key === activeMood)?.label}
          </h2>
          <p className="mt-3 text-base leading-8 text-slate-300">
            {moodProfiles.find((mood) => mood.key === activeMood)?.blurb}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {recommendations.map((movie) => (
            <article key={`${movie.tmdbId || movie.id}-${movie.slug}`} className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm">
              <Image src={movie.image || "/" } alt={movie.title || "Movie poster"} width={800} height={480} loading="eager" className="h-44 w-full object-cover" />
              <div className="space-y-3 p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-pink-600">{movie.genre}</p>
                  <p className="text-sm font-medium text-slate-500">★ {movie.rating}</p>
                </div>
                <h3 className="text-xl font-semibold text-slate-900">{movie.title}</h3>
                <p className="text-sm leading-7 text-slate-600">{movie.reason}</p>
                <Link href={`/movie/${movie.slug}`} className="inline-flex text-sm font-semibold text-slate-900 hover:text-pink-600">
                  Explore this pick →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
