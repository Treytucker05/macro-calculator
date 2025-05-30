/* src/ui/mainCalc.js — auto-calculates macros whenever inputs change */
import { getMacros } from '../core/rd2_core.js';
import { validateMacros } from '../js/validateMacros.js';

function init() {
  const output = document.getElementById('basicResults');

  const weightInp = document.getElementById('weight');
  const genderSel = document.getElementById('gender');
  const actSel    = document.getElementById('activity');
  const goalSel   = document.getElementById('goal');
  const mealsInp  = document.getElementById('meals');

  if (!output || !weightInp || !genderSel || !actSel || !goalSel || !mealsInp)
    return;

  function readParams() {
    return {
      weight:   +weightInp.value,
      gender:    genderSel.value,
      intensity: actSel.value,
      goal:      goalSel.value,
      meals:    +mealsInp.value || 4
    };
  }

  function renderResults(r, meals, bw) {
    const { calories, protein, fats, carbs, perMeal, messages } = r;
    const warn = validateMacros({ p: protein, c: carbs, f: fats }, bw)
                   .map(t => ({ text: t, level: 'warn' }));
    const all = [...messages, ...warn];

    output.innerHTML = `
      <div class="macro-grid">
        <div class="macro-card"><span>Calories</span><strong>${calories}</strong></div>
        <div class="macro-card"><span>Protein (g)</span><strong>${protein}</strong></div>
        <div class="macro-card"><span>Fats (g)</span><strong>${fats}</strong></div>
        <div class="macro-card"><span>Carbs (g)</span><strong>${carbs}</strong></div>
      </div>

      <h4>Per-Meal (~${meals})</h4>
      <p>${perMeal.protein} g P • ${perMeal.fats} g F • ${perMeal.carbs} g C</p>

      <h4>Guidance</h4>
      <ul class="guidance-list">
        ${all.map(m => `<li>${m.text}</li>`).join('')}
      </ul>
    `;
  }

  function update() {
    const p = readParams();
    try {
      const res = getMacros(p);
      renderResults(res, p.meals, p.weight);
    } catch (err) {
      output.style.color = 'red';
      output.textContent = err.message;
    }
  }

  [weightInp, genderSel, actSel, goalSel, mealsInp]
    .forEach(el => el.addEventListener('input', update));
  [genderSel, actSel, goalSel]
    .forEach(el => el.addEventListener('change', update));

  update(); // initial render
}

document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', init)
  : init();
