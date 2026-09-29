import jwt from "jsonwebtoken";
import { users } from "../mocks/users.mock";
import type { JwtPayload } from "../types/user";

const JWT_SECRET =
  process.env.JWT_SECRET ?? "development-secret-change-me";

export function authenticate(username: string, password: string) {
  const user = users.find(
    (item) =>
      item.username === username &&
      item.password === password,
  );

  if (!user) {
    return null;
  }

  const payload: JwtPayload = {
    sub: user.id.toString(),
    role: user.role,
  };

  if (user.role === "user" && user.rut) {
    payload.rut = user.rut;
  }

  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: "1h",
  });

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      ...(user.rut ? { rut: user.rut } : {}),
    },
  };
}