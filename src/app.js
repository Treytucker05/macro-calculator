import { getMacros } from './core/rd2_core.js';

// QUICK SMOKE TEST — remove or replace later
const demo = getMacros({
  weight: 200,
  gender: 'male',
  intensity: 'Moderate',
  goal: 'maintain',
  meals: 4
});

console.table(demo);
