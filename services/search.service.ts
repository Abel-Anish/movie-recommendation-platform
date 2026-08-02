import { getLocalMovies } from "../lib/movies";
import type { Movie } from "../types/movie";

export async function searchMovies(query: string): Promise<Movie[]> {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return getLocalMovies();

  return getLocalMovies().filter((movie) => {
    const haystack = `${movie.title} ${movie.genre} ${movie.vibe} ${movie.overview}`.toLowerCase();
    return haystack.includes(normalized);
  });
}
