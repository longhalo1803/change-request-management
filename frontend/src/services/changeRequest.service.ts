import axiosInstance from "@/lib/axios";
import type { ApiResponse } from "@/lib/types";
import {
  type ChangeRequest,
  type CreateChangeRequestInput,
  type UpdateChangeRequestInput,
  type StatusTransitionInput,
  type SearchChangeRequestInput,
  type SearchChangeRequestResponse,
} from "@/lib/types/changeRequest.types";

/**
 * Change Request Service
 * Handles all API calls for change request operations
 */

export const changeRequestService = {
  /**
   * List change requests with search/filter - loads all items (no pagination)
   */
  async list(
    filters: SearchChangeRequestInput
  ): Promise<SearchChangeRequestResponse> {
    const params = new URLSearchParams();
    if (filters.spaceId) params.append("spaceId", filters.spaceId);
    if (filters.statusId) params.append("statusId", filters.statusId);
    if (filters.assignedTo) params.append("assignedTo", filters.assignedTo);
    if (filters.search) params.append("search", filters.search);
    if (filters.id) params.append("id", filters.id);
    if (filters.name) params.append("name", filters.name);
    if (filters.priorityId) params.append("priorityId", filters.priorityId);
    if (filters.parentId) params.append("parentId", filters.parentId);
    if (filters.sortBy) params.append("sortBy", filters.sortBy);
    if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);

    const response = await axiosInstance.get<
      ApiResponse<SearchChangeRequestResponse>
    >(`/change-requests?${params.toString()}`);
    return response.data.data;
  },

  /**
   * Get single change request by ID
   */
  async getById(id: string): Promise<ChangeRequest> {
    const response = await axiosInstance.get<ApiResponse<ChangeRequest>>(
      `/change-requests/${id}`
    );
    return response.data.data;
  },

  /**
   * Create new change request (CUSTOMER only)
   */
  async create(input: CreateChangeRequestInput): Promise<ChangeRequest> {
    const response = await axiosInstance.post<ApiResponse<ChangeRequest>>(
      "/change-requests",
      input
    );
    return response.data.data;
  },

  /**
   * Update change request (CUSTOMER only, DRAFT only)
   */
  async update(
    id: string,
    input: UpdateChangeRequestInput
  ): Promise<ChangeRequest> {
    const response = await axiosInstance.put<ApiResponse<ChangeRequest>>(
      `/change-requests/${id}`,
      input
    );
    return response.data.data;
  },

  /**
   * Delete change request (CUSTOMER only, DRAFT only)
   */
  async delete(id: string): Promise<void> {
    await axiosInstance.delete(`/change-requests/${id}`);
  },

  /**
   * Submit change request (DRAFT → SUBMITTED)
   */
  async submit(id: string): Promise<ChangeRequest> {
    const response = await axiosInstance.post<ApiResponse<ChangeRequest>>(
      `/change-requests/${id}/submit`
    );
    return response.data.data;
  },

  /**
   * Transition status (PM or Customer based on current status)
   */
  async transitionStatus(
    id: string,
    input: StatusTransitionInput
  ): Promise<ChangeRequest> {
    const response = await axiosInstance.post<ApiResponse<ChangeRequest>>(
      `/change-requests/${id}/status-transition`,
      input
    );
    return response.data.data;
  },

  /**
   * Get change requests by space (all items)
   */
  async getBySpace(spaceId: string): Promise<SearchChangeRequestResponse> {
    const response = await axiosInstance.get<
      ApiResponse<SearchChangeRequestResponse>
    >(`/change-requests/by-space/${spaceId}`);
    return response.data.data;
  },

  /**
   * Get change requests assigned to current user (all items)
   */
  async getAssignedToMe(): Promise<SearchChangeRequestResponse> {
    const response = await axiosInstance.get<
      ApiResponse<SearchChangeRequestResponse>
    >(`/change-requests/assigned/to-me`);
    return response.data.data;
  },

  /**
   * Get status history for a change request
   */
  async getStatusHistory(id: string): Promise<Array<any>> {
    const response = await axiosInstance.get<ApiResponse<Array<any>>>(
      `/change-requests/${id}/status-history`
    );
    return response.data.data;
  },
};
