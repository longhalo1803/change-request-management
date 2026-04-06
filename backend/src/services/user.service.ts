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
  fullName: string;
  role: UserRole;
}

export interface UpdateUserInput {
  email?: string;
  fullName?: string;
  role?: UserRole;
  isActive?: boolean;
}

export class UserService {
  private userRepo: UserRepository;

  constructor() {
    this.userRepo = new UserRepository();
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<Omit<User, "password">> {
    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new AppError("user.not_found", 404);
    }
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Get all users (admin)
   */
  async getAllUsers(
    page: number = 1,
    limit: number = 20
  ): Promise<{
    data: Omit<User, "password">[];
    total: number;
    page: number;
    limit: number;
  }> {
    const skip = (page - 1) * limit;
    const { data, total } = await this.userRepo.findAll({ skip, take: limit });

    const usersWithoutPassword = data.map(({ password: _, ...user }) => user);

    return {
      data: usersWithoutPassword,
      total,
      page,
      limit,
    };
  }

  /**
   * Get users by role
   */
  async getUsersByRole(role: UserRole): Promise<Omit<User, "password">[]> {
    const users = await this.userRepo.findByRole(role);
    return users.map(({ password: _, ...user }) => user);
  }

  /**
   * Create new user
   */
  async createUser(input: CreateUserInput): Promise<Omit<User, "password">> {
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
      fullName: input.fullName,
      role: input.role,
    });

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Update user
   */
  async updateUser(
    id: string,
    input: UpdateUserInput
  ): Promise<Omit<User, "password">> {
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

    const updateData: Partial<User> = {};
    if (input.email !== undefined) updateData.email = input.email;
    if (input.fullName !== undefined) updateData.fullName = input.fullName;
    if (input.role !== undefined) updateData.role = input.role;
    if (input.isActive !== undefined) updateData.isActive = input.isActive;

    await this.userRepo.update(id, updateData);

    const updatedUser = await this.userRepo.findById(id);
    if (!updatedUser) throw new AppError("user.not_found", 404);

    const { password: _, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  /**
   * Delete user
   */
  async deleteUser(id: string): Promise<void> {
    // Verify user exists
    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new AppError("user.not_found", 404);
    }

    await this.userRepo.delete(id);
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
}
