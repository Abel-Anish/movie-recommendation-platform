import { getLocalMovies } from "../lib/movies";
import type { DiscoveryPaths, GlobalDiscoveryLane, Movie, MovieDetails, Review, SpecialPick } from "../types/movie";
import { buildTmdbUrl, fetchJson } from "./api";
import { fallbackBackdrop, fallbackPoster, getBackdropUrl, getPosterUrl } from "./image.service";

type TmdbMovie = {
  id?: number;
  title?: string;
  name?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  overview?: string;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  genre_ids?: number[];
  original_language?: string;
  runtime?: number;
  genres?: Array<{ id?: number; name?: string }>;
  keywords?: { keywords?: Array<{ id?: number; name?: string }> };
  credits?: { cast?: Array<{ name?: string; character?: string }> ; crew?: Array<{ name?: string; job?: string }> };
  videos?: { results?: Array<{ key?: string; type?: string; official?: boolean }> };
  similar?: { results?: TmdbMovie[] };
  recommendations?: { results?: TmdbMovie[] };
  production_companies?: Array<{ name?: string }>;
  budget?: number;
  revenue?: number;
  spoken_languages?: Array<{ english_name?: string; name?: string }>;
  tagline?: string;
  imdb_id?: string;
  vote_count?: number;
};

type TmdbListResponse = { results?: TmdbMovie[] };

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function getReleaseYear(movie: TmdbMovie) {
  const raw = movie.release_date || movie.first_air_date || "";
  return raw ? Number(raw.slice(0, 4)) : new Date().getFullYear();
}

function mapGenreName(genreId?: number) {
  const map: Record<number, string> = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Sci-Fi",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War",
    37: "Western",
  };

  return genreId ? map[genreId] || "Featured" : "Featured";
}

function getMoodFromGenre(genre: string): Movie["mood"] {
  if (genre === "Thriller" || genre === "Horror") return "thriller";
  if (genre === "Romance") return "romantic";
  if (genre === "Family" || genre === "Comedy") return "cozy";
  return "adventure";
}

function normalizeRating(value?: number) {
  return `${(value || 0).toFixed(1)}/10`;
}

function formatCurrency(value?: number) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "—";
  }
  return `$${value.toLocaleString()}`;
}

function getGenres(payload: TmdbMovie) {
  return (payload.genres || []).map((genre) => genre.name).filter(Boolean) as string[];
}

export async function mapTmdbMovie(movie: TmdbMovie): Promise<Movie> {
  const title = movie.title || movie.name || "Untitled";
  const id = `${movie.id ?? "0"}`;
  const slug = `${slugify(title)}-${id}`;
  const genre = movie.genre_ids?.[0] ? mapGenreName(movie.genre_ids[0]) : "Featured";
  const image = await getPosterUrl(movie.poster_path, fallbackPoster);
  const backdrop = await getBackdropUrl(movie.backdrop_path, fallbackBackdrop);
  const genres = getGenres(movie);

  return {
    id,
    tmdbId: id,
    title,
    slug,
    genre,
    year: getReleaseYear(movie),
    rating: normalizeRating(movie.vote_average),
    image,
    backdrop,
    posterPath: movie.poster_path || null,
    backdropPath: movie.backdrop_path || null,
    blurb: movie.overview || "A cinematic pick from TMDb.",
    vibe: genre === "Sci-Fi" ? "Fresh and cinematic" : "Bright and immersive",
    overview: movie.overview || "A cinematic pick from TMDb.",
    runtime: movie.runtime ? `${movie.runtime} min` : "TBD",
    cast: [],
    mood: getMoodFromGenre(genre),
    category: "trending",
    genres: genres.length ? genres : [genre],
    tagline: movie.tagline || null,
    imdbId: movie.imdb_id || null,
    voteCount: movie.vote_count || undefined,
  };
}

type MovieCategory = "trending" | "popular" | "top-rated" | "upcoming" | "now-playing";

export async function getMovieCatalogByCategory(category: MovieCategory): Promise<Movie[]> {
  try {
    const endpointMap: Record<MovieCategory, string> = {
      trending: "/trending/movie/week",
      popular: "/movie/popular",
      "top-rated": "/movie/top_rated",
      upcoming: "/movie/upcoming",
      "now-playing": "/movie/now_playing",
    };

    const url = buildTmdbUrl(endpointMap[category], { page: "1" });
    const payload = await fetchJson<TmdbListResponse>(url);
    const mapped = await Promise.all((payload.results || []).slice(0, 6).map(mapTmdbMovie));
    return mapped.length ? mapped : getLocalMovies();
  } catch {
    return getLocalMovies();
  }
}

export async function getMovieCatalog(): Promise<Movie[]> {
  return getMovieCatalogByCategory("trending");
}

export async function getMovieBySlug(slug: string): Promise<MovieDetails | null> {
  const fallback = getLocalMovies().find((item) => item.slug === slug);
  if (fallback) {
    const details: MovieDetails = {
      ...fallback,
      credits: {
        cast: fallback.cast,
        crew: fallback.crew || ["Director unavailable"],
      },
      similar: [],
      recommendations: [],
      reviews: [],
    };
    details.discoveryPaths = await getMovieDiscoveryPaths(details);
    return details;
  }

  const idMatch = slug.match(/-(\d+)$/);
  const id = idMatch ? idMatch[1] : slug;

  if (!id || id === "0") {
    return null;
  }

  try {
    const url = buildTmdbUrl(`/movie/${id}`, {
      append_to_response: "credits,videos,similar,recommendations,keywords",
    });
    const payload = await fetchJson<TmdbMovie & { release_date?: string; runtime?: number; genres?: Array<{ name?: string }>; keywords?: { keywords?: Array<{ name?: string }> }; credits?: { cast?: Array<{ name?: string; character?: string }> ; crew?: Array<{ name?: string; job?: string }> }; videos?: { results?: Array<{ key?: string; type?: string; official?: boolean }> }; similar?: { results?: TmdbMovie[] }; recommendations?: { results?: TmdbMovie[] } }>(url);

    const title = payload.title || payload.name || "Untitled";
    const image = await getPosterUrl(payload.poster_path, fallbackPoster);
    const backdrop = await getBackdropUrl(payload.backdrop_path, fallbackBackdrop);
    const cast = (payload.credits?.cast || []).slice(0, 12).map((person) => person.name || "Cast unavailable");
    const crew = (payload.credits?.crew || []).filter((person) => person.job === "Director").map((person) => person.name || "Director unavailable");
    const otherCrew = (payload.credits?.crew || []).filter((person) => person.job && person.job !== "Director").slice(0, 8).map((person) => person.name || "Crew unavailable");
    const director = crew[0] || "Director unavailable";
    const trailer = (payload.videos?.results || []).find((video) => video.type === "Trailer" && video.official)?.key || null;
    const genres = getGenres(payload);
    const keywords = (payload.keywords?.keywords || []).map((keyword) => keyword.name).filter(Boolean) as string[];
    const similar = payload.similar?.results ? await Promise.all(payload.similar.results.slice(0, 6).map(mapTmdbMovie)) : [];
    const recommendations = payload.recommendations?.results ? await Promise.all(payload.recommendations.results.slice(0, 6).map(mapTmdbMovie)) : [];
    const productionCompanies = (payload.production_companies || []).map((company) => company.name).filter(Boolean) as string[];
    const spokenLanguages = (payload.spoken_languages || []).map((language) => language.english_name || language.name).filter(Boolean) as string[];

    const review: Review = {
      id: `${id}-review`,
      author: "TMDb",
      content: "This recommendation is generated from live TMDb metadata and audience signals.",
      rating: 4,
      source: "tmdb",
      date: new Date().toISOString(),
    };

    const details: MovieDetails = {
      id,
      title,
      slug,
      genre: genres[0] || "Featured",
      year: getReleaseYear(payload),
      rating: `${(payload.vote_average || 0).toFixed(1)}/10`,
      image,
      backdrop,
      blurb: payload.overview || "A cinematic pick from TMDb.",
      vibe: "Fresh and cinematic",
      overview: payload.overview || "A cinematic pick from TMDb.",
      runtime: payload.runtime ? `${payload.runtime} min` : "TBD",
      cast,
      crew: [director, ...otherCrew],
      mood: "adventure",
      category: "trending",
      credits: {
        cast,
        crew: [director, ...otherCrew],
      },
      similar,
      recommendations,
      reviews: [review],
      releaseDate: payload.release_date,
      originalLanguage: payload.original_language,
      genres,
      trailer,
      director,
      tagline: payload.tagline || null,
      imdbId: payload.imdb_id || null,
      voteCount: payload.vote_count || undefined,
      keywords,
      productionCompanies,
      budget: formatCurrency(payload.budget),
      revenue: formatCurrency(payload.revenue),
      spokenLanguages,
    };

    details.discoveryPaths = await getMovieDiscoveryPaths(details, payload.keywords?.keywords);
    return details;
  } catch {
    return null;
  }
}

export async function getMovieById(movieId: string): Promise<Movie | null> {
  try {
    const url = buildTmdbUrl(`/movie/${movieId}`);
    const payload = await fetchJson<TmdbMovie>(url);
    return mapTmdbMovie(payload);
  } catch {
    return null;
  }
}

export async function getMovieDiscoveryPaths(
  movie: MovieDetails,
  rawKeywords?: Array<{ id?: number; name?: string }>,
): Promise<DiscoveryPaths> {
  const seenIds = new Set<string>([movie.id, movie.tmdbId || ""].filter(Boolean));
  const fallbackCatalog = getLocalMovies();

  const takeUnique = (candidates: Movie[], limit = 4): Movie[] => {
    const picked: Movie[] = [];
    for (const c of candidates) {
      if (!c || !c.id || seenIds.has(c.id) || (c.tmdbId && seenIds.has(c.tmdbId))) continue;
      if (c.title?.toLowerCase() === movie.title?.toLowerCase()) continue;
      seenIds.add(c.id);
      if (c.tmdbId) seenIds.add(c.tmdbId);
      picked.push(c);
      if (picked.length >= limit) break;
    }
    return picked;
  };

  // 1. SAME VIBE: tone and style alignment
  const vibePool = [...movie.similar, ...movie.recommendations];
  let sameVibe = takeUnique(
    vibePool.filter((m) => m.genre === movie.genre || m.mood === movie.mood),
    4,
  );
  if (sameVibe.length < 3) {
    sameVibe = [
      ...sameVibe,
      ...takeUnique(fallbackCatalog.filter((m) => m.genre === movie.genre), 4 - sameVibe.length),
    ];
  }

  // 2. SAME MIND: shared themes & keywords
  let mindCandidates: Movie[] = [];
  const keywordIds = (rawKeywords || []).map((k) => k.id).filter(Boolean);
  if (process.env.TMDB_API_KEY && keywordIds.length > 0) {
    try {
      const url = buildTmdbUrl("/discover/movie", {
        with_keywords: keywordIds.slice(0, 3).join("|"),
        sort_by: "vote_average.desc",
        "vote_count.gte": "80",
        page: "1",
      });
      const res = await fetchJson<TmdbListResponse>(url);
      mindCandidates = await Promise.all((res.results || []).slice(0, 8).map(mapTmdbMovie));
    } catch {
      // Ignore
    }
  }
  if (!mindCandidates.length) {
    mindCandidates = fallbackCatalog.filter(
      (m) => m.vibe === movie.vibe || m.blurb.toLowerCase().includes("space"),
    );
  }
  const sameMind = takeUnique([...mindCandidates, ...movie.recommendations], 4);

  // 3. SAME GENRE: genre-based excellence
  const sameGenre = takeUnique(
    [...movie.recommendations, ...fallbackCatalog.filter((m) => m.genre === movie.genre)],
    4,
  );

  // 4. SAME CREATORS: director/cast connections
  let creatorCandidates: Movie[] = [];
  const directorName = movie.director || movie.crew?.[0];
  if (directorName && directorName !== "Director unavailable") {
    creatorCandidates = fallbackCatalog.filter(
      (m) => m.director === directorName || m.cast.some((actor) => movie.cast.includes(actor)),
    );
  }
  if (creatorCandidates.length < 3) {
    creatorCandidates = [...creatorCandidates, ...fallbackCatalog.filter((m) => m.rating >= "8.0")];
  }
  const sameCreators = takeUnique(creatorCandidates, 4);

  // 5. DIFFERENT COUNTRY: non-native language parallels
  let intlCandidates: Movie[] = [];
  const currentLang = movie.originalLanguage || "en";
  if (process.env.TMDB_API_KEY) {
    try {
      const url = buildTmdbUrl("/discover/movie", {
        without_original_language: currentLang,
        sort_by: "vote_average.desc",
        "vote_count.gte": "120",
        page: "1",
      });
      const res = await fetchJson<TmdbListResponse>(url);
      intlCandidates = await Promise.all((res.results || []).slice(0, 8).map(mapTmdbMovie));
    } catch {
      // Ignore
    }
  }
  if (!intlCandidates.length) {
    intlCandidates = fallbackCatalog.filter(
      (m) => ((m as { originalLanguage?: string }).originalLanguage || "en") !== currentLang,
    );
  }
  const differentCountry = takeUnique([...intlCandidates, ...fallbackCatalog], 4);

  // 6. HIDDEN GEMS: less obvious movies with strong relevance
  let gemCandidates: Movie[] = [];
  if (process.env.TMDB_API_KEY) {
    try {
      const url = buildTmdbUrl("/discover/movie", {
        sort_by: "vote_average.desc",
        "vote_average.gte": "7.4",
        "vote_count.gte": "40",
        "vote_count.lte": "3000",
        page: "1",
      });
      const res = await fetchJson<TmdbListResponse>(url);
      gemCandidates = await Promise.all((res.results || []).slice(0, 8).map(mapTmdbMovie));
    } catch {
      // Ignore
    }
  }
  if (!gemCandidates.length) {
    gemCandidates = fallbackCatalog.filter((m) => (m.voteCount || 500) < 80000);
  }
  const hiddenGems = takeUnique([...gemCandidates, ...fallbackCatalog], 4);

  return {
    sameVibe: sameVibe.length ? sameVibe : fallbackCatalog.slice(0, 3),
    sameMind: sameMind.length ? sameMind : fallbackCatalog.slice(1, 4),
    sameGenre: sameGenre.length ? sameGenre : fallbackCatalog.slice(2, 5),
    sameCreators: sameCreators.length ? sameCreators : fallbackCatalog.slice(3, 6),
    differentCountry: differentCountry.length ? differentCountry : fallbackCatalog.slice(0, 3),
    hiddenGems: hiddenGems.length ? hiddenGems : fallbackCatalog.slice(1, 4),
  };
}

export async function getGlobalDiscoveryLanes(): Promise<GlobalDiscoveryLane[]> {
  const fallbackMovies = getLocalMovies();

  const laneConfigs = [
    {
      id: "kerala",
      title: "FROM KERALA",
      subtitle: "Malayalam Cinema: Grounded realism, intricate writing & raw emotional stakes",
      languageCode: "ml",
      editorialNote: "YOU WATCHED HOLLYWOOD. TRY KERALA NEXT.",
      flagOrIcon: "🌴",
    },
    {
      id: "seoul",
      title: "SEOUL AFTER DARK",
      subtitle: "Korean Cinema: Razor-sharp tension, psychological twists & emotional velocity",
      languageCode: "ko",
      editorialNote: "Bong Joon-ho opened the door. Walk further into Seoul.",
      flagOrIcon: "⚡",
    },
    {
      id: "tokyo",
      title: "TOKYO STORIES",
      subtitle: "Japanese Cinema: Contemplative anime, neo-noir & transcendent drama",
      languageCode: "ja",
      editorialNote: "Existential wonder and auteur visions from the East.",
      flagOrIcon: "🎌",
    },
    {
      id: "india",
      title: "INDIAN CINEMA",
      subtitle: "Grand mythic canvases, breathless pacing & cinematic spectacle",
      languageCode: "hi",
      editorialNote: "Beyond conventions — filmmaking operating at absolute maximum intensity.",
      flagOrIcon: "🏛️",
    },
    {
      id: "europe",
      title: "EUROPEAN NIGHT",
      subtitle: "French, Spanish & Italian cinema: Bold auteur voices & visual intimacy",
      languageCode: "fr",
      editorialNote: "Cannes darlings and unforgettable continental narratives.",
      flagOrIcon: "🎬",
    },
  ];

  const lanes: GlobalDiscoveryLane[] = [];

  for (const config of laneConfigs) {
    let movies: Movie[] = [];
    if (process.env.TMDB_API_KEY) {
      try {
        const url = buildTmdbUrl("/discover/movie", {
          with_original_language: config.languageCode,
          sort_by: "popularity.desc",
          "vote_count.gte": "25",
          page: "1",
        });
        const res = await fetchJson<TmdbListResponse>(url);
        movies = await Promise.all((res.results || []).slice(0, 6).map(mapTmdbMovie));
      } catch {
        // Ignore
      }
    }

    if (!movies.length) {
      movies = fallbackMovies
        .filter((m) => ((m as { originalLanguage?: string }).originalLanguage || "") === config.languageCode)
        .slice(0, 6);
      if (!movies.length) {
        movies = fallbackMovies.slice(0, 4);
      }
    }

    lanes.push({
      ...config,
      movies,
    });
  }

  return lanes;
}

export async function getTonightPick(): Promise<SpecialPick | null> {
  const fallback = getLocalMovies();
  let candidate: Movie | null = null;

  if (process.env.TMDB_API_KEY) {
    try {
      const url = buildTmdbUrl("/movie/top_rated", { page: "1" });
      const res = await fetchJson<TmdbListResponse>(url);
      const first = res.results?.[0];
      if (first) {
        candidate = await mapTmdbMovie(first);
      }
    } catch {
      // Ignore
    }
  }

  if (!candidate) {
    candidate = fallback[0] || null;
  }

  if (!candidate) return null;

  return {
    movie: candidate,
    headline: "TONIGHT'S CINEMATIC PICK",
    reason: `${candidate.title} (${candidate.year}) — An arresting ${candidate.genre} tour-de-force commanding visual reverence and emotional authenticity.`,
    matchPercentage: 96,
    badge: "CURATORS CHOICE",
  };
}
