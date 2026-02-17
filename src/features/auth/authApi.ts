import { baseApi } from "@/app/api/baseApi";
import type { AuthResponse, LoginRequest, RegisterRequest } from "./authTypes";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (body) => ({
        url: "/api/auth/login",
        method: "post",
        data: body,
      }),
    }),
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (body) => {
        const formData = new FormData();
        formData.append("name", body.name);
        formData.append("email", body.email);
        formData.append("password", body.password);
        if (body.avatarFile) {
          formData.append("avatar", body.avatarFile);
        }
        return {
          url: "/api/auth/register",
          method: "post",
          data: formData,
        };
      },
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;
