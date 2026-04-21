import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { User } from "./user.entity";
import { Space } from "./project.entity";
import { Sprint } from "./project.entity";
import { TaskStatus, TaskPriority, TaskWorktype } from "./task-lookup.entity";

/**
 * ChangeRequest Entity (formerly Task)
 *
 * Represents a change request/task in the system
 */

@Entity("change_requests")
export class ChangeRequest {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255 })
  @Index()
  title: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ name: "cr_key", type: "varchar", length: 50, unique: true })
  @Index()
  crKey: string;

  @Column({ name: "space_id", type: "varchar" })
  spaceId: string;

  @ManyToOne(() => Space, (space) => space.id)
  @JoinColumn({ name: "space_id" })
  space: Space;

  @Column({ name: "sprint_id", type: "varchar", nullable: true })
  sprintId: string | null;

  @ManyToOne(() => Sprint, (sprint) => sprint.id)
  @JoinColumn({ name: "sprint_id" })
  sprint: Sprint | null;

  @Column({ name: "status_id", type: "varchar" })
  statusId: string;

  @ManyToOne(() => TaskStatus)
  @JoinColumn({ name: "status_id" })
  status: TaskStatus;

  @Column({ name: "priority_id", type: "varchar" })
  priorityId: string;

  @ManyToOne(() => TaskPriority)
  @JoinColumn({ name: "priority_id" })
  priority: TaskPriority;

  @Column({ name: "worktype_id", type: "varchar" })
  worktypeId: string;

  @ManyToOne(() => TaskWorktype)
  @JoinColumn({ name: "worktype_id" })
  worktype: TaskWorktype;

  @Column({ name: "created_by", type: "varchar" })
  createdBy: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "created_by" })
  creator: User;

  @Column({ name: "start_date", type: "date", nullable: true })
  startDate: Date | null;

  @Column({ name: "due_date", type: "date", nullable: true })
  dueDate: Date | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @OneToMany(
    () => ChangeRequestStatusHistory,
    (history) => history.changeRequest
  )
  statusHistory: ChangeRequestStatusHistory[];

  @OneToMany(
    () => ChangeRequestAttachment,
    (attachment) => attachment.changeRequest
  )
  attachments: ChangeRequestAttachment[];

  @OneToMany(() => ChangeRequestComment, (comment) => comment.changeRequest)
  comments: ChangeRequestComment[];
}

/**
 * ChangeRequestStatusHistory Entity
 *
 * Tracks status changes for change requests
 */

@Entity("change_request_status_history")
export class ChangeRequestStatusHistory {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "change_request_id", type: "varchar" })
  changeRequestId: string;

  @ManyToOne(() => ChangeRequest, (cr) => cr.statusHistory, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "change_request_id" })
  changeRequest: ChangeRequest;

  @Column({ name: "status_id", type: "varchar" })
  statusId: string;

  @ManyToOne(() => TaskStatus)
  @JoinColumn({ name: "status_id" })
  status: TaskStatus;

  @Column({ name: "changed_by", type: "varchar" })
  changedBy: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "changed_by" })
  changedByUser: User;

  @Column({ type: "text", nullable: true })
  notes: string | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
}

/**
 * ChangeRequestAttachment Entity
 *
 * Stores file attachments for change requests
 */

@Entity("change_request_attachments")
export class ChangeRequestAttachment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "change_request_id", type: "varchar" })
  changeRequestId: string;

  @ManyToOne(() => ChangeRequest, (cr) => cr.attachments, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "change_request_id" })
  changeRequest: ChangeRequest;

  @Column({ name: "file_name", type: "varchar", length: 255 })
  fileName: string;

  @Column({ name: "file_url", type: "varchar", length: 500 })
  fileUrl: string;

  @Column({ name: "file_size", type: "bigint" })
  fileSize: number;

  @Column({ name: "mime_type", type: "varchar", length: 100 })
  mimeType: string;

  @Column({ name: "uploaded_by", type: "varchar" })
  uploadedBy: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "uploaded_by" })
  uploader: User;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
}

/**
 * ChangeRequestComment Entity
 *
 * Stores comments on change requests
 */

@Entity("change_request_comments")
export class ChangeRequestComment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "change_request_id", type: "varchar" })
  changeRequestId: string;

  @ManyToOne(() => ChangeRequest, (cr) => cr.comments, { onDelete: "CASCADE" })
  @JoinColumn({ name: "change_request_id" })
  changeRequest: ChangeRequest;

  @Column({ type: "text" })
  content: string;

  @Column({ name: "commented_by", type: "varchar" })
  commentedBy: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "commented_by" })
  commenter: User;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
