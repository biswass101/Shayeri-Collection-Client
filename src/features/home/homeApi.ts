import { baseApi } from "@/app/api/baseApi";
import type { Category, Video, CommentItem } from "./homeTypes";

type CategoriesResponse = {
  success: boolean;
  data: Array<{
    id: number;
    name: string;
    slug: string;
    description?: string | null;
  }>;
};

type VideoItem = {
  id: number;
  title: string;
  description?: string | null;
  categoryId: number;
  category?: {
    id: number;
    name: string;
    slug: string;
  } | null;
  thumbnailUrl?: string | null;
  durationSeconds?: number | null;
  viewsCount?: number | null;
  likesCount?: number | null;
  createdAt?: string;
  videoUrl?: string | null;
  hlsUrl?: string | null;
};

type VideosResponse = {
  success: boolean;
  data: VideoItem[];
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
};

type CommentEntity = {
  id: number;
  body: string;
  createdAt: string;
  userId: number;
  user?: { name?: string | null } | null;
  replies?: CommentEntity[];
};

type CommentResponse = {
  success: boolean;
  data: CommentEntity[];
};

type CommentCreateResponse = {
  success: boolean;
  data?: CommentEntity;
};

const formatViews = (views?: number | null) => {
  const value = views ?? 0;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M views`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K views`;
  return `${value} views`;
};

const formatDuration = (seconds?: number | null) => {
  const total = Math.max(0, Math.floor(seconds ?? 0));
  const hrs = Math.floor(total / 3600);
  const mins = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  if (hrs > 0) return `${hrs}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  return `${mins}:${String(secs).padStart(2, "0")}`;
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

const mapVideo = (video: VideoItem): Video => ({
  id: String(video.id),
  title: video.title,
  subtitle: video.description ?? `${video.category?.name ?? "Video"} · Sayeri`,
  thumbnailLabel: video.category?.name ?? "Video",
  categoryId: String(video.categoryId),
  categorySlug: video.category?.slug ?? "",
  views: formatViews(video.viewsCount ?? 0),
  uploaded: formatRelative(video.createdAt),
  duration: formatDuration(video.durationSeconds),
  thumbnailUrl: video.thumbnailUrl ?? undefined,
  hlsUrl: video.hlsUrl ?? undefined,
  videoUrl: video.videoUrl ?? undefined,
  likesCount: video.likesCount ?? 0,
});

const mapComment = (comment: CommentEntity): CommentItem => ({
  id: String(comment.id),
  body: comment.body,
  createdAt: comment.createdAt,
  userName: comment.user?.name ?? "User",
  userId: String(comment.userId),
  replies: comment.replies ? comment.replies.map(mapComment) : [],
});

export const homeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], void>({
      query: () => ({
        url: "/api/categories",
        method: "get",
      }),
      transformResponse: (response: CategoriesResponse) =>
        response.data.map((category) => ({
          id: String(category.id),
          name: category.name,
          slug: category.slug,
        })),
    }),
    getVideos: builder.query<Video[], void>({
      query: () => ({
        url: "/api/videos",
        method: "get",
        params: { limit: 50 },
      }),
      transformResponse: (response: VideosResponse) => response.data.map(mapVideo),
    }),
    getVideoById: builder.query<Video | null, string>({
      query: (id) => ({
        url: `/api/videos/${id}`,
        method: "get",
      }),
      transformResponse: (response: { success: boolean; data?: VideoItem }) =>
        response?.data ? mapVideo(response.data) : null,
    }),
    incrementVideoView: builder.mutation<{ success: boolean; data?: { id: number; viewsCount: number } }, string>({
      query: (id) => ({
        url: `/api/videos/${id}/views`,
        method: "post",
      }),
    }),
    likeVideo: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/api/videos/${id}/likes`,
        method: "post",
      }),
    }),
    unlikeVideo: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/api/videos/${id}/likes`,
        method: "delete",
      }),
    }),
    getLikeStatus: builder.query<{ liked: boolean }, string>({
      query: (id) => ({
        url: `/api/videos/${id}/likes/me`,
        method: "get",
      }),
      transformResponse: (response: { success: boolean; data?: { liked: boolean } }) => ({
        liked: Boolean(response?.data?.liked),
      }),
    }),
    getComments: builder.query<CommentItem[], string>({
      query: (id) => ({
        url: `/api/videos/${id}/comments`,
        method: "get",
      }),
      transformResponse: (response: CommentResponse) => response.data.map(mapComment),
    }),
    addComment: builder.mutation<CommentItem, { id: string; body: string; parentId?: string }>(
      {
        query: ({ id, body, parentId }) => ({
          url: `/api/videos/${id}/comments`,
          method: "post",
          data: { body, parentId },
        }),
        transformResponse: (response: CommentCreateResponse) =>
          response?.data ? mapComment(response.data) : { id: "", body: "", createdAt: "", userName: "" },
      }
    ),
    updateComment: builder.mutation<CommentItem, { id: string; body: string }>(
      {
        query: ({ id, body }) => ({
          url: `/api/comments/${id}`,
          method: "put",
          data: { body },
        }),
        transformResponse: (response: CommentCreateResponse) =>
          response?.data ? mapComment(response.data) : { id: "", body: "", createdAt: "", userName: "" },
      }
    ),
    deleteComment: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/api/comments/${id}`,
        method: "delete",
      }),
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetVideosQuery,
  useGetVideoByIdQuery,
  useIncrementVideoViewMutation,
  useLikeVideoMutation,
  useUnlikeVideoMutation,
  useGetLikeStatusQuery,
  useGetCommentsQuery,
  useAddCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} = homeApi;
