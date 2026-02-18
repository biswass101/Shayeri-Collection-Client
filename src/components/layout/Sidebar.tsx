import { Button } from "@/components/ui/button";
import { useUI } from "@/components/layout/UIContext";
import { useState } from "react";
import ProfileModal from "@/components/layout/ProfileModal";
import { NavLink } from "react-router-dom";
import { Shield, Clock, Download, Heart, Home, LayoutGrid, User, LogIn, LogOut } from "lucide-react";

type SidebarProps = {
  onAuthClick?: () => void;
};

export default function Sidebar({ onAuthClick }: SidebarProps) {
  const { user, clearAuthSession } = useUI();
  const [profileOpen, setProfileOpen] = useState(false);
  const menuItems = [
    { label: "Home", icon: Home, to: "/" },
    { label: "Shorts", icon: LayoutGrid, to: "/shorts" },
    { label: "History", icon: Clock, to: "/history" },
    { label: "Liked Videos", icon: Heart, to: "/liked" },
    { label: "Downloads", icon: Download, to: "/downloads" },
  ];
  const adminItems = user?.role === "admin" ? [{ label: "Admin Panel", icon: Shield, to: "/admin" }] : [];

  return (
    <aside className="fixed bottom-0 left-0 right-0 z-40 flex h-auto w-full max-h-[100dvh] flex-col gap-3 self-start overflow-y-auto border-t border-border/60 bg-background/75 px-3 py-3 backdrop-blur-xl lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:w-60 lg:gap-6 lg:overflow-visible lg:border-t-0 lg:border-b-0 lg:border-r lg:bg-secondary/75 lg:px-5 lg:py-6">
      <div className="flex items-center gap-3">
        <div className="text-sm font-bold uppercase tracking-[0.4px] text-foreground lg:text-base">
          Sayeri
        </div>
      </div>

      <nav className="flex w-full flex-row gap-2 overflow-x-auto pb-1 lg:flex-1 lg:flex-col lg:overflow-visible lg:pb-0">
        {menuItems.map(({ label, icon: Icon, to }) => (
          <NavLink
            key={label}
            to={to}
            className={({ isActive }) =>
              `flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition lg:w-full lg:gap-3 lg:text-sm ${
                isActive
                  ? "bg-foreground text-background"
                  : "text-foreground hover:bg-accent"
              }`
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
              `flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition lg:w-full lg:gap-3 lg:text-sm ${
                isActive
                  ? "bg-foreground text-background"
                  : "text-foreground hover:bg-accent"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto hidden rounded-xl bg-background p-3 shadow-sm ring-1 ring-border/40 lg:block">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center overflow-hidden rounded-full bg-foreground text-background">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={user?.name ?? "User"} className="h-full w-full object-cover" />
            ) : (
              <User size={14} />
            )}
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">{user?.name ?? "Guest"}</div>
            <div className="truncate text-xs text-muted-foreground">{user?.email ?? "Not signed in"}</div>
          </div>
        </div>
        {user ? (
          <Button
            onClick={() => setProfileOpen(true)}
            variant="outline"
            className="mt-3 h-8 w-full border-border bg-background text-xs text-foreground"
          >
            Edit Profile
          </Button>
        ) : null}
        {user ? (
          <Button
            onClick={clearAuthSession}
            variant="outline"
            className="mt-2 h-8 w-full border-border bg-background text-xs text-foreground"
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
      <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
    </aside>
  );
}
