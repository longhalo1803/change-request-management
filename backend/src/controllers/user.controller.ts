import { Request, Response } from "express";
import { UserService } from "@/services/user.service";
import { AppError } from "@/utils/app-error";
import { UserRole } from "@/entities/user.entity";

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
   * GET /users/:id
   */
  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await this.userService.getUserById(id);
      res.json({ status: "success", data: user });
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
   * GET /users
   */
  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await this.userService.getAllUsers(page, limit);
      res.json({ status: "success", data: result });
    } catch (error) {
      res
        .status(500)
        .json({ status: "error", message: "Internal server error" });
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
        res.status(400).json({ status: "error", message: "Invalid role" });
        return;
      }

      const users = await this.userService.getUsersByRole(role as UserRole);
      res.json({ status: "success", data: users });
    } catch (error) {
      res
        .status(500)
        .json({ status: "error", message: "Internal server error" });
    }
  }

  /**
   * POST /users
   */
  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, fullName, role } = req.body;

      // Validate required fields
      if (!email || !password || !fullName || !role) {
        res
          .status(400)
          .json({ status: "error", message: "Missing required fields" });
        return;
      }

      // Validate role
      if (!Object.values(UserRole).includes(role)) {
        res.status(400).json({ status: "error", message: "Invalid role" });
        return;
      }

      // Validate password strength (at least 8 characters)
      if (password.length < 8) {
        res
          .status(400)
          .json({
            status: "error",
            message: "Password must be at least 8 characters",
          });
        return;
      }

      const user = await this.userService.createUser({
        email,
        password,
        fullName,
        role,
      });

      res.status(201).json({ status: "success", data: user });
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
   * PUT /users/:id
   */
  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { email, fullName, role, isActive } = req.body;

      // Validate role if provided
      if (role && !Object.values(UserRole).includes(role)) {
        res.status(400).json({ status: "error", message: "Invalid role" });
        return;
      }

      const user = await this.userService.updateUser(id, {
        email,
        fullName,
        role,
        isActive,
      });

      res.json({ status: "success", data: user });
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
   * DELETE /users/:id
   */
  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.userService.deleteUser(id);
      res.json({ status: "success", message: "User deleted" });
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
   * POST /users/:id/activate
   */
  async activateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.userService.activateUser(id);
      res.json({ status: "success", message: "User activated" });
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
   * POST /users/:id/deactivate
   */
  async deactivateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.userService.deactivateUser(id);
      res.json({ status: "success", message: "User deactivated" });
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
   * POST /users/:id/change-password
   */
  async changePassword(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { oldPassword, newPassword } = req.body;

      if (!oldPassword || !newPassword) {
        res
          .status(400)
          .json({ status: "error", message: "Missing required fields" });
        return;
      }

      if (newPassword.length < 8) {
        res
          .status(400)
          .json({
            status: "error",
            message: "Password must be at least 8 characters",
          });
        return;
      }

      await this.userService.changePassword(id, oldPassword, newPassword);
      res.json({ status: "success", message: "Password changed" });
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
