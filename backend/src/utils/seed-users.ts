import { AppDataSource } from "@/config/database";
import { User, UserRole } from "@/entities/user.entity";
import { PasswordUtil } from "@/utils/password";
import { logger } from "@/utils/logger";

async function seedUsers() {
  try {
    // Initialize database connection
    logger.info("Connecting to the database...");
    await AppDataSource.initialize();
    logger.info("Database connection initialized.");

    const userRepo = AppDataSource.getRepository(User);

    // Prepare users to seed
    const usersToSeed = [
      {
        email: "admin@solashi.com",
        password: "Admin@123",
        fullName: "System Admin",
        role: UserRole.ADMIN,
      },
      {
        email: "pm@solashi.com",
        password: "Pm@123",
        fullName: "Project Manager",
        role: UserRole.PM,
      },
      {
        email: "customer@solashi.com",
        password: "Customer@123",
        fullName: "Demo Customer",
        role: UserRole.CUSTOMER,
      },
    ];

    // Upsert users
    for (const userData of usersToSeed) {
      const existingUser = await userRepo.findOne({
        where: { email: userData.email },
      });
      const hashedPassword = await PasswordUtil.hash(userData.password);

      if (existingUser) {
        existingUser.password = hashedPassword;
        existingUser.fullName = userData.fullName;
        existingUser.role = userData.role;
        existingUser.isActive = true;
        await userRepo.save(existingUser);
        if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
          logger.debug(`Updated existing user: ${userData.email}`);
        }
      } else {
        const newUser = userRepo.create({
          ...userData,
          password: hashedPassword,
          isActive: true,
        });
        await userRepo.save(newUser);
        if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
          logger.debug(`Created new user: ${userData.email}`);
        }
      }
    }

    // Clean up old example.com users if they exist to avoid confusion
    // Instead of deleting, just deactivate them or rename them to avoid FK constraint errors
    const oldAdmin = await userRepo.findOne({
      where: { email: "admin@example.com" },
    });
    if (oldAdmin) {
      oldAdmin.email = "old_admin_deprecated@example.com";
      oldAdmin.isActive = false;
      await userRepo.save(oldAdmin);
      logger.info("Deactivated old admin@example.com");
    }

    const oldPm = await userRepo.findOne({
      where: { email: "pm@example.com" },
    });
    if (oldPm) {
      oldPm.email = "old_pm_deprecated@example.com";
      oldPm.isActive = false;
      await userRepo.save(oldPm);
      logger.info("Deactivated old pm@example.com");
    }

    const oldCustomer = await userRepo.findOne({
      where: { email: "customer@example.com" },
    });
    if (oldCustomer) {
      oldCustomer.email = "old_customer_deprecated@example.com";
      oldCustomer.isActive = false;
      await userRepo.save(oldCustomer);
      logger.info("Deactivated old customer@example.com");
    }

    logger.info("Seed completed successfully!");
  } catch (error) {
    logger.error("Error seeding users:", error);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

seedUsers();
