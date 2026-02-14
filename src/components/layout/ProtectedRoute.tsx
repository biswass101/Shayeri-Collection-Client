import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useUI } from "@/components/layout/UIContext";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, setAuthOpen } = useUI();

  useEffect(() => {
    if (!isAuthenticated) {
      setAuthOpen(true);
    }
  }, [isAuthenticated, setAuthOpen]);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
