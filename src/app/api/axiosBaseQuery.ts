import axios, { AxiosError, AxiosRequestConfig } from "axios";

type AxiosQueryArgs = {
  url: string;
  method?: AxiosRequestConfig["method"];
  data?: AxiosRequestConfig["data"];
  params?: AxiosRequestConfig["params"];
  headers?: AxiosRequestConfig["headers"];
};

type AxiosBaseQueryConfig = {
  baseUrl?: string;
};

type AxiosBaseQueryError = {
  status?: number;
  data?: unknown;
};

export const axiosBaseQuery =
  ({ baseUrl = "" }: AxiosBaseQueryConfig = {}) =>
  async ({ url, method = "get", data, params, headers }: AxiosQueryArgs) => {
    try {
      const token = localStorage.getItem("sayeri_token");
      const result = await axios({
        url: `${baseUrl}${url}`,
        method,
        data,
        params,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...headers,
        },
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data ?? err.message,
        } satisfies AxiosBaseQueryError,
      };
    }
  };
