export function validateMacros(macros, bw) {
  /* macros={p,c,f}; bw=body-weight in lbs */
  const errors = [];
  if (macros.p < bw * 0.8) errors.push('Protein below 0.8 g/lb');
  if (macros.f < bw * 0.3) errors.push('Fat below 0.3 g/lb');
  return errors;
}
