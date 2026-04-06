import { AppDataSource } from "@/config/database";
import { UserRepository } from "@/repositories/user.repository";
import { UserRole } from "@/entities/user.entity";
import { PasswordUtil } from "./password";
import { logger } from "./logger";

/**
 * Seed Users Script
 *
 * Creates default users for testing:
 * - Admin user
 * - PM (Project Manager) user
 * - Customer user
 *
 * Usage: ts-node -r tsconfig-paths/register src/utils/seed-users.ts
 */

const seedUsers = async () => {
  try {
    // Initialize database
    await AppDataSource.initialize();
    logger.info("Database connected");

    const userRepo = new UserRepository();

    // Default users
    const defaultUsers = [
      {
        email: "admin@example.com",
        password: await PasswordUtil.hash("Admin@123"),
        fullName: "System Administrator",
        role: UserRole.ADMIN,
      },
      {
        email: "pm@example.com",
        password: await PasswordUtil.hash("PM@123"),
        fullName: "Project Manager",
        role: UserRole.PM,
      },
      {
        email: "customer@example.com",
        password: await PasswordUtil.hash("Customer@123"),
        fullName: "Test Customer",
        role: UserRole.CUSTOMER,
      },
    ];

    // Create users
    for (const userData of defaultUsers) {
      const existingUser = await userRepo.findByEmail(userData.email);
      if (!existingUser) {
        await userRepo.create(userData);
        logger.info(`Created user: ${userData.email}`);
      } else {
        logger.info(`User already exists: ${userData.email}`);
      }
    }

    logger.info("Seed completed successfully");
    process.exit(0);
  } catch (error) {
    logger.error("Seed failed:", error);
    process.exit(1);
  }
};

seedUsers();
