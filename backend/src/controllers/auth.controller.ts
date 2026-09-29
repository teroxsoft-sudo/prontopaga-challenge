import type { Request, Response } from "express";
import { authenticate } from "../services/auth.service";

export function login(req: Request, res: Response): void {
  const { username, password } = req.body;

  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    !username.trim() ||
    !password
  ) {
    res.status(400).json({
      error: "Usuario y contraseña son obligatorios",
    });
    return;
  }

  const result = authenticate(username.trim(), password);

  if (!result) {
    res.status(401).json({
      error: "Credenciales inválidas",
    });
    return;
  }

  res.status(200).json(result);
}