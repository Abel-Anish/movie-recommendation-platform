export type MovieCategory =
  | "trending"
  | "popular"
  | "top-rated"
  | "upcoming"
  | "now-playing"
  | "ai-picks"
  | "continue-watching";

export type Movie = {
  id: string;
  title: string;
  slug: string;
  genre: string;
  year: number;
  rating: string;
  image: string;
  backdrop?: string;
  blurb: string;
  vibe: string;
  overview: string;
  runtime: string;
  cast: string[];
  crew?: string[];
  mood: "cozy" | "adventure" | "thriller" | "romantic";
  category?: MovieCategory;
  featured?: boolean;
  isNew?: boolean;
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
};