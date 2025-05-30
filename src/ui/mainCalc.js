/* src/ui/mainCalc.js — connects the large “Macro Calculator” form to rd2_core */
import { getMacros } from '../core/rd2_core.js';

function init() {
  const calcBtn = document.querySelector(
    '#macroCalculator button[type="submit"], #macroCalculator button'
  );
  const output = document.getElementById('basicResults');

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
      console.table(res);                    // proof-of-life
      output.style.color   = '';
      output.textContent   = '✓ Core engine received input (see console).';
      // TODO: replace console.table with on-page rendering
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
