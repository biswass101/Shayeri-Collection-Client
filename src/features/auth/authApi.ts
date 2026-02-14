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
      query: (body) => ({
        url: "/api/auth/register",
        method: "post",
        data: body,
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;
