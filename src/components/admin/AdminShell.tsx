import { Link, Outlet, useNavigate } from "react-router-dom";
import { Bell, Home } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useUI } from "@/components/layout/UIContext";
import { cn } from "@/lib/utils";
import { useGetNotificationsQuery, useMarkNotificationReadMutation } from "@/features/notifications/notificationApi";
import { useMemo, useState } from "react";

export default function AdminShell() {
  const { isDark, toggleTheme } = useUI();
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
              <div className="notification-wrap">
                <Button
                  variant="outline"
                  size="icon"
                  className="notification-button border-border bg-background text-foreground"
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
                  {unreadCount > 0 ? <span className="notification-dot" /> : null}
                </Button>
                {showNotifications ? (
                  <div className="notification-panel">
                    <div className="notification-title">Notifications</div>
                    {isLoading ? (
                      <div className="notification-empty">Loading notifications...</div>
                    ) : isError ? (
                      <div className="notification-empty">Could not load notifications.</div>
                    ) : notifications.length === 0 ? (
                      <div className="notification-empty">No notifications yet.</div>
                    ) : (
                      <ul className="notification-list">
                        {notifications.map((note) => (
                          <li
                            key={note.id}
                            className={`notification-item${note.isRead ? "" : " unread"}`}
                            onClick={() => handleNotificationClick(note)}
                          >
                            <div className="notification-item-title">{note.title}</div>
                            {note.body ? <div className="notification-item-body">{note.body}</div> : null}
                            <div className="notification-item-footer">
                              <div className="notification-meta">{note.time}</div>
                              <button
                                type="button"
                                className="notification-mark"
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
