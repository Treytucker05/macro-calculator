const STORAGE_KEY = 'weights';

function readWeights() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function writeWeights(arr) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}

export function addWeight(dateISO, lbs) {
  const arr = readWeights();
  arr.push({ d: dateISO, l: lbs });
  writeWeights(arr);
}

function weekStart(dateISO) {
  const d = new Date(dateISO);
  const day = d.getUTCDay();
  const diff = (day + 6) % 7; // days since Monday
  d.setUTCDate(d.getUTCDate() - diff);
  return d.toISOString().slice(0, 10);
}

export function getWeekAverage(weekStartISO) {
  const arr = readWeights();
  const start = weekStart(weekStartISO);
  const weekEntries = arr.filter(e => weekStart(e.d) === start);
  if (!weekEntries.length) return 0;
  const sum = weekEntries.reduce((s, e) => s + e.l, 0);
  return sum / weekEntries.length;
}
