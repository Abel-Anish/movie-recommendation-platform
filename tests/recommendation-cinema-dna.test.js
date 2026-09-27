const test = require('node:test');
const assert = require('node:assert/strict');
const {
  buildRecommendationPlan,
  calculateCinemaDna,
  selectUnexpectedGem,
} = require('../services/recommendation-engine.js');

test('calculateCinemaDna computes valid dimensions and global taste profile', () => {
  const seeds = [
    { title: 'Interstellar', genres: ['Sci-Fi', 'Adventure'], language: 'en', year: 2014 },
    { title: 'Parasite', genres: ['Thriller', 'Drama'], language: 'ko', year: 2019 },
    { title: 'Premam', genres: ['Romance', 'Comedy', 'Drama'], language: 'ml', year: 2015 },
  ];

  const recommendations = [
    { title: 'Arrival', genres: ['Sci-Fi', 'Drama'], language: 'en', year: 2016, rating: '8.0/10' },
    { title: 'Memories of Murder', genres: ['Crime', 'Thriller'], language: 'ko', year: 2003, rating: '8.1/10' },
    { title: 'Kumbalangi Nights', genres: ['Drama', 'Family'], language: 'ml', year: 2019, rating: '8.2/10' },
  ];

  const dna = calculateCinemaDna(seeds, recommendations);

  assert.ok(Array.isArray(dna.dimensions));
  assert.ok(dna.dimensions.length >= 4);
  assert.ok(dna.dimensions[0].score >= 40 && dna.dimensions[0].score <= 100);
  assert.ok(Array.isArray(dna.globalTaste));
  assert.ok(dna.globalTaste.length >= 1);
  assert.ok(Array.isArray(dna.dominantGenres));
  assert.ok(dna.totalSeedsAnalyzed === 3);
});

test('selectUnexpectedGem selects an unexpected recommendation with real reasoning', () => {
  const seeds = [
    { title: 'Interstellar', genres: ['Sci-Fi'], language: 'en' },
  ];

  const candidates = [
    { title: 'Interstellar', genres: ['Sci-Fi'], language: 'en', rating: '8.7/10' },
    { title: 'Solaris', genres: ['Sci-Fi', 'Drama'], language: 'ru', rating: '8.0/10', score: 35 },
    { title: 'The Prestige', genres: ['Mystery', 'Drama'], language: 'en', rating: '8.5/10', score: 40 },
  ];

  const gem = selectUnexpectedGem(seeds, candidates);

  assert.ok(gem);
  assert.equal(gem.headline, "THE MOVIE YOU DIDN'T KNOW YOU NEEDED");
  assert.ok(gem.movie.title !== 'Interstellar');
  assert.ok(gem.reason.length > 20);
});
