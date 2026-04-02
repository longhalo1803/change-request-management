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
 * - BrSE user
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
        email: "admin@solashi.com",
        password: await PasswordUtil.hash("Admin@123"),
        fullName: "System Administrator",
        role: UserRole.ADMIN,
      },
      {
        email: "brse@solashi.com",
        password: await PasswordUtil.hash("Brse@123"),
        fullName: "BrSE Manager",
        role: UserRole.BRSE,
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
