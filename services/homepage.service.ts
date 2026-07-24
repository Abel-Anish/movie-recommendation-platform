import { getLocalMovies } from "../lib/movies";
import type { HomepageSection, Movie } from "../types/movie";
import { HOME_SECTIONS } from "../constants/home";

export async function getHomepageData(): Promise<{ featured: Movie | null; sections: HomepageSection[] }> {
  const movies = getLocalMovies() as Movie[];

  const featured = movies[0] ?? null;

  const sections: HomepageSection[] = [
    {
      key: "trending",
      title: HOME_SECTIONS.trending,
      description: "Freshly surfaced picks for tonight.",
      movies: movies.slice(0, 6),
      kind: "trending",
    },
    {
      key: "popular",
      title: HOME_SECTIONS.popular,
      description: "Highly loved by the community.",
      movies: movies.slice(1, 7),
      kind: "popular",
    },
    {
      key: "top-rated",
      title: HOME_SECTIONS.topRated,
      description: "Critics and audiences agree.",
      movies: movies.slice(2, 8),
      kind: "top-rated",
    },
    {
      key: "upcoming",
      title: HOME_SECTIONS.upcoming,
      description: "Coming soon to your queue.",
      movies: movies.slice(3, 9),
      kind: "upcoming",
    },
    {
      key: "ai-picks",
      title: HOME_SECTIONS.aiPicks,
      description: "Tailored to your mood.",
      movies: movies.slice(4, 10),
      kind: "ai-picks",
    },
  ];

  return { featured, sections };
}
