"use client";

import { useSyncExternalStore } from "react";
import { getStoredWatchlist, isMovieInWatchlist, toggleWatchlistMovie } from "../lib/watchlist";
import type { Movie } from "../types/movie";

let cachedList: Movie[] = [];
let cachedRaw = "";

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("watchlist-updated", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("watchlist-updated", callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot(): Movie[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem("moviematch_watchlist") || window.localStorage.getItem("watchlist") || "[]";
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedList = getStoredWatchlist();
  }
  return cachedList;
}

function getServerSnapshot(): Movie[] {
  return [];
}

export function useWatchlist() {
  const watchlist = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = (movie: Movie) => {
    return toggleWatchlistMovie(movie);
  };

  const isInWatchlist = (movieIdOrSlug: string) => {
    return isMovieInWatchlist(movieIdOrSlug, watchlist);
  };

  return {
    watchlist,
    toggle,
    isInWatchlist,
  };
}
