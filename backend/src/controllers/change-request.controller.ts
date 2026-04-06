import { Request, Response } from "express";
import { ChangeRequestService } from "@/services/change-request.service";
import { AppError } from "@/utils/app-error";

/**
 * ChangeRequest Controller
 *
 * Handles HTTP requests for CR operations
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
   * GET /change-requests/:id
   */
  async getCrById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const cr = await this.crService.getCrById(id);
      res.json({ status: "success", data: cr });
    } catch (error) {
      if (error instanceof AppError) {
        res
          .status(error.statusCode)
          .json({ status: "error", message: error.message });
      } else {
        res
          .status(500)
          .json({ status: "error", message: "Internal server error" });
      }
    }
  }

  /**
   * GET /change-requests/key/:crKey
   */
  async getCrByCrKey(req: Request, res: Response): Promise<void> {
    try {
      const { crKey } = req.params;
      const cr = await this.crService.getCrByCrKey(crKey);
      res.json({ status: "success", data: cr });
    } catch (error) {
      if (error instanceof AppError) {
        res
          .status(error.statusCode)
          .json({ status: "error", message: error.message });
      } else {
        res
          .status(500)
          .json({ status: "error", message: "Internal server error" });
      }
    }
  }

  /**
   * GET /spaces/:spaceId/change-requests
   */
  async getCrsBySpaceId(req: Request, res: Response): Promise<void> {
    try {
      const { spaceId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await this.crService.getCrsBySpaceId(spaceId, page, limit);
      res.json({ status: "success", data: result });
    } catch (error) {
      res
        .status(500)
        .json({ status: "error", message: "Internal server error" });
    }
  }

  /**
   * GET /change-requests/assigned/to-me
   */
  async getCrsAssignedToMe(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({ status: "error", message: "Unauthorized" });
        return;
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await this.crService.getCrsAssignedToUser(
        userId,
        page,
        limit
      );
      res.json({ status: "success", data: result });
    } catch (error) {
      res
        .status(500)
        .json({ status: "error", message: "Internal server error" });
    }
  }

  /**
   * GET /change-requests/created/by-me
   */
  async getCrsCreatedByMe(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({ status: "error", message: "Unauthorized" });
        return;
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await this.crService.getCrsCreatedByUser(
        userId,
        page,
        limit
      );
      res.json({ status: "success", data: result });
    } catch (error) {
      res
        .status(500)
        .json({ status: "error", message: "Internal server error" });
    }
  }

  /**
   * POST /spaces/:spaceId/change-requests
   */
  async createCr(req: Request, res: Response): Promise<void> {
    try {
      const { spaceId } = req.params;
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({ status: "error", message: "Unauthorized" });
        return;
      }

      const {
        title,
        description,
        statusId,
        priorityId,
        worktypeId,
        assignedTo,
        sprintId,
        estimatedHours,
        dueDate,
      } = req.body;

      if (!title || !statusId || !priorityId || !worktypeId) {
        res
          .status(400)
          .json({ status: "error", message: "Missing required fields" });
        return;
      }

      const cr = await this.crService.createCr({
        title,
        description,
        spaceId,
        statusId,
        priorityId,
        worktypeId,
        createdBy: userId,
        assignedTo,
        sprintId,
        estimatedHours,
        dueDate,
      });

      res.status(201).json({ status: "success", data: cr });
    } catch (error) {
      res
        .status(500)
        .json({ status: "error", message: "Internal server error" });
    }
  }

  /**
   * PUT /change-requests/:id
   */
  async updateCr(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const {
        title,
        description,
        statusId,
        priorityId,
        worktypeId,
        assignedTo,
        sprintId,
        estimatedHours,
        actualHours,
        dueDate,
      } = req.body;

      const cr = await this.crService.updateCr(id, {
        title,
        description,
        statusId,
        priorityId,
        worktypeId,
        assignedTo,
        sprintId,
        estimatedHours,
        actualHours,
        dueDate,
      });

      res.json({ status: "success", data: cr });
    } catch (error) {
      if (error instanceof AppError) {
        res
          .status(error.statusCode)
          .json({ status: "error", message: error.message });
      } else {
        res
          .status(500)
          .json({ status: "error", message: "Internal server error" });
      }
    }
  }

  /**
   * DELETE /change-requests/:id
   */
  async deleteCr(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.crService.deleteCr(id);
      res.json({ status: "success", message: "CR deleted" });
    } catch (error) {
      if (error instanceof AppError) {
        res
          .status(error.statusCode)
          .json({ status: "error", message: error.message });
      } else {
        res
          .status(500)
          .json({ status: "error", message: "Internal server error" });
      }
    }
  }

  /**
   * POST /change-requests/:id/comments
   */
  async addComment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id;
      const { content } = req.body;

      if (!userId || !content) {
        res
          .status(400)
          .json({ status: "error", message: "Missing required fields" });
        return;
      }

      const comment = await this.crService.addComment(id, content, userId);
      res.status(201).json({ status: "success", data: comment });
    } catch (error) {
      if (error instanceof AppError) {
        res
          .status(error.statusCode)
          .json({ status: "error", message: error.message });
      } else {
        res
          .status(500)
          .json({ status: "error", message: "Internal server error" });
      }
    }
  }

  /**
   * GET /change-requests/:id/comments
   */
  async getComments(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const comments = await this.crService.getComments(id);
      res.json({ status: "success", data: comments });
    } catch (error) {
      if (error instanceof AppError) {
        res
          .status(error.statusCode)
          .json({ status: "error", message: error.message });
      } else {
        res
          .status(500)
          .json({ status: "error", message: "Internal server error" });
      }
    }
  }

  /**
   * DELETE /change-requests/:id/comments/:commentId
   */
  async deleteComment(req: Request, res: Response): Promise<void> {
    try {
      const { id, commentId } = req.params;
      await this.crService.deleteComment(id, commentId);
      res.json({ status: "success", message: "Comment deleted" });
    } catch (error) {
      if (error instanceof AppError) {
        res
          .status(error.statusCode)
          .json({ status: "error", message: error.message });
      } else {
        res
          .status(500)
          .json({ status: "error", message: "Internal server error" });
      }
    }
  }

  /**
   * GET /change-requests/:id/attachments
   */
  async getAttachments(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const attachments = await this.crService.getAttachments(id);
      res.json({ status: "success", data: attachments });
    } catch (error) {
      if (error instanceof AppError) {
        res
          .status(error.statusCode)
          .json({ status: "error", message: error.message });
      } else {
        res
          .status(500)
          .json({ status: "error", message: "Internal server error" });
      }
    }
  }

  /**
   * DELETE /change-requests/:id/attachments/:attachmentId
   */
  async deleteAttachment(req: Request, res: Response): Promise<void> {
    try {
      const { id, attachmentId } = req.params;
      await this.crService.deleteAttachment(id, attachmentId);
      res.json({ status: "success", message: "Attachment deleted" });
    } catch (error) {
      if (error instanceof AppError) {
        res
          .status(error.statusCode)
          .json({ status: "error", message: error.message });
      } else {
        res
          .status(500)
          .json({ status: "error", message: "Internal server error" });
      }
    }
  }

  /**
   * GET /change-requests/:id/status-history
   */
  async getStatusHistory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const history = await this.crService.getStatusHistory(id);
      res.json({ status: "success", data: history });
    } catch (error) {
      if (error instanceof AppError) {
        res
          .status(error.statusCode)
          .json({ status: "error", message: error.message });
      } else {
        res
          .status(500)
          .json({ status: "error", message: "Internal server error" });
      }
    }
  }

  /**
   * POST /change-requests/:id/status-change
   */
  async recordStatusChange(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id;
      const { statusId, notes } = req.body;

      if (!userId || !statusId) {
        res
          .status(400)
          .json({ status: "error", message: "Missing required fields" });
        return;
      }

      await this.crService.recordStatusChange(id, statusId, userId, notes);
      res.json({ status: "success", message: "Status updated" });
    } catch (error) {
      if (error instanceof AppError) {
        res
          .status(error.statusCode)
          .json({ status: "error", message: error.message });
      } else {
        res
          .status(500)
          .json({ status: "error", message: "Internal server error" });
      }
    }
  }
}
