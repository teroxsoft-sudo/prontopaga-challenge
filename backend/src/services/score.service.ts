import { normalizeRut } from "../utils/rut";

export function calculateScore(rut: string): number {
  const normalized = normalizeRut(rut);

  let hash = 0;

  for (let i = 0; i < normalized.length; i++) {
    hash = (hash * 31 + normalized.charCodeAt(i)) >>> 0;
  }

  return hash % 101;
}