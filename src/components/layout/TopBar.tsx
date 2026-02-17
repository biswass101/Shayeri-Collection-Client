import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUI } from "@/components/layout/UIContext";
import ProfileModal from "@/components/layout/ProfileModal";
import { useGetNotificationsQuery, useMarkNotificationReadMutation } from "@/features/notifications/notificationApi";
import { Bell, Moon, Search, Sun, User, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

type TopBarProps = {
  searchValue: string;
  onSearchChange: (value: string) => void;
  isDark: boolean;
  onToggleTheme: () => void;
};

export default function TopBar({ searchValue, onSearchChange, isDark, onToggleTheme }: TopBarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const { isAuthenticated, setAuthOpen, user, clearAuthSession } = useUI();
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
    <>
      <div className="flex flex-wrap items-center gap-3 lg:flex-nowrap lg:gap-4">
      <div className="order-1 mr-auto flex items-center lg:hidden">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full border border-border bg-card"
            aria-label="Profile menu"
            onClick={() => {
              if (!isAuthenticated) {
                setAuthOpen(true);
                return;
              }
              setShowProfileMenu((prev) => !prev);
            }}
          >
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={user?.name ?? "User"} className="h-full w-full rounded-full object-cover" />
            ) : (
              <User size={18} />
            )}
          </Button>
          {showProfileMenu ? (
            <div className="absolute left-0 top-[calc(100%+10px)] z-30 w-40 rounded-xl border border-border bg-card p-2 shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
              <button
                type="button"
                className="w-full rounded-lg px-3 py-2 text-left text-sm transition hover:bg-accent"
                onClick={() => {
                  setShowProfileMenu(false);
                  setProfileOpen(true);
                }}
              >
                Edit Profile
              </button>
              <button
                type="button"
                className="w-full rounded-lg px-3 py-2 text-left text-sm text-destructive transition hover:bg-accent"
                onClick={() => {
                  setShowProfileMenu(false);
                  clearAuthSession();
                }}
              >
                Logout
              </button>
            </div>
          ) : null}
        </div>
      </div>
      <div
        className={`order-2 flex w-full min-w-0 flex-1 items-center gap-3 rounded-full bg-card px-4 py-1.5 shadow-[inset_0_0_0_1px_hsl(var(--border))] transition-[width,flex,opacity,transform] duration-300 ease-out sm:py-2 lg:order-none lg:w-auto ${
          isSearchActive ? "sm:w-auto" : ""
        }`}
      >
        <Search size={18} className="text-muted-foreground" />
        <Input
          className="h-7 border-0 bg-transparent px-0 text-sm shadow-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none sm:h-9"
          placeholder="Search Sayeri videos"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          onFocus={() => setIsSearchActive(true)}
        />
        <span className="ml-auto hidden rounded-lg border border-border bg-secondary px-2 py-0.5 text-xs font-semibold text-muted-foreground sm:inline-flex">
          /
        </span>
      </div>
      <div
        className={`order-1 ml-auto items-center gap-2 transition-[opacity,transform] duration-300 ease-out lg:ml-0 ${
          isSearchActive ? "hidden sm:flex sm:opacity-100 sm:translate-y-0" : "flex"
        }`}
      >
        <div className="relative">
          <Button
            variant="outline"
            size="icon"
            className="relative h-9 w-9 rounded-xl border-border bg-card sm:h-10 sm:w-10"
            aria-label="Notifications"
            onClick={() => {
              if (!isAuthenticated) {
                setAuthOpen(true);
                return;
              }
              setShowNotifications((prev) => !prev);
            }}
          >
            <Bell size={18} />
            {unreadCount > 0 ? (
              <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-foreground" />
            ) : null}
          </Button>
          {showNotifications ? (
            <div className="fixed left-2 top-2 z-30 w-[min(92vw,320px)] rounded-2xl border border-border bg-card p-3 shadow-[0_18px_40px_rgba(0,0,0,0.18)] sm:absolute sm:left-auto sm:right-0 sm:top-[calc(100%+12px)] sm:z-20 sm:w-64">
              <div className="mb-2 flex items-center justify-between gap-2">
                <div className="text-sm font-semibold">Notifications</div>
                <button
                  type="button"
                  aria-label="Close notifications"
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:bg-accent hover:text-foreground"
                  onClick={() => setShowNotifications(false)}
                >
                  <X size={14} />
                </button>
              </div>
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
          variant="ghost"
          size="icon"
          className="h-9 w-9 sm:h-10 sm:w-10"
          onClick={onToggleTheme}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </Button>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={`order-3 ml-auto h-9 text-xs transition-[opacity,transform] duration-300 ease-out sm:hidden ${
          isSearchActive ? "flex opacity-100 translate-y-0" : "hidden opacity-0 -translate-y-1"
        }`}
        onClick={() => {
          onSearchChange("");
          setIsSearchActive(false);
        }}
      >
        Cancel
      </Button>
      </div>
      <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
    </>
  );
}
