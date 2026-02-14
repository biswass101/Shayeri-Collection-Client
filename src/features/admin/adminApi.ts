import { baseApi } from "@/app/api/baseApi";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadVideo: builder.mutation<
      { success: boolean; data?: unknown },
      {
        title: string;
        description?: string;
        categoryId: string;
        isPublished: boolean;
        videoFile: File;
        thumbnailFile?: File | null;
      }
    >({
      query: ({ title, description, categoryId, isPublished, videoFile, thumbnailFile }) => {
        const formData = new FormData();
        formData.append("title", title);
        if (description) formData.append("description", description);
        formData.append("categoryId", categoryId);
        formData.append("isPublished", String(isPublished));
        formData.append("video", videoFile);
        if (thumbnailFile) {
          formData.append("thumbnail", thumbnailFile);
        }

        return {
          url: "/api/videos",
          method: "post",
          data: formData,
          headers: { "Content-Type": "multipart/form-data" },
        };
      },
    }),
    updateVideo: builder.mutation<
      { success: boolean; data?: unknown },
      {
        id: string;
        title: string;
        description: string;
        categoryId: string;
        isPublished: boolean;
        videoFile?: File | null;
        thumbnailFile?: File | null;
      }
    >({
      query: ({ id, title, description, categoryId, isPublished, videoFile, thumbnailFile }) => {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("categoryId", categoryId);
        formData.append("isPublished", String(isPublished));
        if (videoFile) {
          formData.append("video", videoFile);
        }
        if (thumbnailFile) {
          formData.append("thumbnail", thumbnailFile);
        }

        return {
          url: `/api/videos/${id}`,
          method: "put",
          data: formData,
          headers: { "Content-Type": "multipart/form-data" },
        };
      },
    }),
    deleteVideo: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/api/videos/${id}`,
        method: "delete",
      }),
    }),
    getDashboard: builder.query<
      {
        totals: {
          uploads: number;
          users: number;
          comments: number;
          shares: number;
          downloads: number;
          alerts: number;
        };
        trends: { labels: string[]; shares: number[]; downloads: number[] };
        categories: Array<{ label: string; value: number }>;
        engagement: { likes: number; shares: number; comments: number; downloads: number };
      },
      void
    >({
      query: () => ({
        url: "/api/admin/dashboard",
        method: "get",
      }),
      transformResponse: (response: { success: boolean; data?: any }) => response.data,
    }),
    createCategory: builder.mutation<
      { success: boolean; data?: unknown },
      { name: string; slug: string; description?: string }
    >({
      query: ({ name, slug, description }) => ({
        url: "/api/categories",
        method: "post",
        data: { name, slug, description },
      }),
    }),
    updateCategory: builder.mutation<
      { success: boolean; data?: unknown },
      { id: string; name?: string; slug?: string; description?: string }
    >({
      query: ({ id, ...payload }) => ({
        url: `/api/categories/${id}`,
        method: "put",
        data: payload,
      }),
    }),
    deleteCategory: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/api/categories/${id}`,
        method: "delete",
      }),
    }),
  }),
});

export const {
  useUploadVideoMutation,
  useUpdateVideoMutation,
  useDeleteVideoMutation,
  useGetDashboardQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = adminApi;
