/**
 * Comment Types
 * All types related to comments and attachments
 */

export interface ChangeRequestComment {
  id: string;
  changeRequestId: string;
  content: string;
  commentedBy: string;
  commenterName?: string;
  commenter?: {
    id: string;
    fullName: string;
    email: string;
    role: string;
  };
  createdAt: string;
  updatedAt: string;
  attachments?: ChangeRequestAttachment[];
}

export interface ChangeRequestAttachment {
  id: string;
  changeRequestId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: string;
  createdAt: string;
}

export interface CreateCommentInput {
  content: string;
}

export enum CommentVisibility {
  PUBLIC = "public",
  INTERNAL = "internal",
  PM_ONLY = "pm_only",
}

export interface CrComment {
  id: string;
  content: string;
  visibility: CommentVisibility;
  changeRequestId: string;
  authorId: string;
  author?: any;
  createdAt: string;
  updatedAt: string;
}
