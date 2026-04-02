import axiosInstance from "@/lib/axios";
import type { ApiResponse } from "@/lib/types";
import type { User } from "@/lib/types";
import { appConfig } from "@/config/app.config";
import { authServiceMock } from "./auth.service.mock";

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

const useMock = appConfig.useMockServices;

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    if (useMock) {
      return authServiceMock.login(credentials);
    }

    const response = await axiosInstance.post<ApiResponse<LoginResponse>>(
      "/auth/login",
      credentials,
    );
    return response.data.data;
  },

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    if (useMock) {
      return authServiceMock.refreshToken(refreshToken);
    }

    const response = await axiosInstance.post<
      ApiResponse<RefreshTokenResponse>
    >("/auth/refresh", { refreshToken });
    return response.data.data;
  },

  async logout(refreshToken: string): Promise<void> {
    if (useMock) {
      return authServiceMock.logout(refreshToken);
    }

    await axiosInstance.post("/auth/logout", { refreshToken });
  },

  async getCurrentUser(): Promise<User> {
    if (useMock) {
      return authServiceMock.getCurrentUser();
    }

    const response = await axiosInstance.get<ApiResponse<User>>("/auth/me");
    return response.data.data;
  },
};
