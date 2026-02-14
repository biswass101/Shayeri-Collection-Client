import { Button } from "@/components/ui/button";
import { useUI } from "@/components/layout/UIContext";
import { NavLink } from "react-router-dom";
import {
  Shield,
  Clock,
  Download,
  Heart,
  Home,
  LayoutGrid,
  User,
} from "lucide-react";

type SidebarProps = {
  onToggle?: () => void;
  collapsed?: boolean;
  onAuthClick?: () => void;
};

export default function Sidebar({ onToggle, collapsed = true, onAuthClick }: SidebarProps) {
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
    <aside className={`sidebar${collapsed ? " sidebar-collapsed" : ""}`}>
      <div className="sidebar-top">
        <button className="icon-button" type="button" aria-label="Toggle menu" onClick={onToggle}>
          <span />
          <span />
          <span />
        </button>
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

      <div className="sidebar-auth">
        <div className="auth-bubble">
          <User size={16} />
        </div>
        <div className="auth-actions">
          <Button variant="ghost" size="sm" className="auth-text" onClick={onAuthClick}>
            {user?.name ?? "Authenticate"}
          </Button>
          {user ? (
            <Button
              variant="ghost"
              size="sm"
              className="auth-logout"
              onClick={clearAuthSession}
            >
              Logout
            </Button>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
