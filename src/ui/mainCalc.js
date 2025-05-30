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
      intensity:  document.getElementById('activity').value,
      goal:       document.getElementById('goal').value,
      meals:     +document.getElementById('meals').value || 4
    };

    try {
      const res = getMacros(params);
      console.table(res);  // proof-of-life
      output.textContent = '✓ Core engine received input (see console).';
      output.style.color = '';
    } catch (e) {
      output.textContent = e.message;
      output.style.color = 'red';
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

