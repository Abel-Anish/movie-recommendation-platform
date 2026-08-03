import type { Movie as SharedMovie } from "../types/movie";

export type Movie = SharedMovie;

export const movies: Movie[] = [
  {
    id: "summer-lantern",
    title: "The Summer Lantern",
    slug: "the-summer-lantern",
    genre: "Feel-Good",
    year: 2024,
    rating: "4.8/5",
    image:
      "https://images.unsplash.com/photo-1517602302552-471fe67acf66?auto=format&fit=crop&w=900&q=80",
    blurb:
      "A warm-hearted story about second chances, old friendships, and finding joy in the little things.",
    vibe: "Cozy and uplifting",
    overview:
      "A heartfelt story set by the sea, where a small-town summer festival becomes the setting for old wounds to heal and new friendships to bloom.",
    runtime: "1h 42m",
    cast: ["Maya Chen", "Noah Reed", "Lena Ortiz"],
    mood: "cozy",
  },
  {
    id: "neon-harbor",
    title: "Neon Harbor",
    slug: "neon-harbor",
    genre: "Sci-Fi",
    year: 2023,
    rating: "4.7/5",
    image:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=80",
    blurb:
      "A stylish, mind-bending adventure set in a city that glows brighter than the stars above it.",
    vibe: "Bright and futuristic",
    overview:
      "In a city powered by light and memory, a young engineer uncovers a conspiracy hidden in the skyline itself.",
    runtime: "2h 04m",
    cast: ["Aria Singh", "Dorian Hale", "Samir Brooks"],
    mood: "adventure",
  },
  {
    id: "little-stars",
    title: "Little Stars",
    slug: "little-stars",
    genre: "Family",
    year: 2022,
    rating: "4.9/5",
    image:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=80",
    blurb:
      "A heartfelt family film filled with laughter, courage, and the magic of everyday kindness.",
    vibe: "Gentle and charming",
    overview:
      "Three siblings discover that the secret to finding their way home lies in helping someone else find theirs.",
    runtime: "1h 33m",
    cast: ["Elena Price", "Theo Martinez", "Jules Kim"],
    mood: "cozy",
  },
  {
    id: "midnight-circuit",
    title: "Midnight Circuit",
    slug: "midnight-circuit",
    genre: "Thriller",
    year: 2021,
    rating: "4.6/5",
    image:
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=900&q=80",
    blurb:
      "A fast-paced mystery with sharp twists and a finale that will keep you guessing until the last scene.",
    vibe: "Tense and addictive",
    overview:
      "When a late-night courier finds a device that predicts the next crime, he becomes the target of a citywide manhunt.",
    runtime: "1h 58m",
    cast: ["Nora Vale", "Kai Mercer", "Tess Green"],
    mood: "thriller",
  },
  {
    id: "golden-hour-drive",
    title: "Golden Hour Drive",
    slug: "golden-hour-drive",
    genre: "Feel-Good",
    year: 2020,
    rating: "4.5/5",
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80",
    blurb:
      "A road-trip romance that balances humor, heart, and the comfort of a perfect soundtrack.",
    vibe: "Easy-going and sweet",
    overview:
      "Two strangers in a coastal town take one spontaneous drive and accidentally discover the kind of connection that changes the course of their lives.",
    runtime: "1h 47m",
    cast: ["Iris Lane", "Milo Hart", "Sage Bell"],
    mood: "romantic",
  },
  {
    id: "echoes-tomorrow",
    title: "Echoes of Tomorrow",
    slug: "echoes-of-tomorrow",
    genre: "Sci-Fi",
    year: 2024,
    rating: "4.8/5",
    image:
      "https://images.unsplash.com/photo-1516110833967-0b5716ca1387?auto=format&fit=crop&w=900&q=80",
    blurb:
      "A breathtaking journey through memory, time, and the choices that shape who we become.",
    vibe: "Emotional and immersive",
    overview:
      "A time-bending mystery that asks whether the past can be rewritten when memory itself begins to fail.",
    runtime: "2h 11m",
    cast: ["Luca Rowan", "Jade Brooks", "Nina Hale"],
    mood: "adventure",
  },
];

export const genres = ["All", ...Array.from(new Set(movies.map((movie) => movie.genre)))];

export function getLocalMovies() {
  return movies;
}

export function getMovieBySlug(slug: string) {
  return movies.find((movie) => movie.slug === slug);
}
