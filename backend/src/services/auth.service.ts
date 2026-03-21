import { UserRepository } from '@/repositories/user.repository';
import { TokenService, TokenPair } from './token.service';
import { PasswordUtil } from '@/utils/password';
import { AppError } from '@/utils/app-error';
import { User } from '@/entities/user.entity';

/**
 * Auth Service
 * 
 * Business logic for authentication operations
 * 
 * SOLID Principles:
 * - Single Responsibility: Only handles authentication logic
 * - Dependency Inversion: Depends on repository and token service abstractions
 * - Open/Closed: Easy to extend with new auth methods (OAuth, SSO)
 */

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: Omit<User, 'password'>;
  tokens: TokenPair;
}

export class AuthService {
  private userRepo: UserRepository;
  private tokenService: TokenService;

  constructor() {
    this.userRepo = new UserRepository();
    this.tokenService = new TokenService();
  }

  /**
   * Login user with email and password
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const { email, password } = credentials;

    // Find user by email
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new AppError('auth.invalid_credentials', 401);
    }

    // Check if user is active
    if (!user.isActive) {
      throw new AppError('auth.account_inactive', 403);
    }

    // Verify password
    const isPasswordValid = await PasswordUtil.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('auth.invalid_credentials', 401);
    }

    // Update last login timestamp
    await this.userRepo.updateLastLogin(user.id);

    // Generate tokens
    const tokens = await this.tokenService.generateTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      tokens
    };
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const accessToken = await this.tokenService.refreshAccessToken(refreshToken);
      return { accessToken };
    } catch (error) {
      throw new AppError('auth.invalid_refresh_token', 401);
    }
  }

  /**
   * Logout user (revoke refresh token)
   */
  async logout(refreshToken: string): Promise<void> {
    await this.tokenService.revokeRefreshToken(refreshToken);
  }

  /**
   * Logout from all devices
   */
  async logoutAll(userId: string): Promise<void> {
    await this.tokenService.revokeAllUserTokens(userId);
  }

  /**
   * Verify user credentials (for middleware)
   */
  async verifyUser(userId: string): Promise<User | null> {
    const user = await this.userRepo.findById(userId);
    if (!user || !user.isActive) {
      return null;
    }
    return user;
  }
}
