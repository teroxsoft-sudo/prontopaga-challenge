export type UserRole = "admin" | "user";

export interface User {
  id: number;
  username: string;
  role: UserRole;
  rut?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface ScoreResponse {
  rut: string;
  score: number;
  fecha: string;
}

export interface ApiError {
  error: string;
}