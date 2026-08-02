export type Review = {
  id: string;
  author: string;
  content: string;
  rating?: number;
  source: "tmdb" | "local";
  createdAt?: string;
};
