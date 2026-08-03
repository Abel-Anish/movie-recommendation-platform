import { getLocalMovies } from "../lib/movies";
import type { Movie, MovieDetails, Review } from "../types/movie";
import { buildTmdbUrl, fetchJson } from "./api";
import { fallbackBackdrop, fallbackPoster, getBackdropUrl, getPosterUrl } from "./image.service";

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
  original_language?: string;
  runtime?: number;
  genres?: Array<{ id?: number; name?: string }>;
  keywords?: { keywords?: Array<{ id?: number; name?: string }> };
  credits?: { cast?: Array<{ name?: string }> ; crew?: Array<{ name?: string; job?: string }> };
  videos?: { results?: Array<{ key?: string; type?: string; official?: boolean }> };
  similar?: { results?: TmdbMovie[] };
  recommendations?: { results?: TmdbMovie[] };
};

type TmdbListResponse = { results?: TmdbMovie[] };

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function getReleaseYear(movie: TmdbMovie) {
  const raw = movie.release_date || movie.first_air_date || "";
  return raw ? Number(raw.slice(0, 4)) : new Date().getFullYear();
}

function mapGenreName(genreId?: number) {
  const map: Record<number, string> = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Sci-Fi",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War",
    37: "Western",
  };

  return genreId ? map[genreId] || "Featured" : "Featured";
}

function getMoodFromGenre(genre: string): Movie["mood"] {
  if (genre === "Thriller" || genre === "Horror") return "thriller";
  if (genre === "Romance") return "romantic";
  if (genre === "Family" || genre === "Comedy") return "cozy";
  return "adventure";
}

function normalizeRating(value?: number) {
  return `${(value || 0).toFixed(1)}/10`;
}

export async function mapTmdbMovie(movie: TmdbMovie): Promise<Movie> {
  const title = movie.title || movie.name || "Untitled";
  const id = `${movie.id ?? "0"}`;
  const slug = `${slugify(title)}-${id}`;
  const genre = movie.genre_ids?.[0] ? mapGenreName(movie.genre_ids[0]) : "Featured";
  const image = await getPosterUrl(movie.poster_path, fallbackPoster);
  const backdrop = await getBackdropUrl(movie.backdrop_path, fallbackBackdrop);

  return {
    id,
    tmdbId: id,
    title,
    slug,
    genre,
    year: getReleaseYear(movie),
    rating: normalizeRating(movie.vote_average),
    image,
    backdrop,
    posterPath: movie.poster_path || null,
    backdropPath: movie.backdrop_path || null,
    blurb: movie.overview || "A cinematic pick from TMDb.",
    vibe: genre === "Sci-Fi" ? "Fresh and cinematic" : "Bright and immersive",
    overview: movie.overview || "A cinematic pick from TMDb.",
    runtime: movie.runtime ? `${movie.runtime} min` : "TBD",
    cast: [],
    mood: getMoodFromGenre(genre),
    category: "trending",
  };
}

type MovieCategory = "trending" | "popular" | "top-rated" | "upcoming" | "now-playing";

export async function getMovieCatalogByCategory(category: MovieCategory): Promise<Movie[]> {
  try {
    const endpointMap: Record<MovieCategory, string> = {
      trending: "/trending/movie/week",
      popular: "/movie/popular",
      "top-rated": "/movie/top_rated",
      upcoming: "/movie/upcoming",
      "now-playing": "/movie/now_playing",
    };

    const url = buildTmdbUrl(endpointMap[category], { page: "1" });
    const payload = await fetchJson<TmdbListResponse>(url);
    const mapped = await Promise.all((payload.results || []).slice(0, 6).map(mapTmdbMovie));
    return mapped.length ? mapped : getLocalMovies();
  } catch {
    return getLocalMovies();
  }
}

export async function getMovieCatalog(): Promise<Movie[]> {
  return getMovieCatalogByCategory("trending");
}

export async function getMovieBySlug(slug: string): Promise<MovieDetails | null> {
  const fallback = getLocalMovies().find((item) => item.slug === slug);
  if (fallback) {
    return {
      ...fallback,
      credits: {
        cast: fallback.cast,
        crew: fallback.crew || ["Director unavailable"],
      },
      similar: [],
      recommendations: [],
      reviews: [],
    };
  }

  const idMatch = slug.match(/-(\d+)$/);
  const id = idMatch ? idMatch[1] : slug;

  if (!id || id === "0") {
    return null;
  }

  try {
    const url = buildTmdbUrl(`/movie/${id}`, {
      append_to_response: "credits,videos,similar,recommendations,keywords",
    });
    const payload = await fetchJson<TmdbMovie & { release_date?: string; runtime?: number; genres?: Array<{ name?: string }>; keywords?: { keywords?: Array<{ name?: string }> }; credits?: { cast?: Array<{ name?: string }> ; crew?: Array<{ name?: string; job?: string }> }; videos?: { results?: Array<{ key?: string; type?: string; official?: boolean }> }; similar?: { results?: TmdbMovie[] }; recommendations?: { results?: TmdbMovie[] } }>(url);

    const title = payload.title || payload.name || "Untitled";
    const image = await getPosterUrl(payload.poster_path);
    const backdrop = await getBackdropUrl(payload.backdrop_path);
    const cast = (payload.credits?.cast || []).slice(0, 8).map((person) => person.name || "Cast unavailable");
    const crew = (payload.credits?.crew || []).filter((person) => person.job === "Director").map((person) => person.name || "Director unavailable");
    const director = crew[0] || "Director unavailable";
    const trailer = (payload.videos?.results || []).find((video) => video.type === "Trailer" && video.official)?.key || null;
    const genres = (payload.genres || []).map((genre) => genre.name).filter(Boolean) as string[];
    const keywords = (payload.keywords?.keywords || []).map((keyword) => keyword.name).filter(Boolean) as string[];
    const similar = payload.similar?.results ? await Promise.all(payload.similar.results.slice(0, 6).map(mapTmdbMovie)) : [];
    const recommendations = payload.recommendations?.results ? await Promise.all(payload.recommendations.results.slice(0, 6).map(mapTmdbMovie)) : [];

    const review: Review = {
      id: `${id}-review`,
      author: "TMDb",
      content: "This recommendation is generated from live TMDb metadata and audience signals.",
      rating: 4,
      source: "tmdb",
      date: new Date().toISOString(),
    };

    return {
      id,
      title,
      slug,
      genre: genres[0] || "Featured",
      year: getReleaseYear(payload),
      rating: `${(payload.vote_average || 0).toFixed(1)}/10`,
      image,
      backdrop,
      blurb: payload.overview || "A cinematic pick from TMDb.",
      vibe: "Fresh and cinematic",
      overview: payload.overview || "A cinematic pick from TMDb.",
      runtime: payload.runtime ? `${payload.runtime} min` : "TBD",
      cast,
      crew: [director],
      mood: "adventure",
      category: "trending",
      credits: {
        cast,
        crew: [director],
      },
      similar,
      recommendations,
      reviews: [review],
      releaseDate: payload.release_date,
      originalLanguage: payload.original_language,
      genres,
      trailer,
      director,
      keywords,
    };
  } catch {
    return null;
  }
}

export async function getMovieById(movieId: string): Promise<Movie | null> {
  try {
    const url = buildTmdbUrl(`/movie/${movieId}`);
    const payload = await fetchJson<TmdbMovie>(url);
    return mapTmdbMovie(payload);
  } catch {
    return null;
  }
}
