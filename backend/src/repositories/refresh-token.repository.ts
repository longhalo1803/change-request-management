import { Repository } from 'typeorm';
import { AppDataSource } from '@/config/database';
import { RefreshToken } from '@/entities/refresh-token.entity';

/**
 * RefreshToken Repository
 * 
 * Data access layer for RefreshToken entity
 * 
 * SOLID Principles:
 * - Single Responsibility: Only handles RefreshToken data access
 * - Interface Segregation: Provides specific methods for token operations
 */

export class RefreshTokenRepository {
  private repository: Repository<RefreshToken>;

  constructor() {
    this.repository = AppDataSource.getRepository(RefreshToken);
  }

  /**
   * Create new refresh token
   */
  async create(data: {
    token: string;
    userId: string;
    expiresAt: Date;
  }): Promise<RefreshToken> {
    const refreshToken = this.repository.create(data);
    return this.repository.save(refreshToken);
  }

  /**
   * Find refresh token by token string
   */
  async findByToken(token: string): Promise<RefreshToken | null> {
    return this.repository.findOne({
      where: { token, isRevoked: false },
      relations: ['user']
    });
  }

  /**
   * Revoke refresh token
   */
  async revoke(tokenId: string): Promise<void> {
    await this.repository.update(tokenId, { isRevoked: true });
  }

  /**
   * Revoke all tokens for a user
   */
  async revokeAllForUser(userId: string): Promise<void> {
    await this.repository.update(
      { userId, isRevoked: false },
      { isRevoked: true }
    );
  }

  /**
   * Delete expired tokens (cleanup job)
   */
  async deleteExpired(): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .delete()
      .where('expires_at < :now', { now: new Date() })
      .execute();
  }
}
