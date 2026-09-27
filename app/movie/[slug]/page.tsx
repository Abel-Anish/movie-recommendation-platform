import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MediaCard } from "../../../components/movie/media-card";
import { WatchlistToggleButton } from "../../../components/movie/watchlist-toggle-button";
import { fallbackBackdrop, fallbackPoster } from "../../../services/image.service";
import { getMovieBySlug } from "../../../services/movie.service";

export default async function MoviePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const movie = await getMovieBySlug(slug);

  if (!movie) {
    notFound();
  }

  const posterSrc = movie.image && movie.image !== "/" ? movie.image : fallbackPoster;
  const backdropSrc =
    movie.backdrop && movie.backdrop !== "/"
      ? movie.backdrop
      : movie.image && movie.image !== "/"
      ? movie.image
      : fallbackBackdrop;

  const releaseYear = movie.year || (movie.releaseDate ? Number(movie.releaseDate.slice(0, 4)) : 2024);

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-12 px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Navigation Breadcrumb Bar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4 text-xs font-mono text-slate-400">
        <Link
          href="/search"
          className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wider text-slate-300 hover:text-[#e50914] transition"
        >
          ← BACK TO DATABASE
        </Link>
        <span className="hidden sm:inline uppercase tracking-widest text-slate-500">
          STORYBOARD RECORD • ID #{movie.id || movie.tmdbId || "TMDb"}
        </span>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wider text-slate-300 hover:text-[#f5c518] transition"
        >
          FEATURED ISSUES →
        </Link>
      </div>

      {/* Cinematic Cover / Storyboard Profile Hero Section */}
      <section className="relative overflow-hidden rounded-2xl border-2 border-white/20 bg-[#0e1017] shadow-[0_25px_60px_rgba(0,0,0,0.9)]">
        {/* Full-width Backdrop Image */}
        <div className="relative h-72 sm:h-96 lg:h-[28rem] w-full bg-[#050608] overflow-hidden">
          <Image
            src={backdropSrc}
            alt={movie.title ? `${movie.title} backdrop` : "Movie backdrop"}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-50 transition-transform duration-700 hover:scale-102"
          />
          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e1017] via-[#0e1017]/60 to-transparent" />
          <div className="absolute inset-0 bg-radial-[ellipse_at_top_left] from-transparent via-black/40 to-black/80" />

          {/* Film-strip Top Edge */}
          <div className="film-strip-edge" />

          {/* Bottom Floating Title Header */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex items-end gap-6">
              {/* Layered Comic Poster Frame */}
              <div className="hidden sm:block relative h-48 w-32 shrink-0 overflow-hidden rounded-xl border-2 border-white/30 shadow-[0_15px_35px_rgba(0,0,0,0.9)] bg-black">
                <Image
                  src={posterSrc}
                  alt={movie.title ? `${movie.title} poster` : "Movie poster"}
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="comic-badge comic-badge-red text-xs">
                    {movie.genre}
                  </span>
                  <span className="comic-badge comic-badge-gold text-xs" title="TMDb Community Rating">
                    ★ TMDb {movie.rating}
                  </span>
                  <span className="comic-badge comic-badge-dark text-xs">
                    {releaseYear}
                  </span>
                </div>

                <h1 className="font-sans text-3xl sm:text-5xl font-black uppercase tracking-tight text-white drop-shadow-lg">
                  {movie.title}
                </h1>

                {movie.tagline ? (
                  <p className="text-sm sm:text-base italic font-serif text-[#f5c518] drop-shadow">
                    &ldquo;{movie.tagline}&rdquo;
                  </p>
                ) : null}
              </div>
            </div>

            {/* Quick Action Header Buttons */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <WatchlistToggleButton movie={movie} className="text-xs" />
              {movie.trailer ? (
                <a
                  href={`https://www.youtube.com/watch?v=${movie.trailer}`}
                  target="_blank"
                  rel="noreferrer"
                  className="comic-btn-primary text-xs"
                >
                  ▶ PLAY TRAILER
                </a>
              ) : null}
              {movie.imdbId ? (
                <a
                  href={`https://www.imdb.com/title/${movie.imdbId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="comic-btn-secondary text-xs"
                  title="View on IMDb"
                >
                  IMDb ↗
                </a>
              ) : null}
            </div>
          </div>
        </div>

        {/* Storyboard Content & Metadata Grid */}
        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.3fr_0.7fr] lg:p-10 border-t border-white/10">
          {/* Main Story & Premises */}
          <div className="space-y-8">
            {/* The Story / Overview */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="comic-badge comic-badge-dark text-[10px]">SCENE 01</span>
                <h2 className="font-sans text-xl font-black uppercase text-white tracking-wide">
                  THE STORY
                </h2>
              </div>
              <div className="caption-box caption-box-gold text-sm leading-relaxed text-slate-200">
                <p>{movie.overview || "A cinematic story waiting to be explored."}</p>
              </div>
            </div>

            {/* Why You Might Like It */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="comic-badge comic-badge-red text-[10px]">ANALYSIS</span>
                <h3 className="font-sans text-lg font-black uppercase text-white tracking-wide">
                  ATMOSPHERE & VIBE
                </h3>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/4 p-4 text-xs sm:text-sm leading-relaxed text-slate-300">
                <span className="font-bold text-[#f5c518] mr-2 uppercase tracking-wider">
                  NARRATIVE ENERGY:
                </span>
                {movie.vibe || "A powerful balance of narrative pacing and dramatic character moments"} with unforgettable cinema styling.
              </div>
            </div>

            {/* Genres Tag Cloud */}
            {movie.genres && movie.genres.length > 0 ? (
              <div className="space-y-2.5">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
                  GENRE ARCHIVE
                </h3>
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((g, idx) => (
                    <span
                      key={`genre-${g}-${idx}`}
                      className="comic-badge comic-badge-dark text-xs border border-white/15"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Behind The Camera & Direction */}
            {movie.crew && movie.crew.length > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="comic-badge comic-badge-dark text-[10px]">PRODUCTION</span>
                  <h3 className="font-sans text-lg font-black uppercase text-white tracking-wide">
                    BEHIND THE CAMERA
                  </h3>
                </div>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {movie.crew.map((member, idx) => (
                    <div
                      key={`crew-${member}-${idx}`}
                      className="rounded-lg border border-white/10 bg-[#12151e] p-3 text-xs"
                    >
                      <span className="block text-[10px] font-mono font-bold uppercase text-[#e50914]">
                        {idx === 0 ? "DIRECTOR" : "CREW"}
                      </span>
                      <span className="font-bold text-white text-sm">{member}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          {/* Sidebar Metadata Panels */}
          <div className="space-y-6">
            {/* The Cast */}
            {movie.cast && movie.cast.length > 0 ? (
              <div className="rounded-xl border border-white/12 bg-[#12151e] p-5 shadow-lg">
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                  <span className="text-xs font-black uppercase tracking-widest text-[#f5c518]">
                    THE CAST
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">HEADLINERS</span>
                </div>
                <ul className="space-y-2 text-xs">
                  {movie.cast.map((member, idx) => (
                    <li
                      key={`cast-${member}-${idx}`}
                      className="flex items-center justify-between rounded-lg bg-white/4 px-3 py-2 text-slate-200 border border-white/6"
                    >
                      <span className="font-bold">{member}</span>
                      <span className="text-[10px] font-mono text-slate-400">#{idx + 1}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {/* Technical Specifications Panel */}
            <div className="rounded-xl border border-white/12 bg-[#12151e] p-5 shadow-lg space-y-3">
              <span className="block text-xs font-black uppercase tracking-widest text-[#e50914] border-b border-white/10 pb-2">
                ISSUE SPECIFICATIONS
              </span>
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex justify-between py-1 border-b border-white/6">
                  <span className="text-slate-500 uppercase">RELEASE DATE</span>
                  <span className="font-bold text-white">{movie.releaseDate || movie.year}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/6">
                  <span className="text-slate-500 uppercase">RUNTIME</span>
                  <span className="font-bold text-white">{movie.runtime || "TBD"}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/6">
                  <span className="text-slate-500 uppercase">LANGUAGE</span>
                  <span className="font-bold text-white">
                    {movie.originalLanguage ? movie.originalLanguage.toUpperCase() : "ENGLISH"}
                  </span>
                </div>
                {movie.budget && movie.budget !== "—" ? (
                  <div className="flex justify-between py-1 border-b border-white/6">
                    <span className="text-slate-500 uppercase">BUDGET</span>
                    <span className="font-bold text-white">{movie.budget}</span>
                  </div>
                ) : null}
                {movie.revenue && movie.revenue !== "—" ? (
                  <div className="flex justify-between py-1 border-b border-white/6">
                    <span className="text-slate-500 uppercase">BOX OFFICE</span>
                    <span className="font-bold text-white">{movie.revenue}</span>
                  </div>
                ) : null}
                <div className="flex justify-between py-1">
                  <span className="text-slate-500 uppercase">TMDB RATING</span>
                  <span className="font-bold text-[#f5c518]">★ {movie.rating}</span>
                </div>
              </div>
            </div>

            {/* Production Companies */}
            {movie.productionCompanies && movie.productionCompanies.length > 0 ? (
              <div className="rounded-xl border border-white/12 bg-[#12151e] p-4 text-xs space-y-2">
                <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400">
                  STUDIOS & PRODUCTION
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {movie.productionCompanies.map((c, idx) => (
                    <span
                      key={`comp-${c}-${idx}`}
                      className="rounded bg-white/6 px-2.5 py-1 text-[11px] font-medium text-slate-300 border border-white/8"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* ─── SIX DISCOVERY PATHS ────────────────────────────────────────── */}
      <section className="space-y-12 border-t border-white/10 pt-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="comic-badge comic-badge-red text-[10px]">
              ISSUE EXPANSION • NARRATIVE MATRIX
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              ONE FILM → SIX DISCOVERY PATHS
            </span>
          </div>
          <h2 className="font-sans text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
            IF YOU LIKED {movie.title}...
          </h2>
          <p className="max-w-2xl text-xs sm:text-sm text-slate-300">
            Six distinct discovery vectors mapped from actual TMDb keywords, director styles, audience signals, and international counterparts.
          </p>
        </div>

        {/* 1. SAME VIBE */}
        {movie.discoveryPaths?.sameVibe && movie.discoveryPaths.sameVibe.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-end justify-between border-b border-white/10 pb-3">
              <div>
                <span className="comic-badge comic-badge-dark text-[10px]">
                  PATH 01 • ATMOSPHERE & TONE
                </span>
                <h3 className="font-sans text-xl sm:text-2xl font-black uppercase text-white mt-1">
                  SAME VIBE
                </h3>
                <p className="text-xs text-slate-400">
                  Shared aesthetic pacing, tension, and emotional frequency.
                </p>
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {movie.discoveryPaths.sameVibe.map((item, idx) => (
                <MediaCard
                  key={`vibe-${item.id || item.slug}-${idx}`}
                  movie={item}
                  issueNumber={idx + 1}
                />
              ))}
            </div>
          </div>
        ) : null}

        {/* 2. SAME MIND */}
        {movie.discoveryPaths?.sameMind && movie.discoveryPaths.sameMind.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-end justify-between border-b border-white/10 pb-3">
              <div>
                <span className="comic-badge comic-badge-gold text-[10px]">
                  PATH 02 • THEMATIC FREQUENCY
                </span>
                <h3 className="font-sans text-xl sm:text-2xl font-black uppercase text-white mt-1">
                  SAME MIND
                </h3>
                <p className="text-xs text-slate-400">
                  High-concept philosophical questions and narrative motifs.
                </p>
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {movie.discoveryPaths.sameMind.map((item, idx) => (
                <MediaCard
                  key={`mind-${item.id || item.slug}-${idx}`}
                  movie={item}
                  issueNumber={idx + 1}
                />
              ))}
            </div>
          </div>
        ) : null}

        {/* 3. SAME GENRE */}
        {movie.discoveryPaths?.sameGenre && movie.discoveryPaths.sameGenre.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-end justify-between border-b border-white/10 pb-3">
              <div>
                <span className="comic-badge comic-badge-red text-[10px]">
                  PATH 03 • GENRE EXCELLENCE
                </span>
                <h3 className="font-sans text-xl sm:text-2xl font-black uppercase text-white mt-1">
                  SAME GENRE ({movie.genre.toUpperCase()})
                </h3>
                <p className="text-xs text-slate-400">
                  Top-rated masterworks in this cinematic tradition.
                </p>
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {movie.discoveryPaths.sameGenre.map((item, idx) => (
                <MediaCard
                  key={`genre-${item.id || item.slug}-${idx}`}
                  movie={item}
                  issueNumber={idx + 1}
                />
              ))}
            </div>
          </div>
        ) : null}

        {/* 4. SAME CREATORS */}
        {movie.discoveryPaths?.sameCreators && movie.discoveryPaths.sameCreators.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-end justify-between border-b border-white/10 pb-3">
              <div>
                <span className="comic-badge comic-badge-dark text-[10px]">
                  PATH 04 • AUTEUR ROSTER
                </span>
                <h3 className="font-sans text-xl sm:text-2xl font-black uppercase text-white mt-1">
                  SAME CREATORS ({movie.director || "DIRECTOR & CAST"})
                </h3>
                <p className="text-xs text-slate-400">
                  Filmmaking lineage from the director and core ensemble.
                </p>
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {movie.discoveryPaths.sameCreators.map((item, idx) => (
                <MediaCard
                  key={`creators-${item.id || item.slug}-${idx}`}
                  movie={item}
                  issueNumber={idx + 1}
                />
              ))}
            </div>
          </div>
        ) : null}

        {/* 5. DIFFERENT COUNTRY */}
        {movie.discoveryPaths?.differentCountry && movie.discoveryPaths.differentCountry.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-end justify-between border-b border-white/10 pb-3">
              <div>
                <span className="comic-badge comic-badge-gold text-[10px]">
                  PATH 05 • BEYOND HOLLYWOOD
                </span>
                <h3 className="font-sans text-xl sm:text-2xl font-black uppercase text-white mt-1">
                  DIFFERENT COUNTRY & LANGUAGE
                </h3>
                <p className="text-xs text-slate-400">
                  International counterparts providing parallel cinematic revelation.
                </p>
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {movie.discoveryPaths.differentCountry.map((item, idx) => (
                <MediaCard
                  key={`country-${item.id || item.slug}-${idx}`}
                  movie={item}
                  issueNumber={idx + 1}
                />
              ))}
            </div>
          </div>
        ) : null}

        {/* 6. HIDDEN GEMS */}
        {movie.discoveryPaths?.hiddenGems && movie.discoveryPaths.hiddenGems.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-end justify-between border-b border-white/10 pb-3">
              <div>
                <span className="comic-badge comic-badge-red text-[10px]">
                  PATH 06 • CINEPHILE ARCHIVE
                </span>
                <h3 className="font-sans text-xl sm:text-2xl font-black uppercase text-white mt-1">
                  HIDDEN GEMS
                </h3>
                <p className="text-xs text-slate-400">
                  Underappreciated masterpieces with exceptional ratings and lower visibility.
                </p>
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {movie.discoveryPaths.hiddenGems.map((item, idx) => (
                <MediaCard
                  key={`gems-${item.id || item.slug}-${idx}`}
                  movie={item}
                  issueNumber={idx + 1}
                />
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}
