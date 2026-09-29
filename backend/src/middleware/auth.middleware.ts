import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "../types/user";

const JWT_SECRET =
  process.env.JWT_SECRET ?? "development-secret-change-me";

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    res.status(401).json({
      error: "Token de autenticación requerido",
    });
    return;
  }

  const token = authorization.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded === "string") {
      res.status(401).json({
        error: "Token inválido",
      });
      return;
    }

    req.user = decoded as unknown as JwtPayload;

    next();
  } catch {
    res.status(401).json({
      error: "Token inválido o expirado",
    });
  }
}