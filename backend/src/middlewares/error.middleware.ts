import { Request, Response, NextFunction } from "express";
import { AppError } from "@/utils/app-error";
import { logger } from "@/utils/logger";
import { config } from "@/config/env";

export const errorMiddleware = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  let statusCode = 500;
  let message = "Internal Server Error";

  if (err instanceof AppError) {
    statusCode = err.statusCode;

    // Transform dot notation (auth.invalid_credentials) to namespace notation (auth:invalid_credentials)
    // for i18next translation
    let i18nKey = err.message;
    if (i18nKey.includes(".")) {
      i18nKey = i18nKey.replace(".", ":");
    }

    // Use type assertion to bypass strict type checking for dynamic translation keys
    message = req.t ? req.t(i18nKey as any) : err.message;
  }

  // Log error
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
  });

  // Send response
  res.status(statusCode).json({
    success: false,
    message,
    ...(config.nodeEnv === "development" && { stack: err.stack }),
  });
};
