import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from "typeorm";

/**
 * User Entity
 *
 * Represents system users with role-based access
 * Roles: ADMIN, PM, CUSTOMER
 *
 * SOLID Principles:
 * - Single Responsibility: Only represents user data structure
 * - Open/Closed: Easy to extend with new fields without modifying existing code
 */

export enum UserRole {
  ADMIN = "admin",
  PM = "pm",
  CUSTOMER = "customer",
}

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255, unique: true })
  @Index()
  email: string;

  @Column({ type: "varchar", length: 255 })
  password: string;

  @Column({ name: "full_name", type: "varchar", length: 255 })
  fullName: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  @Index()
  role: UserRole;

  @Column({ name: "is_active", type: "boolean", default: true })
  isActive: boolean;

  @Column({ name: "last_login_at", type: "timestamp", nullable: true })
  lastLoginAt: Date | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
