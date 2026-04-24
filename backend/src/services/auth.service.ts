import { UserRepository } from "@/repositories/user.repository";
import { TokenService, TokenPair } from "./token.service";
import { PasswordUtil } from "@/utils/password";
import { AppError } from "@/utils/app-error";
import { User, UserRole } from "@/entities/user.entity";
import crypto from "crypto";
import { PasswordResetTokenRepository } from "@/repositories/password-reset-token.repository";
import { DevToolsService } from "./dev-tools.service";
import { RateLimiterService } from "./rate-limiter.service";

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
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    fullName: string;
    phone: string | null;
    role: UserRole;
    isActive: boolean;
    lastLoginAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  };
  tokens: TokenPair;
}

export class AuthService {
  private userRepo: UserRepository;
  private tokenService: TokenService;
  private passwordResetTokenRepo: PasswordResetTokenRepository;

  constructor() {
    this.userRepo = new UserRepository();
    this.tokenService = new TokenService();
    this.passwordResetTokenRepo = new PasswordResetTokenRepository();
  }

  /**
   * Request password reset token
   */
  async forgotPassword(email: string): Promise<void> {
    const rateLimiter = RateLimiterService.getInstance();
    const limitStatus = rateLimiter.checkLimit(email, "forgot_password");
    
    if (!limitStatus.allowed) {
      // Silently discard request if within 1 minute
      return;
    }

    const user = await this.userRepo.findByEmail(email);
    if (!user || !user.isActive) {
      // Don't reveal if user exists
      return;
    }

    // Generate token
    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    // Save token hash to db
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);
    await this.passwordResetTokenRepo.createToken(user.id, tokenHash, 15);

    const resetLink = `http://localhost:3000/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

    // Mock sending email
    console.log(`Password reset link: ${resetLink}`);

    if (process.env.NODE_ENV === "development") {
      DevToolsService.getInstance().storeMockEmail(
        email,
        "Password Reset Request",
        `Click here to reset your password: ${resetLink}`,
        token,
        tokenHash,
        expiresAt
      );
    }
  }

  /**
   * Reset password using token
   */
  async resetPassword(
    email: string,
    token: string,
    newPassword: string
  ): Promise<void> {
    const user = await this.userRepo.findByEmail(email);
    if (!user || !user.isActive) {
      throw new AppError("auth.invalid_reset_token", 400);
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const validToken = await this.passwordResetTokenRepo.findValidToken(
      user.id,
      tokenHash
    );

    if (!validToken || validToken.expiresAt < new Date()) {
      throw new AppError("auth.invalid_reset_token", 400);
    }

    // Hash new password
    const hashedPassword = await PasswordUtil.hash(newPassword);

    // Update user password
    await this.userRepo.update(user.id, { password: hashedPassword });

    // Mark token as used
    await this.passwordResetTokenRepo.markAsUsed(validToken.id);

    // Logout all existing sessions
    await this.tokenService.revokeAllUserTokens(user.id);
  }

  /**
   * Login user with email and password
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const { email, password } = credentials;

    // Find user by email
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new AppError("auth.invalid_credentials", 401);
    }

    // Check if user is active
    if (!user.isActive) {
      throw new AppError("auth.account_inactive", 403);
    }

    // Verify password
    const isPasswordValid = await PasswordUtil.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError("auth.invalid_credentials", 401);
    }

    // Update last login timestamp
    await this.userRepo.updateLastLogin(user.id);

    // Generate tokens
    const tokens = await this.tokenService.generateTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Build user response without password, including computed fullName
    const userResponse = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return {
      user: userResponse,
      tokens,
    };
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const accessToken =
        await this.tokenService.refreshAccessToken(refreshToken);
      return { accessToken };
    } catch (error) {
      throw new AppError("auth.invalid_refresh_token", 401);
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
