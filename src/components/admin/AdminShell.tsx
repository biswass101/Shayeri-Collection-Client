import { Link, Outlet } from "react-router-dom";
import { Bell, Home } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useUI } from "@/components/layout/UIContext";
import { cn } from "@/lib/utils";

export default function AdminShell() {
  const { isDark, toggleTheme } = useUI();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[256px_1fr]">
        <AdminSidebar />
        <div className="px-3 py-4 sm:px-4 lg:px-6 lg:py-5">
          <header className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-card px-3 py-3 shadow-sm ring-1 ring-border/40 sm:px-4">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <Link
                to="/"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "border-border bg-background text-foreground hover:bg-accent"
                )}
              >
                <Home size={16} className="mr-2" />
                Client Home
              </Link>
              <div className="rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold sm:px-4 sm:text-sm">
                Admin Control Center
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="border-border bg-background text-foreground">
                <Bell size={16} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-border bg-background text-foreground"
                onClick={toggleTheme}
              >
                {isDark ? "Light" : "Dark"}
              </Button>
            </div>
          </header>

          <Outlet />
        </div>
      </div>
    </div>
  );
}
