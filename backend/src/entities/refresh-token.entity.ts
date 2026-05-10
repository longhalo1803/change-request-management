import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from "typeorm";
import { User } from "./user.entity";

/**
 * RefreshToken Entity
 *
 * Stores refresh tokens for JWT authentication
 * Allows token revocation and session management
 *
 * SOLID Principles:
 * - Single Responsibility: Only manages refresh token data
 * - Dependency Inversion: References User through abstraction
 */

@Entity("refresh_tokens")
export class RefreshToken {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "text" })
  token: string;

  @Column({ name: "user_id", type: "uuid" })
  @Index()
  userId: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ name: "expires_at", type: "timestamp" })
  expiresAt: Date;

  @Column({ name: "is_revoked", type: "boolean", default: false })
  isRevoked: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
}
