/* src/ui/mainCalc.js — auto-calculates macros whenever inputs change */
import { getMacros } from '../core/rd2_core.js';
import { validateMacros } from '../js/validateMacros.js';

function init() {
  const output    = document.getElementById('basicResults');

  // form inputs in the large calculator pane
  const weightInp = document.getElementById('weight');
  const genderSel = document.getElementById('gender');
  const actSel    = document.getElementById('activity');
  const goalSel   = document.getElementById('goal');
  const mealsInp  = document.getElementById('meals');

  if (!output || !weightInp || !genderSel || !actSel || !goalSel || !mealsInp)
    return; // safety guard

  /** collect current form values */
  function readParams() {
    return {
      weight:   +weightInp.value,
      gender:    genderSel.value,
      intensity: actSel.value,
      goal:      goalSel.value,
      meals:    +mealsInp.value || 4
    };
  }

  /** render results into #basicResults */
  function renderResults(res, meals, bw) {
    const { calories, protein, fats, carbs, perMeal, messages } = res;

    // extra warnings for low protein / fat
    const warn = validateMacros({ p: protein, c: carbs, f: fats }, bw)
                   .map(t => ({ text: t, level: 'warn' }));
    const allMessages = [...messages, ...warn];

    output.innerHTML = `
      <div class="macro-grid">
        <div class="macro-card"><span>Calories</span><strong>${calories}</strong></div>
        <div class="macro-card"><span>Protein&nbsp;(g)</span><strong>${protein}</strong></div>
        <div class="macro-card"><span>Fats&nbsp;(g)</span><strong>${fats}</strong></div>
        <div class="macro-card"><span>Carbs&nbsp;(g)</span><strong>${carbs}</strong></div>
      </div>

      <h4>Per-Meal (~${meals})</h4>
      <p>${perMeal.protein} g&nbsp;P • ${perMeal.fats} g&nbsp;F • ${perMeal.carbs} g&nbsp;C</p>

      <h4>Guidance</h4>
      <ul class="guidance-list">
        ${allMessages.map(m => `<li>${m.text}</li>`).join('')}
      </ul>
    `;
  }

  /** recompute and render */
  function update() {
    const params = readParams();
    try {
      const res = getMacros(params);
      renderResults(res, params.meals, params.weight);
    } catch (err) {
      output.style.color = 'red';
      output.textContent = err.message;
    }
  }

  // live updates on any change
  [weightInp, mealsInp].forEach(el => el.addEventListener('input', update));
  [genderSel, actSel, goalSel].forEach(el => el.addEventListener('change', update));

  update(); // initial render
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
