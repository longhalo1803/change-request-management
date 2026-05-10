import axiosInstance from "@/lib/axios";
import type { ApiResponse } from "@/lib/types";
import {
  type ChangeRequestComment,
  type ChangeRequestAttachment,
  type CreateCommentInput,
} from "@/lib/types/comment.types";

/**
 * Comment Service
 * Handles all API calls for change request comments
 */

export const commentService = {
  /**
   * Get all comments for a change request
   */
  async list(crId: string): Promise<ChangeRequestComment[]> {
    const response = await axiosInstance.get<
      ApiResponse<ChangeRequestComment[]>
    >(`/change-requests/${crId}/comments`);
    return response.data.data;
  },

  /**
   * Add comment to a change request (with optional file attachments)
   */
  async create(
    crId: string,
    input: CreateCommentInput,
    files?: File[]
  ): Promise<ChangeRequestComment> {
    const formData = new FormData();
    formData.append("content", input.content);

    if (files && files.length > 0) {
      for (const file of files) {
        formData.append("files", file);
      }
    }

    const response = await axiosInstance.post<
      ApiResponse<ChangeRequestComment>
    >(`/change-requests/${crId}/comments`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  },

  /**
   * Delete comment (owner only)
   */
  async delete(crId: string, commentId: string): Promise<void> {
    await axiosInstance.delete(
      `/change-requests/${crId}/comments/${commentId}`
    );
  },

  /**
   * Get attachments for a change request
   */
  async getAttachments(crId: string): Promise<ChangeRequestAttachment[]> {
    const response = await axiosInstance.get<
      ApiResponse<ChangeRequestAttachment[]>
    >(`/change-requests/${crId}/attachments`);
    return response.data.data;
  },

  /**
   * Delete attachment (owner only)
   */
  async deleteAttachment(crId: string, attachmentId: string): Promise<void> {
    await axiosInstance.delete(
      `/change-requests/${crId}/attachments/${attachmentId}`
    );
  },
};
