import { NextResponse } from "next/server";
import { getLocalMovies } from "../../../lib/movies";

function mapTmdbMovie(movie: any) {
  const posterPath = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=900&q=80";
  const backdropPath = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : posterPath;

  return {
    id: `${movie.id}`,
    title: movie.title || movie.name || "Untitled",
    slug: (movie.title || movie.name || "untitled")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-"),
    genre: movie.genre_ids?.[0] ? "Trending" : "Featured",
    year: Number((movie.release_date || movie.first_air_date || "2024").slice(0, 4)),
    rating: `${(movie.vote_average || 0).toFixed(1)}/10`,
    image: posterPath,
    backdrop: backdropPath,
    blurb: movie.overview || "A cinematic pick from the live movie database.",
    vibe: "Fresh and cinematic",
    overview: movie.overview || "A cinematic pick from the live movie database.",
    runtime: "2h",
    cast: ["Live TMDb data", "Dynamic recommendation"],
    mood: "adventure" as const,
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.trim() || "";
  const genre = searchParams.get("genre")?.trim() || "";

  const fallbackMovies = getLocalMovies().filter((movie) => {
    const matchesSearch = !search || `${movie.title} ${movie.genre} ${movie.vibe}`.toLowerCase().includes(search.toLowerCase());
    const matchesGenre = !genre || genre === "All" || movie.genre === genre;
    return matchesSearch && matchesGenre;
  });

  if (!process.env.TMDB_API_KEY) {
    return NextResponse.json({ movies: fallbackMovies });
  }

  try {
    let url = `https://api.themoviedb.org/3/trending/movie/week?api_key=${process.env.TMDB_API_KEY}`;

    if (search) {
      url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(search)}&api_key=${process.env.TMDB_API_KEY}&include_adult=false`;
    } else if (genre && genre !== "All") {
      url = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&sort_by=popularity.desc&with_genres=${encodeURIComponent(genre)}`;
    }

    const response = await fetch(url, { next: { revalidate: 60 } });
    if (!response.ok) {
      throw new Error("TMDb request failed");
    }

    const payload = await response.json();
    const movies = (payload.results || []).slice(0, 9).map(mapTmdbMovie);
    return NextResponse.json({ movies: movies.length ? movies : fallbackMovies });
  } catch {
    return NextResponse.json({ movies: fallbackMovies });
  }
}
