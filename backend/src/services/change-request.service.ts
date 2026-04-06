import { ChangeRequestRepository } from "@/repositories/change-request.repository";
import { AppError } from "@/utils/app-error";
import { ChangeRequest } from "@/entities/change-request.entity";

/**
 * ChangeRequest Service
 *
 * Business logic for CR operations
 *
 * SOLID Principles:
 * - Single Responsibility: Only handles CR business logic
 * - Dependency Inversion: Depends on repository abstraction
 * - Open/Closed: Easy to extend with new CR workflows
 */

export interface CreateCrInput {
  title: string;
  description?: string;
  spaceId: string;
  statusId: string;
  priorityId: string;
  worktypeId: string;
  createdBy: string;
  assignedTo?: string;
  sprintId?: string;
  estimatedHours?: number;
  dueDate?: string;
}

export interface UpdateCrInput {
  title?: string;
  description?: string;
  statusId?: string;
  priorityId?: string;
  worktypeId?: string;
  assignedTo?: string;
  sprintId?: string;
  estimatedHours?: number;
  actualHours?: number;
  dueDate?: string;
}

export class ChangeRequestService {
  private crRepo: ChangeRequestRepository;

  constructor() {
    this.crRepo = new ChangeRequestRepository();
  }

  /**
   * Generate unique CR key
   */
  private generateCrKey(): string {
    return `CR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get CR by ID
   */
  async getCrById(id: string): Promise<ChangeRequest> {
    const cr = await this.crRepo.findById(id);
    if (!cr) {
      throw new AppError("cr.not_found", 404);
    }
    return cr;
  }

  /**
   * Get CR by crKey
   */
  async getCrByCrKey(crKey: string): Promise<ChangeRequest> {
    const cr = await this.crRepo.findByCrKey(crKey);
    if (!cr) {
      throw new AppError("cr.not_found", 404);
    }
    return cr;
  }

  /**
   * Get all CRs for a space
   */
  async getCrsBySpaceId(
    spaceId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{
    data: ChangeRequest[];
    total: number;
    page: number;
    limit: number;
  }> {
    const skip = (page - 1) * limit;
    const { data, total } = await this.crRepo.findBySpaceId(spaceId, {
      skip,
      take: limit,
    });
    return { data, total, page, limit };
  }

  /**
   * Get all CRs assigned to user
   */
  async getCrsAssignedToUser(
    userId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{
    data: ChangeRequest[];
    total: number;
    page: number;
    limit: number;
  }> {
    const skip = (page - 1) * limit;
    const { data, total } = await this.crRepo.findByAssigneeId(userId, {
      skip,
      take: limit,
    });
    return { data, total, page, limit };
  }

  /**
   * Get all CRs created by user
   */
  async getCrsCreatedByUser(
    userId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{
    data: ChangeRequest[];
    total: number;
    page: number;
    limit: number;
  }> {
    const skip = (page - 1) * limit;
    const { data, total } = await this.crRepo.findByCreatedById(userId, {
      skip,
      take: limit,
    });
    return { data, total, page, limit };
  }

  /**
   * Create new CR
   */
  async createCr(input: CreateCrInput): Promise<ChangeRequest> {
    const crKey = this.generateCrKey();

    const crData: Partial<ChangeRequest> = {
      crKey,
      title: input.title,
      description: input.description,
      spaceId: input.spaceId,
      statusId: input.statusId,
      priorityId: input.priorityId,
      worktypeId: input.worktypeId,
      createdBy: input.createdBy,
      assignedTo: input.assignedTo || null,
      sprintId: input.sprintId || null,
      estimatedHours: input.estimatedHours || null,
      dueDate: input.dueDate ? new Date(input.dueDate) : null,
    };

    return this.crRepo.create(crData);
  }

  /**
   * Update CR
   */
  async updateCr(id: string, input: UpdateCrInput): Promise<ChangeRequest> {
    // Verify CR exists
    await this.getCrById(id);

    const updateData: Partial<ChangeRequest> = {};
    if (input.title !== undefined) updateData.title = input.title;
    if (input.description !== undefined)
      updateData.description = input.description;
    if (input.statusId !== undefined) updateData.statusId = input.statusId;
    if (input.priorityId !== undefined)
      updateData.priorityId = input.priorityId;
    if (input.worktypeId !== undefined)
      updateData.worktypeId = input.worktypeId;
    if (input.assignedTo !== undefined)
      updateData.assignedTo = input.assignedTo;
    if (input.sprintId !== undefined) updateData.sprintId = input.sprintId;
    if (input.estimatedHours !== undefined)
      updateData.estimatedHours = input.estimatedHours;
    if (input.actualHours !== undefined)
      updateData.actualHours = input.actualHours;
    if (input.dueDate !== undefined)
      updateData.dueDate = input.dueDate ? new Date(input.dueDate) : null;

    await this.crRepo.update(id, updateData);
    return this.getCrById(id);
  }

  /**
   * Delete CR
   */
  async deleteCr(id: string): Promise<void> {
    // Verify CR exists
    await this.getCrById(id);
    await this.crRepo.delete(id);
  }

  /**
   * Add comment to CR
   */
  async addComment(
    crId: string,
    content: string,
    commentedBy: string
  ): Promise<any> {
    // Verify CR exists
    await this.getCrById(crId);

    return this.crRepo.createComment({
      changeRequestId: crId,
      content,
      commentedBy,
    });
  }

  /**
   * Delete comment
   */
  async deleteComment(crId: string, commentId: string): Promise<void> {
    // Verify CR exists
    await this.getCrById(crId);
    await this.crRepo.deleteComment(commentId);
  }

  /**
   * Get CR comments
   */
  async getComments(crId: string): Promise<any[]> {
    await this.getCrById(crId);
    return this.crRepo.findCommentsByCrId(crId);
  }

  /**
   * Get CR attachments
   */
  async getAttachments(crId: string): Promise<any[]> {
    await this.getCrById(crId);
    return this.crRepo.findAttachmentsByCrId(crId);
  }

  /**
   * Delete attachment
   */
  async deleteAttachment(crId: string, attachmentId: string): Promise<void> {
    await this.getCrById(crId);
    await this.crRepo.deleteAttachment(attachmentId);
  }

  /**
   * Get CR status history
   */
  async getStatusHistory(crId: string): Promise<any[]> {
    await this.getCrById(crId);
    return this.crRepo.findStatusHistoryByCrId(crId);
  }

  /**
   * Create status history record (when status changes)
   */
  async recordStatusChange(
    crId: string,
    statusId: string,
    changedBy: string,
    notes?: string
  ): Promise<void> {
    await this.getCrById(crId);

    await this.crRepo.createStatusHistory({
      changeRequestId: crId,
      statusId,
      changedBy,
      notes: notes || null,
    });

    // Update CR status
    await this.crRepo.update(crId, { statusId });
  }
}
