import { UserRepository } from "@/repositories/user.repository";
import { PasswordUtil } from "@/utils/password";
import { AppError } from "@/utils/app-error";
import { User, UserRole } from "@/entities/user.entity";

/**
 * User Service
 *
 * Business logic for user management
 *
 * SOLID Principles:
 * - Single Responsibility: Only handles user business logic
 * - Dependency Inversion: Depends on repository abstraction
 */

export interface CreateUserInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
}

export interface UpdateUserInput {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  phone?: string;
  isActive?: boolean;
}

export interface UpdateMyProfileInput {
  firstName?: string;
  lastName?: string;
  phone?: string;
}

/**
 * Safe user object without password
 */
export interface SafeUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone: string | null;
  role: UserRole;
  isActive: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * AdminUser shape expected by the frontend
 */
export interface AdminUserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  role: UserRole;
  status: "active" | "inactive";
  createdDate: Date;
  avatar: string;
}

export class UserService {
  private userRepo: UserRepository;

  constructor() {
    this.userRepo = new UserRepository();
  }

  /**
   * Strip password from User entity and include computed fullName
   */
  private toSafeUser(user: User): SafeUser {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName, // from getter
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  /**
   * Transform User entity to AdminUser response format
   */
  private toAdminUserResponse(user: User): AdminUserResponse {
    return {
      id: user.id,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email,
      phone: user.phone || null,
      role: user.role,
      status: user.isActive ? "active" : "inactive",
      createdDate: user.createdAt,
      avatar:
        `${(user.firstName || "?")[0]}${(user.lastName || "?")[0]}`.toUpperCase(),
    };
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<SafeUser> {
    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new AppError("user.not_found", 404);
    }
    return this.toSafeUser(user);
  }

  /**
   * Get all users (admin) - excludes the requesting admin
   */
  async getAllUsersExcludingSelf(
    currentUserId: string
  ): Promise<AdminUserResponse[]> {
    const { data } = await this.userRepo.findAllExcluding(currentUserId);
    return data.map((user) => this.toAdminUserResponse(user));
  }

  /**
   * Get all users (admin) - includes pagination
   */
  async getAllUsers(
    page: number = 1,
    limit: number = 20
  ): Promise<{
    data: SafeUser[];
    total: number;
    page: number;
    limit: number;
  }> {
    const skip = (page - 1) * limit;
    const { data, total } = await this.userRepo.findAll({ skip, take: limit });

    return {
      data: data.map((user) => this.toSafeUser(user)),
      total,
      page,
      limit,
    };
  }

  /**
   * Get users by role
   */
  async getUsersByRole(role: UserRole): Promise<SafeUser[]> {
    const users = await this.userRepo.findByRole(role);
    return users.map((user) => this.toSafeUser(user));
  }

  /**
   * Create new user
   */
  async createUser(input: CreateUserInput): Promise<AdminUserResponse> {
    // Check if email exists
    const emailExists = await this.userRepo.emailExists(input.email);
    if (emailExists) {
      throw new AppError("user.email_already_exists", 400);
    }

    // Hash password
    const hashedPassword = await PasswordUtil.hash(input.password);

    const user = await this.userRepo.create({
      email: input.email,
      password: hashedPassword,
      firstName: input.firstName,
      lastName: input.lastName,
      role: input.role,
      phone: input.phone || null,
    });

    return this.toAdminUserResponse(user);
  }

  /**
   * Update user
   */
  async updateUser(
    id: string,
    input: UpdateUserInput
  ): Promise<AdminUserResponse> {
    // Verify user exists
    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new AppError("user.not_found", 404);
    }

    // Check if new email is already taken by another user
    if (input.email && input.email !== user.email) {
      const emailExists = await this.userRepo.emailExists(input.email);
      if (emailExists) {
        throw new AppError("user.email_already_exists", 400);
      }
    }

    const updateData: Record<string, any> = {};
    if (input.email !== undefined) updateData.email = input.email;
    if (input.firstName !== undefined) updateData.firstName = input.firstName;
    if (input.lastName !== undefined) updateData.lastName = input.lastName;
    if (input.role !== undefined) updateData.role = input.role;
    if (input.phone !== undefined) updateData.phone = input.phone || null;
    if (input.isActive !== undefined) updateData.isActive = input.isActive;

    await this.userRepo.update(id, updateData);

    const updatedUser = await this.userRepo.findById(id);
    if (!updatedUser) throw new AppError("user.not_found", 404);

    return this.toAdminUserResponse(updatedUser);
  }

  /**
   * Update user status (activate/deactivate)
   */
  async updateUserStatus(
    id: string,
    status: "active" | "inactive"
  ): Promise<AdminUserResponse> {
    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new AppError("user.not_found", 404);
    }

    const isActive = status === "active";
    await this.userRepo.update(id, { isActive });

    const updatedUser = await this.userRepo.findById(id);
    if (!updatedUser) throw new AppError("user.not_found", 404);

    return this.toAdminUserResponse(updatedUser);
  }

  /**
   * Activate user
   */
  async activateUser(id: string): Promise<void> {
    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new AppError("user.not_found", 404);
    }

    await this.userRepo.update(id, { isActive: true });
  }

  /**
   * Deactivate user
   */
  async deactivateUser(id: string): Promise<void> {
    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new AppError("user.not_found", 404);
    }

    await this.userRepo.update(id, { isActive: false });
  }

  /**
   * Change user password
   */
  async changePassword(
    id: string,
    oldPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new AppError("user.not_found", 404);
    }

    // Verify old password
    const isPasswordValid = await PasswordUtil.compare(
      oldPassword,
      user.password
    );
    if (!isPasswordValid) {
      throw new AppError("user.invalid_password", 401);
    }

    // Hash new password
    const hashedPassword = await PasswordUtil.hash(newPassword);
    await this.userRepo.update(id, { password: hashedPassword });
  }

  /**
   * Update own profile (self-service for customer/PM)
   * Only allows safe fields: firstName, lastName, phone
   */
  async updateMyProfile(
    id: string,
    input: UpdateMyProfileInput
  ): Promise<SafeUser> {
    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new AppError("user.not_found", 404);
    }

    const updateData: Record<string, any> = {};
    if (input.firstName !== undefined) updateData.firstName = input.firstName;
    if (input.lastName !== undefined) updateData.lastName = input.lastName;
    if (input.phone !== undefined) updateData.phone = input.phone || null;

    if (Object.keys(updateData).length > 0) {
      await this.userRepo.update(id, updateData);
    }

    const updatedUser = await this.userRepo.findById(id);
    if (!updatedUser) throw new AppError("user.not_found", 404);

    return this.toSafeUser(updatedUser);
  }

  /**
   * Self-deactivate account (used when customer/PM "deletes" their profile)
   * Actually just sets isActive = false
   */
  async selfDeactivate(id: string): Promise<void> {
    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new AppError("user.not_found", 404);
    }

    await this.userRepo.update(id, { isActive: false });
  }
}
