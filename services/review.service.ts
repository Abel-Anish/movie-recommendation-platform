import type { Review } from "../types/review";

export async function getReviews(): Promise<Review[]> {
  return [
    {
      id: "local-review-1",
      author: "Ava",
      content: "A polished, thoughtful recommendation experience with strong cinematic energy.",
      rating: 4.5,
      source: "local",
      createdAt: "2025-01-01",
    },
  ];
}
