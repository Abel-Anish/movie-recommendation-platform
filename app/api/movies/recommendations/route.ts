import { NextResponse } from "next/server";
import { getLocalMovies } from "../../../../lib/movies";
import { buildTmdbUrl, fetchJson } from "../../../../services/api";
import { mapTmdbMovie } from "../../../../services/movie.service";
import {
  buildRecommendationPlan,
  calculateCinemaDna,
  parseNaturalLanguageQuery,
  selectUnexpectedGem,
  type RecommendationMode,
} from "../../../../services/recommendation-engine";
import type { Movie } from "../../../../types/movie";

type TmdbSearchResult = {
  results?: Array<{
    id: number;
    title?: string;
    name?: string;
    genre_ids?: number[];
    poster_path?: string | null;
    backdrop_path?: string | null;
    overview?: string;
    release_date?: string;
    vote_average?: number;
    original_language?: string;
  }>;
};

type TmdbMovieDetails = {
  id: number;
  title?: string;
  genres?: Array<{ id: number; name: string }>;
  keywords?: { keywords?: Array<{ id: number; name: string }> };
  recommendations?: { results?: Array<Parameters<typeof mapTmdbMovie>[0]> };
  similar?: { results?: Array<Parameters<typeof mapTmdbMovie>[0]> };
  original_language?: string;
  release_date?: string;
  vote_average?: number;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mood = searchParams.get("mood") || "adventure";
  const seedParam = searchParams.get("seed") || "";
  const prompt = searchParams.get("prompt") || searchParams.get("q") || "";
  const mode = (searchParams.get("mode") as RecommendationMode) || "best_match";

  const seedTitles = seedParam
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const fallbackMovies = getLocalMovies();

  if (!process.env.TMDB_API_KEY) {
    const fallbackSeeds = (seedTitles.length ? seedTitles : ["Interstellar", "Arrival"]).map((title) => ({
      title,
      genres: ["Sci-Fi", "Adventure", "Drama"],
      keywords: ["space", "journey", "life"],
      language: "en",
    }));
    const scored = buildRecommendationPlan(fallbackSeeds, fallbackMovies, mood, {
      naturalLanguageQuery: prompt,
      mode,
      maxResults: 40,
    });
    const cinemaDna = calculateCinemaDna(fallbackSeeds, scored);
    const unexpectedGem = selectUnexpectedGem(fallbackSeeds, fallbackMovies);
    return NextResponse.json({
      recommendations: scored,
      cinemaDna,
      unexpectedGem,
      totalCandidates: scored.length,
    });
  }

  try {
    const activeSeeds: Array<{
      title: string;
      genres: string[];
      keywords: string[];
      language?: string;
      year?: number;
    }> = [];
    const candidatePool: Movie[] = [];
    const seenCandidateIds = new Set<string>();

    // Extract seeds from natural language prompt if seeds not explicitly provided
    const derivedSeeds = [...seedTitles];
    if (derivedSeeds.length === 0 && prompt) {
      const match = prompt.match(/(?:like|similar to)\s+([A-Za-z0-9\s]+?)(?:\s+but|\s+from|\s+with|\s+in|$)/i);
      if (match && match[1]?.trim()) {
        derivedSeeds.push(match[1].trim());
      }
    }

    const targetSeeds =
      derivedSeeds.length > 0
        ? derivedSeeds.slice(0, 5)
        : prompt
        ? []
        : ["Interstellar", "Arrival", "The Matrix"];

    // Harvest candidates from seeds
    for (const seedTitle of targetSeeds) {
      try {
        const searchUrl = buildTmdbUrl("/search/movie", {
          query: seedTitle,
          include_adult: "false",
          page: "1",
        });
        const searchRes = await fetchJson<TmdbSearchResult>(searchUrl);
        const firstMovie = searchRes.results?.[0];

        if (firstMovie) {
          const detailUrl = buildTmdbUrl(`/movie/${firstMovie.id}`, {
            append_to_response: "keywords,recommendations,similar",
          });
          const detailRes = await fetchJson<TmdbMovieDetails>(detailUrl);

          const genres = (detailRes.genres || []).map((g) => g.name).filter(Boolean);
          const keywords = (detailRes.keywords?.keywords || []).map((k) => k.name).filter(Boolean);
          const year = detailRes.release_date ? Number(detailRes.release_date.slice(0, 4)) : undefined;

          activeSeeds.push({
            title: firstMovie.title || seedTitle,
            genres,
            keywords,
            language: detailRes.original_language || firstMovie.original_language,
            year,
          });

          const recResults = [
            ...(detailRes.recommendations?.results || []),
            ...(detailRes.similar?.results || []),
          ];

          for (const rawCandidate of recResults.slice(0, 12)) {
            if (rawCandidate.id && !seenCandidateIds.has(String(rawCandidate.id))) {
              seenCandidateIds.add(String(rawCandidate.id));
              const mapped = await mapTmdbMovie(rawCandidate);
              candidatePool.push(mapped);
            }
          }
        }
      } catch {
        // Continue with other seeds
      }
    }

    // Natural Language Query assistance
    if (prompt) {
      const parsed = parseNaturalLanguageQuery(prompt);
      const TMDB_GENRES: Record<string, string> = {
        Action: "28",
        Adventure: "12",
        Animation: "16",
        Comedy: "35",
        Crime: "80",
        Documentary: "99",
        Drama: "18",
        Family: "10751",
        Fantasy: "14",
        History: "36",
        Horror: "27",
        Music: "10402",
        Mystery: "9648",
        Romance: "10749",
        "Sci-Fi": "878",
        Thriller: "53",
        War: "10752",
        Western: "37",
      };

      const params: Record<string, string> = {
        sort_by: "popularity.desc",
        "vote_count.gte": "10",
        page: "1",
      };
      if (parsed.language) {
        params.with_original_language = parsed.language;
      }
      if (parsed.genre && TMDB_GENRES[parsed.genre]) {
        params.with_genres = TMDB_GENRES[parsed.genre];
      }

      if (parsed.language || parsed.genre) {
        try {
          const langUrl = buildTmdbUrl("/discover/movie", params);
          const langRes = await fetchJson<TmdbSearchResult>(langUrl);
          for (const raw of (langRes.results || []).slice(0, 16)) {
            if (raw.id && !seenCandidateIds.has(String(raw.id))) {
              seenCandidateIds.add(String(raw.id));
              const mapped = await mapTmdbMovie(raw as never);
              candidatePool.push(mapped);
            }
          }
        } catch {
          // Ignore
        }
      }

      if (activeSeeds.length === 0) {
        activeSeeds.push({
          title: prompt,
          genres: parsed.genre ? [parsed.genre] : ["Cinema"],
          keywords: [prompt],
          language: parsed.language || "en",
        });
      }
    }

    // International / Different Language candidate harvesting
    if (mode === "international" || mode === "different_language") {
      try {
        const intlUrl = buildTmdbUrl("/discover/movie", {
          sort_by: "vote_average.desc",
          "vote_count.gte": "100",
          without_original_language: "en",
          page: "1",
        });
        const intlRes = await fetchJson<TmdbSearchResult>(intlUrl);
        for (const raw of (intlRes.results || []).slice(0, 12)) {
          if (raw.id && !seenCandidateIds.has(String(raw.id))) {
            seenCandidateIds.add(String(raw.id));
            const mapped = await mapTmdbMovie(raw as never);
            candidatePool.push(mapped);
          }
        }
      } catch {
        // Ignore
      }
    }

    // If candidate pool is still low, fetch trending movies
    if (candidatePool.length < 15) {
      try {
        const trendingUrl = buildTmdbUrl("/trending/movie/week", { page: "1" });
        const trendingRes = await fetchJson<TmdbSearchResult>(trendingUrl);
        for (const rawCandidate of (trendingRes.results || []).slice(0, 15)) {
          if (rawCandidate.id && !seenCandidateIds.has(String(rawCandidate.id))) {
            seenCandidateIds.add(String(rawCandidate.id));
            const mapped = await mapTmdbMovie(rawCandidate as never);
            candidatePool.push(mapped);
          }
        }
      } catch {
        // Ignore
      }
    }

    const finalCandidates = candidatePool.length > 0 ? candidatePool : fallbackMovies;
    const finalSeeds =
      activeSeeds.length > 0
        ? activeSeeds
        : targetSeeds.map((title) => ({
            title,
            genres: ["Sci-Fi", "Adventure", "Drama"],
            keywords: ["cinematic", "story"],
            language: "en",
          }));

    const recommendations = buildRecommendationPlan(finalSeeds, finalCandidates, mood, {
      naturalLanguageQuery: prompt,
      mode,
      maxResults: 60,
    });

    const cinemaDna = calculateCinemaDna(finalSeeds, recommendations);
    const unexpectedGem = selectUnexpectedGem(finalSeeds, finalCandidates);

    return NextResponse.json({
      recommendations,
      cinemaDna,
      unexpectedGem,
      totalCandidates: recommendations.length,
    });
  } catch {
    const scoredFallback = buildRecommendationPlan(
      [{ title: "Default", genres: ["Sci-Fi", "Adventure"], keywords: ["film"] }],
      fallbackMovies,
      mood,
      { naturalLanguageQuery: prompt, mode, maxResults: 30 },
    );
    const cinemaDna = calculateCinemaDna(
      [{ title: "Default", genres: ["Sci-Fi", "Adventure"], language: "en" }],
      scoredFallback,
    );
    const unexpectedGem = selectUnexpectedGem(
      [{ title: "Default", genres: ["Sci-Fi"], language: "en" }],
      fallbackMovies,
    );
    return NextResponse.json({
      recommendations: scoredFallback,
      cinemaDna,
      unexpectedGem,
      totalCandidates: scoredFallback.length,
    });
  }
}
