import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useUI } from "@/components/layout/UIContext";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, setAuthOpen, authReady } = useUI();

  useEffect(() => {
    if (authReady && !isAuthenticated) {
      setAuthOpen(true);
    }
  }, [authReady, isAuthenticated, setAuthOpen]);

  if (!authReady) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
