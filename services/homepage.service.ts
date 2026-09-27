import { getLocalMovies } from "../lib/movies";
import type { HomepageData, HomepageSection, Movie } from "../types/movie";
import { HOME_SECTIONS } from "../constants/home";
import { getGlobalDiscoveryLanes, getMovieCatalogByCategory, getTonightPick } from "./movie.service";

export async function getHomepageData(): Promise<HomepageData> {
  const fallbackMovies = getLocalMovies() as Movie[];

  const [trending, popular, topRated, upcoming, nowPlaying, tonightPick, globalLanes] =
    await Promise.all([
      getMovieCatalogByCategory("trending"),
      getMovieCatalogByCategory("popular"),
      getMovieCatalogByCategory("top-rated"),
      getMovieCatalogByCategory("upcoming"),
      getMovieCatalogByCategory("now-playing"),
      getTonightPick(),
      getGlobalDiscoveryLanes(),
    ]);

  const sections: HomepageSection[] = [
    {
      key: "trending",
      title: HOME_SECTIONS.trending,
      description: "Freshly surfaced picks for tonight.",
      movies: trending.length ? trending : fallbackMovies.slice(0, 6),
      kind: "trending",
    },
    {
      key: "popular",
      title: HOME_SECTIONS.popular,
      description: "Highly loved by the community.",
      movies: popular.length ? popular : fallbackMovies.slice(1, 7),
      kind: "popular",
    },
    {
      key: "top-rated",
      title: HOME_SECTIONS.topRated,
      description: "Critics and audiences agree.",
      movies: topRated.length ? topRated : fallbackMovies.slice(2, 8),
      kind: "top-rated",
    },
    {
      key: "upcoming",
      title: HOME_SECTIONS.upcoming,
      description: "Coming soon to your queue.",
      movies: upcoming.length ? upcoming : fallbackMovies.slice(3, 9),
      kind: "upcoming",
    },
    {
      key: "now-playing",
      title: HOME_SECTIONS.nowPlaying,
      description: "Playing right now in the spotlight.",
      movies: nowPlaying.length ? nowPlaying : fallbackMovies.slice(4, 10),
      kind: "now-playing",
    },
  ];

  const featured = sections[0]?.movies[0] ?? fallbackMovies[0] ?? null;

  return { featured, sections, tonightPick, globalLanes };
}
