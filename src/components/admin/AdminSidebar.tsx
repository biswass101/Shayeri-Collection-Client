import { NavLink } from "react-router-dom";
import { LayoutDashboard, Film, User, Tags } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUI } from "@/components/layout/UIContext";
import { useState } from "react";
import ProfileModal from "@/components/layout/ProfileModal";

const links = [
  { label: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Videos", to: "/admin/videos", icon: Film },
  { label: "Categories", to: "/admin/categories", icon: Tags },
];

export default function AdminSidebar() {
  const { user, clearAuthSession } = useUI();
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <aside className="fixed bottom-0 left-0 right-0 z-40 flex w-full max-h-[100dvh] flex-col gap-3 overflow-y-auto bg-card/70 p-3 shadow-[inset_0_1px_0_hsl(var(--border)/0.4)] backdrop-blur-xl lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:gap-0 lg:overflow-visible lg:p-5 lg:shadow-[inset_-1px_0_0_hsl(var(--border)/0.4)]">
      <div className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-foreground lg:mb-6 lg:text-sm">Admin</div>

      <nav className="flex flex-1 gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
        {links.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition lg:gap-3 lg:text-sm ${
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

      <div className="mt-1 hidden rounded-xl bg-background p-3 shadow-sm ring-1 ring-border/40 lg:mt-6 lg:block">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center overflow-hidden rounded-full bg-foreground text-background">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={user?.name ?? "User"} className="h-full w-full object-cover" />
            ) : (
              <User size={14} />
            )}
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">{user?.name ?? "Admin"}</div>
            <div className="text-xs text-muted-foreground">{user?.email}</div>
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
        <Button
          onClick={clearAuthSession}
          variant="outline"
          className="mt-2 h-8 w-full border-border bg-background text-xs text-foreground"
        >
          Logout
        </Button>
      </div>
      <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
    </aside>
  );
}
