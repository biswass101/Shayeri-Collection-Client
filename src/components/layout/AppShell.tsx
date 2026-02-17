import { Outlet, useLocation } from "react-router-dom";
import AuthModal from "@/components/auth/AuthModal";
import Sidebar from "@/components/layout/Sidebar";
import { useUI } from "@/components/layout/UIContext";

export default function AppShell() {
  const { authOpen, setAuthOpen, setAuthSession } = useUI();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-transparent text-foreground">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[240px_1fr]">
        <Sidebar onAuthClick={() => setAuthOpen(true)} />
        <main className="px-4 pt-4 pb-24 sm:px-6 sm:pt-5 sm:pb-12 lg:px-8 lg:py-6">
          <div key={location.pathname} className="page-enter">
            <Outlet />
          </div>
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
