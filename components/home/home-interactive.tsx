"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { MediaCard } from "../movie/media-card";
import { getLocalMovies, type Movie } from "../../lib/movies";

const starterMovies = ["Interstellar", "The Martian", "Arrival", "Blade Runner 2049"];
const filters = ["All", "Action", "Sci-Fi", "Drama", "Thriller", "Family"] as const;

type MoviesApiResponse = {
  movies?: Movie[];
};

export default function HomeInteractive() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("All");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [inputs, setInputs] = useState<string[]>(starterMovies);
  const [movies, setMovies] = useState<Movie[]>(() => getLocalMovies());
  const [assistantOpen, setAssistantOpen] = useState<boolean>(false);
  const [assistantInput, setAssistantInput] = useState<string>("");
  const [assistantReply, setAssistantReply] = useState<string>("Try saying: \"I want an intense space thriller with deep emotion.\"");

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
    return movies.filter((movie) => {
      const g = movie.genre.toLowerCase();
      const target = activeFilter.toLowerCase();
      return g.includes(target) || (movie.genres || []).some((mg) => mg.toLowerCase().includes(target));
    });
  }, [activeFilter, movies]);

  return (
    <div>
      {/* Comic Action Bar & Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="comic-btn-primary text-xs cursor-pointer"
        >
          <span>🎬</span> CAN&apos;T DECIDE?
        </button>

        <div className="flex flex-wrap gap-1.5 bg-black/40 p-1 rounded-lg border border-white/10">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`rounded px-3 py-1.5 text-xs font-black uppercase tracking-wider transition ${
                activeFilter === filter
                  ? "bg-[#e50914] text-white shadow-[2px_2px_0px_#000000]"
                  : "text-slate-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setAssistantOpen(true)}
          className="comic-btn-secondary text-xs cursor-pointer"
        >
          <span>💬</span> WRITERS ROOM
        </button>

        <Link
          href="/recommendations"
          className="comic-btn-secondary text-xs"
        >
          AI RECOMMENDATIONS →
        </Link>
      </div>

      {/* Grid of Interactive Movies */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visibleMovies.slice(0, 6).map((movie, idx) => {
          const key = `interactive-${movie.tmdbId || movie.id}-${idx}`;
          return <MediaCard key={key} movie={movie} issueNumber={idx + 1} />;
        })}
      </div>

      {/* Comic Assistant Dialog */}
      {assistantOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 px-4 backdrop-blur-md">
          <div className="w-full max-w-xl rounded-2xl border-2 border-white/20 bg-[#0e1017] p-6 shadow-2xl relative">
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <span className="comic-badge comic-badge-red text-[10px]">
                  WRITERS ROOM AI
                </span>
                <h2 className="mt-1 font-sans text-2xl font-black uppercase tracking-tight text-white">
                  DESCRIBE YOUR MOOD
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setAssistantOpen(false)}
                className="rounded-md border border-white/20 px-3 py-1 text-xs font-bold text-slate-400 hover:bg-white/10 hover:text-white"
              >
                CLOSE [ESC]
              </button>
            </div>

            <div className="mt-5 caption-box caption-box-gold text-xs leading-relaxed text-slate-200">
              <span className="block font-black uppercase tracking-wider text-[#f5c518] mb-1">
                AI SCRIPT DOCTOR SAYS:
              </span>
              {assistantReply}
            </div>

            <div className="mt-5 space-y-4">
              <label className="flex flex-col gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-300">
                WHAT ARE YOU IN THE MOOD FOR?
                <input
                  value={assistantInput}
                  onChange={(e) => setAssistantInput(e.target.value)}
                  placeholder="e.g. Something like Inception with intense plot twists"
                  className="rounded-lg border border-white/20 bg-black/60 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-[#e50914]"
                />
              </label>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const message = assistantInput.toLowerCase();
                    if (message.includes("happy") || message.includes("feel-good") || message.includes("comedy")) {
                      setAssistantReply("Try The Summer Lantern or feel-good comedy releases for an uplifting cinematic journey.");
                    } else if (message.includes("scary") || message.includes("horror") || message.includes("dark")) {
                      setAssistantReply("Try Midnight Circuit or psychological horror releases for gripping tension.");
                    } else if (message.includes("space") || message.includes("sci-fi") || message.includes("inception")) {
                      setAssistantReply("Try Arrival, Interstellar, or Echoes of Tomorrow for high-concept mind-bending drama.");
                    } else {
                      setAssistantReply(`Based on "${assistantInput || 'your query'}", we recommend exploring Arrival for intellectual thrills or trending Sci-Fi picks.`);
                    }
                  }}
                  className="comic-btn-primary text-xs"
                >
                  CONSULT AI
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAssistantInput("");
                    setAssistantReply("Try saying: 'I want something emotional but not depressing.'");
                  }}
                  className="comic-btn-secondary text-xs"
                >
                  RESET
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* "Can't Decide?" Comic Modal */}
      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 px-4 backdrop-blur-md">
          <div className="w-full max-w-2xl rounded-2xl border-2 border-white/20 bg-[#0e1017] p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <span className="comic-badge comic-badge-gold text-[10px]">
                  STORYBOARD DISCOVERY
                </span>
                <h2 className="mt-1 font-sans text-2xl font-black uppercase tracking-tight text-white">
                  TELL US MOVIES YOU LOVED
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  We will search TMDb to cross-reference genres, keywords, and audience signals.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-md border border-white/20 px-3 py-1 text-xs font-bold text-slate-400 hover:bg-white/10 hover:text-white"
              >
                CLOSE [ESC]
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {inputs.map((input, index) => (
                <label key={`seed-${index}`} className="flex flex-col gap-1 text-xs font-bold uppercase tracking-wider text-slate-300">
                  SEED FILM #{index + 1}
                  <input
                    value={input}
                    onChange={(e) => {
                      const next = [...inputs];
                      next[index] = e.target.value;
                      setInputs(next);
                    }}
                    className="rounded-lg border border-white/20 bg-black/60 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-[#e50914]"
                    placeholder="Type a favorite movie (e.g. Inception)"
                  />
                </label>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
              <button
                type="button"
                onClick={() => setInputs((current) => [...current, ""])}
                className="rounded-md border border-white/20 bg-white/5 px-3.5 py-2 text-xs font-bold text-slate-300 hover:bg-white/10"
              >
                + ADD ANOTHER FILM
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  const valid = inputs.map((i) => i.trim()).filter(Boolean);
                  const query = valid.length ? valid.join(",") : starterMovies.join(",");
                  router.push(`/recommendations?seed=${encodeURIComponent(query)}`);
                }}
                className="comic-btn-primary text-xs"
              >
                GENERATE RECOMMENDATIONS →
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
