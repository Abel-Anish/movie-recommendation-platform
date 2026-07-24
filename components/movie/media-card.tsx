import Link from "next/link";

type MovieCardProps = {
  movie: {
    title: string;
    slug: string;
    genre: string;
    year: number;
    rating: string;
    image: string;
    blurb: string;
    vibe: string;
  };
};

export function MediaCard({ movie }: MovieCardProps) {
  return (
    <article className="group overflow-hidden rounded-[1.5rem] border border-white/10 bg-[rgba(255,255,255,0.08)] shadow-[0_10px_40px_rgba(0,0,0,0.25)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(255,61,90,0.18)]">
      <img src={movie.image} alt={movie.title} className="h-48 w-full object-cover" />
      <div className="space-y-3 p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-[#ff3d5a]">{movie.genre}</p>
          <p className="text-sm font-medium text-slate-300">★ {movie.rating}</p>
        </div>
        <div>
          <h4 className="text-xl font-semibold text-white">{movie.title}</h4>
          <p className="mt-1 text-sm text-slate-400">{movie.year}</p>
        </div>
        <p className="text-sm leading-7 text-slate-300">{movie.blurb}</p>
        <div className="rounded-2xl border border-white/10 bg-white/10 px-3 py-2 text-sm font-medium text-slate-200">
          {movie.vibe}
        </div>
        <Link href={`/movie/${movie.slug}`} className="inline-flex text-sm font-semibold text-white hover:text-[#ff3d5a]">
          View details →
        </Link>
      </div>
    </article>
  );
}
