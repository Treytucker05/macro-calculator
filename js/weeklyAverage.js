/**
 * weeklyAverage
 * @param {number[]} weights – array of numeric body-weights
 * @returns {number} arithmetic mean rounded to one decimal
 */
export function weeklyAverage(weights) {
  if (!weights.length) return 0;
  const sum = weights.reduce((a, b) => a + b, 0);
  return Math.round((sum / weights.length) * 10) / 10;
}
