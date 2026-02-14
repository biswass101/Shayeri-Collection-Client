import { baseApi } from "@/app/api/baseApi";
import type { NotificationItem } from "./notificationTypes";

type NotificationEntity = {
  id: number;
  title: string;
  body?: string | null;
  isRead: boolean;
  createdAt: string;
  type: string;
  videoId?: number | null;
};

type NotificationsResponse = {
  success: boolean;
  data: NotificationEntity[];
};

const formatRelative = (isoDate?: string) => {
  if (!isoDate) return "Just now";
  const date = new Date(isoDate);
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} months ago`;
  const years = Math.floor(months / 12);
  return `${years} years ago`;
};

const mapNotification = (note: NotificationEntity): NotificationItem => ({
  id: String(note.id),
  title: note.title,
  body: note.body ?? null,
  isRead: note.isRead,
  createdAt: note.createdAt,
  time: formatRelative(note.createdAt),
  type: note.type,
  videoId: note.videoId ? String(note.videoId) : null,
});

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<NotificationItem[], void>({
      query: () => ({
        url: "/api/notifications",
        method: "get",
      }),
      transformResponse: (response: NotificationsResponse) => response.data.map(mapNotification),
      providesTags: ["Notifications"],
    }),
    markNotificationRead: builder.mutation<{ success: boolean; data?: NotificationEntity }, string>({
      query: (id) => ({
        url: `/api/notifications/${id}/read`,
        method: "put",
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const { useGetNotificationsQuery, useMarkNotificationReadMutation } = notificationApi;
