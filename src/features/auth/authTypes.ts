export type AuthUser = {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string | null;
  role: string;
};

export type AuthResponse = {
  success: boolean;
  message: string;
  data: {
    user: AuthUser;
    token: string;
  };
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
  avatarFile?: File | null;
};
