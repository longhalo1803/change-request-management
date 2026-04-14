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
import { User } from "./user.entity";
import { Project } from "./project.entity";

/**
 * Quotation Entity
 *
 * Represents quotations/estimates for projects
 */

@Entity("quotations")
export class Quotation {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255 })
  @Index()
  title: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ name: "project_id", type: "varchar" })
  projectId: string;

  @ManyToOne(() => Project, (project) => project.id)
  @JoinColumn({ name: "project_id" })
  project: Project;

  @Column({ name: "quoted_by", type: "varchar" })
  quotedBy: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "quoted_by" })
  quoter: User;

  @Column({ type: "decimal", precision: 12, scale: 2 })
  amount: number;

  @Column({ type: "varchar", length: 50, default: "PENDING" })
  @Index()
  status: string;

  @Column({ name: "valid_until", type: "date", nullable: true })
  validUntil: Date | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}

/**
 * Notification Entity
 *
 * Represents notifications for users
 */

@Entity("notifications")
export class Notification {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "user_id", type: "varchar" })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ type: "varchar", length: 255 })
  title: string;

  @Column({ type: "text" })
  message: string;

  @Column({ type: "varchar", length: 50, default: "INFO" })
  type: string;

  @Column({ name: "is_read", type: "boolean", default: false })
  @Index()
  isRead: boolean;

  @Column({ name: "related_id", type: "varchar", nullable: true })
  relatedId: string | null;

  @Column({ name: "related_type", type: "varchar", length: 50, nullable: true })
  relatedType: string | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
