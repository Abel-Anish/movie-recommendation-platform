"use client";

import Image from "next/image";
import Link from "next/link";
import { useWatchlist } from "../../hooks/use-watchlist";
import { fallbackPoster } from "../../services/image.service";
import type { Movie } from "../../types/movie";

export type MovieCardVariant = "standard" | "compact" | "featured" | "horizontal" | "recommendation";

type MovieCardProps = {
  movie: Movie;
  variant?: MovieCardVariant;
  issueNumber?: number | string;
  reason?: string;
  score?: number;
  className?: string;
  priority?: boolean;
};

export function MediaCard({
  movie,
  variant = "standard",
  issueNumber,
  reason,
  score,
  className = "",
  priority = false,
}: MovieCardProps) {
  const { isInWatchlist, toggle } = useWatchlist();
  const inWatchlist = isInWatchlist(movie.id || movie.slug);
  const imageSrc = movie.image && movie.image !== "/" ? movie.image : fallbackPoster;
  const title = movie.title || "Untitled movie";
  const releaseYear = movie.year || (movie.releaseDate ? Number(movie.releaseDate.slice(0, 4)) : 2024);
  const ratingValue = movie.rating || "N/A";

  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(movie);
  };

  /* Recommendation Card Variant */
  if (variant === "recommendation") {
    return (
      <article
        className={`group relative flex flex-col justify-between overflow-hidden rounded-xl border border-white/12 bg-[#12151e] shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#e50914]/50 hover:shadow-[0_20px_45px_-10px_rgba(0,0,0,0.8),0_0_20px_rgba(229,9,20,0.2)] ${className}`}
      >
        <div className="relative h-52 w-full overflow-hidden bg-black">
          <Image
            src={imageSrc}
            alt={`${title} poster`}
            width={700}
            height={400}
            priority={priority}
            className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#12151e] via-black/20 to-transparent" />

          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-wrap items-center gap-2">
            {typeof score === "number" && score > 0 ? (
              <span className="comic-badge comic-badge-gold">
                ★ MATCH {score * 10}%
              </span>
            ) : (
              <span className="comic-badge comic-badge-red">
                RECOMMENDED
              </span>
            )}
            <span className="comic-badge comic-badge-dark">
              {movie.genre}
            </span>
          </div>

          <button
            type="button"
            onClick={handleWatchlistToggle}
            aria-label={inWatchlist ? `Remove ${title} from watchlist` : `Add ${title} to watchlist`}
            className={`absolute right-3 top-3 rounded-md px-2.5 py-1 text-xs font-black uppercase tracking-wider backdrop-blur-md transition ${
              inWatchlist
                ? "bg-[#e50914] text-white shadow-md"
                : "border border-white/20 bg-black/70 text-white/90 hover:bg-black/90 hover:border-white/40"
            }`}
          >
            {inWatchlist ? "✓ SAVED" : "+ WATCHLIST"}
          </button>
        </div>

        <div className="flex flex-1 flex-col justify-between p-5">
          <div className="space-y-3">
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="font-sans text-xl font-black uppercase tracking-tight text-white transition group-hover:text-[#f5c518]">
                {title}
              </h3>
              <span className="text-xs font-bold text-[#f5c518]">★ {ratingValue}</span>
            </div>

            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {releaseYear} • {movie.runtime || "Feature"}
            </p>

            {/* Comic Reason Caption Box */}
            <div className="caption-box caption-box-gold mt-2 text-xs leading-relaxed text-slate-300">
              <span className="block font-black uppercase tracking-widest text-[#f5c518] mb-1">
                WHY THIS MATCHES:
              </span>
              {reason || movie.reason || movie.blurb || movie.overview}
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
            <Link
              href={`/movie/${movie.slug}`}
              className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-white transition hover:text-[#e50914]"
            >
              ENTER STORY →
            </Link>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
              {movie.vibe || "Curated Pick"}
            </span>
          </div>
        </div>
      </article>
    );
  }

  /* Horizontal Variant (for Watchlist / Search List) */
  if (variant === "horizontal") {
    return (
      <article
        className={`group relative flex flex-col overflow-hidden rounded-xl border border-white/12 bg-[#12151e] shadow-lg transition-all duration-300 hover:border-[#e50914]/50 sm:flex-row ${className}`}
      >
        <div className="relative h-48 w-full sm:h-auto sm:w-44 shrink-0 overflow-hidden bg-black">
          <Image
            src={imageSrc}
            alt={`${title} poster`}
            fill
            sizes="(max-width: 640px) 100vw, 176px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="flex flex-1 flex-col justify-between p-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="comic-badge comic-badge-red">{movie.genre}</span>
                <span className="text-xs font-bold text-slate-400">{releaseYear}</span>
              </div>
              <span className="text-xs font-black text-[#f5c518]">★ {ratingValue}</span>
            </div>

            <h3 className="text-xl font-black uppercase tracking-tight text-white group-hover:text-[#e50914] transition">
              {title}
            </h3>

            <p className="line-clamp-2 text-xs leading-relaxed text-slate-300">
              {movie.blurb || movie.overview}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-3">
            <Link
              href={`/movie/${movie.slug}`}
              className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-white hover:text-[#e50914] transition"
            >
              DETAILS →
            </Link>
            <button
              type="button"
              onClick={handleWatchlistToggle}
              className="rounded-md border border-white/20 bg-black/60 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-300 hover:bg-[#e50914] hover:text-white hover:border-[#e50914] transition"
            >
              {inWatchlist ? "REMOVE" : "+ WATCHLIST"}
            </button>
          </div>
        </div>
      </article>
    );
  }

  /* Compact Variant */
  if (variant === "compact") {
    return (
      <Link
        href={`/movie/${movie.slug}`}
        className={`group relative block overflow-hidden rounded-lg border border-white/10 bg-[#12151e] transition-all duration-200 hover:-translate-y-1 hover:border-[#e50914]/60 ${className}`}
      >
        <div className="relative aspect-[2/3] w-full overflow-hidden bg-black">
          <Image
            src={imageSrc}
            alt={`${title} poster`}
            fill
            sizes="(max-width: 768px) 50vw, 20vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80" />
          <div className="absolute bottom-2 left-2 right-2">
            <p className="truncate text-xs font-black uppercase text-white group-hover:text-[#f5c518] transition">
              {title}
            </p>
            <p className="text-[10px] font-bold text-slate-400">{releaseYear} • ★ {ratingValue}</p>
          </div>
        </div>
      </Link>
    );
  }

  /* Standard Comic Storyboard Movie Card Variant */
  return (
    <article
      className={`group relative flex flex-col justify-between overflow-hidden rounded-xl border border-white/12 bg-[#12151e] shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-[#e50914]/60 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.85),0_0_22px_rgba(229,9,20,0.22)] ${className}`}
    >
      {/* Poster Frame */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#060709]">
        <Image
          src={imageSrc}
          alt={`${title} poster`}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#12151e] via-transparent to-black/30" />

        {/* Top Badges */}
        <div className="absolute left-3 top-3 flex items-center gap-2">
          {issueNumber !== undefined ? (
            <span className="comic-badge comic-badge-dark text-[10px]">
              PANEL #{String(issueNumber).padStart(2, "0")}
            </span>
          ) : (
            <span className="comic-badge comic-badge-red text-[10px]">
              {movie.genre}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleWatchlistToggle}
          aria-label={inWatchlist ? `Remove ${title} from watchlist` : `Add ${title} to watchlist`}
          className={`absolute right-3 top-3 rounded-md px-2.5 py-1 text-[11px] font-black uppercase tracking-wider backdrop-blur-md transition ${
            inWatchlist
              ? "bg-[#e50914] text-white shadow-md"
              : "border border-white/20 bg-black/70 text-white/90 hover:bg-black/90 hover:border-white/40"
          }`}
        >
          {inWatchlist ? "✓ SAVED" : "+ WATCHLIST"}
        </button>

        {/* Bottom corner rating overlay */}
        <div className="absolute bottom-2.5 right-3">
          <span className="comic-badge comic-badge-gold">
            ★ {ratingValue}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div className="space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#e50914]">
              {movie.genre}
            </span>
            <span className="text-xs font-semibold text-slate-400">
              {releaseYear}
            </span>
          </div>

          <h3 className="font-sans text-xl font-black uppercase tracking-tight text-white transition group-hover:text-[#f5c518]">
            <Link href={`/movie/${movie.slug}`} className="hover:underline">
              {title}
            </Link>
          </h3>

          <p className="line-clamp-2 text-xs leading-relaxed text-slate-300">
            {movie.blurb || movie.overview || "A cinematic journey streaming from the TMDb catalog."}
          </p>

          {movie.genres && movie.genres.length > 1 ? (
            <div className="flex flex-wrap gap-1">
              {movie.genres.slice(0, 3).map((g) => (
                <span
                  key={g}
                  className="rounded bg-white/6 px-2 py-0.5 text-[10px] font-semibold text-slate-300 border border-white/6"
                >
                  {g}
                </span>
              ))}
            </div>
          ) : null}

          <div className="rounded-md border border-white/8 bg-white/4 px-3 py-1.5 text-[11px] font-semibold text-slate-300">
            <span className="font-bold text-slate-400 mr-1.5">VIBE:</span>
            {movie.vibe || "Immersive & Cinematic"}
          </div>

          {reason || movie.reason ? (
            <div className="rounded border border-[#f5c518]/20 bg-[#f5c518]/5 px-2.5 py-1 text-[11px] text-[#f5c518] italic">
              &ldquo;{reason || movie.reason}&rdquo;
            </div>
          ) : null}
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
          <Link
            href={`/movie/${movie.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-white transition hover:text-[#e50914]"
          >
            DISCOVER →
          </Link>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
            {movie.runtime || "TBD"}
          </span>
        </div>
      </div>
    </article>
  );
}
