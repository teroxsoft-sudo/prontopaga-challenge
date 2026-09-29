import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type { User } from "../types";

interface AuthContextType {
  token: string | null;
  user: User | null;
  setSession: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [token, setToken] = useState<string | null>(() =>
    sessionStorage.getItem("token"),
  );

  const [user, setUser] = useState<User | null>(() => {
    const storedUser = sessionStorage.getItem("user");

    if (!storedUser) return null;

    try {
      return JSON.parse(storedUser) as User;
    } catch {
      return null;
    }
  });

  function setSession(newToken: string, newUser: User) {
    sessionStorage.setItem("token", newToken);
    sessionStorage.setItem("user", JSON.stringify(newUser));

    setToken(newToken);
    setUser(newUser);
  }

  function logout() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        setSession,
        logout,
        isAuthenticated: Boolean(token && user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth debe utilizarse dentro de AuthProvider",
    );
  }

  return context;
}