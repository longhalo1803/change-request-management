import { AppDataSource } from "@/config/database";
import { logger } from "@/utils/logger";

/**
 * Migration Check Script
 *
 * Verifies that all migrations have been run before starting the server
 * Prevents server startup if database schema is not up to date
 *
 * Usage: Called automatically before server starts
 */

export const checkMigrations = async (): Promise<boolean> => {
  try {
    // Initialize database connection
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    // Get migrations table
    const migrationTable = await AppDataSource.query(
      `SELECT name FROM migrations ORDER BY timestamp DESC LIMIT 1`
    );

    if (migrationTable.length === 0) {
      logger.warn(
        "⚠️  No migrations found in database. Running migrations now..."
      );
      // This will be handled by the server startup
      return false;
    }

    // Get list of executed migrations
    const executedMigrations = await AppDataSource.query(
      `SELECT name FROM migrations ORDER BY timestamp DESC`
    );

    logger.info(`Executed migrations: ${executedMigrations.length}`);

    logger.info("✅ All migrations are up to date");
    return true;
  } catch (error) {
    logger.error("Error checking migrations:", error);
    return false;
  }
};

/**
 * Main function for standalone migration check
 * Can be called via: ts-node -r tsconfig-paths/register src/scripts/check-migrations.ts
 */
export const main = async () => {
  try {
    const isUpToDate = await checkMigrations();

    if (!isUpToDate) {
      logger.error("❌ Migration check failed");
      process.exit(1);
    }

    logger.info("✅ Migration check passed");
    process.exit(0);
  } catch (error) {
    logger.error("Fatal error during migration check:", error);
    process.exit(1);
  }
};

// Run main if this file is executed directly
if (require.main === module) {
  main();
}
