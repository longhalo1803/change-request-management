import multer, { StorageEngine } from "multer";
import path from "path";
import fs from "fs";
import { Request, Express } from "express";

/**
 * File Upload Middleware
 *
 * Handles file uploads for change request attachments
 * Storage: Local disk (/backend/uploads/change-requests/:crId/)
 * Max file size: 10MB
 * Max files per request: 5
 */

// Create uploads directory if it doesn't exist
const uploadDir = path.join(process.cwd(), "uploads", "change-requests");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage: StorageEngine = multer.diskStorage({
  destination: (req: Request, file, cb) => {
    // Create CR-specific directory
    const crId = req.params.id;
    const crDir = path.join(uploadDir, crId);

    if (!fs.existsSync(crDir)) {
      fs.mkdirSync(crDir, { recursive: true });
    }

    cb(null, crDir);
  },
  filename: (req: Request, file, cb) => {
    // Generate unique filename: timestamp-originalname
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    const filename = `${timestamp}-${name}${ext}`;
    cb(null, filename);
  },
});

// File filter
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "image/png",
    "image/jpeg",
    "image/jpg",
    "application/zip",
  ];

  const allowedExtensions = [
    ".pdf",
    ".doc",
    ".docx",
    ".xls",
    ".xlsx",
    ".png",
    ".jpg",
    ".jpeg",
    ".zip",
  ];

  const fileExt = path.extname(file.originalname).toLowerCase();

  if (
    allowedTypes.includes(file.mimetype) &&
    allowedExtensions.includes(fileExt)
  ) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type: ${file.mimetype}`));
  }
};

// Configure multer
export const uploadFiles = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 5, // Max 5 files per request
  },
});

/**
 * Utility function to get file URL for serving
 */
export const getFileUrl = (crId: string, filename: string): string => {
  return `/api/uploads/change-requests/${crId}/${filename}`;
};

/**
 * Utility function to delete file from disk
 */
export const deleteFile = (crId: string, filename: string): void => {
  const filePath = path.join(uploadDir, crId, filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

/**
 * Utility function to get relative file path for database storage
 */
export const getRelativeFilePath = (crId: string, filename: string): string => {
  return `/uploads/change-requests/${crId}/${filename}`;
};
