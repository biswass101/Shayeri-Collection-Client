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
  }),
});

export const { useUploadVideoMutation } = adminApi;
