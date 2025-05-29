/**
 * calorieCorrection
 * @param {number} targetWeeklyLbs – desired lbs change per week (neg = lose, pos = gain)
 * @param {number} actualWeeklyLbs – actual lbs change last week
 * @returns {number} daily kcal adjustment (neg = cut, pos = add) rounded to nearest 25
 * Uses formula: (targetWeeklyLbs - actualWeeklyLbs) * 3500 / 7
 */
export function calorieCorrection(targetWeeklyLbs, actualWeeklyLbs) {
  const adjustment = (targetWeeklyLbs - actualWeeklyLbs) * 3500 / 7;
  return Math.round(adjustment / 25) * 25;
}
