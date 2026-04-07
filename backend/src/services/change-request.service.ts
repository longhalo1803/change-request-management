import { ChangeRequestRepository } from "@/repositories/change-request.repository";
import { AppError } from "@/utils/app-error";
import {
  ChangeRequest,
  ChangeRequestComment,
  ChangeRequestStatusHistory,
} from "@/entities/change-request.entity";
import { AppDataSource } from "@/config/database";

/**
 * ChangeRequest Service
 *
 * Business logic for CR operations with role-based visibility and validations
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
  priorityId?: string;
  worktypeId?: string;
  assignedTo?: string;
  sprintId?: string;
  estimatedHours?: number;
  actualHours?: number;
  dueDate?: string;
}

export interface SearchCRInput {
  search?: string;
  id?: string;
  name?: string;
  statusId?: string;
  priorityId?: string;
  spaceId?: string;
  assignedTo?: string;
  parentId?: string;
  sortBy?: "createdAt" | "priority" | "dueDate" | "title";
  sortOrder?: "asc" | "desc";
}

export class ChangeRequestService {
  private crRepo: ChangeRequestRepository;
  private statusRepo = AppDataSource.getRepository("TaskStatus");

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
   * Check if user can view this CR based on role and status
   */
  private canUserViewCR(cr: any, userId: string, userRole: string): boolean {
    // Admin can see all
    if (userRole === "admin") return true;

    // If CR is DRAFT, only creator and admin can view
    if (cr.status?.name === "DRAFT" || cr.statusId?.name === "DRAFT") {
      return cr.createdBy === userId;
    }

    // PM cannot see DRAFT, but can see all other statuses
    if (userRole === "pm") {
      return cr.status?.name !== "DRAFT";
    }

    // Customer can see their own DRAFT + all non-DRAFT
    if (userRole === "customer") {
      const isDraft =
        cr.status?.name === "DRAFT" || cr.statusId?.name === "DRAFT";
      if (isDraft) {
        return cr.createdBy === userId;
      }
      return true;
    }

    return false;
  }

  /**
   * Get CR by ID with visibility check
   */
  async getCrById(
    id: string,
    userId?: string,
    userRole?: string
  ): Promise<ChangeRequest> {
    const cr = await this.crRepo.findById(id);
    if (!cr) {
      throw new AppError("cr.not_found", 404);
    }

    // Check visibility if userId and role provided
    if (userId && userRole) {
      if (!this.canUserViewCR(cr, userId, userRole)) {
        throw new AppError("cr.forbidden", 403);
      }
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
   * Search and filter CRs with visibility based on role
   */
  async searchCRs(
    filters: SearchCRInput,
    userId: string,
    userRole: string
  ): Promise<{
    items: ChangeRequest[];
    total: number;
  }> {
    // Get status ID for DRAFT to exclude
    let draftStatusId: string | undefined;
    if (userRole === "pm") {
      // PM cannot see DRAFT CRs
      const draftStatus = await AppDataSource.getRepository(
        "TaskStatus"
      ).findOne({
        where: { name: "DRAFT" },
      });
      draftStatusId = draftStatus?.id;
    }

    // Map new field names to repository expected fields
    let sortBy: "created_at" | "priority" | "status" = "created_at";
    if (filters.sortBy === "createdAt") sortBy = "created_at";
    else if (filters.sortBy === "priority") sortBy = "priority";
    else if (filters.sortBy === "dueDate" || filters.sortBy === "title")
      sortBy = "created_at"; // Fallback to created_at for unsupported fields

    let sortOrder: "ASC" | "DESC" = "DESC";
    if (filters.sortOrder === "asc") sortOrder = "ASC";
    else if (filters.sortOrder === "desc") sortOrder = "DESC";

    const result = await this.crRepo.searchAndFilter({
      search: filters.search || filters.name, // Map name to search
      status: filters.statusId,
      priority: filters.priorityId,
      spaceId: filters.spaceId,
      assignedTo: filters.assignedTo,
      excludeStatus:
        draftStatusId && userRole === "pm" ? draftStatusId : undefined,
      sortBy,
      sortOrder,
      skip: 0, // Load all
      take: 10000, // Load all
    });

    // For customer: additional filter - show own DRAFT + all non-DRAFT
    if (userRole === "customer") {
      result.data = result.data.filter((cr) => {
        if (cr.status?.name === "DRAFT") {
          return cr.createdBy === userId;
        }
        return true;
      });

      // Recalculate total for customer
      result.total = result.data.length;
    }

    return {
      items: result.data,
      total: result.total,
    };
  }

  /**
   * Get all CRs for a space with visibility
   */
  async getCrsBySpaceId(
    spaceId: string,
    userId: string,
    userRole: string
  ): Promise<{
    items: ChangeRequest[];
    total: number;
  }> {
    const result = await this.searchCRs(
      {
        spaceId,
      },
      userId,
      userRole
    );

    return {
      items: result.items,
      total: result.total,
    };
  }

  /**
   * Get all CRs assigned to user
   */
  async getCrsAssignedToUser(userId: string): Promise<{
    items: ChangeRequest[];
    total: number;
  }> {
    const { data, total } = await this.crRepo.findByAssigneeId(userId, {
      skip: 0,
      take: 10000, // Load all
    });
    return { items: data, total };
  }

  /**
   * Get all CRs created by user
   */
  async getCrsCreatedByUser(
    userId: string,
    page: number = 1,
    limit: number = 15
  ): Promise<{
    items: ChangeRequest[];
    total: number;
    page: number;
    limit: number;
  }> {
    const skip = (page - 1) * limit;
    const { data, total } = await this.crRepo.findByCreatedById(userId, {
      skip,
      take: limit,
    });
    return { items: data, total, page, limit };
  }

  /**
   * Create new CR (CUSTOMER ONLY)
   */
  async createCr(
    input: CreateCrInput,
    userRole: string
  ): Promise<ChangeRequest> {
    // Only CUSTOMER can create CRs
    if (userRole !== "customer") {
      throw new AppError("cr.create_denied", 403);
    }

    // Validate inputs
    if (!input.title || input.title.trim().length < 3) {
      throw new AppError("cr.title_invalid", 400);
    }

    if (input.title.length > 255) {
      throw new AppError("cr.title_too_long", 400);
    }

    // Get DRAFT status ID
    const draftStatus = await AppDataSource.getRepository("TaskStatus").findOne(
      {
        where: { name: "DRAFT" },
      }
    );
    if (!draftStatus) {
      throw new AppError("cr.status_not_found", 500);
    }

    const crKey = this.generateCrKey();

    const crData: Partial<ChangeRequest> = {
      crKey,
      title: input.title,
      description: input.description,
      spaceId: input.spaceId,
      statusId: draftStatus.id, // Always DRAFT for new CRs
      priorityId: input.priorityId,
      worktypeId: input.worktypeId,
      createdBy: input.createdBy,
      assignedTo: undefined, // Cannot assign at creation
      sprintId: input.sprintId,
      estimatedHours: input.estimatedHours,
      dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
    };

    return this.crRepo.create(crData);
  }

  /**
   * Update CR (CUSTOMER ONLY for DRAFT status)
   */
  async updateCr(
    id: string,
    input: UpdateCrInput,
    userId: string,
    userRole: string
  ): Promise<ChangeRequest> {
    // Only CUSTOMER can edit CRs
    if (userRole !== "customer") {
      throw new AppError("cr.update_denied", 403);
    }

    // Verify CR exists and get current state
    const cr = await this.getCrById(id);

    // Can only edit DRAFT CRs
    if (cr.status?.name !== "DRAFT") {
      throw new AppError("cr.cannot_edit_non_draft", 400);
    }

    // Can only edit own CRs
    if (cr.createdBy !== userId) {
      throw new AppError("cr.can_only_edit_own", 403);
    }

    const updateData: Partial<ChangeRequest> = {};
    if (input.title !== undefined) {
      if (input.title.trim().length < 3) {
        throw new AppError("cr.title_invalid", 400);
      }
      if (input.title.length > 255) {
        throw new AppError("cr.title_too_long", 400);
      }
      updateData.title = input.title;
    }

    if (input.description !== undefined) {
      updateData.description = input.description;
    }

    if (input.priorityId !== undefined) {
      updateData.priorityId = input.priorityId;
    }

    if (input.worktypeId !== undefined) {
      updateData.worktypeId = input.worktypeId;
    }

    if (input.sprintId !== undefined) {
      updateData.sprintId = input.sprintId || null;
    }

    if (input.estimatedHours !== undefined) {
      updateData.estimatedHours = input.estimatedHours || null;
    }

    if (input.dueDate !== undefined) {
      updateData.dueDate = input.dueDate ? new Date(input.dueDate) : null;
    }

    await this.crRepo.update(id, updateData);
    return this.getCrById(id);
  }

  /**
   * Delete CR (CUSTOMER ONLY for DRAFT status)
   */
  async deleteCr(id: string, userId: string, userRole: string): Promise<void> {
    // Only CUSTOMER can delete CRs
    if (userRole !== "customer") {
      throw new AppError("cr.delete_denied", 403);
    }

    const cr = await this.getCrById(id);

    // Can only delete DRAFT CRs
    if (cr.status?.name !== "DRAFT") {
      throw new AppError("cr.cannot_delete_non_draft", 400);
    }

    // Can only delete own CRs
    if (cr.createdBy !== userId) {
      throw new AppError("cr.can_only_delete_own", 403);
    }

    await this.crRepo.delete(id);
  }

  /**
   * Submit CR from DRAFT to SUBMITTED (CUSTOMER ONLY)
   */
  async submitCr(
    id: string,
    userId: string,
    userRole: string
  ): Promise<ChangeRequest> {
    if (userRole !== "customer") {
      throw new AppError("cr.submit_denied", 403);
    }

    const cr = await this.getCrById(id);

    if (cr.status?.name !== "DRAFT") {
      throw new AppError("cr.cannot_submit_non_draft", 400);
    }

    if (cr.createdBy !== userId) {
      throw new AppError("cr.can_only_submit_own", 403);
    }

    // Get SUBMITTED status
    const submittedStatus = await AppDataSource.getRepository(
      "TaskStatus"
    ).findOne({
      where: { name: "SUBMITTED" },
    });
    if (!submittedStatus) {
      throw new AppError("cr.status_not_found", 500);
    }

    // Update status and record history
    await this.crRepo.update(id, { statusId: submittedStatus.id });
    await this.crRepo.createStatusHistory({
      changeRequestId: id,
      statusId: submittedStatus.id,
      changedBy: userId,
      notes: "CR submitted by creator",
    });

    return this.getCrById(id);
  }

  /**
   * Add comment to CR
   */
  async addComment(
    crId: string,
    content: string,
    commentedBy: string,
    userRole: string
  ): Promise<ChangeRequestComment> {
    // Only CUSTOMER and PM can comment
    if (userRole !== "customer" && userRole !== "pm") {
      throw new AppError("cr.comment_denied", 403);
    }

    const cr = await this.getCrById(crId);

    // Cannot comment on DRAFT CRs
    if (cr.status?.name === "DRAFT") {
      throw new AppError("cr.cannot_comment_draft", 403);
    }

    // Validate content
    if (!content || content.trim().length === 0) {
      throw new AppError("cr.comment_empty", 400);
    }

    if (content.length > 5000) {
      throw new AppError("cr.comment_too_long", 400);
    }

    return this.crRepo.createComment({
      changeRequestId: crId,
      content: content.trim(),
      commentedBy,
    });
  }

  /**
   * Delete comment (only owner can delete)
   */
  async deleteComment(
    crId: string,
    commentId: string,
    userId: string,
    userRole: string
  ): Promise<void> {
    // Verify CR exists
    await this.getCrById(crId);

    // Get the comment
    const commentRepo = AppDataSource.getRepository(ChangeRequestComment);
    const comment = await commentRepo.findOne({
      where: { id: commentId, changeRequestId: crId },
    });

    if (!comment) {
      throw new AppError("cr.comment_not_found", 404);
    }

    // Only owner or admin can delete
    if (comment.commentedBy !== userId && userRole !== "admin") {
      throw new AppError("cr.can_only_delete_own_comment", 403);
    }

    await this.crRepo.deleteComment(commentId);
  }

  /**
   * Get CR comments
   */
  async getComments(crId: string): Promise<ChangeRequestComment[]> {
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
  async getStatusHistory(crId: string): Promise<ChangeRequestStatusHistory[]> {
    await this.getCrById(crId);
    return this.crRepo.findStatusHistoryByCrId(crId);
  }

  /**
   * Transition CR status with validation
   * Role-based status transitions:
   * - PM: SUBMITTED→IN_DISCUSSION, IN_DISCUSSION→SUBMITTED (reject), APPROVED→IN_PROGRESS, IN_PROGRESS→COMPLETED
   * - Customer: IN_DISCUSSION→APPROVED (approve), IN_DISCUSSION→SUBMITTED (reject)
   */
  async transitionStatus(
    crId: string,
    toStatusId: string,
    userId: string,
    userRole: string,
    notes?: string
  ): Promise<ChangeRequest> {
    const cr = await this.getCrById(crId);

    // Get current status and new status
    const statusRepo = AppDataSource.getRepository("TaskStatus");
    const newStatus = await statusRepo.findOne({ where: { id: toStatusId } });
    if (!newStatus) {
      throw new AppError("cr.status_not_found", 404);
    }

    const currentStatusName = cr.status?.name;
    const newStatusName = newStatus.name;

    // Define allowed transitions by role
    const allowedTransitions: Record<string, Record<string, string[]>> = {
      pm: {
        SUBMITTED: ["IN_DISCUSSION"],
        IN_DISCUSSION: ["SUBMITTED"],
        APPROVED: ["IN_PROGRESS"],
        IN_PROGRESS: ["COMPLETED"],
      },
      customer: {
        IN_DISCUSSION: ["APPROVED", "SUBMITTED"],
      },
      admin: {},
    };

    // Check if this role can perform this transition
    const transitions = allowedTransitions[userRole];
    if (!transitions || !transitions[currentStatusName]) {
      throw new AppError("cr.invalid_transition", 409);
    }

    if (!transitions[currentStatusName].includes(newStatusName)) {
      throw new AppError("cr.invalid_transition", 409);
    }

    // Update status and record history
    await this.crRepo.update(crId, { statusId: toStatusId });
    await this.crRepo.createStatusHistory({
      changeRequestId: crId,
      statusId: toStatusId,
      changedBy: userId,
      notes:
        notes || `Status changed from ${currentStatusName} to ${newStatusName}`,
    });

    // Return updated CR
    return await this.getCrById(crId);
  }

  /**
   * Add comment with file attachments
   */
  async addCommentWithAttachments(
    crId: string,
    content: string,
    commentedBy: string,
    userRole: string,
    attachments?: Array<{
      fileName: string;
      fileUrl: string;
      fileSize: number;
      mimeType: string;
    }>
  ): Promise<ChangeRequestComment> {
    // Create the comment first
    const comment = await this.addComment(crId, content, commentedBy, userRole);

    // If attachments provided, create attachment records
    if (attachments && attachments.length > 0) {
      for (const attachment of attachments) {
        await this.crRepo.createAttachment({
          changeRequestId: crId,
          fileName: attachment.fileName,
          fileUrl: attachment.fileUrl,
          fileSize: attachment.fileSize,
          mimeType: attachment.mimeType,
          uploadedBy: commentedBy,
        });
      }
    }

    // Return comment with attachments
    const fullComment = await AppDataSource.getRepository(
      ChangeRequestComment
    ).findOne({
      where: { id: comment.id },
      relations: ["commenter"],
    });

    return fullComment || comment;
  }
}
