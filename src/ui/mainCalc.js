/* src/ui/mainCalc.js — connects the large “Macro Calculator” form to rd2_core */
import { getMacros } from '../core/rd2_core.js';

function init() {
  const calcBtn = document.querySelector('#basicCalculator .calculate-btn');
  const output = document.getElementById('basicResults');

  /**
   * Render calculation outcome into #basicResults
   * @param {ReturnType<typeof getMacros>} r
   * @param {number} meals
   */
  function renderResults(r, meals) {
    const { calories, protein, fats, carbs, perMeal, messages } = r;

    output.innerHTML = `
      <div class="macro-grid">
        <div class="macro-card"><span>Calories</span><strong>${calories}</strong></div>
        <div class="macro-card"><span>Protein&nbsp;(g)</span><strong>${protein}</strong></div>
        <div class="macro-card"><span>Fats&nbsp;(g)</span><strong>${fats}</strong></div>
        <div class="macro-card"><span>Carbs&nbsp;(g)</span><strong>${carbs}</strong></div>
      </div>

      <h4>Per-Meal&nbsp;(~${meals})</h4>
      <p>${perMeal.protein} g&nbsp;P&nbsp;&middot;&nbsp;${perMeal.fats} g&nbsp;F&nbsp;&middot;&nbsp;${perMeal.carbs} g&nbsp;C</p>

      <h4>Guidance</h4>
      <ul class="guidance-list">
        ${messages.map(m => `<li>${m.text}</li>`).join('')}
      </ul>
    `;
  }

  if (!calcBtn || !output) return;

  calcBtn.addEventListener('click', (ev) => {
    ev.preventDefault();

    const params = {
      weight:    +document.getElementById('weight').value,
      gender:     document.getElementById('gender').value,
      intensity:  document.getElementById('activity').value, // v2 day-type selector
      goal:       document.getElementById('goal').value,
      meals:     +document.getElementById('meals').value || 4
    };

    try {
      const res = getMacros(params);
      renderResults(res, params.meals);
    } catch (err) {
      output.style.color = 'red';
      output.textContent = err.message;
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
