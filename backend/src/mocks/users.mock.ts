import type { User } from "../types/user";

export const users: User[] = [
  {
    id: 1,
    username: "admin",
    password: "Admin123!",
    role: "admin",
  },
  {
    id: 2,
    username: "user",
    password: "User123!",
    role: "user",
    rut: "12345678-5",
  },
];