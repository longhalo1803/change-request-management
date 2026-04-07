import axiosInstance from "@/lib/axios";
import type { ApiResponse } from "@/lib/types";
import type { User } from "@/lib/types";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface RefreshTokenResponse {
  accessToken: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await axiosInstance.post<ApiResponse<LoginResponse>>(
      "/auth/login",
      credentials
    );
    return response.data.data;
  },

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const response = await axiosInstance.post<
      ApiResponse<RefreshTokenResponse>
    >("/auth/refresh", { refreshToken });
    return response.data.data;
  },

  async logout(refreshToken: string): Promise<void> {
    await axiosInstance.post("/auth/logout", { refreshToken });
  },

  async getCurrentUser(): Promise<User> {
    const response = await axiosInstance.get<ApiResponse<User>>("/auth/me");
    return response.data.data;
  },
};
