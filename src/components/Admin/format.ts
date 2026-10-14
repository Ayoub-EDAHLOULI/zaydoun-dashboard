// Number formatting for the admin usage screens

/** $4.82 · $0.0057 · <$0.001 — small amounts keep enough precision to be useful */
export function formatUsd(n: number, axis = false): string {
  if (n === 0) return "$0";
  if (n >= 0.01) return `$${n.toFixed(2)}`;
  if (n >= 0.001) return `$${n.toFixed(4).replace(/0+$/, "")}`;
  // Axis ticks are exact; values this small just read as "<$0.001"
  return axis ? `$${Number(n.toPrecision(2))}` : "<$0.001";
}

/** 1,284 · 12.9K · 2.1M */
export function formatCompact(n: number): string {
  return new Intl.NumberFormat(undefined, {
    notation: n >= 10_000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(n);
}

/** 3h 12m · 14m · 45s · 0s */
export function formatDuration(seconds: number): string {
  const s = Math.round(seconds);
  if (s < 60) return `${s}s`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m`;
  return `${Math.floor(m / 60)}h ${m % 60}m`;
}
