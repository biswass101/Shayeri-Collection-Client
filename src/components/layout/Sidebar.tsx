import { Button } from "@/components/ui/button";
import { useUI } from "@/components/layout/UIContext";
import { NavLink } from "react-router-dom";
import { Shield, Clock, Download, Heart, Home, LayoutGrid, User, LogIn, LogOut } from "lucide-react";

type SidebarProps = {
  onAuthClick?: () => void;
};

export default function Sidebar({ onAuthClick }: SidebarProps) {
  const { user, clearAuthSession } = useUI();
  const menuItems = [
    { label: "Home", icon: Home, to: "/" },
    { label: "Shorts", icon: LayoutGrid, to: "/shorts" },
    { label: "History", icon: Clock, to: "/history" },
    { label: "Liked Videos", icon: Heart, to: "/liked" },
    { label: "Downloads", icon: Download, to: "/downloads" },
  ];
  const adminItems = user?.role === "admin" ? [{ label: "Admin Panel", icon: Shield, to: "/admin" }] : [];

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="brand">Sayeri</div>
      </div>

      <nav className="sidebar-menu">
        {menuItems.map(({ label, icon: Icon, to }) => (
          <NavLink
            key={label}
            to={to}
            className={({ isActive }) =>
              `sidebar-item${isActive ? " sidebar-item-active" : ""}`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
        {adminItems.map(({ label, icon: Icon, to }) => (
          <NavLink
            key={label}
            to={to}
            className={({ isActive }) =>
              `sidebar-item${isActive ? " sidebar-item-active" : ""}`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto rounded-xl bg-background p-3 shadow-sm ring-1 ring-border/40">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-full bg-foreground text-background">
            <User size={14} />
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">{user?.name ?? "Guest"}</div>
            <div className="text-xs text-muted-foreground">{user?.email ?? "Not signed in"}</div>
          </div>
        </div>
        {user ? (
          <Button
            onClick={clearAuthSession}
            variant="outline"
            className="mt-3 h-8 w-full border-border bg-background text-xs text-foreground"
          >
            <LogOut size={14} className="mr-2" />
            Logout
          </Button>
        ) : (
          <Button
            onClick={onAuthClick}
            variant="outline"
            className="mt-3 h-8 w-full border-border bg-background text-xs text-foreground"
          >
            <LogIn size={14} className="mr-2" />
            Authenticate
          </Button>
        )}
      </div>
    </aside>
  );
}
