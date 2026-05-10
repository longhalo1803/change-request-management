import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { UserRoleEntity } from "./user-role.entity";

/**
 * User Entity
 *
 * Represents system users with role-based access
 * Role is now a FK reference to user_roles table
 *
 * SOLID Principles:
 * - Single Responsibility: Only represents user data structure
 * - Open/Closed: Easy to extend with new fields without modifying existing code
 */

/**
 * UserRole enum kept for backward compatibility
 * Used throughout the codebase for role checks, middleware, etc.
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

  @Column({ name: "first_name", type: "varchar", length: 255 })
  firstName: string;

  @Column({ name: "last_name", type: "varchar", length: 255 })
  lastName: string;

  @Column({ name: "phone", type: "varchar", length: 50, nullable: true })
  phone: string | null;

  @Column({ name: "role_id", type: "varchar", length: 36 })
  roleId: string;

  @ManyToOne(() => UserRoleEntity, { eager: true })
  @JoinColumn({ name: "role_id" })
  roleEntity: UserRoleEntity;

  @Column({ name: "is_active", type: "boolean", default: true })
  isActive: boolean;

  @Column({ name: "last_login_at", type: "timestamp", nullable: true })
  lastLoginAt: Date | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  /**
   * Backward compatibility getter for role
   * Returns the role code (e.g., "admin", "pm", "customer") as UserRole enum
   * This allows existing code using user.role to continue working
   */
  get role(): UserRole {
    if (this.roleEntity) {
      return this.roleEntity.code as UserRole;
    }
    return UserRole.CUSTOMER;
  }

  /**
   * Backward compatibility getter
   * Returns full name from firstName + lastName
   * This allows existing code using user.fullName to continue working
   */
  get fullName(): string {
    return `${this.firstName || ""} ${this.lastName || ""}`.trim();
  }
}
