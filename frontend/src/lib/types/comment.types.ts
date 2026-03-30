export enum CommentVisibility {
  PUBLIC = 'public',
  INTERNAL = 'internal',
  PM_ONLY = 'pm_only'
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
