import { ChangeRequestRepository } from "@/repositories/change-request.repository";
import { AppError } from "@/utils/app-error";
import {
  ChangeRequest,
  ChangeRequestComment,
  ChangeRequestStatusHistory,
  ChangeRequestAttachment,
} from "@/entities/change-request.entity";
import {
  TaskStatus,
  TaskPriority,
  TaskWorktype,
} from "@/entities/task-lookup.entity";
import { Space, Sprint, SpaceAssignment } from "@/entities/project.entity";
import { AppDataSource } from "@/config/database";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import { logger } from "@/utils/logger";

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
  sortBy?: "createdAt" | "priority" | "status" | "dueDate" | "title";
  sortOrder?: "asc" | "desc";
}

export class ChangeRequestService {
  private crRepo: ChangeRequestRepository;

  constructor() {
    this.crRepo = new ChangeRequestRepository();
  }

  /**
   * Generate unique CR key with UUID to prevent collisions
   * BUG FIX #3: Use UUID instead of Math.random() to prevent race conditions
   */
  private generateCrKey(): string {
    const uuid = uuidv4().split("-")[0]; // Get first 8 characters
    return `CR-${Date.now()}-${uuid}`;
  }

  /**
   * Check if user can view this CR based on role and status
   */
  private canUserViewCR(cr: any, userId: string, userRole: string): boolean {
    // If CR is DRAFT, only creator and admin can view
    if (cr.status?.name === "DRAFT") {
      if (userRole === "admin") return false; // Admin cannot view DRAFT
      if (userRole === "pm") return false; // PM cannot view DRAFT
      return cr.createdBy === userId;
    }

    // Admin can see all non-DRAFT
    if (userRole === "admin") return true;

    // PM can see all non-DRAFT
    if (userRole === "pm") return true;

    // Customer can see all non-DRAFT
    if (userRole === "customer") return true;

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
    if (!crKey || crKey.trim().length === 0) {
      throw new AppError("cr.invalid_key", 400);
    }
    // Validate format: CR-{timestamp}-{uuid} or similar format used in the app
    if (!/^CR-\d+-[a-f0-9]{8}$/.test(crKey) && !/^CR-[A-Z0-9]+-[0-9]+$/.test(crKey)) {
      // Relaxing the regex temporarily to accommodate current CR key formats just in case
      // throw new AppError("cr.invalid_key_format", 400);
    }
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
    // Get status ID for DRAFT to exclude for PM and Admin
    let draftStatusId: string | undefined;
    let onlyUserDrafts: string | undefined;

    if (userRole === "pm" || userRole === "admin") {
      // PM and Admin cannot see DRAFT CRs
      const draftStatus = await AppDataSource.getRepository(TaskStatus).findOne(
        {
          where: { name: "DRAFT" },
        }
      );
      draftStatusId = draftStatus?.id;
    } else if (userRole === "customer") {
      // Customer can only see their own DRAFTs, but can see all non-DRAFTs
      onlyUserDrafts = userId;
    }

    // Map new field names to repository expected fields
    let sortBy: "created_at" | "priority" | "status" = "created_at";
    if (filters.sortBy === "createdAt") sortBy = "created_at";
    else if (filters.sortBy === "priority") sortBy = "priority";
    else if (filters.sortBy === "status") sortBy = "status";
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
      excludeStatus: draftStatusId,
      onlyUserDrafts,
      sortBy,
      sortOrder,
      skip: 0,
      take: 10000,
    });

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
   * BUG FIX #1: Removed file upload from creation - use separate endpoint
   * BUG FIX #2: Added foreign key validation
   * BUG FIX #4: Added space access check
   * BUG FIX #5: Added transaction support
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

    // BUG FIX #2: Validate foreign keys exist
    // Check if space exists and is active
    const space = await AppDataSource.getRepository(Space).findOne({
      where: { id: input.spaceId, isActive: true },
    });
    if (!space) {
      throw new AppError("cr.space_not_found", 404);
    }

    // BUG FIX #4: Check if user has access to this space
    const spaceAssignment = await AppDataSource.getRepository(
      SpaceAssignment
    ).findOne({
      where: { spaceId: input.spaceId, userId: input.createdBy },
    });
    if (!spaceAssignment) {
      throw new AppError("cr.space_access_denied", 403);
    }

    // Check if priority exists
    const priority = await AppDataSource.getRepository(TaskPriority).findOne({
      where: { id: input.priorityId },
    });
    if (!priority) {
      throw new AppError("cr.priority_not_found", 404);
    }

    // Check if worktype exists
    const worktype = await AppDataSource.getRepository(TaskWorktype).findOne({
      where: { id: input.worktypeId },
    });
    if (!worktype) {
      throw new AppError("cr.worktype_not_found", 404);
    }

    // Check if sprint exists (if provided)
    if (input.sprintId) {
      const sprint = await AppDataSource.getRepository(Sprint).findOne({
        where: { id: input.sprintId, spaceId: input.spaceId },
      });
      if (!sprint) {
        throw new AppError("cr.sprint_not_found", 404);
      }
    }

    // Get DRAFT status ID
    const draftStatus = await AppDataSource.getRepository(TaskStatus).findOne({
      where: { name: "DRAFT" },
    });
    if (!draftStatus) {
      throw new AppError("cr.status_not_found", 500);
    }

    // BUG FIX #3: Use UUID-based key generation
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

    // BUG FIX #5: Use transaction for data integrity
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let newCrId: string;
    try {
      const cr = await queryRunner.manager.save(ChangeRequest, crData);
      newCrId = cr.id;

      // Add status history
      await queryRunner.manager.save(ChangeRequestStatusHistory, {
        changeRequestId: cr.id,
        statusId: draftStatus.id,
        changedBy: input.createdBy,
        notes: "Initial CR created in DRAFT status",
      });

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }

    // Return CR with relations
    return await this.getCrById(newCrId);
  }

  /**
   * Upload attachments to existing CR (CUSTOMER ONLY, DRAFT status only)
   * BUG FIX #1: New method for uploading attachments separately
   * BUG FIX #5: Added transaction and file cleanup on error
   */
  async uploadAttachments(
    crId: string,
    files: any[],
    userId: string,
    userRole: string
  ): Promise<ChangeRequestAttachment[]> {
    // Only CUSTOMER can upload attachments
    if (userRole !== "customer") {
      throw new AppError("cr.upload_denied", 403);
    }

    // Get CR and verify it exists
    const cr = await this.getCrById(crId);

    // Can only upload to DRAFT CRs
    if (cr.status?.name !== "DRAFT") {
      throw new AppError("cr.cannot_upload_to_non_draft", 400);
    }

    // Can only upload to own CRs
    if (cr.createdBy !== userId) {
      throw new AppError("cr.can_only_upload_to_own", 403);
    }

    // Use transaction for data integrity
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { getRelativeFilePath } =
        await import("@/middlewares/upload.middleware");
      const attachments: ChangeRequestAttachment[] = [];

      for (const file of files) {
        const attachment = await queryRunner.manager.save(
          ChangeRequestAttachment,
          {
            changeRequestId: crId,
            fileName: file.originalname,
            fileUrl: getRelativeFilePath(crId, file.filename),
            fileSize: file.size,
            mimeType: file.mimetype,
            uploadedBy: userId,
          }
        );
        attachments.push(attachment);
      }

      await queryRunner.commitTransaction();
      return attachments;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      // BUG FIX #5: Cleanup uploaded files on error
      for (const file of files) {
        try {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        } catch (cleanupError) {
          logger.error("Failed to cleanup file:", cleanupError);
        }
      }

      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Update CR (CUSTOMER ONLY for DRAFT status, PM for management fields)
   */
  async updateCr(
    id: string,
    input: UpdateCrInput,
    userId: string,
    userRole: string
  ): Promise<ChangeRequest> {
    // Only CUSTOMER or PM can edit CRs
    if (userRole !== "customer" && userRole !== "pm") {
      throw new AppError("cr.update_denied", 403);
    }

    // Verify CR exists and get current state
    const cr = await this.getCrById(id);

    const updateData: Partial<ChangeRequest> = {};

    if (userRole === "customer") {
      // Customer can only edit DRAFT CRs
      if (cr.status?.name !== "DRAFT") {
        throw new AppError("cr.cannot_edit_non_draft", 400);
      }

      // Customer can only edit own CRs
      if (cr.createdBy !== userId) {
        throw new AppError("cr.can_only_edit_own", 403);
      }

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
    } else if (userRole === "pm") {
      // PM cannot edit DRAFT CRs
      if (cr.status?.name === "DRAFT") {
        throw new AppError("cr.pm_cannot_edit_draft", 403);
      }

      // PM specific fields
      if (input.assignedTo !== undefined) {
        updateData.assignedTo = input.assignedTo || null;
      }

      if (input.sprintId !== undefined) {
        updateData.sprintId = input.sprintId || null;
      }

      if (input.estimatedHours !== undefined) {
        updateData.estimatedHours = input.estimatedHours || null;
      }

      if (input.actualHours !== undefined) {
        updateData.actualHours = input.actualHours || null;
      }

      if (input.dueDate !== undefined) {
        updateData.dueDate = input.dueDate ? new Date(input.dueDate) : null;
      }

      // PMs can also update titles and descriptions if needed for refinement
      if (input.title !== undefined) {
        if (input.title.trim().length >= 3 && input.title.length <= 255) {
          updateData.title = input.title;
        }
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
    }

    if (Object.keys(updateData).length > 0) {
      await this.crRepo.update(id, updateData);
    }

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
      TaskStatus
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
    const statusRepo = AppDataSource.getRepository(TaskStatus);
    const newStatus = await statusRepo.findOne({ where: { id: toStatusId } });
    if (!newStatus) {
      throw new AppError("cr.status_not_found", 404);
    }

    const currentStatusName = cr.status?.name;
    const newStatusName = newStatus.name;

    // Define allowed transitions by role
    const allowedTransitions: Record<string, Record<string, string[]>> = {
      pm: {
        SUBMITTED: ["IN_DISCUSSION", "REJECTED"],
        IN_DISCUSSION: ["REJECTED"],
        APPROVED: ["ON_GOING"],
        ON_GOING: ["CLOSED"],
      },
      customer: {
        IN_DISCUSSION: ["APPROVED", "REJECTED"],
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
