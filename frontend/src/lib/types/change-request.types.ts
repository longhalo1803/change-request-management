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

export interface ChangeRequest {
  id: string;
  title: string;
  description: string;
  status: CrStatus;
  priority: 'low' | 'medium' | 'high' | 'critical';
  customerId: string;
  customer?: any;
  assigneeId?: string;
  assignee?: any;
  sprintId?: string;
  sprint?: any;
  estimatedHours?: number;
  actualHours?: number;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  comments?: any[];
  attachments?: any[];
  quotation?: any;
  statusHistory?: any[];
}
