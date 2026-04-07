/**
 * Change Request Types
 * All types related to change requests
 */

export interface TaskStatus {
  id: string;
  name: string;
  description?: string;
}

export interface TaskPriority {
  id: string;
  name: string;
  level: number;
}

export interface TaskWorktype {
  id: string;
  name: string;
}

export interface UserInfo {
  id: string;
  fullName: string;
  email: string;
  avatar?: string;
}

export interface ChangeRequest {
  id: string;
  crKey: string;
  title: string;
  description?: string;
  spaceId: string;
  statusId: string;
  status?: TaskStatus;
  priorityId?: string;
  priority?: TaskPriority;
  worktypeId?: string;
  worktype?: TaskWorktype;
  createdBy: string;
  creator?: UserInfo;
  assignedTo?: string | null;
  assignee?: UserInfo | null;
  sprintId?: string;
  estimatedHours?: number;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateChangeRequestInput {
  title: string;
  description?: string;
  spaceId: string;
  priorityId?: string;
  worktypeId?: string;
  sprintId?: string;
  estimatedHours?: number;
  dueDate?: string;
}

export interface UpdateChangeRequestInput {
  title?: string;
  description?: string;
  priorityId?: string;
  worktypeId?: string;
  sprintId?: string;
  estimatedHours?: number;
  dueDate?: string;
}

export interface StatusTransitionInput {
  toStatusId: string;
  notes?: string;
}

export interface SearchChangeRequestInput {
  spaceId?: string;
  statusId?: string;
  assignedTo?: string;
  search?: string; // Search by title, description, crKey
  id?: string; // Search by exact ID
  name?: string; // Search by title/name
  priorityId?: string; // Filter by priority
  sortBy?: "createdAt" | "priority" | "dueDate" | "title"; // Sort field
  sortOrder?: "asc" | "desc"; // Sort order
}

export interface SearchChangeRequestResponse {
  items: ChangeRequest[];
  total: number;
}

export enum ChangeRequestStatus {
  DRAFT = "DRAFT",
  SUBMITTED = "SUBMITTED",
  IN_DISCUSSION = "IN_DISCUSSION",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  ON_GOING = "ON_GOING",
  CLOSED = "CLOSED",
}

export enum ChangeRequestPriority {
  CRITICAL = "CRITICAL",
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW",
}

// Alias for backward compatibility
export type CrStatus = ChangeRequestStatus;
