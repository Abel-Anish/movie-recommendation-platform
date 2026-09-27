"use client";

import Image from "next/image";
import Link from "next/link";
import { WatchlistToggleButton } from "../movie/watchlist-toggle-button";
import { fallbackBackdrop, fallbackPoster } from "../../services/image.service";
import type { SpecialPick } from "../../types/movie";

export function TonightsPick({ pick }: { pick: SpecialPick | null | undefined }) {
  if (!pick || !pick.movie) return null;

  const { movie, headline, reason } = pick;
  const posterSrc = movie.image && movie.image !== "/" ? movie.image : fallbackPoster;
  const backdropSrc = movie.backdrop && movie.backdrop !== "/" ? movie.backdrop : fallbackBackdrop;

  return (
    <section className="relative overflow-hidden rounded-2xl border-2 border-[#f5c518]/40 bg-[#10131d] shadow-[0_25px_60px_rgba(0,0,0,0.85)]">
      <div className="relative h-72 sm:h-96 w-full overflow-hidden bg-black">
        <Image
          src={backdropSrc}
          alt={`${movie.title} backdrop`}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#10131d] via-[#10131d]/60 to-transparent" />
        <div className="film-strip-edge" />

        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span className="comic-badge comic-badge-gold text-xs">
            ★ {headline}
          </span>
          <span className="comic-badge comic-badge-red text-xs">
            CURATED SELECTION
          </span>
        </div>

        {/* Floating details */}
        <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-end gap-5">
            <div className="relative hidden sm:block h-44 w-28 shrink-0 overflow-hidden rounded-xl border-2 border-white/25 bg-black shadow-2xl">
              <Image
                src={posterSrc}
                alt={`${movie.title} poster`}
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="comic-badge comic-badge-dark text-xs">
                  {movie.genre}
                </span>
                <span className="comic-badge comic-badge-gold text-xs">
                  ★ {movie.rating}
                </span>
                <span className="text-xs font-mono font-bold text-slate-300">
                  {movie.year} • {movie.runtime || "Feature"}
                </span>
              </div>
              <h2 className="font-sans text-3xl sm:text-5xl font-black uppercase text-white drop-shadow-md">
                {movie.title}
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <WatchlistToggleButton movie={movie} className="text-xs" />
            <Link
              href={`/movie/${movie.slug}`}
              className="comic-btn-primary text-xs"
            >
              EXPLORE STORY →
            </Link>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6 bg-[#0c0e15] border-t border-white/10">
        <div className="caption-box caption-box-gold text-xs leading-relaxed text-slate-200">
          <span className="block font-black uppercase tracking-widest text-[#f5c518] mb-1">
            EDITORIAL NOTE:
          </span>
          {reason}
        </div>
      </div>
    </section>
  );
}
