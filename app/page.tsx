import HomeInteractive from "@/components/home/home-interactive";
import { HeroBanner } from "../components/layout/hero-banner";
import { SectionShell } from "../components/layout/section-shell";
import { MediaCard } from "../components/movie/media-card";
import { getHomepageData } from "../services/homepage.service";

export default async function Home() {
  const { featured, sections } = await getHomepageData();

  return (
    <div className="min-h-screen">
      <main className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-8 lg:px-8 lg:py-10">
        <HeroBanner
          badge="✨ Discover your next obsession"
          title={featured?.title ?? "Find your next favorite movie"}
          subtitle={featured?.blurb}
          actions={<HomeInteractive />}
        >
          {featured ? (
            <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-6 backdrop-blur-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Featured release</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">{featured.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">{featured.overview}</p>
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/10 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Why it fits</p>
                <p className="mt-2 text-base font-medium text-white">{featured.vibe}</p>
              </div>
            </div>
          ) : null}
        </HeroBanner>

        {sections.map((section) => (
          <SectionShell key={section.key} title={section.title} description={section.description} action={null}>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {section.movies.map((movie) => (
                <MediaCard key={movie.id} movie={movie} />
              ))}
            </div>
          </SectionShell>
        ))}
      </main>
    </div>
  );
}
