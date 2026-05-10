import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { config } from "@/config/env";
import { UserRole } from "@/entities/user.entity";
import { RefreshTokenRepository } from "@/repositories/refresh-token.repository";

/**
 * Token Service
 *
 * Handles JWT token generation and verification
 *
 * SOLID Principles:
 * - Single Responsibility: Only handles token operations
 * - Dependency Inversion: Depends on RefreshTokenRepository abstraction
 */

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export class TokenService {
  private refreshTokenRepo: RefreshTokenRepository;

  constructor() {
    this.refreshTokenRepo = new RefreshTokenRepository();
  }

  /**
   * Generate access token (short-lived)
   */
  generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(
      payload,
      config.jwt.accessSecret as Secret,
      {
        expiresIn: config.jwt.accessExpiresIn,
      } as SignOptions,
    );
  }

  /**
   * Generate refresh token (long-lived)
   */
  generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(
      payload,
      config.jwt.refreshSecret as Secret,
      {
        expiresIn: config.jwt.refreshExpiresIn,
      } as SignOptions,
    );
  }

  /**
   * Generate both access and refresh tokens
   */
  async generateTokenPair(payload: TokenPayload): Promise<TokenPair> {
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);

    // Store refresh token in database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await this.refreshTokenRepo.create({
      token: refreshToken,
      userId: payload.userId,
      expiresAt,
    });

    return { accessToken, refreshToken };
  }

  /**
   * Verify access token
   */
  verifyAccessToken(token: string): TokenPayload {
    return jwt.verify(token, config.jwt.accessSecret as Secret) as TokenPayload;
  }

  /**
   * Verify refresh token
   */
  verifyRefreshToken(token: string): TokenPayload {
    return jwt.verify(
      token,
      config.jwt.refreshSecret as Secret,
    ) as TokenPayload;
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(refreshToken: string): Promise<string> {
    // Verify refresh token
    const payload = this.verifyRefreshToken(refreshToken);

    // Check if refresh token exists and is not revoked
    const storedToken = await this.refreshTokenRepo.findByToken(refreshToken);
    if (!storedToken || storedToken.isRevoked) {
      throw new Error("Invalid refresh token");
    }

    // Check if token is expired
    if (new Date() > storedToken.expiresAt) {
      throw new Error("Refresh token expired");
    }

    // Generate new access token
    return this.generateAccessToken({
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    });
  }

  /**
   * Revoke refresh token
   */
  async revokeRefreshToken(token: string): Promise<void> {
    const storedToken = await this.refreshTokenRepo.findByToken(token);
    if (storedToken) {
      await this.refreshTokenRepo.revoke(storedToken.id);
    }
  }

  /**
   * Revoke all refresh tokens for a user (logout from all devices)
   */
  async revokeAllUserTokens(userId: string): Promise<void> {
    await this.refreshTokenRepo.revokeAllForUser(userId);
  }
}
