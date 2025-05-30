import { weeklyAverage } from '../../js/weeklyAverage.js';
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

    resultDiv.innerHTML = `
      <div class="macro-grid">
        <div class="macro-card">
          <span>Daily kcal adj.</span>
          <strong>${kcalAdj > 0 ? '+' : ''}${kcalAdj}</strong>
        </div>
        <div class="macro-card">
          <span>Avg body-weight (lb)</span>
          <strong>${avg.toFixed(1)}</strong>
        </div>
      </div>
      <p style="margin-top:0.5rem;">
        Diff = ${diff.toFixed(1)} lb/week
      </p>
    `;
    resultDiv.style.color = '';
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
