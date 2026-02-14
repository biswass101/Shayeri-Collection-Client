import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { AuthUser } from "@/features/auth/authTypes";

type UIContextValue = {
  isDark: boolean;
  toggleTheme: () => void;
  authOpen: boolean;
  setAuthOpen: (open: boolean) => void;
  isAuthenticated: boolean;
  setAuthSession: (user: AuthUser, token: string) => void;
  clearAuthSession: () => void;
  user: AuthUser | null;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
};

const UIContext = createContext<UIContextValue | null>(null);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

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
  }, []);

  const value = useMemo(
    () => ({
      isDark,
      toggleTheme: () => setIsDark((prev) => !prev),
      authOpen,
      setAuthOpen,
      isAuthenticated: Boolean(user),
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
      sidebarCollapsed,
      toggleSidebar: () => setSidebarCollapsed((prev) => !prev),
    }),
    [isDark, authOpen, user, sidebarCollapsed]
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
