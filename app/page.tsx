import Image from "next/image";
import Link from "next/link";
import HomeInteractive from "@/components/home/home-interactive";
import { AroundTheWorld } from "../components/home/around-the-world";
import { MoodDiscovery } from "../components/home/mood-discovery";
import { TonightsPick } from "../components/home/tonights-pick";
import { HeroBanner } from "../components/layout/hero-banner";
import { SectionShell } from "../components/layout/section-shell";
import { MediaCard } from "../components/movie/media-card";
import { WatchlistToggleButton } from "../components/movie/watchlist-toggle-button";
import { fallbackBackdrop, fallbackPoster } from "../services/image.service";
import { getHomepageData } from "../services/homepage.service";

const actLabels: Record<string, string> = {
  trending: "ACT I • WORLD BROADCAST",
  popular: "ACT II • AUDIENCE FAVORITES",
  "top-rated": "ACT III • HALL OF FAME",
  upcoming: "ACT IV • FUTURE RELEASES",
  "now-playing": "ACT V • CURRENT ATTRACTIONS",
};

export default async function Home() {
  const { featured, sections, tonightPick, globalLanes } = await getHomepageData();

  const featuredPoster = featured?.image && featured.image !== "/" ? featured.image : fallbackPoster;
  const featuredBackdrop =
    featured?.backdrop && featured.backdrop !== "/"
      ? featured.backdrop
      : featured?.image && featured.image !== "/"
      ? featured.image
      : fallbackBackdrop;

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-12 px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* ─── 1. CINEMATIC HOMEPAGE OPENING HERO ─────────────────────────── */}
      <HeroBanner
        badge="ISSUE #01 • PREMIERE SPOTLIGHT"
        title={featured?.title ?? "ENTER THE MOVIE UNIVERSE"}
        subtitle={featured?.blurb ?? "A cinematic journey exploring high-concept stories from around the globe."}
        actions={
          <div className="flex flex-wrap items-center gap-3">
            {featured ? (
              <Link
                href={`/movie/${featured.slug}`}
                className="comic-btn-primary text-xs"
              >
                ENTER STORY →
              </Link>
            ) : null}
            <Link href="/recommendations" className="comic-btn-secondary text-xs">
              AI MATCHMAKER
            </Link>
          </div>
        }
      >
        {featured ? (
          <div className="group relative overflow-hidden rounded-xl border-2 border-white/20 bg-[#12151e] shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
            {/* Backdrop layer */}
            <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-black">
              <Image
                src={featuredBackdrop}
                alt={`${featured.title} backdrop`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 500px"
                className="object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#12151e] via-[#12151e]/40 to-transparent" />

              {/* Floating Poster in frame */}
              <div className="absolute bottom-4 left-4 flex items-end gap-4">
                <div className="relative h-32 w-22 shrink-0 overflow-hidden rounded-md border-2 border-white/30 shadow-2xl">
                  <Image
                    src={featuredPoster}
                    alt={`${featured.title} poster`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <span className="comic-badge comic-badge-red text-[10px]">
                    {featured.genre}
                  </span>
                  <p className="text-xs font-bold text-slate-300">
                    {featured.year} • ★ {featured.rating}
                  </p>
                </div>
              </div>
            </div>

            {/* Synopsis & Actions */}
            <div className="p-5 space-y-4">
              {/* Caption Box */}
              <div className="caption-box caption-box-gold text-xs leading-relaxed text-slate-300">
                <span className="block font-black uppercase tracking-wider text-[#f5c518] mb-1">
                  THE PREMISE:
                </span>
                {featured.overview || "A standout release commanding attention across the cinematic landscape."}
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  href={`/movie/${featured.slug}`}
                  className="comic-btn-primary text-xs"
                >
                  EXPLORE STORY →
                </Link>
                <WatchlistToggleButton movie={featured} className="text-xs py-2 px-3.5" />
              </div>
            </div>
          </div>
        ) : null}
      </HeroBanner>

      {/* ─── 2. TONIGHT'S PICK (EDITORIAL SPOTLIGHT) ────────────────────── */}
      {tonightPick ? <TonightsPick pick={tonightPick} /> : null}

      {/* ─── 3. AROUND THE WORLD TONIGHT (GLOBAL DISCOVERY LANES) ───────── */}
      {globalLanes && globalLanes.length > 0 ? <AroundTheWorld lanes={globalLanes} /> : null}

      {/* ─── 4. WHAT ARE YOU IN THE MOOD FOR? (MOOD DISCOVERY CHIPS) ─────── */}
      <MoodDiscovery />

      {/* ─── 5. INTERACTIVE NARRATIVE / WRITERS ROOM ────────────────────── */}
      <section className="rounded-2xl border border-white/12 bg-[#0c0e15] p-6 sm:p-8">
        <div className="mb-6 flex flex-col gap-1 border-b border-white/10 pb-4">
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[#e50914]">
            WRITERS ROOM & GENRE SEQUENCES
          </span>
          <h2 className="font-sans text-2xl font-black uppercase text-white">
            CHOOSE YOUR NARRATIVE
          </h2>
          <p className="text-xs text-slate-400">
            Filter panels by category or consult the script doctor for a mood-driven recommendation.
          </p>
        </div>

        <HomeInteractive />
      </section>

      {/* ─── 6. ACT I TO V STORYBOARD CHAPTER SECTIONS ─────────────────── */}
      {sections.map((section, sectionIdx) => {
        const chapterLabel = actLabels[section.key] || `ACT ${sectionIdx + 1}`;

        return (
          <SectionShell
            key={section.key}
            chapter={chapterLabel}
            eyebrow="STORYBOARD PANEL SEQUENCE"
            title={section.title}
            description={section.description}
            action={
              <Link
                href="/search"
                className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-[#e50914] transition"
              >
                VIEW FULL ARCHIVE →
              </Link>
            }
          >
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {section.movies.map((movie, movieIdx) => (
                <MediaCard
                  key={`${section.key}-${movie.tmdbId || movie.id}-${movieIdx}`}
                  movie={movie}
                  issueNumber={movieIdx + 1}
                />
              ))}
            </div>
          </SectionShell>
        );
      })}

      {/* ─── 7. INTERMISSION FINALE EDITORIAL BANNER ───────────────────── */}
      <section className="relative overflow-hidden rounded-2xl border-2 border-white/15 bg-gradient-to-r from-[#121520] via-[#0d0f17] to-[#18111e] p-8 sm:p-10 shadow-2xl text-center">
        <div className="absolute inset-0 bg-comic-dots opacity-40 pointer-events-none" />
        <div className="film-strip-edge" />
        <div className="relative mx-auto max-w-2xl space-y-4 pt-2">
          <span className="comic-badge comic-badge-gold text-xs">
            CHAPTER FINALE • THE NEXT ISSUE
          </span>
          <h2 className="font-sans text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
            TELL US WHAT YOU&apos;RE FEELING.
          </h2>
          <p className="text-sm leading-relaxed text-slate-300">
            Cross-reference your favorite films with TMDb&apos;s rich cinematic web to unlock tailored recommendations for your next movie night.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <Link href="/recommendations" className="comic-btn-primary text-xs">
              LAUNCH RECOMMENDATIONS →
            </Link>
            <Link href="/search" className="comic-btn-secondary text-xs">
              EXPLORE FULL DATABASE
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
