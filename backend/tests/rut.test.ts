import { describe, expect, it } from "vitest";
import {
  formatRut,
  isValidRut,
  normalizeRut,
} from "../src/utils/rut";

describe("RUT utilities", () => {
  it("debe normalizar un RUT", () => {
    expect(normalizeRut("12.345.678-5")).toBe(
      "12345678-5",
    );
  });

  it("debe formatear un RUT", () => {
    expect(formatRut("12345678-5")).toBe(
      "12.345.678-5",
    );
  });

  it("debe validar un RUT correcto", () => {
    expect(isValidRut("12.345.678-5")).toBe(true);
  });

  it("debe rechazar un RUT incorrecto", () => {
    expect(isValidRut("12.345.678-9")).toBe(false);
  });
});