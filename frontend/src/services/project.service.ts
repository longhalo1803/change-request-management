import axiosInstance from "@/lib/axios";
import type { ApiResponse } from "@/lib/types";
import {
  type Project,
  type Space,
  type CreateProjectInput,
  type UpdateProjectInput,
  type CreateSpaceInput,
  type UpdateSpaceInput,
} from "@/lib/types/project.types";

/**
 * Project Service
 * Handles all API calls for project operations
 */

export const projectService = {
  /**
   * List all projects
   */
  async list(): Promise<Project[]> {
    const response =
      await axiosInstance.get<ApiResponse<Project[]>>("/projects");
    return response.data.data;
  },

  /**
   * Get single project by ID
   */
  async getById(id: string): Promise<Project> {
    const response = await axiosInstance.get<ApiResponse<Project>>(
      `/projects/${id}`
    );
    return response.data.data;
  },

  /**
   * Create new project (PM only)
   */
  async create(input: CreateProjectInput): Promise<Project> {
    const response = await axiosInstance.post<ApiResponse<Project>>(
      "/projects",
      input
    );
    return response.data.data;
  },

  /**
   * Update project (PM only, owner only)
   */
  async update(id: string, input: UpdateProjectInput): Promise<Project> {
    const response = await axiosInstance.put<ApiResponse<Project>>(
      `/projects/${id}`,
      input
    );
    return response.data.data;
  },

  /**
   * Delete project (PM only, owner only)
   */
  async delete(id: string): Promise<void> {
    await axiosInstance.delete(`/projects/${id}`);
  },

  /**
   * List spaces for a project
   */
  async getSpaces(projectId: string): Promise<Space[]> {
    const response = await axiosInstance.get<ApiResponse<Space[]>>(
      `/projects/${projectId}/spaces`
    );
    return response.data.data;
  },

  /**
   * Get single space by ID
   */
  async getSpaceById(id: string): Promise<Space> {
    const response = await axiosInstance.get<ApiResponse<Space>>(
      `/spaces/${id}`
    );
    return response.data.data;
  },

  /**
   * Create space (PM only, project owner only)
   */
  async createSpace(
    projectId: string,
    input: CreateSpaceInput
  ): Promise<Space> {
    const response = await axiosInstance.post<ApiResponse<Space>>(
      `/projects/${projectId}/spaces`,
      input
    );
    return response.data.data;
  },

  /**
   * Update space (PM only, project owner only)
   */
  async updateSpace(id: string, input: UpdateSpaceInput): Promise<Space> {
    const response = await axiosInstance.put<ApiResponse<Space>>(
      `/spaces/${id}`,
      input
    );
    return response.data.data;
  },

  /**
   * Delete space (PM only, project owner only)
   */
  async deleteSpace(id: string): Promise<void> {
    await axiosInstance.delete(`/spaces/${id}`);
  },
};
