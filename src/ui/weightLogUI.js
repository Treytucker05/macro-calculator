import { saveWeight } from '../../js/weightLog.js';

/**
 * Wire the weight-logging form—only when the elements exist.
 * This makes the script safe to include on pages that don’t yet
 * have the weight-log UI.
 */
function wireWeightLogUI() {
  const form      = document.getElementById('weight-log-form');
  const input     = document.getElementById('weight-log-input');
  const tableBody = document.getElementById('weight-log-tbody');

  // Abort silently until the real UI is present.
  if (!form || !input || !tableBody) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const pounds = parseFloat(input.value);
    if (Number.isNaN(pounds)) return;

    // Persist the entry, then render a new table row.
    saveWeight(pounds, new Date());

    const row = document.createElement('tr');
    row.innerHTML =
      `<td>${new Date().toLocaleDateString()}</td><td>${pounds}</td>`;
    tableBody.prepend(row);
    input.value = '';
  });
}

/* Ensure DOM is ready before wiring events */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', wireWeightLogUI);
} else {
  wireWeightLogUI();
}

//////////////////////////////////////////////////////////////////////
//  >>>>>  END OF FILE  <<<<<                                        //
//////////////////////////////////////////////////////////////////////
