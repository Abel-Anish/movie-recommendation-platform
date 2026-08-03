export const fallbackPoster = "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=900&q=80";
export const fallbackBackdrop = "https://images.unsplash.com/photo-1517602302552-471fe67acf66?auto=format&fit=crop&w=1600&q=80";

export async function getPosterUrl(path?: string | null, fallback = fallbackPoster) {
  const base = process.env.TMDB_IMAGE_BASE_URL || "https://image.tmdb.org/t/p";
  return path ? `${base}/w500${path}` : fallback;
}

export async function getBackdropUrl(path?: string | null, fallback = fallbackBackdrop) {
  const base = process.env.TMDB_IMAGE_BASE_URL || "https://image.tmdb.org/t/p";
  return path ? `${base}/original${path}` : fallback;
}
