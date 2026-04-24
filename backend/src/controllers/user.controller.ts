import { Request, Response } from "express";
import { UserService } from "@/services/user.service";
import { AppError } from "@/utils/app-error";
import { UserRole } from "@/entities/user.entity";
import { logger } from "@/utils/logger";

/**
 * User Controller
 *
 * Handles HTTP requests for user management
 *
 * SOLID Principles:
 * - Single Responsibility: Only handles HTTP request/response
 * - Dependency Inversion: Depends on service abstraction
 */

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
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
      });
    } else {
      logger.error(error);
      res.status(statusCode).json({
        success: false,
        data: null,
        message: error.message || "Internal server error",
      });
    }
  }

  /**
   * PUT /users/me
   * Update own profile (self-update)
   */
  async updateMyProfile(req: Request, res: Response): Promise<void> {
    try {
      const currentUserId = req.user!.id;
      const { firstName, lastName, phone } = req.body;

      const user = await this.userService.updateMyProfile(currentUserId, {
        firstName,
        lastName,
        phone,
      });

      this.sendSuccess(res, user, "Profile updated successfully");
    } catch (error) {
      this.sendError(res, error as Error);
    }
  }

  /**
   * GET /users/:id
   */
  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await this.userService.getUserById(id);
      this.sendSuccess(res, user);
    } catch (error) {
      this.sendError(res, error as Error);
    }
  }

  /**
   * GET /users
   * Returns all users excluding the requesting admin
   */
  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const currentUserId = req.user!.id;
      const users =
        await this.userService.getAllUsersExcludingSelf(currentUserId);
      this.sendSuccess(res, users, "Users retrieved successfully");
    } catch (error) {
      this.sendError(res, error as Error);
    }
  }

  /**
   * GET /users/by-role/:role
   */
  async getUsersByRole(req: Request, res: Response): Promise<void> {
    try {
      const { role } = req.params;

      // Validate role
      if (!Object.values(UserRole).includes(role as UserRole)) {
        res.status(400).json({
          success: false,
          data: null,
          message: "Invalid role",
        });
        return;
      }

      const users = await this.userService.getUsersByRole(role as UserRole);
      this.sendSuccess(res, users);
    } catch (error) {
      this.sendError(res, error as Error);
    }
  }

  /**
   * POST /users
   * Create a new user (admin only)
   */
  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, firstName, lastName, role, phone } = req.body;

      // Validate required fields
      if (!email || !password || !firstName || !lastName || !role) {
        this.sendError(
          res,
          new AppError(
            "Missing required fields: email, password, firstName, lastName, role",
            400
          )
        );
        return;
      }

      // Validate role
      if (!Object.values(UserRole).includes(role)) {
        this.sendError(res, new AppError("Invalid role", 400));
        return;
      }

      // Validate password strength (at least 8 characters)
      if (password.length < 8) {
        this.sendError(
          res,
          new AppError("Password must be at least 8 characters", 400)
        );
        return;
      }

      const user = await this.userService.createUser({
        email,
        password,
        firstName,
        lastName,
        role,
        phone,
      });

      this.sendSuccess(res, user, "User created successfully", 201);
    } catch (error) {
      this.sendError(res, error as Error);
    }
  }

  /**
   * PUT /users/:id
   * Update user information (admin only)
   */
  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { email, firstName, lastName, role, phone } = req.body;

      // Validate role if provided
      if (role && !Object.values(UserRole).includes(role)) {
        this.sendError(res, new AppError("Invalid role", 400));
        return;
      }

      const user = await this.userService.updateUser(id, {
        email,
        firstName,
        lastName,
        role,
        phone,
      });

      this.sendSuccess(res, user, "User updated successfully");
    } catch (error) {
      this.sendError(res, error as Error);
    }
  }

  /**
   * PATCH /users/:id/status
   * Update user status (activate/deactivate) - admin only
   * Admin cannot deactivate themselves
   */
  async updateUserStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const currentUserId = req.user!.id;

      // Prevent admin from deactivating themselves
      if (id === currentUserId && status === "inactive") {
        this.sendError(
          res,
          new AppError("Cannot deactivate your own account", 400)
        );
        return;
      }

      // Validate status
      if (!["active", "inactive"].includes(status)) {
        this.sendError(
          res,
          new AppError("Invalid status. Must be 'active' or 'inactive'", 400)
        );
        return;
      }

      const user = await this.userService.updateUserStatus(id, status);
      this.sendSuccess(
        res,
        user,
        `User ${status === "active" ? "activated" : "deactivated"} successfully`
      );
    } catch (error) {
      this.sendError(res, error as Error);
    }
  }

  /**
   * POST /users/:id/activate
   */
  async activateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.userService.activateUser(id);
      this.sendSuccess(res, null, "User activated");
    } catch (error) {
      this.sendError(res, error as Error);
    }
  }

  /**
   * POST /users/:id/deactivate
   */
  async deactivateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.userService.deactivateUser(id);
      this.sendSuccess(res, null, "User deactivated");
    } catch (error) {
      this.sendError(res, error as Error);
    }
  }

  /**
   * POST /users/:id/change-password
   */
  async changePassword(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { oldPassword, newPassword } = req.body;

      if (!oldPassword || !newPassword) {
        this.sendError(res, new AppError("Missing required fields", 400));
        return;
      }

      if (newPassword.length < 8) {
        this.sendError(
          res,
          new AppError("Password must be at least 8 characters", 400)
        );
        return;
      }

      await this.userService.changePassword(id, oldPassword, newPassword);
      this.sendSuccess(res, null, "Password changed");
    } catch (error) {
      this.sendError(res, error as Error);
    }
  }
}
