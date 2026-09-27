const test = require('node:test');
const assert = require('node:assert/strict');
const { buildRecommendationPlan } = require('../services/recommendation-engine.js');

test('buildRecommendationPlan prioritizes mood-aligned genres and shared keywords', () => {
  const seeds = [
    {
      title: 'Interstellar',
      mood: 'adventure',
      genres: ['Sci-Fi', 'Adventure'],
      keywords: ['space', 'time', 'exploration'],
      source: 'seed',
    },
  ];

  const candidates = [
    {
      title: 'Arrival',
      genres: ['Sci-Fi', 'Drama'],
      keywords: ['space', 'language', 'time'],
      source: 'similar',
    },
    {
      title: 'The Martian',
      genres: ['Sci-Fi', 'Adventure'],
      keywords: ['survival', 'space'],
      source: 'recommendation',
    },
    {
      title: 'A Beautiful Day in the Neighborhood',
      genres: ['Drama'],
      keywords: ['heart', 'friendship'],
      source: 'recommendation',
    },
  ];

  const result = buildRecommendationPlan(seeds, candidates, 'adventure');

  assert.equal(result.length, 3);
  assert.equal(result[0].title, 'Arrival');
  assert.equal(result[0].reason.includes('adventurous'), true);
  assert.equal(result[1].title, 'The Martian');
});
