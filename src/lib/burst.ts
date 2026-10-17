/**
 * Radiating "speed lines" for the cinematic login intro.
 *
 * Values are pseudo-random but seeded, so the server and every render produce
 * identical markup (no hydration mismatch, no client JavaScript needed).
 */

export interface BurstLine {
  /** Degrees around the centre. */
  angle: number;
  /** Gap from the centre before the line starts, px. */
  offset: number;
  length: number;
  thickness: number;
  opacity: number;
}

/** Small, fast seeded PRNG (mulberry32). Returns numbers in [0, 1). */
function seededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const round = (n: number, places: number) => Number(n.toFixed(places));

export function burstLines(count = 72, seed = 7): BurstLine[] {
  const rand = seededRandom(seed);
  const step = 360 / count;
  return Array.from({ length: count }, (_, i) => ({
    // Evenly spaced, with jitter so it doesn't look mechanical.
    angle: round(i * step + rand() * step * 0.8, 2),
    offset: Math.round(170 + rand() * 155),
    length: Math.round(700 + rand() * 500),
    thickness: round(1 + rand() * 3.4, 1),
    opacity: round(0.35 + rand() * 0.65, 2),
  }));
}
