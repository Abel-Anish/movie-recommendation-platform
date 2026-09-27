import { getLocalMovies } from "../lib/movies";
import type { Movie } from "../types/movie";
import { buildTmdbUrl, fetchJson } from "./api";
import { mapTmdbMovie } from "./movie.service";

type TmdbListResponse = {
  results?: Array<Parameters<typeof mapTmdbMovie>[0]>;
};

export async function searchMovies(query: string, page = 1): Promise<Movie[]> {
  const normalized = query.trim();
  const fallback = getLocalMovies().filter((movie) => {
    if (!normalized) return true;
    const haystack = `${movie.title} ${movie.genre} ${movie.vibe} ${movie.overview}`.toLowerCase();
    return haystack.includes(normalized.toLowerCase());
  });

  if (!normalized) {
    return fallback;
  }

  try {
    const url = buildTmdbUrl("/search/movie", {
      query: normalized,
      include_adult: "false",
      page: `${Math.max(1, page)}`,
    });

    const payload = await fetchJson<TmdbListResponse>(url);
    if (!payload.results || payload.results.length === 0) {
      return fallback;
    }

    const mapped = await Promise.all(payload.results.slice(0, 18).map(mapTmdbMovie));
    return mapped.length ? mapped : fallback;
  } catch {
    return fallback;
  }
}

