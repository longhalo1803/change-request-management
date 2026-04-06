import { Repository } from "typeorm";
import { AppDataSource } from "@/config/database";
import { User, UserRole } from "@/entities/user.entity";

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

  constructor() {
    this.repository = AppDataSource.getRepository(User);
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } });
  }

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<User | null> {
    return this.repository.findOne({ where: { id } });
  }

  /**
   * Create new user
   */
  async create(userData: {
    email: string;
    password: string;
    fullName: string;
    role: UserRole;
  }): Promise<User> {
    const user = this.repository.create(userData);
    return this.repository.save(user);
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
      select: [
        "id",
        "email",
        "fullName",
        "role",
        "isActive",
        "lastLoginAt",
        "createdAt",
        "updatedAt",
      ],
      skip: options?.skip || 0,
      take: options?.take || 20,
      order: { createdAt: "DESC" },
    });
    return { data, total };
  }

  /**
   * Update user
   */
  async update(id: string, userData: Partial<User>): Promise<void> {
    await this.repository.update(id, userData);
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
    return this.repository.find({
      where: { role },
      select: ["id", "email", "fullName", "role", "isActive", "createdAt"],
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
