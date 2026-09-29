export type UserRole = "admin" | "user";

export interface User {
  id: number;
  username: string;
  password: string;
  role: UserRole;
  rut?: string;
}

export interface JwtPayload {
  sub: string;
  role: UserRole;
  rut?: string;
}