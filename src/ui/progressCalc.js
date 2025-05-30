import { weeklyAverage } from '../js/weeklyAverage.js';
import { getLastWeekWeights } from './weightLogUI.js';

function init() {
  const adjBtn = document.querySelector('#progressCalculator button[type="submit"], #progressCalculator button');
  const resultDiv = document.getElementById('adjustmentResults');

  if (!adjBtn || !resultDiv) return;

  adjBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const lastWeek = getLastWeekWeights();
    const targetChange = +document.getElementById('targetWeeklyChange').value;
    const actualChange = +document.getElementById('actualWeeklyChange').value;

    const avg = weeklyAverage(lastWeek);
    const diff = targetChange - actualChange;
    const kcalAdj = Math.round((diff * 3500) / 7);

    console.table({ avgWeight: avg, kcalAdj });

    resultDiv.textContent =
      `Avg weight = ${avg.toFixed(1)} lb → Daily kcal adjustment: ${kcalAdj > 0 ? '+' : ''}${kcalAdj} kcal (console has details)`;
    resultDiv.style.color = '';
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
