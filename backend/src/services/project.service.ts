import { ProjectRepository } from "@/repositories/project.repository";
import { AppError } from "@/utils/app-error";
import { Project, Space } from "@/entities/project.entity";

/**
 * Project Service
 *
 * Business logic for Project and Space operations
 * Only PM role can perform CRUD operations on projects and spaces
 *
 * SOLID Principles:
 * - Single Responsibility: Only handles project business logic
 * - Dependency Inversion: Depends on repository abstraction
 */

export interface CreateProjectInput {
  name: string;
  description?: string;
  projectKey: string;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
  projectKey?: string;
  isActive?: boolean;
}

export interface CreateSpaceInput {
  name: string;
  description?: string;
}

export interface UpdateSpaceInput {
  name?: string;
  description?: string;
  isActive?: boolean;
}

export class ProjectService {
  private projectRepo: ProjectRepository;

  constructor() {
    this.projectRepo = new ProjectRepository();
  }

  /**
   * Validate user role - only PM can manage projects
   */
  private validatePMRole(userRole: string): void {
    if (userRole !== "pm") {
      throw new AppError("project.pm_only", 403);
    }
  }

  /**
   * Get all projects (visible to all, but only PM can edit)
   */
  async getAllProjects(): Promise<Project[]> {
    return this.projectRepo.findAll();
  }

  /**
   * Get project by ID
   */
  async getProjectById(id: string): Promise<Project> {
    const project = await this.projectRepo.findProjectById(id);
    if (!project) {
      throw new AppError("project.not_found", 404);
    }
    return project;
  }

  /**
   * Get project with spaces
   */
  async getProjectWithSpaces(id: string): Promise<Project> {
    const project = await this.projectRepo.findProjectWithSpaces(id);
    if (!project) {
      throw new AppError("project.not_found", 404);
    }
    return project;
  }

  /**
   * Create project (PM ONLY)
   */
  async createProject(
    input: CreateProjectInput,
    userId: string,
    userRole: string
  ): Promise<Project> {
    this.validatePMRole(userRole);

    // Validate inputs
    if (!input.name || input.name.trim().length < 3) {
      throw new AppError("project.name_invalid", 400);
    }

    if (input.name.length > 255) {
      throw new AppError("project.name_too_long", 400);
    }

    if (!input.projectKey || input.projectKey.trim().length < 3) {
      throw new AppError("project.key_invalid", 400);
    }

    if (input.projectKey.length > 50) {
      throw new AppError("project.key_too_long", 400);
    }

    // Check projectKey is unique
    const isUnique = await this.projectRepo.isProjectKeyUnique(
      input.projectKey
    );
    if (!isUnique) {
      throw new AppError("project.key_exists", 400);
    }

    const projectData: Partial<Project> = {
      name: input.name.trim(),
      description: input.description,
      projectKey: input.projectKey.toUpperCase(),
      ownerId: userId,
      isActive: true,
    };

    return this.projectRepo.createProject(projectData);
  }

  /**
   * Update project (PM ONLY, owner only)
   */
  async updateProject(
    id: string,
    input: UpdateProjectInput,
    userId: string,
    userRole: string
  ): Promise<Project> {
    this.validatePMRole(userRole);

    const project = await this.getProjectById(id);

    // Check ownership
    if (project.ownerId !== userId) {
      throw new AppError("project.not_owner", 403);
    }

    const updateData: Partial<Project> = {};

    if (input.name !== undefined) {
      if (input.name.trim().length < 3) {
        throw new AppError("project.name_invalid", 400);
      }
      if (input.name.length > 255) {
        throw new AppError("project.name_too_long", 400);
      }
      updateData.name = input.name.trim();
    }

    if (input.description !== undefined) {
      updateData.description = input.description;
    }

    if (input.projectKey !== undefined) {
      if (input.projectKey.length < 3 || input.projectKey.length > 50) {
        throw new AppError("project.key_invalid", 400);
      }
      // Check uniqueness
      const isUnique = await this.projectRepo.isProjectKeyUnique(
        input.projectKey,
        id
      );
      if (!isUnique) {
        throw new AppError("project.key_exists", 400);
      }
      updateData.projectKey = input.projectKey.toUpperCase();
    }

    if (input.isActive !== undefined) {
      updateData.isActive = input.isActive;
    }

    await this.projectRepo.updateProject(id, updateData);
    return this.getProjectById(id);
  }

  /**
   * Delete project (PM ONLY, owner only)
   */
  async deleteProject(
    id: string,
    userId: string,
    userRole: string
  ): Promise<void> {
    this.validatePMRole(userRole);

    const project = await this.getProjectById(id);

    // Check ownership
    if (project.ownerId !== userId) {
      throw new AppError("project.not_owner", 403);
    }

    // Check if has active spaces
    const projectWithSpaces = await this.projectRepo.findProjectWithSpaces(id);
    if (projectWithSpaces?.spaces && projectWithSpaces.spaces.length > 0) {
      throw new AppError("project.has_spaces", 409);
    }

    await this.projectRepo.deleteProject(id);
  }

  // ===== SPACE OPERATIONS =====

  /**
   * Get spaces for project
   */
  async getSpacesForProject(projectId: string): Promise<Space[]> {
    // Verify project exists
    await this.getProjectById(projectId);
    return this.projectRepo.findSpacesByProjectId(projectId);
  }

  /**
   * Get space by ID
   */
  async getSpaceById(id: string): Promise<Space> {
    const space = await this.projectRepo.findSpaceById(id);
    if (!space) {
      throw new AppError("space.not_found", 404);
    }
    return space;
  }

  /**
   * Create space (PM ONLY, project owner only)
   */
  async createSpace(
    projectId: string,
    input: CreateSpaceInput,
    userId: string,
    userRole: string
  ): Promise<Space> {
    this.validatePMRole(userRole);

    const project = await this.getProjectById(projectId);

    // Check ownership
    if (project.ownerId !== userId) {
      throw new AppError("space.create_denied", 403);
    }

    // Validate input
    if (!input.name || input.name.trim().length < 3) {
      throw new AppError("space.name_invalid", 400);
    }

    if (input.name.length > 255) {
      throw new AppError("space.name_too_long", 400);
    }

    // Generate space key (based on project key)
    const spaceCount = (await this.projectRepo.findSpacesByProjectId(projectId))
      .length;
    const spaceKey = `${project.projectKey}-${spaceCount + 1}`;

    const spaceData: Partial<Space> = {
      name: input.name.trim(),
      description: input.description,
      projectId,
      isActive: true,
    };

    return this.projectRepo.createSpace(spaceData);
  }

  /**
   * Update space (PM ONLY, project owner only)
   */
  async updateSpace(
    spaceId: string,
    input: UpdateSpaceInput,
    userId: string,
    userRole: string
  ): Promise<Space> {
    this.validatePMRole(userRole);

    const space = await this.getSpaceById(spaceId);
    const project = await this.getProjectById(space.projectId);

    // Check ownership
    if (project.ownerId !== userId) {
      throw new AppError("space.update_denied", 403);
    }

    const updateData: Partial<Space> = {};

    if (input.name !== undefined) {
      if (input.name.trim().length < 3) {
        throw new AppError("space.name_invalid", 400);
      }
      if (input.name.length > 255) {
        throw new AppError("space.name_too_long", 400);
      }
      updateData.name = input.name.trim();
    }

    if (input.description !== undefined) {
      updateData.description = input.description;
    }

    if (input.isActive !== undefined) {
      updateData.isActive = input.isActive;
    }

    await this.projectRepo.updateSpace(spaceId, updateData);
    return this.getSpaceById(spaceId);
  }

  /**
   * Delete space (PM ONLY, project owner only)
   */
  async deleteSpace(
    spaceId: string,
    userId: string,
    userRole: string
  ): Promise<void> {
    this.validatePMRole(userRole);

    const space = await this.getSpaceById(spaceId);
    const project = await this.getProjectById(space.projectId);

    // Check ownership
    if (project.ownerId !== userId) {
      throw new AppError("space.delete_denied", 403);
    }

    await this.projectRepo.deleteSpace(spaceId);
  }
}
