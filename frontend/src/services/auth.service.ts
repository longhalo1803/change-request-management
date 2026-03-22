// import axiosInstance from '@/lib/axios';
// import type { ApiResponse } from '@/lib/types/api.types';
import { UserRole } from '@/lib/types/cr.types';
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
   * Login with email and password (MOCKED FOR TESTING)
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    // Mock network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock response to bypass database for now
    return {
      user: {
        id: 'mock-admin-id',
        email: credentials.email || 'admin@solashi.com',
        fullName: 'Admin Terminal',
        role: UserRole.ADMIN,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      tokens: {
        accessToken: 'mock-access-token-12345',
        refreshToken: 'mock-refresh-token-67890'
      }
    };
  },

  /**
   * Refresh access token (MOCKED)
   */
  async refreshToken(_refreshToken: string): Promise<RefreshTokenResponse> {
    return {
      accessToken: 'mock-new-access-token'
    };
  },

  /**
   * Logout (MOCKED)
   */
  async logout(_refreshToken: string): Promise<void> {
    // Just a mock response
    await new Promise(resolve => setTimeout(resolve, 500));
  },

  /**
   * Get current user info (MOCKED)
   */
  async getCurrentUser(): Promise<User> {
    return {
      id: 'mock-admin-id',
      email: 'admin@solashi.com',
      fullName: 'Admin Terminal',
      role: UserRole.ADMIN,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
};
