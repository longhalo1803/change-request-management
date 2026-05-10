import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from "typeorm";

/**
 * UserRole Entity (Lookup Table)
 *
 * Stores available roles in the system: admin, pm, customer
 * Replaces the old ENUM-based role column in the users table
 *
 * Benefits:
 * - FK constraint prevents invalid role values
 * - Easy to extend with new roles
 * - Supports metadata (description) per role
 */

@Entity("user_roles")
export class UserRoleEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 50, unique: true })
  code: string;

  @Column({ type: "varchar", length: 100 })
  name: string;

  @Column({ type: "text", nullable: true })
  description: string | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
}
