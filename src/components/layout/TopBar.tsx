import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Moon, Search, Sun } from "lucide-react";
import { useState } from "react";

type TopBarProps = {
  searchValue: string;
  onSearchChange: (value: string) => void;
  isDark: boolean;
  onToggleTheme: () => void;
};

export default function TopBar({ searchValue, onSearchChange, isDark, onToggleTheme }: TopBarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const notifications = [
    "Your playlist “Late Night Sayeri” is trending.",
    "New uploads from Sayeri Originals.",
    "Weekly recap is ready to watch.",
  ];

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
          onClick={() => setShowNotifications((prev) => !prev)}
        >
          <Bell size={18} />
          <span className="notification-dot" />
        </Button>
        {showNotifications ? (
          <div className="notification-panel">
            <div className="notification-title">Notifications</div>
            <ul className="notification-list">
              {notifications.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
      <Button variant="ghost" size="icon" className="theme-toggle" onClick={onToggleTheme}>
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </Button>
    </div>
  );
}
