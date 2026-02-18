import { baseApi } from "@/app/api/baseApi";
import type { AuthUser } from "@/features/auth/authTypes";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateUserProfile: builder.mutation<
      { success: boolean; data?: AuthUser },
      { id: string; name?: string; email?: string; avatarFile?: File | null }
    >({
      query: ({ id, name, avatarFile }) => {
        if (avatarFile) {
          const formData = new FormData();
          if (name) formData.append("name", name);
          formData.append("avatar", avatarFile);
          return {
            url: `/api/users/${id}`,
            method: "put",
            data: formData,
          };
        }
        return {
          url: `/api/users/${id}`,
          method: "put",
          data: {
            ...(name ? { name } : {}),
          },
        };
      },
      transformResponse: (response: { success: boolean; data?: any }) => {
        const user = response?.data;
        if (!user) return { success: false };
        return {
          success: true,
          data: {
            id: String(user.id),
            email: user.email,
            name: user.name,
            avatarUrl: user.avatarUrl ?? null,
            role: user.role,
          },
        };
      },
    }),
  }),
});

export const { useUpdateUserProfileMutation } = userApi;
