"use client";

import { motion } from "framer-motion";
import { useWatchlist } from "../../hooks/use-watchlist";
import type { Movie } from "../../types/movie";

export function WatchlistToggleButton({
  movie,
  className = "",
}: {
  movie: Movie;
  className?: string;
}) {
  const { isInWatchlist, toggle } = useWatchlist();
  const inWatchlist = isInWatchlist(movie.id || movie.slug);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(movie);
  };

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.94 }}
      onClick={handleToggle}
      aria-label={inWatchlist ? `Remove ${movie.title} from collection` : `Add ${movie.title} to archive`}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-xs font-black uppercase tracking-wider transition ${
        inWatchlist
          ? "bg-[#e50914] text-white shadow-[2px_2px_0px_rgba(0,0,0,0.8)] hover:bg-[#b20710]"
          : "border border-white/20 bg-white/6 text-slate-200 hover:bg-white/12 hover:text-white"
      } ${className}`}
    >
      <motion.span
        key={inWatchlist ? "saved" : "unsaved"}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.15 }}
      >
        {inWatchlist ? "✓ IN COLLECTION" : "+ ADD TO ARCHIVE"}
      </motion.span>
    </motion.button>
  );
}
