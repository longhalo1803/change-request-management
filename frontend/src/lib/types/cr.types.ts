// CR Status Enum
export enum CrStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  UNDER_ANALYSIS = 'under_analysis',
  PENDING_INFO = 'pending_info',
  PENDING_APPROVAL = 'pending_approval',
  APPROVED = 'approved',
  ONGOING = 'ongoing',
  BLOCKED = 'blocked',
  REJECTED = 'rejected',
  CLOSED = 'closed'
}

// Comment Visibility Enum
export enum CommentVisibility {
  PUBLIC = 'public',
  INTERNAL = 'internal',
  BRSE_ONLY = 'brse_only'
}

// Task Role Enum
export enum TaskRole {
  DEVELOPER = 'developer',
  QA = 'qa',
  BRSE = 'brse'
}

// SubTask Status Enum
export enum SubTaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
  BLOCKED = 'blocked'
}

// User Role Enum
export enum UserRole {
  ADMIN = 'admin',
  BRSE = 'brse',
  DEVELOPER = 'developer',
  QA = 'qa',
  CUSTOMER = 'customer'
}

// Main Interfaces
export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChangeRequest {
  id: string;
  title: string;
  description: string;
  status: CrStatus;
  priority: 'low' | 'medium' | 'high' | 'critical';
  customerId: string;
  customer?: User;
  assigneeId?: string;
  assignee?: User;
  sprintId?: string;
  sprint?: Sprint;
  estimatedHours?: number;
  actualHours?: number;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  comments?: CrComment[];
  attachments?: CrAttachment[];
  quotation?: CrQuotation;
  statusHistory?: CrStatusHistory[];
}

export interface CrComment {
  id: string;
  content: string;
  visibility: CommentVisibility;
  changeRequestId: string;
  authorId: string;
  author?: User;
  createdAt: string;
  updatedAt: string;
}

export interface CrAttachment {
  id: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  changeRequestId: string;
  uploadedById: string;
  uploadedBy?: User;
  createdAt: string;
}

export interface CrQuotation {
  id: string;
  changeRequestId: string;
  totalHours: number;
  totalCost: number;
  currency: string;
  notes?: string;
  createdById: string;
  createdBy?: User;
  items?: CrQuotationItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CrQuotationItem {
  id: string;
  quotationId: string;
  description: string;
  hours: number;
  rate: number;
  cost: number;
  role: TaskRole;
}

export interface CrSubTask {
  id: string;
  changeRequestId: string;
  title: string;
  description?: string;
  status: SubTaskStatus;
  assigneeId?: string;
  assignee?: User;
  estimatedHours?: number;
  actualHours?: number;
  role: TaskRole;
  createdAt: string;
  updatedAt: string;
}

export interface CrStatusHistory {
  id: string;
  changeRequestId: string;
  fromStatus: CrStatus;
  toStatus: CrStatus;
  changedById: string;
  changedBy?: User;
  notes?: string;
  createdAt: string;
}

export interface Sprint {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
