"use client";

import { useEffect, useMemo, useState } from "react";
import { MovieCard } from "../components/movie-card";
import { genres, getLocalMovies } from "../lib/movies";

type MovieCard = {
  id: string;
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

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [activeGenre, setActiveGenre] = useState("All");
  const [movies, setMovies] = useState<MovieCard[]>(getLocalMovies());

  useEffect(() => {
    fetch(`/api/movies?search=${encodeURIComponent(query)}&genre=${encodeURIComponent(activeGenre)}`)
      .then((response) => response.json())
      .then((data) => setMovies(data.movies || getLocalMovies()))
      .catch(() => setMovies(getLocalMovies()));
  }, [activeGenre, query]);

  const filteredMovies = useMemo(() => {
    return movies.filter((movie) => {
      const matchesQuery = `${movie.title} ${movie.genre} ${movie.vibe}`
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesGenre = activeGenre === "All" || movie.genre === activeGenre;
      return matchesQuery && matchesGenre;
    });
  }, [activeGenre, movies, query]);

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-8 lg:px-8 lg:py-10">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-pink-600">Search library</p>
        <h1 className="mt-3 text-3xl font-black text-slate-900">Find your next watch fast.</h1>
        <p className="mt-3 max-w-2xl text-base leading-8 text-slate-600">
          Search by mood, genre, or title and discover a more personal movie lineup.
        </p>

        <label className="mt-6 flex flex-col gap-2 text-sm font-semibold text-slate-700">
          Search movies
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try “space”, “feel-good”, or “thriller”"
            className="rounded-2xl border border-slate-300 px-4 py-3 text-base outline-none ring-0 focus:border-slate-500"
          />
        </label>

        <div className="mt-6 flex flex-wrap gap-2">
          {genres.map((genre) => (
            <button
              key={genre}
              type="button"
              onClick={() => setActiveGenre(genre)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeGenre === genre
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </section>
    </main>
  );
}
