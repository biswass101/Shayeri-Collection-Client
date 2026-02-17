import { Link, Outlet, useNavigate } from "react-router-dom";
import { Bell, Home, LogIn, LogOut } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useUI } from "@/components/layout/UIContext";
import { cn } from "@/lib/utils";
import { useGetNotificationsQuery, useMarkNotificationReadMutation } from "@/features/notifications/notificationApi";
import { useMemo, useState } from "react";

export default function AdminShell() {
  const { isDark, toggleTheme, user, clearAuthSession } = useUI();
  const [showNotifications, setShowNotifications] = useState(false);
  const { isAuthenticated, setAuthOpen } = useUI();
  const navigate = useNavigate();
  const { data: notifications = [], isLoading, isError } = useGetNotificationsQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [markRead] = useMarkNotificationReadMutation();

  const unreadCount = useMemo(
    () => notifications.filter((note) => !note.isRead).length,
    [notifications]
  );

  const handleNotificationClick = async (note: (typeof notifications)[number]) => {
    if (!note.isRead) {
      await markRead(note.id);
    }
    if (note.videoId) {
      navigate(`/watch/${note.videoId}`);
    }
    setShowNotifications(false);
  };

  const handleMarkRead = async (note: (typeof notifications)[number]) => {
    if (!note.isRead) {
      await markRead(note.id);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground lg:h-screen">
      <div className="grid min-h-screen grid-cols-1 lg:h-screen lg:grid-cols-[256px_1fr]">
        <AdminSidebar />
        <div className="w-full min-w-0 px-3 pt-4 pb-24 sm:px-4 sm:pt-5 sm:pb-12 lg:h-screen lg:overflow-y-auto lg:px-6 lg:py-5">
          <header className="mb-5 flex w-full min-w-0 flex-row flex-nowrap items-center justify-between gap-2 rounded-xl bg-card px-3 py-3 shadow-sm ring-1 ring-border/40 sm:px-4">
            <div className="flex w-auto flex-nowrap items-center gap-2 sm:gap-3">
              <Link
                to="/"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "border-border bg-background text-foreground hover:bg-accent"
                )}
                aria-label="Client Home"
              >
                <Home size={16} className="mr-2" />
                <span className="hidden sm:inline">Client Home</span>
              </Link>
            </div>

            <div className="flex w-auto flex-nowrap items-center justify-end gap-2 sm:ml-auto">
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-9 border-border bg-background p-0 text-xs lg:hidden sm:w-auto sm:px-3"
                onClick={() => (user ? clearAuthSession() : setAuthOpen(true))}
                aria-label={user ? "Logout" : "Authenticate"}
              >
                {user ? <LogOut size={14} className="sm:mr-2" /> : <LogIn size={14} className="sm:mr-2" />}
                <span className="hidden sm:inline">{user ? "Logout" : "Authenticate"}</span>
              </Button>
              <div className="relative">
                <Button
                  variant="outline"
                  size="icon"
                  className="relative h-9 w-9 rounded-xl border-border bg-background text-foreground sm:h-10 sm:w-10"
                  aria-label="Notifications"
                  onClick={() => {
                    if (!isAuthenticated) {
                      setAuthOpen(true);
                      return;
                    }
                    setShowNotifications((prev) => !prev);
                  }}
                >
                  <Bell size={16} />
                  {unreadCount > 0 ? (
                    <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-foreground" />
                  ) : null}
                </Button>
                {showNotifications ? (
                  <div className="absolute -right-2 top-[calc(100%+12px)] z-20 w-[min(92vw,320px)] rounded-2xl border border-border bg-card p-3 shadow-[0_18px_40px_rgba(0,0,0,0.18)] sm:right-0 sm:w-64">
                    <div className="mb-2 text-sm font-semibold">Notifications</div>
                    {isLoading ? (
                      <div className="px-2 py-1 text-xs text-muted-foreground">Loading notifications...</div>
                    ) : isError ? (
                      <div className="px-2 py-1 text-xs text-muted-foreground">Could not load notifications.</div>
                    ) : notifications.length === 0 ? (
                      <div className="px-2 py-1 text-xs text-muted-foreground">No notifications yet.</div>
                    ) : (
                      <ul className="grid max-h-60 list-none gap-2 overflow-y-auto p-0 text-xs text-muted-foreground">
                        {notifications.map((note) => (
                          <li
                            key={note.id}
                            className={`cursor-pointer rounded-lg p-2 text-foreground transition hover:bg-accent ${
                              note.isRead ? "bg-secondary" : "border border-border bg-card"
                            }`}
                            onClick={() => handleNotificationClick(note)}
                          >
                            <div className="text-sm font-semibold">{note.title}</div>
                            {note.body ? <div className="text-xs text-muted-foreground">{note.body}</div> : null}
                            <div className="mt-1 flex items-center justify-between gap-2">
                              <div className="text-[0.7rem] text-muted-foreground">{note.time}</div>
                              <button
                                type="button"
                                className="text-[0.7rem] text-muted-foreground transition hover:text-foreground"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleMarkRead(note);
                                }}
                              >
                                {note.isRead ? "Read" : "Mark as read"}
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : null}
              </div>
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
