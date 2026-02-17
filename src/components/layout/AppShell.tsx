import { Outlet } from "react-router-dom";
import AuthModal from "@/components/auth/AuthModal";
import Sidebar from "@/components/layout/Sidebar";
import { useUI } from "@/components/layout/UIContext";

export default function AppShell() {
  const { authOpen, setAuthOpen, setAuthSession } = useUI();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="page-grid">
        <Sidebar onAuthClick={() => setAuthOpen(true)} />
        <main className="content">
          <Outlet />
        </main>
      </div>
      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onAuthenticated={setAuthSession}
      />
    </div>
  );
}
