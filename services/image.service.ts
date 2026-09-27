export const fallbackPoster = "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=900&q=80";
export const fallbackBackdrop = "https://images.unsplash.com/photo-1517602302552-471fe67acf66?auto=format&fit=crop&w=1600&q=80";

export function getPosterUrlSync(path?: string | null, fallback = fallbackPoster): string {
  if (!path || typeof path !== "string" || path.trim() === "" || path === "/") {
    return fallback;
  }
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const base = process.env.TMDB_IMAGE_BASE_URL || "https://image.tmdb.org/t/p";
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}/w500${cleanPath}`;
}

export function getBackdropUrlSync(path?: string | null, fallback = fallbackBackdrop): string {
  if (!path || typeof path !== "string" || path.trim() === "" || path === "/") {
    return fallback;
  }
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const base = process.env.TMDB_IMAGE_BASE_URL || "https://image.tmdb.org/t/p";
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}/original${cleanPath}`;
}

export async function getPosterUrl(path?: string | null, fallback = fallbackPoster): Promise<string> {
  return getPosterUrlSync(path, fallback);
}

export async function getBackdropUrl(path?: string | null, fallback = fallbackBackdrop): Promise<string> {
  return getBackdropUrlSync(path, fallback);
}

