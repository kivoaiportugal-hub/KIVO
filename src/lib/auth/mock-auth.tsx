"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface User {
  id: string;
  email: string;
  full_name: string;
  restaurant_name: string;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error?: string }>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  signIn: async () => ({}),
  signUp: async () => ({}),
  signOut: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

const DEMO_USER: User = {
  id: "demo-user-001",
  email: "demo@kivo.ai",
  full_name: "João Silva",
  restaurant_name: "O Kivo Restaurante",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for session
    const stored = localStorage.getItem("kivo_session");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {}
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    // Accept any email + any password (demo mode)
    if (!email || !password) {
      return { error: "Email e password são obrigatórios" };
    }

    const newUser: User = {
      id: "user-" + Date.now(),
      email,
      full_name: email.split("@")[0],
      restaurant_name: "O Meu Restaurante",
    };

    setUser(newUser);
    localStorage.setItem("kivo_session", JSON.stringify(newUser));
    return {};
  };

  const signUp = async (email: string, password: string, name: string) => {
    if (!email || !password || !name) {
      return { error: "Todos os campos são obrigatórios" };
    }

    const newUser: User = {
      id: "user-" + Date.now(),
      email,
      full_name: name,
      restaurant_name: name + " Restaurante",
    };

    setUser(newUser);
    localStorage.setItem("kivo_session", JSON.stringify(newUser));
    return {};
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem("kivo_session");
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
