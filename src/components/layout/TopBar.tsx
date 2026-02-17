import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUI } from "@/components/layout/UIContext";
import { useGetNotificationsQuery, useMarkNotificationReadMutation } from "@/features/notifications/notificationApi";
import { Bell, Moon, Search, Sun } from "lucide-react";
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
    <div className="content-top">
      <div className="search-bar">
        <Search size={18} className="search-icon" />
        <Input
          className="border-0 bg-transparent px-0 text-sm shadow-none focus-visible:ring-0"
          placeholder="Search Sayeri videos"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
        />
        <span className="search-hint">/</span>
      </div>
      <div className="notification-wrap">
        <Button
          variant="outline"
          size="icon"
          className="notification-button"
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
      <Button variant="ghost" size="icon" className="theme-toggle" onClick={onToggleTheme}>
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </Button>
    </div>
  );
}
