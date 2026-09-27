export type MovieCategory =
  | "trending"
  | "popular"
  | "top-rated"
  | "upcoming"
  | "now-playing"
  | "ai-picks"
  | "continue-watching";

export type Mood =
  | "cozy"
  | "adventure"
  | "thriller"
  | "romantic"
  | "dark"
  | "mind-bending"
  | "emotional"
  | "intense"
  | "fun"
  | "late-night"
  | "unsettling"
  | "inspiring";

export type Movie = {
  id: string;
  tmdbId?: string;
  title: string;
  slug: string;
  genre: string;
  year: number;
  rating: string;
  image: string;
  backdrop?: string;
  posterPath?: string | null;
  backdropPath?: string | null;
  blurb: string;
  vibe: string;
  overview: string;
  runtime: string;
  cast: string[];
  crew?: string[];
  mood: Mood | string;
  category?: MovieCategory;
  featured?: boolean;
  isNew?: boolean;
  releaseDate?: string;
  originalLanguage?: string;
  genres?: string[];
  trailer?: string | null;
  director?: string;
  tagline?: string | null;
  imdbId?: string | null;
  voteCount?: number;
  reason?: string;
  score?: number;
  primarySeed?: string;
  seedSources?: string[];
  keywords?: string[];
  productionCompanies?: string[];
  budget?: string;
  revenue?: string;
  spokenLanguages?: string[];
};

export type Review = {
  id: string;
  author: string;
  content: string;
  rating: number;
  source: string;
  date: string;
};

export type MovieDetails = Movie & {
  credits: {
    cast: string[];
    crew: string[];
  };
  similar: Movie[];
  recommendations: Movie[];
  reviews: Review[];
  discoveryPaths?: DiscoveryPaths;
};

export type DiscoveryPaths = {
  sameVibe: Movie[];
  sameMind: Movie[];
  sameGenre: Movie[];
  sameCreators: Movie[];
  differentCountry: Movie[];
  hiddenGems: Movie[];
};

export type SpecialPick = {
  movie: Movie;
  headline: string;
  reason: string;
  matchPercentage?: number;
  badge?: string;
};

export type CinemaDnaDimension = {
  label: string;
  score: number; // 0 - 100
};

export type CinemaDnaProfile = {
  dimensions: CinemaDnaDimension[];
  globalTaste: string[];
  dominantGenres: string[];
  dominantLanguages: string[];
  decadeTendencies: Array<{ decade: string; percentage: number }>;
  ratingPreference: string;
  mainstreamTendency: "Blockbuster / Mainstream" | "Balanced Discovery" | "Underground / Cinephile";
  totalSeedsAnalyzed: number;
};

export type GlobalDiscoveryLane = {
  id: string;
  title: string;
  subtitle: string;
  languageCode: string;
  editorialNote: string;
  flagOrIcon?: string;
  movies: Movie[];
};

export type HomepageSection = {
  key: string;
  title: string;
  description?: string;
  movies: Movie[];
  kind: MovieCategory;
};

export type HomepageData = {
  featured: Movie | null;
  sections: HomepageSection[];
  tonightPick?: SpecialPick | null;
  globalLanes?: GlobalDiscoveryLane[];
};