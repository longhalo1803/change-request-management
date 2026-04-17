import { Request, Response } from "express";
import { ProjectService } from "@/services/project.service";
import { AppError } from "@/utils/app-error";

/**
 * Project Controller
 *
 * Handles HTTP requests for Project and Space operations
 * Only PM role can perform CRUD operations
 *
 * SOLID Principles:
 * - Single Responsibility: Only handles HTTP request/response
 * - Dependency Inversion: Depends on service abstraction
 */

export class ProjectController {
  private projectService: ProjectService;

  constructor() {
    this.projectService = new ProjectService();
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

  // ===== PROJECT ENDPOINTS =====

  /**
   * GET /api/projects
   * Get all projects (visible to all)
   */
  async getProjects(req: Request, res: Response): Promise<void> {
    try {
      const projects = await this.projectService.getAllProjects();
      this.sendSuccess(res, projects, "Projects retrieved successfully");
    } catch (error) {
      this.sendError(res, error as Error);
    }
  }

  /**
   * GET /api/projects/:id
   * Get single project
   */
  async getProject(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const project = await this.projectService.getProjectWithSpaces(id);
      this.sendSuccess(res, project, "Project retrieved successfully");
    } catch (error) {
      const appError = error as AppError;
      this.sendError(res, appError, appError.statusCode || 500);
    }
  }

  /**
   * POST /api/projects
   * Create project (PM ONLY)
   */
  async createProject(req: Request, res: Response): Promise<void> {
    try {
      const user = this.getUserFromRequest(req);
      const { name, description, projectKey } = req.body;

      if (!name || !projectKey) {
        this.sendError(res, new AppError("project.missing_fields", 400), 400);
        return;
      }

      const project = await this.projectService.createProject(
        { name, description, projectKey },
        user.id,
        user.role
      );

      this.sendSuccess(res, project, "Project created successfully", 201);
    } catch (error) {
      const appError = error as AppError;
      this.sendError(res, appError, appError.statusCode || 500);
    }
  }

  /**
   * PUT /api/projects/:id
   * Update project (PM ONLY, owner only)
   */
  async updateProject(req: Request, res: Response): Promise<void> {
    try {
      const user = this.getUserFromRequest(req);
      const { id } = req.params;
      const { name, description, projectKey, isActive } = req.body;

      const project = await this.projectService.updateProject(
        id,
        { name, description, projectKey, isActive },
        user.id,
        user.role
      );

      this.sendSuccess(res, project, "Project updated successfully");
    } catch (error) {
      const appError = error as AppError;
      this.sendError(res, appError, appError.statusCode || 500);
    }
  }

  /**
   * DELETE /api/projects/:id
   * Delete project (PM ONLY, owner only)
   */
  async deleteProject(req: Request, res: Response): Promise<void> {
    try {
      const user = this.getUserFromRequest(req);
      const { id } = req.params;

      await this.projectService.deleteProject(id, user.id, user.role);

      this.sendSuccess(res, { id }, "Project deleted successfully");
    } catch (error) {
      const appError = error as AppError;
      this.sendError(res, appError, appError.statusCode || 500);
    }
  }

  // ===== SPACE ENDPOINTS =====

  /**
   * GET /api/projects/:projectId/spaces
   * Get spaces for project
   */
  async getSpaces(req: Request, res: Response): Promise<void> {
    try {
      const { projectId } = req.params;
      const spaces = await this.projectService.getSpacesForProject(projectId);
      this.sendSuccess(res, spaces, "Spaces retrieved successfully");
    } catch (error) {
      const appError = error as AppError;
      this.sendError(res, appError, appError.statusCode || 500);
    }
  }

  /**
   * GET /api/projects/:projectId/spaces/:spaceId
   * Get single space
   */
  async getSpace(req: Request, res: Response): Promise<void> {
    try {
      const { spaceId } = req.params;
      const space = await this.projectService.getSpaceById(spaceId);
      this.sendSuccess(res, space, "Space retrieved successfully");
    } catch (error) {
      const appError = error as AppError;
      this.sendError(res, appError, appError.statusCode || 500);
    }
  }

  /**
   * POST /api/projects/:projectId/spaces
   * Create space in project (PM ONLY, project owner only)
   */
  async createSpace(req: Request, res: Response): Promise<void> {
    try {
      const user = this.getUserFromRequest(req);
      const { projectId } = req.params;
      const { name, description } = req.body;

      if (!name) {
        this.sendError(res, new AppError("space.name_required", 400), 400);
        return;
      }

      const space = await this.projectService.createSpace(
        projectId,
        { name, description },
        user.id,
        user.role
      );

      this.sendSuccess(res, space, "Space created successfully", 201);
    } catch (error) {
      const appError = error as AppError;
      this.sendError(res, appError, appError.statusCode || 500);
    }
  }

  /**
   * PUT /api/projects/:projectId/spaces/:spaceId
   * Update space (PM ONLY, project owner only)
   */
  async updateSpace(req: Request, res: Response): Promise<void> {
    try {
      const user = this.getUserFromRequest(req);
      const { projectId, spaceId } = req.params;
      const { name, description, isActive } = req.body;

      const space = await this.projectService.updateSpace(
        spaceId,
        { name, description, isActive },
        user.id,
        user.role
      );

      this.sendSuccess(res, space, "Space updated successfully");
    } catch (error) {
      const appError = error as AppError;
      this.sendError(res, appError, appError.statusCode || 500);
    }
  }

  /**
   * DELETE /api/projects/:projectId/spaces/:spaceId
   * Delete space (PM ONLY, project owner only)
   */
  async deleteSpace(req: Request, res: Response): Promise<void> {
    try {
      const user = this.getUserFromRequest(req);
      const { projectId, spaceId } = req.params;

      await this.projectService.deleteSpace(spaceId, user.id, user.role);

      this.sendSuccess(res, { id: spaceId }, "Space deleted successfully");
    } catch (error) {
      const appError = error as AppError;
      this.sendError(res, appError, appError.statusCode || 500);
    }
  }
}
