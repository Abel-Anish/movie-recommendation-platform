import { NextResponse } from "next/server";
import { getLocalMovies } from "../../../lib/movies";
import { buildTmdbUrl, fetchJson } from "../../../services/api";
import { mapTmdbMovie } from "../../../services/movie.service";

type TmdbMovie = {
  id?: number;
  title?: string;
  name?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  overview?: string;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  genre_ids?: number[];
};

type TmdbListResponse = {
  results?: TmdbMovie[];
};

function mapGenreName(genre: string) {
  const map: Record<string, string> = {
    "Sci-Fi": "878",
    Family: "10751",
    Thriller: "53",
    Action: "28",
    Adventure: "12",
    Comedy: "35",
    Drama: "18",
    Romance: "10749",
    Fantasy: "14",
    Horror: "27",
    Animation: "16",
    Crime: "80",
    Documentary: "99",
    Mystery: "9648",
    History: "36",
    Music: "10402",
    War: "10752",
    Western: "37",
  };

  return map[genre] || "";
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.trim() || "";
  const genre = searchParams.get("genre")?.trim() || "";
  const language = searchParams.get("language")?.trim() || "";
  const mood = searchParams.get("mood")?.trim() || "";
  const page = Number(searchParams.get("page") || "1");

  const fallbackMovies = getLocalMovies().filter((movie) => {
    const matchesSearch = !search || `${movie.title} ${movie.genre} ${movie.vibe}`.toLowerCase().includes(search.toLowerCase());
    const matchesGenre = !genre || genre === "All" || movie.genre === genre;
    const matchesLang = !language || (movie as { originalLanguage?: string }).originalLanguage === language;
    const matchesMood = !mood || movie.mood?.toLowerCase() === mood.toLowerCase();
    return matchesSearch && matchesGenre && matchesLang && matchesMood;
  });

  if (!process.env.TMDB_API_KEY) {
    return NextResponse.json({ movies: fallbackMovies });
  }

  try {
    let url = buildTmdbUrl("/trending/movie/week", { page: `${Math.max(1, page)}` });

    if (search) {
      url = buildTmdbUrl("/search/movie", {
        query: search,
        include_adult: "false",
        page: `${Math.max(1, page)}`,
      });
    } else if (language) {
      url = buildTmdbUrl("/discover/movie", {
        sort_by: "popularity.desc",
        with_original_language: language,
        "vote_count.gte": "25",
        page: `${Math.max(1, page)}`,
      });
    } else if (genre && genre !== "All") {
      const genreId = mapGenreName(genre);
      if (genreId) {
        url = buildTmdbUrl("/discover/movie", {
          sort_by: "popularity.desc",
          with_genres: genreId,
          page: `${Math.max(1, page)}`,
        });
      }
    }

    const payload = await fetchJson<TmdbListResponse>(url);
    if (!payload.results || payload.results.length === 0) {
      return NextResponse.json({ movies: search ? [] : fallbackMovies });
    }

    const movies = await Promise.all((payload.results || []).slice(0, 18).map((movie) => mapTmdbMovie(movie as never)));
    return NextResponse.json({ movies: movies.length ? movies : fallbackMovies });
  } catch {
    return NextResponse.json({ movies: fallbackMovies });
  }
}

