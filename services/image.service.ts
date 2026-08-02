export async function getPosterUrl(path: string) {
  return path || "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=900&q=80";
}

export async function getBackdropUrl(path: string) {
  return path || "https://images.unsplash.com/photo-1517602302552-471fe67acf66?auto=format&fit=crop&w=1600&q=80";
}
