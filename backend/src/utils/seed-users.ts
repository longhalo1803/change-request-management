import { AppDataSource } from "@/config/database";
import { User, UserRole } from "@/entities/user.entity";
import { PasswordUtil } from "@/utils/password";

async function seedUsers() {
  try {
    // Initialize database connection
    console.log("Connecting to the database...");
    await AppDataSource.initialize();
    console.log("Database connection initialized.");

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
        email: "customer@example.com",
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
        console.log(`Updated existing user: ${userData.email}`);
      } else {
        const newUser = userRepo.create({
          ...userData,
          password: hashedPassword,
          isActive: true,
        });
        await userRepo.save(newUser);
        console.log(`Created new user: ${userData.email}`);
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
      console.log("Deactivated old admin@example.com");
    }

    const oldPm = await userRepo.findOne({
      where: { email: "pm@example.com" },
    });
    if (oldPm) {
      oldPm.email = "old_pm_deprecated@example.com";
      oldPm.isActive = false;
      await userRepo.save(oldPm);
      console.log("Deactivated old pm@example.com");
    }

    console.log("Seed completed successfully!");
  } catch (error) {
    console.error("Error seeding users:", error);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

seedUsers();
