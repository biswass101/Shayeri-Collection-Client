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
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
};

const UIContext = createContext<UIContextValue | null>(null);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", isDark);
  }, [isDark]);

  useEffect(() => {
    const storedToken = localStorage.getItem("sayeri_token");
    const storedUser = localStorage.getItem("sayeri_user");
    const storedSidebar = localStorage.getItem("sayeri_sidebar_collapsed");
    if (storedToken && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("sayeri_user");
      }
    }
    if (storedSidebar !== null) {
      setSidebarCollapsed(storedSidebar === "true");
    }
    setAuthReady(true);
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
      sidebarCollapsed,
      toggleSidebar: () =>
        setSidebarCollapsed((prev) => {
          const next = !prev;
          localStorage.setItem("sayeri_sidebar_collapsed", String(next));
          return next;
        }),
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
