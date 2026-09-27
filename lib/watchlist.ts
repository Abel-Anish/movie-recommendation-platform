import type { Movie } from "../types/movie";
import { getLocalMovies } from "./movies";

const WATCHLIST_STORAGE_KEY = "moviematch_watchlist";

export function getStoredWatchlist(): Movie[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(WATCHLIST_STORAGE_KEY) || window.localStorage.getItem("watchlist");
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    // Handle array of strings (legacy IDs) or array of full Movie objects
    const localMovies = getLocalMovies();
    const result: Movie[] = [];
    const seen = new Set<string>();

    for (const item of parsed) {
      if (typeof item === "string") {
        const found = localMovies.find((m) => m.id === item || m.slug === item);
        if (found && !seen.has(found.id)) {
          seen.add(found.id);
          result.push(found);
        }
      } else if (item && typeof item === "object" && item.id) {
        if (!seen.has(item.id)) {
          seen.add(item.id);
          result.push(item as Movie);
        }
      }
    }

    return result;
  } catch {
    return [];
  }
}

export function saveStoredWatchlist(movies: Movie[]): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    // Unique by ID
    const seen = new Set<string>();
    const unique = movies.filter((m) => {
      if (!m || !m.id || seen.has(m.id)) return false;
      seen.add(m.id);
      return true;
    });

    const serialized = JSON.stringify(unique);
    window.localStorage.setItem(WATCHLIST_STORAGE_KEY, serialized);
    // Also update legacy key for compatibility
    window.localStorage.setItem("watchlist", JSON.stringify(unique.map((m) => m.id)));
    window.dispatchEvent(new Event("watchlist-updated"));
  } catch {
    // Ignore storage quota errors
  }
}

export function isMovieInWatchlist(movieId: string, currentList?: Movie[]): boolean {
  const list = currentList ?? getStoredWatchlist();
  return list.some((m) => m.id === movieId || m.tmdbId === movieId || m.slug === movieId);
}

export function toggleWatchlistMovie(movie: Movie): { inWatchlist: boolean; list: Movie[] } {
  const current = getStoredWatchlist();
  const exists = current.some((m) => m.id === movie.id || (movie.tmdbId && m.tmdbId === movie.tmdbId) || m.slug === movie.slug);

  let updated: Movie[];
  if (exists) {
    updated = current.filter(
      (m) => m.id !== movie.id && (!movie.tmdbId || m.tmdbId !== movie.tmdbId) && m.slug !== movie.slug,
    );
  } else {
    updated = [movie, ...current];
  }

  saveStoredWatchlist(updated);
  return { inWatchlist: !exists, list: updated };
}
