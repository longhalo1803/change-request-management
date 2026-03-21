import axiosInstance from '@/lib/axios';
import type { ApiResponse } from '@/lib/types/api.types';
import type { User } from '@/lib/types/cr.types';

/**
 * Auth Service
 * 
 * API calls for authentication
 * 
 * SOLID Principles:
 * - Single Responsibility: Only handles auth API calls
 * - Dependency Inversion: Depends on axios abstraction
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

export const authService = {
  /**
   * Login with email and password
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
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
    await axiosInstance.post('/auth/logout', { refreshToken });
  },

  /**
   * Get current user info
   */
  async getCurrentUser(): Promise<User> {
    const response = await axiosInstance.get<ApiResponse<User>>('/auth/me');
    return response.data.data;
  }
};
