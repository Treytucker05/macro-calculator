/* src/ui/calcForm.js — browser glue for RD2 core */
import { getMacros } from '../core/rd2_core.js';

const form   = document.getElementById('macroForm');
const output = document.getElementById('macroResults');

/**
 * Render calculation outcome into #macroResults.
 * @param {ReturnType<typeof getMacros>} r
 * @param {number} meals
 */
function renderResults(r, meals) {
  const { calories, protein, fats, carbs, perMeal, messages } = r;

  output.innerHTML = `
    <h3>Daily Targets</h3>
    <ul>
      <li><strong>Calories:</strong> ${calories} kcal</li>
      <li><strong>Protein:</strong>  ${protein} g</li>
      <li><strong>Fats:</strong>     ${fats} g</li>
      <li><strong>Carbs:</strong>    ${carbs} g</li>
    </ul>

    <h4>Per-Meal (~${meals} meals)</h4>
    <ul>
      <li>Protein: ${perMeal.protein} g</li>
      <li>Fats:    ${perMeal.fats} g</li>
      <li>Carbs:   ${perMeal.carbs} g</li>
    </ul>

    <h4>Guidance</h4>
    <ul>
      ${messages.map(m => `<li>${m.text}</li>`).join('')}
    </ul>
  `;
}

if (form && output) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(form).entries());
    const params = {
      weight:    +data.weight,
      gender:     data.gender,
      intensity:  data.intensity,
      goal:       data.goal,
      meals:     +data.meals || 4
    };

    try {
      const result = getMacros(params);
      renderResults(result, params.meals);
    } catch (err) {
      output.innerHTML = `<p style="color:red;">${err.message}</p>`;
    }
  });
}
