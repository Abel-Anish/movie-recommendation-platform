"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { MediaCard } from "../components/movie/media-card";
import { getLocalMovies } from "../lib/movies";

const starterMovies = ["Interstellar", "The Martian", "Arrival", "Blade Runner 2049"];

const filters = ["All", "Feel-Good", "Sci-Fi", "Family", "Thriller"];

type MovieCard = {
  id: string;
  title: string;
  slug: string;
  genre: string;
  year: number;
  rating: string;
  image: string;
  backdrop?: string;
  blurb: string;
  vibe: string;
  overview: string;
  runtime: string;
  cast: string[];
  mood: string;
};

export default function Home() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputs, setInputs] = useState(starterMovies);
  const [movies, setMovies] = useState<MovieCard[]>(getLocalMovies());
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [assistantInput, setAssistantInput] = useState("");
  const [assistantReply, setAssistantReply] = useState("Try saying: ‘I want something emotional but not depressing.’");

  useEffect(() => {
    fetch("/api/movies")
      .then((response) => response.json())
      .then((data) => setMovies(data.movies || getLocalMovies()))
      .catch(() => setMovies(getLocalMovies()));
  }, []);

  const visibleMovies = useMemo(() => {
    if (activeFilter === "All") {
      return movies;
    }

    return movies.filter((movie) => movie.genre === activeFilter);
  }, [activeFilter, movies]);

  return (
    <div className="min-h-screen">
      <main className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-8 lg:px-8 lg:py-10">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[rgba(255,255,255,0.08)] p-8 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl lg:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,61,90,0.3),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(108,99,255,0.25),_transparent_35%)]" />
          <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="flex flex-col justify-between gap-8">
              <div className="space-y-5">
                <span className="inline-flex w-fit rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm font-semibold text-pink-200">
                  ✨ Discover your next obsession
                </span>
                <h1 className="max-w-2xl text-4xl font-black tracking-tight text-white sm:text-5xl">
                  Find your next favorite movie without the endless scrolling.
                </h1>
                <p className="max-w-xl text-lg leading-8 text-slate-300">
                  A polished movie companion built to feel personal, immersive, and genuinely useful.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="rounded-full bg-gradient-to-r from-[#ff3d5a] to-[#6c63ff] px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.01]"
                >
                  🎥 I don&apos;t know what to watch
                </button>
                <button
                  type="button"
                  onClick={() => setAssistantOpen(true)}
                  className="rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
                >
                  💬 Movie assistant
                </button>
                <Link
                  href="/recommendations"
                  className="rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
                >
                  Browse recommendations
                </Link>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-6 backdrop-blur-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Featured release</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">Arrival</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Thoughtful, emotional, and quietly mind-bending — a perfect pick when you want something reflective and memorable.
              </p>
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/10 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Why it fits</p>
                <p className="mt-2 text-base font-medium text-white">
                  Intelligent sci-fi with a strong emotional core and a cinematic atmosphere.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="pick-list" className="space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#ff3d5a]">
                Featured picks
              </p>
              <h3 className="mt-2 text-2xl font-bold text-white">
                Curated for your next movie night.
              </h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    activeFilter === filter
                      ? "bg-white text-slate-900"
                      : "bg-white/10 text-slate-200 ring-1 ring-white/10 hover:bg-white/15"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {visibleMovies.map((movie) => (
              <MediaCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-[rgba(255,255,255,0.08)] p-8 text-white shadow-lg backdrop-blur-xl lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
                Why it works
              </p>
              <h3 className="mt-2 text-2xl font-bold">A smarter way to choose your next watch.</h3>
              <p className="mt-3 max-w-2xl text-base leading-8 text-slate-300">
                The experience blends mood, quality, and personality so it feels less like a catalog and more like a companion.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
              <p className="text-sm font-semibold text-slate-200">Try this tonight</p>
              <p className="mt-2 text-lg font-medium">
                Open the modal, enter a few favorites, and let the app build a tailored next-step suggestion.
              </p>
            </div>
          </div>
        </section>
      </main>

      {assistantOpen ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-[rgba(9,9,9,0.95)] p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#6c63ff]">Movie assistant</p>
                <h2 className="mt-2 text-2xl font-bold text-white">Ask for a recommendation</h2>
              </div>
              <button
                type="button"
                onClick={() => setAssistantOpen(false)}
                className="rounded-full border border-white/10 px-3 py-2 text-sm text-slate-300"
              >
                Close
              </button>
            </div>

            <div className="mt-6 space-y-3 rounded-[1.5rem] border border-white/10 bg-white/10 p-4 text-sm text-slate-300">
              <p className="font-semibold text-white">Assistant reply</p>
              <p>{assistantReply}</p>
            </div>

            <div className="mt-6 space-y-3">
              <label className="flex flex-col gap-2 text-sm font-semibold text-slate-300">
                What are you in the mood for?
                <input
                  value={assistantInput}
                  onChange={(event) => setAssistantInput(event.target.value)}
                  placeholder="Something like Interstellar but happier"
                  className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-base text-white outline-none"
                />
              </label>
              <button
                type="button"
                onClick={() => {
                  const message = assistantInput.toLowerCase();
                  if (message.includes("happy") || message.includes("happier")) {
                    setAssistantReply("Try The Summer Lantern or Golden Hour Drive for a warm, uplifting evening.");
                  } else if (message.includes("scary") || message.includes("horror")) {
                    setAssistantReply("Try Midnight Circuit for suspenseful tension and a sharp, modern thriller energy.");
                  } else if (message.includes("space") || message.includes("sci-fi")) {
                    setAssistantReply("Try Neon Harbor or Echoes of Tomorrow for a stylish sci-fi experience.");
                  } else {
                    setAssistantReply("I’d start with Arrival for thoughtful storytelling or The Summer Lantern if you want comfort and heart.");
                  }
                }}
                className="rounded-full bg-gradient-to-r from-[#ff3d5a] to-[#6c63ff] px-5 py-2.5 text-sm font-semibold text-white"
              >
                Ask assistant
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {isModalOpen ? (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-[rgba(9,9,9,0.92)] p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#ff3d5a]">Can&apos;t decide?</p>
                <h2 className="mt-2 text-2xl font-bold text-white">Tell us the movies you loved.</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-full border border-white/10 px-3 py-2 text-sm text-slate-300"
              >
                Close
              </button>
            </div>

            <div className="mt-6 space-y-3">
              {inputs.map((input, index) => (
                <label key={`${input}-${index}`} className="flex flex-col gap-2 text-sm font-semibold text-slate-300">
                  Movie {index + 1}
                  <input
                    value={input}
                    onChange={(event) => {
                      const next = [...inputs];
                      next[index] = event.target.value;
                      setInputs(next);
                    }}
                    className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-base text-white outline-none"
                    placeholder="Type a favorite movie"
                  />
                </label>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setInputs((current) => [...current, ""])}
                className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200"
              >
                + Add another
              </button>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-full bg-gradient-to-r from-[#ff3d5a] to-[#6c63ff] px-5 py-2.5 text-sm font-semibold text-white"
              >
                Find my next movie
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
