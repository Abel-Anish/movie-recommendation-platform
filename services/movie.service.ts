import { getLocalMovies } from "../lib/movies";
import type { Movie, MovieDetails } from "../types/movie";

export async function getMovieCatalog(): Promise<Movie[]> {
  return getLocalMovies();
}

export async function getMovieBySlug(slug: string): Promise<MovieDetails | null> {
  const movie = getLocalMovies().find((item) => item.slug === slug) as MovieDetails | undefined;
  if (!movie) return null;

  return {
    ...movie,
    credits: {
      cast: movie.cast,
      crew: movie.crew || ["Director unavailable"],
    },
    similar: getLocalMovies().slice(0, 3),
    recommendations: getLocalMovies().slice(1, 4),
    reviews: [
      {
        id: `${movie.id}-review`,
        author: "Studio Review",
        content: "A polished recommendation entry with rich metadata and a cinematic presence.",
        rating: 4,
        source: "local",
        date: "2025-01-01",
      },
    ],
  };
}
