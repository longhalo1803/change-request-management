import { Router } from "express";
import { ProjectController } from "@/controllers/project.controller";
import { requireAuth } from "@/middlewares/auth.middleware";

/**
 * Project Routes
 *
 * Endpoints for managing projects and spaces
 *
 * Permission Rules:
 * - All roles: Can view projects and spaces
 * - PM ONLY: Can create/update/delete projects and spaces (owner only)
 */

const router = Router();
const controller = new ProjectController();

// Apply auth middleware to all routes
router.use(requireAuth);

// ===== PROJECT ENDPOINTS =====

/**
 * GET /api/projects
 * Get all projects
 */
router.get("/", (req, res) => controller.getProjects(req, res));

/**
 * POST /api/projects
 * Create project (PM ONLY)
 */
router.post("/", (req, res) => controller.createProject(req, res));

/**
 * GET /api/projects/:id
 * Get single project with spaces
 */
router.get("/:id", (req, res) => controller.getProject(req, res));

/**
 * PUT /api/projects/:id
 * Update project (PM ONLY, owner only)
 */
router.put("/:id", (req, res) => controller.updateProject(req, res));

/**
 * DELETE /api/projects/:id
 * Delete project (PM ONLY, owner only)
 */
router.delete("/:id", (req, res) => controller.deleteProject(req, res));

// ===== SPACE ENDPOINTS =====

/**
 * GET /api/projects/:projectId/spaces
 * Get spaces for project
 */
router.get("/:projectId/spaces", (req, res) => controller.getSpaces(req, res));

/**
 * POST /api/projects/:projectId/spaces
 * Create space in project (PM ONLY, project owner only)
 */
router.post("/:projectId/spaces", (req, res) =>
  controller.createSpace(req, res)
);

/**
 * GET /api/projects/:projectId/spaces/:spaceId
 * Get single space
 */
router.get("/:projectId/spaces/:spaceId", (req, res) =>
  controller.getSpace(req, res)
);

/**
 * PUT /api/projects/:projectId/spaces/:spaceId
 * Update space (PM ONLY, project owner only)
 */
router.put("/:projectId/spaces/:spaceId", (req, res) =>
  controller.updateSpace(req, res)
);

/**
 * DELETE /api/projects/:projectId/spaces/:spaceId
 * Delete space (PM ONLY, project owner only)
 */
router.delete("/:projectId/spaces/:spaceId", (req, res) =>
  controller.deleteSpace(req, res)
);

export default router;
