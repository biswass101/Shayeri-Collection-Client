import { NavLink } from "react-router-dom";
import { LayoutDashboard, Film, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUI } from "@/components/layout/UIContext";

const links = [
  { label: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Videos", to: "/admin/videos", icon: Film },
];

export default function AdminSidebar() {
  const { user, clearAuthSession } = useUI();

  return (
    <aside className="flex min-h-screen w-64 flex-col bg-card/80 p-5 shadow-[inset_-1px_0_0_hsl(var(--border)/0.4)]">
      <div className="mb-6 text-sm font-bold uppercase tracking-[0.2em] text-foreground">Admin</div>

      <nav className="flex flex-1 flex-col gap-2">
        {links.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-foreground text-background"
                  : "text-foreground hover:bg-muted"
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-6 rounded-xl bg-background p-3 shadow-sm ring-1 ring-border/40">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-full bg-foreground text-background">
            <User size={14} />
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">{user?.name ?? "Admin"}</div>
            <div className="text-xs text-muted-foreground">{user?.email}</div>
          </div>
        </div>
        <Button
          onClick={clearAuthSession}
          variant="outline"
          className="mt-3 h-8 w-full border-border bg-background text-xs text-foreground"
        >
          Logout
        </Button>
      </div>
    </aside>
  );
}
