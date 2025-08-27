'use client';

// pure helpers extracted from your original component :contentReference[oaicite:1]{index=1}
export function buildSummary(analysisData) {
  if (!analysisData || typeof analysisData !== 'object') {
    return {
      columns: [],
      nRows: 0,
      numericCount: 0,
      rowsSumm: [],
      missingByCol: [],
      overallMissingPct: 0,
      insights: emptyInsights(),
    };
  }

  const columns = Object.keys(analysisData);

  // total rows = max count across columns
  let nRows = 0;
  columns.forEach((c) => {
    const v = Number(analysisData[c]?.count ?? 0);
    if (!Number.isNaN(v)) nRows = Math.max(nRows, v);
  });

  const rowsSumm = columns.map((c) => {
    const r = {
      column: c,
      count: num(analysisData[c]?.count),
      mean: num(analysisData[c]?.mean),
      std: num(analysisData[c]?.std),
      min: num(analysisData[c]?.min),
      p25: num(analysisData[c]?.['25%']),
      p50: num(analysisData[c]?.['50%']),
      p75: num(analysisData[c]?.['75%']),
      max: num(analysisData[c]?.max),
    };
    r.range = deriveRange(r.min, r.max);
    r.iqr = deriveIQR(r.p25, r.p75);
    r.cv = deriveCV(r.std, r.mean);
    r.skewHint = deriveSkew(r.p25, r.p50, r.p75);
    return r;
  });

  const numericCount = rowsSumm.filter((r) => isFiniteNumber(r.mean)).length;

  const missingByCol = columns.map((c) => {
    const cnt = Number(analysisData[c]?.count ?? 0);
    const miss = nRows > 0 ? Math.max(nRows - cnt, 0) : 0;
    const pct = nRows > 0 ? (miss / nRows) * 100 : 0;
    return { column: c, missing: miss, pct };
  });

  const totalMissing = missingByCol.reduce((s, m) => s + m.missing, 0);
  const totalCells = nRows * columns.length || 1;
  const overallMissingPct = (totalMissing / totalCells) * 100;

  const numericRows = rowsSumm.filter((r) => isFiniteNumber(r.mean));
  const highVar = [...numericRows]
    .sort((a, b) => (b.cv ?? -1) - (a.cv ?? -1))
    .slice(0, 3);
  const nearConst = numericRows
    .filter((r) => (r.std ?? 0) === 0 || (r.iqr ?? 0) === 0)
    .slice(0, 3);
  const skewed = [...numericRows]
    .filter((r) => r.skewHint !== 'balanced')
    .sort((a, b) => skewMagnitude(b) - skewMagnitude(a))
    .slice(0, 3);
  const wideRange = [...numericRows]
    .sort((a, b) => (b.range ?? 0) - (a.range ?? 0))
    .slice(0, 3);

  return {
    columns,
    nRows,
    numericCount,
    rowsSumm,
    missingByCol,
    overallMissingPct,
    insights: { highVar, nearConst, skewed, wideRange },
  };
}

export function num(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}
export function isFiniteNumber(v) {
  return typeof v === 'number' && Number.isFinite(v);
}
export function fmt(v) {
  if (v === null || v === undefined || Number.isNaN(v)) return '—';
  const abs = Math.abs(v);
  if (abs >= 1_000_000)
    return Intl.NumberFormat(undefined, { notation: 'compact' }).format(v);
  if (abs >= 1000) return Intl.NumberFormat().format(v);
  if (abs >= 1) return Number(v).toFixed(2);
  return Number(v).toPrecision(3);
}

function deriveRange(min, max) {
  return isFiniteNumber(min) && isFiniteNumber(max) ? max - min : null;
}
function deriveIQR(p25, p75) {
  return isFiniteNumber(p25) && isFiniteNumber(p75) ? p75 - p25 : null;
}
function deriveCV(std, mean) {
  if (!isFiniteNumber(std) || !isFiniteNumber(mean) || mean === 0) return null;
  return Math.abs(std / mean);
}
function deriveSkew(p25, p50, p75) {
  if (![p25, p50, p75].every(isFiniteNumber)) return 'balanced';
  const left = Math.abs(p50 - p25),
    right = Math.abs(p75 - p50);
  if (left / (right || 1) >= 1.6) return 'left-skewed (long left tail)';
  if (right / (left || 1) >= 1.6) return 'right-skewed (long right tail)';
  return 'balanced';
}
function skewMagnitude(r) {
  if (r.skewHint.includes('left'))
    return Math.abs(r.p50 - r.p25 - (r.p75 - r.p50));
  if (r.skewHint.includes('right'))
    return Math.abs(r.p75 - r.p50 - (r.p50 - r.p25));
  return 0;
}
function emptyInsights() {
  return { highVar: [], nearConst: [], skewed: [], wideRange: [] };
}
    