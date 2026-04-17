import { Request, Response } from "express";
import {
  ChangeRequestService,
  SearchCRInput,
} from "@/services/change-request.service";
import { AppError } from "@/utils/app-error";
import { createChangeRequestSchema } from "@/validators/change-request.validator";
import { ZodError } from "zod";
import { logger } from "@/utils/logger";
import { config } from "@/config/env";

/**
 * ChangeRequest Controller
 *
 * Handles HTTP requests for CR operations with role-based access control
 *
 * SOLID Principles:
 * - Single Responsibility: Only handles HTTP request/response
 * - Dependency Inversion: Depends on service abstraction
 */

export class ChangeRequestController {
  private crService: ChangeRequestService;

  constructor() {
    this.crService = new ChangeRequestService();
  }

  /**
   * Helper to extract user info from request
   */
  private getUserFromRequest(req: Request) {
    const user = req.user;
    if (!user || !user.id) {
      throw new AppError("auth.unauthorized", 401);
    }
    return {
      id: user.id,
      role: user.role?.toLowerCase() || "customer",
    };
  }

  /**
   * Helper to send success response
   */
  private sendSuccess(
    res: Response,
    data: any,
    message: string = "Success",
    statusCode: number = 200
  ): void {
    res.status(statusCode).json({
      success: true,
      data,
      message,
    });
  }

  /**
   * Helper to send error response
   */
  private sendError(
    res: Response,
    error: Error | AppError,
    statusCode: number = 500
  ): void {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        data: null,
        message: error.message,
        code: error.message,
      });
    } else {
      res.status(statusCode).json({
        success: false,
        data: null,
        message: error.message || "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  }

  /**
   * GET /api/change-requests
   * Get all CRs with search/filter and visibility based on role
   */
  async getChangeRequests(req: Request, res: Response): Promise<void> {
    try {
      const user = this.getUserFromRequest(req);

      const getQueryString = (param: any): string | undefined => {
        return !param
          ? undefined
          : Array.isArray(param)
            ? (param[0] as string)
            : (param as string);
      };

      const filters: SearchCRInput = {
        search: getQueryString(req.query.search),
        id: getQueryString(req.query.id),
        name: getQueryString(req.query.name),
        statusId: getQueryString(req.query.statusId),
        priorityId: getQueryString(req.query.priorityId),
        spaceId: getQueryString(req.query.spaceId),
        assignedTo: getQueryString(req.query.assignedTo),
        parentId: getQueryString(req.query.parentId),
        sortBy:
          (getQueryString(req.query.sortBy) as
            | "createdAt"
            | "priority"
            | "status"
            | "dueDate"
            | "title") || "createdAt",
        sortOrder:
          (getQueryString(req.query.sortOrder) as "asc" | "desc") || "desc",
      };

      const result = await this.crService.searchCRs(
        filters,
        user.id,
        user.role
      );

      this.sendSuccess(res, result, "Change requests retrieved successfully");
    } catch (error) {
      logger.error(error);
      this.sendError(res, error as Error);
    }
  }

  /**
   * GET /api/change-requests/:id
   * Get single CR by ID
   */
  async getChangeRequest(req: Request, res: Response): Promise<void> {
    try {
      const user = this.getUserFromRequest(req);
      const { id } = req.params;

      const cr = await this.crService.getCrById(id, user.id, user.role);

      this.sendSuccess(res, cr, "Change request retrieved successfully");
    } catch (error) {
      const appError = error as AppError;
      this.sendError(res, appError, appError.statusCode || 500);
    }
  }

  /**
   * POST /api/change-requests
   * Create new CR (CUSTOMER ONLY)
   * Status: Always DRAFT
   * Note: Attachments should be uploaded separately via POST /:id/attachments
   * BUG FIX #6: Use Zod validator for input validation
   */
  async createChangeRequest(req: Request, res: Response): Promise<void> {
    try {
      const user = this.getUserFromRequest(req);

      // BUG FIX #6: Use Zod validator
      const validatedData = createChangeRequestSchema.parse(req.body);

      const cr = await this.crService.createCr(
        {
          ...validatedData,
          createdBy: user.id,
        },
        user.role
      );

      this.sendSuccess(res, cr, "Change request created successfully", 201);
    } catch (error) {
      // Handle Zod validation errors
      if (error instanceof ZodError) {
        const firstError = error.errors[0];
        this.sendError(
          res,
          new AppError(firstError.message || "validation.failed", 400),
          400
        );
        return;
      }

      const appError = error as AppError;
      this.sendError(res, appError, appError.statusCode || 500);
    }
  }

  /**
   * POST /api/change-requests/:id/attachments
   * Upload attachments to existing CR (CUSTOMER ONLY, DRAFT status only)
   */
  async uploadAttachments(req: Request, res: Response): Promise<void> {
    try {
      const user = this.getUserFromRequest(req);
      const { id } = req.params;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const files = req.files as any[] | undefined;

      if (!files || files.length === 0) {
        this.sendError(res, new AppError("cr.no_files_provided", 400), 400);
        return;
      }

      // Validate file count
      const MAX_FILES = 5;
      if (files.length > MAX_FILES) {
        this.sendError(res, new AppError("cr.too_many_files", 400), 400);
        return;
      }

      // Validate each file
      const { maxFileSize, allowedTypes } = config.upload;
      const validTypes = allowedTypes.filter((t: string) => t.trim().length > 0);
      
      for (const file of files) {
        if (file.size > maxFileSize) {
          this.sendError(res, new AppError("cr.file_too_large", 400), 400);
          return;
        }
        if (validTypes.length > 0 && !validTypes.includes(file.mimetype)) {
          this.sendError(res, new AppError("cr.file_type_not_allowed", 400), 400);
          return;
        }
      }

      const attachments = await this.crService.uploadAttachments(
        id,
        files,
        user.id,
        user.role
      );

      this.sendSuccess(
        res,
        attachments,
        "Attachments uploaded successfully",
        201
      );
    } catch (error) {
      const appError = error as AppError;
      this.sendError(res, appError, appError.statusCode || 500);
    }
  }

  /**
   * PUT /api/change-requests/:id
   * Update CR (CUSTOMER ONLY, DRAFT status only)
   */
  async updateChangeRequest(req: Request, res: Response): Promise<void> {
    try {
      const user = this.getUserFromRequest(req);
      const { id } = req.params;
      const {
        title,
        description,
        priorityId,
        worktypeId,
        sprintId,
        estimatedHours,
        dueDate,
      } = req.body;

      const cr = await this.crService.updateCr(
        id,
        {
          title,
          description,
          priorityId,
          worktypeId,
          sprintId,
          estimatedHours,
          dueDate,
        },
        user.id,
        user.role
      );

      this.sendSuccess(res, cr, "Change request updated successfully");
    } catch (error) {
      const appError = error as AppError;
      this.sendError(res, appError, appError.statusCode || 500);
    }
  }

  /**
   * DELETE /api/change-requests/:id
   * Delete CR (CUSTOMER ONLY, DRAFT status only)
   */
  async deleteChangeRequest(req: Request, res: Response): Promise<void> {
    try {
      const user = this.getUserFromRequest(req);
      const { id } = req.params;

      await this.crService.deleteCr(id, user.id, user.role);

      this.sendSuccess(res, { id }, "Change request deleted successfully");
    } catch (error) {
      const appError = error as AppError;
      this.sendError(res, appError, appError.statusCode || 500);
    }
  }

  /**
   * POST /api/change-requests/:id/submit
   * Submit CR from DRAFT to SUBMITTED (CUSTOMER ONLY)
   */
  async submitChangeRequest(req: Request, res: Response): Promise<void> {
    try {
      const user = this.getUserFromRequest(req);
      const { id } = req.params;

      const cr = await this.crService.submitCr(id, user.id, user.role);

      this.sendSuccess(res, cr, "Change request submitted successfully");
    } catch (error) {
      const appError = error as AppError;
      this.sendError(res, appError, appError.statusCode || 500);
    }
  }

  /**
   * GET /api/change-requests/:id/status-history
   * Get status history for a CR
   */
  async getStatusHistory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const history = await this.crService.getStatusHistory(id);

      this.sendSuccess(res, history, "Status history retrieved successfully");
    } catch (error) {
      const appError = error as AppError;
      this.sendError(res, appError, appError.statusCode || 500);
    }
  }

  /**
   * GET /api/change-requests/:id/comments
   * Get comments for a CR
   */
  async getComments(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const comments = await this.crService.getComments(id);

      this.sendSuccess(res, comments, "Comments retrieved successfully");
    } catch (error) {
      const appError = error as AppError;
      this.sendError(res, appError, appError.statusCode || 500);
    }
  }

  /**
   * GET /api/change-requests/:id/attachments
   * Get attachments for a CR
   */
  async getAttachments(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const attachments = await this.crService.getAttachments(id);

      this.sendSuccess(res, attachments, "Attachments retrieved successfully");
    } catch (error) {
      const appError = error as AppError;
      this.sendError(res, appError, appError.statusCode || 500);
    }
  }

  /**
   * DELETE /api/change-requests/:id/attachments/:attachmentId
   * Delete attachment
   */
  async deleteAttachment(req: Request, res: Response): Promise<void> {
    try {
      const { id, attachmentId } = req.params;

      await this.crService.deleteAttachment(id, attachmentId);

      this.sendSuccess(
        res,
        { id: attachmentId },
        "Attachment deleted successfully"
      );
    } catch (error) {
      const appError = error as AppError;
      this.sendError(res, appError, appError.statusCode || 500);
    }
  }

  /**
   * GET /api/change-requests/by-space/:spaceId
   * Get all CRs for a specific space with role-based visibility
   */
  async getCRsBySpace(req: Request, res: Response): Promise<void> {
    try {
      const user = this.getUserFromRequest(req);
      const { spaceId } = req.params;

      const result = await this.crService.getCrsBySpaceId(
        spaceId,
        user.id,
        user.role
      );

      this.sendSuccess(
        res,
        result,
        "Change requests for space retrieved successfully"
      );
    } catch (error) {
      logger.error(error);
      this.sendError(res, error as Error);
    }
  }

  /**
   * GET /api/change-requests/assigned/to-me
   * Get CRs assigned to current user
   */
  async getAssignedToMe(req: Request, res: Response): Promise<void> {
    try {
      const user = this.getUserFromRequest(req);

      const result = await this.crService.getCrsAssignedToUser(user.id);

      this.sendSuccess(
        res,
        result,
        "Assigned change requests retrieved successfully"
      );
    } catch (error) {
      logger.error(error);
      this.sendError(res, error as Error);
    }
  }

  /**
   * POST /api/change-requests/:id/comments
   * Add comment to CR (CUSTOMER and PM only, not on DRAFT)
   */
  async addComment(req: Request, res: Response): Promise<void> {
    try {
      const user = this.getUserFromRequest(req);
      const { id } = req.params;
      const { content } = req.body;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const files = req.files as any[] | undefined;

      if (!content) {
        this.sendError(
          res,
          new AppError("cr.comment_content_required", 400),
          400
        );
        return;
      }

      // Prepare attachments if files uploaded
      let attachments: Array<{
        fileName: string;
        fileUrl: string;
        fileSize: number;
        mimeType: string;
      }> = [];
      if (files && files.length > 0) {
        const { getRelativeFilePath } =
          await import("@/middlewares/upload.middleware");
        attachments = files.map((file) => ({
          fileName: file.originalname,
          fileUrl: getRelativeFilePath(id, file.filename),
          fileSize: file.size,
          mimeType: file.mimetype,
        }));
      }

      const comment = await this.crService.addCommentWithAttachments(
        id,
        content,
        user.id,
        user.role,
        attachments
      );

      this.sendSuccess(res, comment, "Comment added successfully", 201);
    } catch (error) {
      const appError = error as AppError;
      this.sendError(res, appError, appError.statusCode || 500);
    }
  }

  /**
   * DELETE /api/change-requests/:id/comments/:commentId
   * Delete comment (owner only)
   */
  async deleteComment(req: Request, res: Response): Promise<void> {
    try {
      const user = this.getUserFromRequest(req);
      const { id, commentId } = req.params;

      await this.crService.deleteComment(id, commentId, user.id, user.role);

      this.sendSuccess(res, { id: commentId }, "Comment deleted successfully");
    } catch (error) {
      const appError = error as AppError;
      this.sendError(res, appError, appError.statusCode || 500);
    }
  }

  /**
   * POST /api/change-requests/:id/status-transition
   * Transition CR status (PM or Customer based on current status)
   */
  async transitionStatus(req: Request, res: Response): Promise<void> {
    try {
      const user = this.getUserFromRequest(req);
      const { id } = req.params;
      const { toStatusId, notes } = req.body;

      const cr = await this.crService.transitionStatus(
        id,
        toStatusId,
        user.id,
        user.role,
        notes
      );

      this.sendSuccess(res, cr, "Status transitioned successfully");
    } catch (error) {
      const appError = error as AppError;
      this.sendError(res, appError, appError.statusCode || 500);
    }
  }
}
