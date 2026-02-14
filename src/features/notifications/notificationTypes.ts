export type NotificationItem = {
  id: string;
  title: string;
  body?: string | null;
  isRead: boolean;
  createdAt: string;
  time: string;
  type: string;
  videoId?: string | null;
};
