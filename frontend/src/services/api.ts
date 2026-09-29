import type {
  ApiError,
  LoginResponse,
  ScoreResponse,
} from "../types";

const API_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:3000";

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, options);

  if (!response.ok) {
    let message = "Ocurrió un error inesperado";

    try {
      const data = (await response.json()) as ApiError;

      if (data.error) {
        message = data.error;
      }
    } catch {
      // Se conserva el mensaje genérico.
    }

    throw new Error(message);
  }

  return (await response.json()) as T;
}

export function login(
  username: string,
  password: string,
): Promise<LoginResponse> {
  return request<LoginResponse>("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });
}

export function getScore(
  rut: string,
  token: string,
): Promise<ScoreResponse> {
  return request<ScoreResponse>(
    `/score/${encodeURIComponent(rut)}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
}