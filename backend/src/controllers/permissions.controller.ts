import { Request, Response } from "express";
import { UserRepository } from "@/repositories/user.repository";

/**
 * Permissions Controller
 *
 * Returns permission groups (roles) from the user_roles table
 * Now backed by database instead of hardcoded enum values
 */

export class PermissionsController {
  private userRepo: UserRepository;

  constructor() {
    this.userRepo = new UserRepository();
  }

  /**
   * GET /permissions/groups
   * Returns available permission groups (role types) from the database
   */
  async getPermissionGroups(_req: Request, res: Response): Promise<void> {
    const roles = await this.userRepo.findAllRoles();

    const groups = roles.map((role, index) => ({
      id: role.id,
      name: role.name,
      description: role.description || "",
      roleType: role.code,
    }));

    res.json({
      success: true,
      data: groups,
      message: "Permission groups retrieved successfully",
    });
  }
}
