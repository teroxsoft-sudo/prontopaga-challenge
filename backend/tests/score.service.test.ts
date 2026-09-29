import { describe, expect, it } from "vitest";
import { calculateScore } from "../src/services/score.service";

describe("calculateScore", () => {
  it("debe retornar siempre el mismo score para el mismo RUT", () => {
    const score1 = calculateScore("12345678-5");
    const score2 = calculateScore("12345678-5");

    expect(score1).toBe(score2);
  });

  it("debe retornar un score entre 0 y 100", () => {
    const score = calculateScore("12345678-5");

    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  it("debe aceptar diferentes formatos del mismo RUT", () => {
    const score1 = calculateScore("12.345.678-5");
    const score2 = calculateScore("12345678-5");

    expect(score1).toBe(score2);
  });
});