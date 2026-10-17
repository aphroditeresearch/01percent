/**
 * Drifting cherry-blossom petals for the sakura dashboard style.
 *
 * Values are pseudo-random but seeded, so the server and every render produce
 * identical markup (no hydration mismatch, no client JavaScript needed) —
 * same approach as burst.ts for the cinematic login.
 */

export interface Petal {
  /** Horizontal start position, percent across the container. */
  left: number;
  size: number;
  /** Full fall-cycle duration, seconds. */
  duration: number;
  /** Negative animation-delay so petals are already mid-fall on load, seconds. */
  delay: number;
  /** Horizontal sway at the midpoint of the fall, px. */
  drift: number;
  /** Starting rotation, degrees. */
  rotate: number;
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

export function sakuraPetals(count = 20, seed = 11): Petal[] {
  const rand = seededRandom(seed);
  return Array.from({ length: count }, () => ({
    left: round(rand() * 100, 2),
    size: Math.round(9 + rand() * 9),
    duration: round(10 + rand() * 10, 2),
    delay: round(rand() * -20, 2),
    drift: Math.round(-70 + rand() * 140),
    rotate: Math.round(rand() * 360),
    opacity: round(0.3 + rand() * 0.45, 2),
  }));
}
