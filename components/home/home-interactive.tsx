"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { MediaCard } from "../movie/media-card";
import { getLocalMovies, type Movie } from "../../lib/movies";

const starterMovies = ["Interstellar", "The Martian", "Arrival", "Blade Runner 2049"];
const filters = ["All", "Feel-Good", "Sci-Fi", "Family", "Thriller"] as const;

type MoviesApiResponse = {
  movies?: Movie[];
};

export default function HomeInteractive() {
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("All");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [inputs, setInputs] = useState<string[]>(starterMovies);
  const [movies, setMovies] = useState<Movie[]>(() => getLocalMovies());
  const [assistantOpen, setAssistantOpen] = useState<boolean>(false);
  const [assistantInput, setAssistantInput] = useState<string>("");
  const [assistantReply, setAssistantReply] = useState<string>("Try saying: \"I want something emotional but not depressing.\"");

  useEffect(() => {
    let mounted = true;
    fetch("/api/movies")
      .then((response) => response.json())
      .then((data: MoviesApiResponse) => {
        if (!mounted) return;
        setMovies(data?.movies || getLocalMovies());
      })
      .catch(() => {
        if (!mounted) return;
        setMovies(getLocalMovies());
      });

    return () => {
      mounted = false;
    };
  }, []);

  const visibleMovies = useMemo(() => {
    if (activeFilter === "All") return movies;
    return movies.filter((movie) => movie.genre === activeFilter);
  }, [activeFilter, movies]);

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="rounded-full bg-gradient-to-r from-[#ff3d5a] to-[#6c63ff] px-4 py-2 text-sm font-semibold text-white shadow transition hover:scale-[1.01]"
        >
          🎥 I don&apos;t know what to watch
        </button>

        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`rounded-full border px-3 py-2 text-sm font-semibold transition ${
                activeFilter === filter
                  ? "border-white/20 bg-white/10 text-white"
                  : "border-white/10 bg-transparent text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setAssistantOpen(true)}
          className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
        >
          💬 Movie assistant
        </button>

        <Link
          href="/recommendations"
          className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
        >
          Browse recommendations
        </Link>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {visibleMovies.map((movie) => (
          <MediaCard key={movie.id} movie={movie} />
        ))}
      </div>

      {assistantOpen ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-[rgba(9,9,9,0.95)] p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#6c63ff]">Movie assistant</p>
                <h2 className="mt-2 text-2xl font-bold text-white">Ask for a recommendation</h2>
              </div>
              <button type="button" onClick={() => setAssistantOpen(false)} className="rounded-full border border-white/10 px-3 py-2 text-sm text-slate-300">
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
                  onChange={(e) => setAssistantInput(e.target.value)}
                  placeholder="Something like Interstellar but happier"
                  className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-base text-white outline-none"
                />
              </label>
              <div className="flex gap-3">
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
                <button type="button" onClick={() => { setAssistantInput(""); setAssistantReply("Try saying: ‘I want something emotional but not depressing.’"); }} className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200">
                  Reset
                </button>
              </div>
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
              <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-full border border-white/10 px-3 py-2 text-sm text-slate-300">
                Close
              </button>
            </div>

            <div className="mt-6 space-y-3">
              {inputs.map((input, index) => (
                <label key={`${input}-${index}`} className="flex flex-col gap-2 text-sm font-semibold text-slate-300">
                  Movie {index + 1}
                  <input
                    value={input}
                    onChange={(e) => {
                      const next = [...inputs];
                      next[index] = e.target.value;
                      setInputs(next);
                    }}
                    className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-base text-white outline-none"
                    placeholder="Type a favorite movie"
                  />
                </label>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={() => setInputs((current) => [...current, ""]) } className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200">
                + Add another
              </button>
              <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-full bg-gradient-to-r from-[#ff3d5a] to-[#6c63ff] px-5 py-2.5 text-sm font-semibold text-white">
                Find my next movie
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
