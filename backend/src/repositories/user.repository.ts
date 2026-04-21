import { Repository, Not } from "typeorm";
import { AppDataSource } from "@/config/database";
import { User, UserRole } from "@/entities/user.entity";
import { UserRoleEntity } from "@/entities/user-role.entity";

/**
 * User Repository
 *
 * Data access layer for User entity
 *
 * SOLID Principles:
 * - Single Responsibility: Only handles User data access
 * - Interface Segregation: Provides specific methods for user operations
 */

export class UserRepository {
  private repository: Repository<User>;
  private roleRepository: Repository<UserRoleEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(User);
    this.roleRepository = AppDataSource.getRepository(UserRoleEntity);
  }

  /**
   * Find a role entity by its code (e.g., "admin", "pm", "customer")
   */
  async findRoleByCode(code: string): Promise<UserRoleEntity | null> {
    return this.roleRepository.findOne({ where: { code } });
  }

  /**
   * Get all available roles
   */
  async findAllRoles(): Promise<UserRoleEntity[]> {
    return this.roleRepository.find({ order: { code: "ASC" } });
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({
      where: { email },
      relations: ["roleEntity"],
    });
  }

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<User | null> {
    return this.repository.findOne({
      where: { id },
      relations: ["roleEntity"],
    });
  }

  /**
   * Create new user
   */
  async create(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    phone?: string | null;
  }): Promise<User> {
    // Resolve role code to role_id
    const roleEntity = await this.findRoleByCode(userData.role);
    if (!roleEntity) {
      throw new Error(`Invalid role: ${userData.role}`);
    }

    const user = this.repository.create({
      email: userData.email,
      password: userData.password,
      firstName: userData.firstName,
      lastName: userData.lastName,
      roleId: roleEntity.id,
      phone: userData.phone,
    });
    const savedUser = await this.repository.save(user);

    // Re-fetch with relation to populate roleEntity getter
    return this.findById(savedUser.id) as Promise<User>;
  }

  /**
   * Update user's last login timestamp
   */
  async updateLastLogin(userId: string): Promise<void> {
    await this.repository.update(userId, {
      lastLoginAt: new Date(),
    });
  }

  /**
   * Check if user is active
   */
  async isActive(userId: string): Promise<boolean> {
    const user = await this.findById(userId);
    return user?.isActive ?? false;
  }

  /**
   * Find all users (for admin)
   */
  async findAll(options?: {
    skip?: number;
    take?: number;
  }): Promise<{ data: User[]; total: number }> {
    const [data, total] = await this.repository.findAndCount({
      relations: ["roleEntity"],
      skip: options?.skip || 0,
      take: options?.take || 20,
      order: { createdAt: "DESC" },
    });
    return { data, total };
  }

  /**
   * Find all users excluding a specific user (for admin - exclude self)
   */
  async findAllExcluding(
    excludeUserId: string,
    options?: {
      skip?: number;
      take?: number;
    }
  ): Promise<{ data: User[]; total: number }> {
    const [data, total] = await this.repository.findAndCount({
      where: { id: Not(excludeUserId) },
      relations: ["roleEntity"],
      skip: options?.skip || 0,
      take: options?.take || 200,
      order: { createdAt: "DESC" },
    });
    return { data, total };
  }

  /**
   * Update user
   * If updating role, resolves role code to role_id automatically
   */
  async update(id: string, userData: Partial<User> & { role?: UserRole }): Promise<void> {
    const updateData: any = { ...userData };

    // If role is being updated, resolve to role_id
    if (updateData.role) {
      const roleEntity = await this.findRoleByCode(updateData.role);
      if (!roleEntity) {
        throw new Error(`Invalid role: ${updateData.role}`);
      }
      updateData.roleId = roleEntity.id;
      delete updateData.role;
    }

    // Remove computed properties that aren't actual columns
    delete updateData.roleEntity;
    delete updateData.fullName;

    await this.repository.update(id, updateData);
  }

  /**
   * Delete user
   */
  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  /**
   * Find users by role
   */
  async findByRole(role: UserRole): Promise<User[]> {
    const roleEntity = await this.findRoleByCode(role);
    if (!roleEntity) {
      return [];
    }

    return this.repository.find({
      where: { roleId: roleEntity.id },
      relations: ["roleEntity"],
    });
  }

  /**
   * Check if email exists
   */
  async emailExists(email: string): Promise<boolean> {
    const user = await this.findByEmail(email);
    return !!user;
  }
}
