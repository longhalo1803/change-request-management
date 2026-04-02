import type { User, UserRole } from "@/lib/types";

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

const MOCK_USERS = {
  "customer@example.com": {
    password: "Customer@123",
    user: {
      id: "4f6d0e1a-4f99-4a89-b6bb-2a8d24e7db11",
      email: "customer@example.com",
      fullName: "Test Customer",
      role: "customer" as UserRole,
      isActive: true,
      createdAt: "2026-03-20T08:00:00.000Z",
      updatedAt: "2026-03-23T08:00:00.000Z",
    },
    tokens: {
      accessToken: "fake-access-token-customer",
      refreshToken: "fake-refresh-token-customer",
    },
  },
  "admin@solashi.com": {
    password: "Admin@123",
    user: {
      id: "1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p",
      email: "admin@solashi.com",
      fullName: "System Administrator",
      role: "admin" as UserRole,
      isActive: true,
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-03-23T08:00:00.000Z",
    },
    tokens: {
      accessToken: "fake-access-token-admin",
      refreshToken: "fake-refresh-token-admin",
    },
  },
  "pm@solashi.com": {
    password: "Pm@123",
    user: {
      id: "2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q",
      email: "pm@solashi.com",
      fullName: "Project Manager",
      role: "pm" as UserRole,
      isActive: true,
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-03-23T08:00:00.000Z",
    },
    tokens: {
      accessToken: "fake-access-token-pm",
      refreshToken: "fake-refresh-token-pm",
    },
  },
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const authServiceMock = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    await delay(500);

    const mockUser = MOCK_USERS[credentials.email as keyof typeof MOCK_USERS];

    if (!mockUser || mockUser.password !== credentials.password) {
      throw new Error("Invalid email or password");
    }

    return {
      user: mockUser.user,
      tokens: mockUser.tokens,
    };
  },

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    await delay(300);

    const user = Object.values(MOCK_USERS).find(
      (u) => u.tokens.refreshToken === refreshToken,
    );

    if (!user) {
      throw new Error("Invalid refresh token");
    }

    return {
      accessToken: user.tokens.accessToken,
    };
  },

  async logout(_refreshToken: string): Promise<void> {
    await delay(200);
  },

  async getCurrentUser(): Promise<User> {
    await delay(300);
    return MOCK_USERS["customer@example.com"].user;
  },
};
