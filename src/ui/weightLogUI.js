import { addWeight, getLast7 } from '../../js/weightLog.js';

document.getElementById('logWeightBtn').addEventListener('click', () => {
  const w = +document.getElementById('todayWeight').value;
  if (!w) return;
  addWeight(new Date().toISOString().slice(0, 10), w);
  alert('Weight logged.');
});

export function getLastWeekWeights() {
  return getLast7();   // returns array of last 7 weights
}
