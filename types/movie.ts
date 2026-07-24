export type MovieCategory = "trending" | "popular" | "top-rated" | "upcoming" | "ai-picks" | "continue-watching";

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
  mood: "cozy" | "adventure" | "thriller" | "romantic";
  category?: MovieCategory;
  featured?: boolean;
  isNew?: boolean;
};

export type HomepageSection = {
  key: string;
  title: string;
  description?: string;
  movies: Movie[];
  kind: MovieCategory;
};
