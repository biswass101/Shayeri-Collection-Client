import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { AuthUser } from "@/features/auth/authTypes";

type UIContextValue = {
  isDark: boolean;
  toggleTheme: () => void;
  authOpen: boolean;
  setAuthOpen: (open: boolean) => void;
  isAuthenticated: boolean;
  authReady: boolean;
  setAuthSession: (user: AuthUser, token: string) => void;
  clearAuthSession: () => void;
  user: AuthUser | null;
};

const UIContext = createContext<UIContextValue | null>(null);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", isDark);
  }, [isDark]);

  useEffect(() => {
    const storedToken = localStorage.getItem("sayeri_token");
    const storedUser = localStorage.getItem("sayeri_user");
    if (storedToken && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("sayeri_user");
      }
    }
    setAuthReady(true);
  }, []);

  useEffect(() => {
    const handleAuthExpired = () => {
      localStorage.removeItem("sayeri_token");
      localStorage.removeItem("sayeri_user");
      setUser(null);
    };
    window.addEventListener("sayeri:auth-expired", handleAuthExpired);
    return () => {
      window.removeEventListener("sayeri:auth-expired", handleAuthExpired);
    };
  }, []);

  const value = useMemo(
    () => ({
      isDark,
      toggleTheme: () => setIsDark((prev) => !prev),
      authOpen,
      setAuthOpen,
      isAuthenticated: Boolean(user),
      authReady,
      user,
      setAuthSession: (nextUser: AuthUser, token: string) => {
        localStorage.setItem("sayeri_token", token);
        localStorage.setItem("sayeri_user", JSON.stringify(nextUser));
        setUser(nextUser);
      },
      clearAuthSession: () => {
        localStorage.removeItem("sayeri_token");
        localStorage.removeItem("sayeri_user");
        setUser(null);
      },
    }),
    [isDark, authOpen, user]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) {
    throw new Error("useUI must be used within UIProvider");
  }
  return ctx;
}
