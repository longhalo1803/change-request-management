import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from "typeorm";

/**
 * TaskStatus Entity
 *
 * Represents possible statuses for change requests/tasks
 */

@Entity("task_statuses")
export class TaskStatus {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 50, unique: true })
  @Index()
  name: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  description: string;

  @Column({ type: "varchar", length: 10 })
  color: string;

  @Column({ type: "int" })
  order: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}

/**
 * TaskPriority Entity
 *
 * Represents priority levels for change requests/tasks
 */

@Entity("task_priorities")
export class TaskPriority {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 50, unique: true })
  @Index()
  name: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  description: string;

  @Column({ type: "varchar", length: 10 })
  color: string;

  @Column({ type: "int" })
  level: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}

/**
 * TaskWorktype Entity
 *
 * Represents types of work (Bug, Feature, Improvement, etc.)
 */

@Entity("task_worktypes")
export class TaskWorktype {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 50, unique: true })
  @Index()
  name: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  description: string;

  @Column({ type: "varchar", length: 10 })
  icon: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
