import { getMacros } from '../core/rd2_core.js';

document.addEventListener('DOMContentLoaded', () => {
  // Big form elements (already present in the v2 UI)
  const calcBtn  = document.querySelector('#macroCalculator button[type="submit"], #macroCalculator button');
  const output   = document.getElementById('basicResults');   // blank region in v2 UI

  if (!calcBtn) return;   // safety

  calcBtn.addEventListener('click', ev => {
    ev.preventDefault();

    const params = {
      weight:   +document.getElementById('weight').value,
      gender:    document.getElementById('gender').value,
      intensity: document.getElementById('activity').value,   // v2 uses “activity” for day type
      goal:      document.getElementById('goal').value,
      meals:    +document.getElementById('meals').value || 4
    };

    try {
      const res = getMacros(params);
      console.table(res);               // proof-of-life
      output.textContent = '✓ Core engine received input (see console for details).';
    } catch (e) {
      output.textContent = e.message;
      output.style.color = 'red';
    }
  });
});

