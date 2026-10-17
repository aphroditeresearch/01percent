import { describe, expect, it } from "vitest";
import { lessonStates, percent } from "./access";

const lessons = [
  { id: "c", position: 3 },
  { id: "a", position: 1 },
  { id: "b", position: 2 },
];

describe("lessonStates", () => {
  it("sequential: only the next lesson after the last completed one is open", () => {
    const s = lessonStates({ unlockMode: "sequential" }, lessons, new Set(["a"]));
    expect(Object.fromEntries(s)).toEqual({ a: "done", b: "open", c: "locked" });
  });

  it("sequential: first lesson is open for a new student", () => {
    const s = lessonStates({ unlockMode: "sequential" }, lessons, new Set());
    expect(Object.fromEntries(s)).toEqual({ a: "open", b: "locked", c: "locked" });
  });

  it("open courses never lock", () => {
    const s = lessonStates({ unlockMode: "open" }, lessons, new Set(["b"]));
    expect(Object.fromEntries(s)).toEqual({ a: "open", b: "done", c: "open" });
  });
});

describe("percent", () => {
  it("rounds and handles empty courses", () => {
    expect(percent(14, 74)).toBe(19);
    expect(percent(0, 0)).toBe(0);
  });
});
