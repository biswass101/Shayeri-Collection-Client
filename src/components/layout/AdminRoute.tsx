import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useUI } from "@/components/layout/UIContext";
import { useToast } from "@/components/ui/use-toast";

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, setAuthOpen } = useUI();
  const { addToast } = useToast();

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (!isAuthenticated) {
      setAuthOpen(true);
      return;
    }

    if (!isAdmin) {
      addToast({
        title: "Access denied",
        description: "Admin role is required to view admin pages.",
        variant: "destructive",
      });
    }
  }, [isAuthenticated, isAdmin, setAuthOpen, addToast]);

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
