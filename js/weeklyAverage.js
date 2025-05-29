export function weeklyAverage(weights) {
  if (!weights.length) return 0;
  const s = weights.reduce((a, b) => a + b, 0);
  return Math.round((s / weights.length) * 10) / 10;
}
