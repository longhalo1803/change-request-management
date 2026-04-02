import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { config } from "@/config/env";
import { i18nMiddleware } from "@/config/i18n";
import { languageMiddleware } from "@/middlewares/language.middleware";
import { errorMiddleware } from "@/middlewares/error.middleware";
import routes from "@/routes";

export const createApp = (): Application => {
  const app = express();

  // Security middleware
  app.use(helmet());

  // CORS configuration
  app.use(
    cors({
      origin: config.corsOrigin,
      credentials: true,
    }),
  );

  // Logging middleware
  if (config.nodeEnv === "development") {
    app.use(morgan("dev"));
  } else {
    app.use(morgan("combined"));
  }

  // Body parser middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // i18n middleware (must be before routes)
  app.use(i18nMiddleware);
  app.use(languageMiddleware);

  // Static files for uploads
  app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

  // Health check endpoint
  app.get("/health", (req, res) => {
    res.json({ success: true, message: "Server is running" });
  });

  // API routes
  app.use(config.apiPrefix, routes);

  // Error handling middleware (must be last)
  app.use(errorMiddleware);

  return app;
};
