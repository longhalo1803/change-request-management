/**
 * Mock Auth Service
 * 
 * Fake authentication service for testing without backend
 * 
 * SOLID Principles:
 * - Single Responsibility: Only handles mock auth
 * - Open/Closed: Easy to switch between mock and real service
 */

import type { User } from '@/lib/types/cr.types';

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

// Mock users database
const MOCK_USERS = {
  'customer@example.com': {
    password: 'Customer@123',
    user: {
      id: '4f6d0e1a-4f99-4a89-b6bb-2a8d24e7db11',
      email: 'customer@example.com',
      fullName: 'Test Customer',
      role: 'customer' as const,
      isActive: true,
      createdAt: '2026-03-20T08:00:00.000Z',
      updatedAt: '2026-03-23T08:00:00.000Z'
    },
    tokens: {
      accessToken: 'fake-access-token-customer',
      refreshToken: 'fake-refresh-token-customer'
    }
  },
  'admin@solashi.com': {
    password: 'Admin@123',
    user: {
      id: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
      email: 'admin@solashi.com',
      fullName: 'System Administrator',
      role: 'admin' as const,
      isActive: true,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-03-23T08:00:00.000Z'
    },
    tokens: {
      accessToken: 'fake-access-token-admin',
      refreshToken: 'fake-refresh-token-admin'
    }
  },
  'brse@solashi.com': {
    password: 'Brse@123',
    user: {
      id: '2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q',
      email: 'brse@solashi.com',
      fullName: 'BrSE Manager',
      role: 'brse' as const,
      isActive: true,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-03-23T08:00:00.000Z'
    },
    tokens: {
      accessToken: 'fake-access-token-brse',
      refreshToken: 'fake-refresh-token-brse'
    }
  }
};

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const authServiceMock = {
  /**
   * Mock login with email and password
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    await delay(500); // Simulate network delay

    const mockUser = MOCK_USERS[credentials.email as keyof typeof MOCK_USERS];

    if (!mockUser || mockUser.password !== credentials.password) {
      throw new Error('Invalid email or password');
    }

    return {
      user: mockUser.user,
      tokens: mockUser.tokens
    };
  },

  /**
   * Mock refresh access token
   */
  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    await delay(300);

    // Find user by refresh token
    const user = Object.values(MOCK_USERS).find(
      u => u.tokens.refreshToken === refreshToken
    );

    if (!user) {
      throw new Error('Invalid refresh token');
    }

    return {
      accessToken: user.tokens.accessToken
    };
  },

  /**
   * Mock logout
   */
  async logout(refreshToken: string): Promise<void> {
    await delay(200);
    // In mock, we don't need to do anything
    console.log('Mock logout:', refreshToken);
  },

  /**
   * Mock get current user info
   */
  async getCurrentUser(): Promise<User> {
    await delay(300);

    // In real app, this would decode the token
    // For mock, return customer user
    return MOCK_USERS['customer@example.com'].user;
  }
};
