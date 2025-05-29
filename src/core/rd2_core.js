/* rd2_core.js – Book-aligned macro calculation engine (Renaissance Diet 2.0)
   Exports: getMacros(params) → { calories, protein, fats, carbs, perMeal, messages }
*/

//////////////////////////////
//  DATA TABLES & CONSTANTS //
//////////////////////////////

// Calorie lookup by body-weight range (lbs) and training-day intensity.
const calorieTable = {
  "Non Training": [
    { min: 100, max: 115, cal: 1300 }, { min: 116, max: 130, cal: 1500 },
    { min: 131, max: 145, cal: 1700 }, { min: 146, max: 160, cal: 1800 },
    { min: 161, max: 175, cal: 1900 }, { min: 176, max: 190, cal: 1950 },
    { min: 191, max: 210, cal: 2000 }, { min: 211, max: 230, cal: 2150 },
    { min: 231, max: 250, cal: 2300 }, { min: 251, max: 275, cal: 2500 },
    { min: 276, max: 300, cal: 2700 }
  ],
  "Light": [
    { min: 100, max: 115, cal: 1500 }, { min: 116, max: 130, cal: 1700 },
    { min: 131, max: 145, cal: 1900 }, { min: 146, max: 160, cal: 2000 },
    { min: 161, max: 175, cal: 2100 }, { min: 176, max: 190, cal: 2200 },
    { min: 191, max: 210, cal: 2300 }, { min: 211, max: 230, cal: 2500 },
    { min: 231, max: 250, cal: 2700 }, { min: 251, max: 275, cal: 2900 },
    { min: 276, max: 300, cal: 3100 }
  ],
  "Moderate": [
    { min: 100, max: 115, cal: 1700 }, { min: 116, max: 130, cal: 1900 },
    { min: 131, max: 145, cal: 2100 }, { min: 146, max: 160, cal: 2250 },
    { min: 161, max: 175, cal: 2400 }, { min: 176, max: 190, cal: 2500 },
    { min: 191, max: 210, cal: 2600 }, { min: 211, max: 230, cal: 2800 },
    { min: 231, max: 250, cal: 3000 }, { min: 251, max: 275, cal: 3250 },
    { min: 276, max: 300, cal: 3500 }
  ],
  "Hard": [
    { min: 100, max: 115, cal: 1900 }, { min: 116, max: 130, cal: 2100 },
    { min: 131, max: 145, cal: 2300 }, { min: 146, max: 160, cal: 2450 },
    { min: 161, max: 175, cal: 2600 }, { min: 176, max: 190, cal: 2750 },
    { min: 191, max: 210, cal: 2900 }, { min: 211, max: 230, cal: 3100 },
    { min: 231, max: 250, cal: 3300 }, { min: 251, max: 275, cal: 3600 },
    { min: 276, max: 300, cal: 3900 }
  ]
};

// Carb minimums & recommended factors (g / lb BW)
const carbMin         = { "Non Training": 0.3, "Light": 0.5, "Moderate": 1.0, "Hard": 1.5 };
const carbRecommended = { "Non Training": 0.5, "Light": 1.0, "Moderate": 1.5, "Hard": 2.0 };

/////////////////////////////////
//  MAIN CALCULATION FUNCTION  //
/////////////////////////////////

/**
 * @param {Object} params
 * @param {number} params.weight   Body-weight (lbs)
 * @param {'male'|'female'} params.gender
 * @param {'Non Training'|'Light'|'Moderate'|'Hard'} params.intensity
 * @param {'cut'|'maintain'|'bulk'} params.goal
 * @param {number} params.meals
 * @param {number=} params.calOverride
 * @param {number=} params.lbChange
 * @param {number=} params.protMult
 * @param {number=} params.fatPercent
 * @returns {Object}
 */
export function getMacros({
  weight,
  gender,
  intensity,
  goal,
  meals,
  calOverride = 0,
  lbChange,
  protMult = 1.0,
  fatPercent = null
}) {
  if (!weight || weight <= 0)   throw new Error('weight must be positive');
  if (!meals  || meals  < 1)    throw new Error('meals must be \u22651');

  // ---------- CALORIES ----------
  let calories;
  if (calOverride > 0) {
    calories = calOverride;
  } else {
    const row = (calorieTable[intensity] || []).find(r => weight >= r.min && weight <= r.max);
    if (!row) throw new Error('weight out of supported range');
    calories = row.cal;
    if (gender === 'female') calories *= 0.95;        // 5 % reduction
    if (typeof lbChange === 'number') calories += lbChange * 500;
    else if (goal === 'cut')  calories -= 250;
    else if (goal === 'bulk') calories += 250;
  }

  // ---------- MACROS ----------
  const proteinG   = +(weight * protMult).toFixed(1);
  const proteinCal = proteinG * 4;
  const minFatG    = 0.3 * weight;

  let fatG, carbG;

  if (fatPercent !== null && fatPercent !== '') {
    fatG = Math.max((calories * fatPercent / 100) / 9, minFatG);
    const carbCal = Math.max(calories - proteinCal - fatG * 9, 0);
    carbG = carbCal / 4;
  } else {
    carbG = weight * carbRecommended[intensity];
    const carbCal = carbG * 4;
    fatG = (calories - proteinCal - carbCal) / 9;
    if (fatG < minFatG) {
      fatG = minFatG;
      carbG = Math.max((calories - proteinCal - fatG * 9) / 4, 0);
    }
  }

  carbG = Math.max(carbG, 0);
  fatG  = Math.max(fatG,  0);

  // ---------- MESSAGES ----------
  const messages = [];
  const minCarbs = weight * carbMin[intensity];
  if (carbG < minCarbs)
    messages.push({ text: `Carbs below ${intensity} minimum (${minCarbs.toFixed(1)} g).`, level: 'warn' });
  if (typeof lbChange === 'number' && Math.abs(lbChange) > 1.5)
    messages.push({ text: 'Aggressive phase: keep stress low & sleep \u22657 h.', level: 'warn' });
  if (intensity === 'Hard' && carbG < weight * 0.5)
    messages.push({ text: 'Very low carbs on hard days may impair performance.', level: 'warn' });

  if (protMult > 1.5)
    messages.push({ text: 'Protein >1.5 g/lb \u2013 advanced intake.', level: 'caution' });
  if (fatG * 9 / calories >= 0.4)
    messages.push({ text: 'High fat (\u226540 % kcal) — favour unsaturated sources.', level: 'caution' });
  const ppm = proteinG / meals;
  if (ppm < 25 || ppm > 50)
    messages.push({ text: 'Per-meal protein target ≈25–50 g.', level: 'caution' });
  if (meals < 4 || meals > 6)
    messages.push({ text: 'Optimal adherence: 4–6 meals.', level: 'caution' });

  const weightKg = weight / 2.2;
  const baseWaterMl = 30 * weightKg;
  const extra = { 'Non Training':0, Light:250, Moderate:500, Hard:1000 }[intensity] || 0;
  const waterTip = extra
    ? `Hydration: ${(baseWaterMl/1000).toFixed(1)}–${((baseWaterMl+extra)/1000).toFixed(1)} L/day.`
    : `Hydration: ${(baseWaterMl/1000).toFixed(1)} L/day.`;
  messages.push({ text: waterTip, level: 'tip' });
  messages.push({ text: 'Whole-food rule: ≥80 % single-ingredient foods + ≥5 servings fruit/veg.', level: 'tip' });

  const round = n => +n.toFixed(1);
  return {
    calories: Math.round(calories),
    protein: round(proteinG),
    fats:    round(fatG),
    carbs:   round(carbG),
    perMeal: {
      protein: round(proteinG / meals),
      fats:    round(fatG    / meals),
      carbs:   round(carbG   / meals)
    },
    messages
  };
}
