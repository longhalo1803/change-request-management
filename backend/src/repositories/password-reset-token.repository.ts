import { Repository, IsNull } from "typeorm";
import { PasswordResetToken } from "../entities/password-reset-token.entity";
import { AppDataSource } from "../config/database";

export class PasswordResetTokenRepository extends Repository<PasswordResetToken> {
  constructor() {
    super(PasswordResetToken, AppDataSource.createEntityManager());
  }

  async createToken(
    userId: string,
    tokenHash: string,
    expiresInMinutes: number = 15
  ): Promise<PasswordResetToken> {
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + expiresInMinutes);

    const token = this.create({
      userId,
      tokenHash,
      expiresAt,
    });

    return this.save(token);
  }

  async findValidToken(
    userId: string,
    tokenHash: string
  ): Promise<PasswordResetToken | null> {
    return this.findOne({
      where: {
        userId,
        tokenHash,
        usedAt: IsNull(),
      },
    });
  }

  async markAsUsed(id: string): Promise<void> {
    await this.update(id, { usedAt: new Date() });
  }
}

export const passwordResetTokenRepository = new PasswordResetTokenRepository();
