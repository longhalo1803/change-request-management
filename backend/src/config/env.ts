import dotenv from "dotenv";
import path from "path";

// Load .env.local first (if exists), then .env
// This allows local development to override production values
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: path.join(__dirname, "../../.env.local") });
}
dotenv.config({ path: path.join(__dirname, "../../.env") });

export const config = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "3000", 10),
  apiPrefix: process.env.API_PREFIX || "/api",

  db: {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306", 10),
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_DATABASE || "cr_management",
    poolSize: parseInt(process.env.DB_POOL_SIZE || "25", 10),
  },

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || "access_secret",
    refreshSecret: process.env.JWT_REFRESH_SECRET || "refresh_secret",
    accessExpiresIn: (process.env.JWT_ACCESS_EXPIRES_IN || "15m") as string,
    refreshExpiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || "7d") as string,
  },

  upload: {
    dir: process.env.UPLOAD_DIR || "uploads",
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || "5242880", 10),
    allowedTypes: (process.env.ALLOWED_FILE_TYPES || "").split(","),
  },

  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
  logLevel: process.env.LOG_LEVEL || "info",
};
