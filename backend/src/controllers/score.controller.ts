import type { Request, Response } from "express";
import { calculateScore } from "../services/score.service";
import {
  formatRut,
  isValidRut,
  normalizeRut,
} from "../utils/rut";

export function getScore(req: Request, res: Response): void {
  const rutParam = req.params.rut;

  // Express puede tipar un parámetro como string | string[].
  // Nuestro endpoint solo acepta un RUT individual.
  if (typeof rutParam !== "string" || !rutParam) {
    res.status(400).json({
      error: "RUT inválido",
    });
    return;
  }

  if (!isValidRut(rutParam)) {
    res.status(400).json({
      error: "RUT inválido",
    });
    return;
  }

  const normalizedRut = normalizeRut(rutParam);

  // Un usuario normal solamente puede consultar
  // el RUT incluido en su JWT.
  if (
    req.user?.role === "user" &&
    normalizeRut(req.user.rut ?? "") !== normalizedRut
  ) {
    res.status(403).json({
      error: "No tienes autorización para consultar este RUT",
    });
    return;
  }

  const score = calculateScore(normalizedRut);

  res.status(200).json({
    rut: formatRut(normalizedRut),
    score,
    fecha: new Date().toISOString(),
  });
}