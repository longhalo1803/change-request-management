import "reflect-metadata";
import { createApp } from "./app";
import { AppDataSource } from "@/config/database";
import { initializeI18n } from "@/config/i18n";
import { config } from "@/config/env";
import { logger } from "@/utils/logger";
import { checkMigrations } from "@/scripts/check-migrations";

const startServer = async () => {
  try {
    // Initialize i18n
    await initializeI18n();
    logger.info("i18n initialized with languages: en, ja, vi");

    // Initialize database connection
    await AppDataSource.initialize();
    logger.info("Database connection established");

    // Check if all migrations have been run
    const migrationsOk = await checkMigrations();
    if (!migrationsOk) {
      logger.warn(
        "⚠️  Database migrations are not up to date. Please run migrations manually using:"
      );
      logger.info("Run: docker-compose exec backend npm run migration:run");
      // Don't exit, allow server to start anyway
    }

    // Create Express app
    const app = createApp();

    // Start server
    app.listen(config.port, () => {
      logger.info(
        `Server is running on port ${config.port} in ${config.nodeEnv} mode`
      );
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
