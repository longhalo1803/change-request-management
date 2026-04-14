import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./user.entity";

/**
 * Project Entity
 *
 * Represents a project that contains spaces and change requests
 */

@Entity("projects")
export class Project {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255 })
  @Index()
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ name: "project_key", type: "varchar", length: 50, unique: true })
  @Index()
  projectKey: string;

  @Column({ name: "owner_id", type: "varchar" })
  ownerId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "owner_id" })
  owner: User;

  @Column({ name: "is_active", type: "boolean", default: true })
  @Index()
  isActive: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @OneToMany(() => Space, (space) => space.project)
  spaces: Space[];
}

/**
 * Space Entity
 *
 * Represents a space within a project for organizing change requests
 */

@Entity("spaces")
export class Space {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ name: "project_id", type: "varchar" })
  projectId: string;

  @ManyToOne(() => Project, (project) => project.spaces)
  @JoinColumn({ name: "project_id" })
  project: Project;

  @Column({ name: "is_active", type: "boolean", default: true })
  isActive: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @OneToMany(() => SpaceAssignment, (assignment) => assignment.space)
  assignments: SpaceAssignment[];

  @OneToMany(() => Sprint, (sprint) => sprint.space)
  sprints: Sprint[];
}

/**
 * SpaceAssignment Entity
 *
 * Represents user assignments to spaces (team membership)
 */

@Entity("space_assignments")
@Index(["spaceId", "userId"], { unique: true })
export class SpaceAssignment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "space_id", type: "varchar" })
  spaceId: string;

  @ManyToOne(() => Space, (space) => space.assignments)
  @JoinColumn({ name: "space_id" })
  space: Space;

  @Column({ name: "user_id", type: "varchar" })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ name: "role", type: "varchar", length: 50 })
  role: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}

/**
 * Sprint Entity
 *
 * Represents a sprint/iteration within a space
 */

@Entity("sprints")
export class Sprint {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ name: "space_id", type: "varchar" })
  spaceId: string;

  @ManyToOne(() => Space, (space) => space.sprints)
  @JoinColumn({ name: "space_id" })
  space: Space;

  @Column({ name: "start_date", type: "date" })
  startDate: Date;

  @Column({ name: "end_date", type: "date" })
  endDate: Date;

  @Column({ name: "status", type: "varchar", length: 50, default: "PLANNING" })
  @Index()
  status: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
