import { describe, expect, it } from "vitest";
import { burstLines } from "./burst";

describe("burstLines", () => {
  it("is deterministic for a given seed (server and client markup match)", () => {
    expect(burstLines(40, 3)).toEqual(burstLines(40, 3));
    expect(burstLines(40, 3)).not.toEqual(burstLines(40, 4));
  });

  it("stays inside the intended ranges", () => {
    const lines = burstLines();
    expect(lines).toHaveLength(72);
    for (const l of lines) {
      expect(l.angle).toBeGreaterThanOrEqual(0);
      expect(l.angle).toBeLessThan(360);
      expect(l.offset).toBeGreaterThanOrEqual(170);
      expect(l.offset).toBeLessThanOrEqual(325);
      expect(l.length).toBeGreaterThanOrEqual(700);
      expect(l.length).toBeLessThanOrEqual(1200);
      expect(l.thickness).toBeGreaterThanOrEqual(1);
      expect(l.thickness).toBeLessThanOrEqual(4.4);
      expect(l.opacity).toBeGreaterThanOrEqual(0.35);
      expect(l.opacity).toBeLessThanOrEqual(1);
    }
  });

  it("covers the full circle", () => {
    const angles = burstLines().map((l) => l.angle);
    expect(Math.min(...angles)).toBeLessThan(10);
    expect(Math.max(...angles)).toBeGreaterThan(350);
  });
});
