/**
 * Project & Space Types
 * All types related to projects and spaces
 */

export interface Project {
  id: string;
  name: string;
  description?: string;
  projectKey: string;
  ownerId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectInput {
  name: string;
  description?: string;
  projectKey: string;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
  projectKey?: string;
}

export interface Space {
  id: string;
  name: string;
  description?: string;
  spaceKey: string;
  projectId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSpaceInput {
  name: string;
  description?: string;
}

export interface UpdateSpaceInput {
  name?: string;
  description?: string;
  isActive?: boolean;
}
