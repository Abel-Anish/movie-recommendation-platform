function buildRecommendationPlan(seeds, candidates, activeMood) {
  const seedGenres = new Set(seeds.flatMap((seed) => seed.genres || []));
  const seedKeywords = new Set(seeds.flatMap((seed) => seed.keywords || []));
  const moodLabel =
    activeMood === "adventure"
      ? "adventurous"
      : activeMood === "thriller"
      ? "suspenseful"
      : activeMood === "romantic"
      ? "romantic"
      : "comforting";

  return candidates
    .map((candidate) => {
      const genreMatches = (candidate.genres || []).filter((genre) => seedGenres.has(genre)).length;
      const keywordMatches = (candidate.keywords || []).filter((keyword) => seedKeywords.has(keyword)).length;
      const moodBonus =
        candidate.genres?.some((genre) => ["Sci-Fi", "Adventure", "Drama"].includes(genre)) &&
        activeMood === "adventure"
          ? 2
          : 0;
      const score = genreMatches * 3 + keywordMatches * 4 + moodBonus;
      const matchCount = Math.max(1, genreMatches + keywordMatches);
      const reason = `${candidate.title} feels like a strong match because it shares ${matchCount} signals with your recent picks and fits a ${moodLabel} mood.`;

      return { ...candidate, score, reason };
    })
    .sort((left, right) => right.score - left.score)
    .slice(0, 8);
}

function calculateCinemaDna(seeds, recommendations) {
  const pool = [...(recommendations || []), ...(seeds || [])];
  const total = Math.max(1, pool.length);
  const genreCount = {};
  const langCount = {};
  const decadeCount = {};

  for (const m of pool) {
    for (const g of m.genres || (m.genre ? [m.genre] : [])) {
      genreCount[g] = (genreCount[g] || 0) + 1;
    }
    const lang = m.originalLanguage || m.language || "en";
    langCount[lang] = (langCount[lang] || 0) + 1;
    if (m.year) {
      const dec = `${Math.floor(m.year / 10) * 10}s`;
      decadeCount[dec] = (decadeCount[dec] || 0) + 1;
    }
  }

  const getDimScore = (genres, base = 42) => {
    const sum = genres.reduce((acc, g) => acc + (genreCount[g] || 0), 0);
    const ratio = sum / Math.max(1, total * 0.8);
    return Math.min(96, Math.max(38, Math.round(base + ratio * 50)));
  };

  const dimensions = [
    { label: "Emotional Resonance", score: getDimScore(["Drama", "Romance", "Family"]) },
    { label: "Suspense & Tension", score: getDimScore(["Thriller", "Horror", "Mystery", "Crime"]) },
    { label: "Sci-Fi & Wonder", score: getDimScore(["Sci-Fi", "Fantasy", "Adventure"]) },
    { label: "Adrenaline & Action", score: getDimScore(["Action", "War", "Adventure"]) },
    { label: "Poetic Romance", score: getDimScore(["Romance", "Drama"]) },
    { label: "Wit & Dark Humor", score: getDimScore(["Comedy", "Animation", "Crime"]) },
  ].sort((a, b) => b.score - a.score);

  const langNames = {
    ml: "India (Kerala)",
    ta: "India (Tamil)",
    te: "India (Telugu)",
    hi: "India (Hindi)",
    ko: "South Korea",
    ja: "Japan",
    fr: "France",
    es: "Spain",
    de: "Germany",
    it: "Italy",
    en: "USA / Hollywood",
  };

  const globalTaste = Object.entries(langCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([code]) => langNames[code] || code.toUpperCase());

  const dominantGenres = Object.entries(genreCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([g]) => g);

  const dominantLanguages = Object.entries(langCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([code]) => langNames[code] || code.toUpperCase());

  const decadeTendencies = Object.entries(decadeCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([decade, count]) => ({
      decade,
      percentage: Math.round((count / total) * 100),
    }));

  return {
    dimensions,
    globalTaste: globalTaste.length ? globalTaste : ["Global Cinema"],
    dominantGenres: dominantGenres.length ? dominantGenres : ["Drama", "Sci-Fi"],
    dominantLanguages: dominantLanguages.length ? dominantLanguages : ["English"],
    decadeTendencies: decadeTendencies.length ? decadeTendencies : [{ decade: "2020s", percentage: 70 }],
    ratingPreference: "Averages 8.0/10 — demanding high critical consensus",
    mainstreamTendency: "Balanced Discovery",
    totalSeedsAnalyzed: (seeds || []).length,
  };
}

function selectUnexpectedGem(seeds, candidates) {
  const seedTitles = new Set((seeds || []).map((s) => (s.title || "").toLowerCase()));
  const eligible = (candidates || []).filter((c) => !seedTitles.has((c.title || "").toLowerCase()));
  if (!eligible.length) return null;
  const picked = eligible[Math.min(2, eligible.length - 1)] || eligible[0];
  return {
    movie: picked,
    headline: "THE MOVIE YOU DIDN'T KNOW YOU NEEDED",
    reason: `An unexpected yet deeply resonant cinematic counterpart to ${seeds?.[0]?.title || "your selection"}.`,
    matchPercentage: 88,
    badge: "UNEXPECTED GEM",
  };
}

module.exports = { buildRecommendationPlan, calculateCinemaDna, selectUnexpectedGem };
