import axiosInstance from '@/lib/axios';
import type { ApiResponse } from '@/lib/types/api.types';
import type { User } from '@/lib/types/cr.types';
import { appConfig } from '@/config/app.config';
import { authServiceMock } from './auth.service.mock';

/**
 * Auth Service
 * 
 * API calls for authentication
 * Automatically switches between real API and mock based on config
 * 
 * SOLID Principles:
 * - Single Responsibility: Only handles auth API calls
 * - Dependency Inversion: Depends on axios abstraction
 * - Open/Closed: Easy to switch between mock and real service
 */

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

// Use mock service if configured
const useMock = appConfig.useMockServices;

export const authService = {
  /**
   * Login with email and password
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    if (useMock) {
      return authServiceMock.login(credentials);
    }

    const response = await axiosInstance.post<ApiResponse<LoginResponse>>(
      '/auth/login',
      credentials
    );
    return response.data.data;
  },

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    if (useMock) {
      return authServiceMock.refreshToken(refreshToken);
    }

    const response = await axiosInstance.post<ApiResponse<RefreshTokenResponse>>(
      '/auth/refresh',
      { refreshToken }
    );
    return response.data.data;
  },

  /**
   * Logout (revoke refresh token)
   */
  async logout(refreshToken: string): Promise<void> {
    if (useMock) {
      return authServiceMock.logout(refreshToken);
    }

    await axiosInstance.post('/auth/logout', { refreshToken });
  },

  /**
   * Get current user info
   */
  async getCurrentUser(): Promise<User> {
    if (useMock) {
      return authServiceMock.getCurrentUser();
    }

    const response = await axiosInstance.get<ApiResponse<User>>('/auth/me');
    return response.data.data;
  }
};
