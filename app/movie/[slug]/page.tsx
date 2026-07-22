import Link from "next/link";
import { notFound } from "next/navigation";
import { getMovieBySlug } from "../../lib/movies";

export default function MoviePage({ params }: { params: { slug: string } }) {
  const movie = getMovieBySlug(params.slug);

  if (!movie) {
    notFound();
  }

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-8 lg:px-8 lg:py-10">
      <Link href="/search" className="text-sm font-semibold text-slate-600 hover:text-slate-900">
        ← Back to search
      </Link>

      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <img src={movie.image} alt={movie.title} className="h-72 w-full object-cover" />
        <div className="grid gap-8 p-8 lg:grid-cols-[1.2fr_0.8fr] lg:p-10">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-pink-100 px-3 py-1 text-sm font-semibold text-pink-700">
                {movie.genre}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                {movie.year}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                {movie.runtime}
              </span>
            </div>
            <h1 className="text-3xl font-black text-slate-900">{movie.title}</h1>
            <p className="text-base leading-8 text-slate-600">{movie.overview}</p>
            <div className="rounded-2xl bg-slate-100 p-4 text-sm leading-7 text-slate-700">
              <p className="font-semibold text-slate-900">Why you might like it</p>
              <p className="mt-2">{movie.vibe} and a story that balances emotion with momentum.</p>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Cast</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              {movie.cast.map((member) => (
                <li key={member} className="rounded-full bg-white px-3 py-2 shadow-sm">
                  {member}
                </li>
              ))}
            </ul>
            <div className="mt-6 rounded-2xl bg-slate-900 p-4 text-white">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Rating</p>
              <p className="mt-2 text-2xl font-black">{movie.rating}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
