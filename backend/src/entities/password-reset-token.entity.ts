import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Unique,
} from "typeorm";
import { User } from "./user.entity";

@Entity("password_reset_tokens")
@Unique("unique_active_token", ["userId", "usedAt"])
export class PasswordResetToken {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "user_id", type: "varchar", length: 36 })
  @Index("idx_user_id")
  userId: string;

  @Column({ name: "token_hash", type: "varchar", length: 255, unique: true })
  @Index("idx_token_hash")
  tokenHash: string;

  @Column({ name: "expires_at", type: "timestamp" })
  @Index("idx_expires_at")
  expiresAt: Date;

  @Column({ name: "used_at", type: "timestamp", nullable: true })
  usedAt: Date | null;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;
}
