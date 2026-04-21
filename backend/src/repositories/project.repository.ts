import { Repository } from "typeorm";
import { AppDataSource } from "@/config/database";
import {
  Project,
  Space,
  Sprint,
} from "@/entities/project.entity";

/**
 * Project Repository
 *
 * Data access layer for Project, Space, Sprint entities
 *
 * SOLID Principles:
 * - Single Responsibility: Only handles project data access
 * - Interface Segregation: Provides specific methods for project operations
 */

export class ProjectRepository {
  private projectRepo: Repository<Project>;
  private spaceRepo: Repository<Space>;
  private sprintRepo: Repository<Sprint>;

  constructor() {
    this.projectRepo = AppDataSource.getRepository(Project);
    this.spaceRepo = AppDataSource.getRepository(Space);
    this.sprintRepo = AppDataSource.getRepository(Sprint);
  }

  // ===== Project CRUD =====

  /**
   * Find project by ID with relations
   */
  async findProjectById(id: string): Promise<Project | null> {
    return this.projectRepo.findOne({
      where: { id },
      relations: ["owner"],
    });
  }

  /**
   * Find project by projectKey
   */
  async findProjectByKey(projectKey: string): Promise<Project | null> {
    return this.projectRepo.findOne({
      where: { projectKey },
      relations: ["owner"],
    });
  }

  /**
   * Find project with spaces
   */
  async findProjectWithSpaces(id: string): Promise<Project | null> {
    return this.projectRepo.findOne({
      where: { id },
      relations: ["owner", "spaces"],
    });
  }

  /**
   * Get all projects with owner
   */
  async findAll(): Promise<Project[]> {
    return this.projectRepo.find({
      relations: ["owner"],
      order: { createdAt: "DESC" },
    });
  }

  /**
   * Get projects by owner ID
   */
  async findByOwnerId(ownerId: string): Promise<Project[]> {
    return this.projectRepo.find({
      where: { ownerId },
      relations: ["owner"],
      order: { createdAt: "DESC" },
    });
  }

  /**
   * Create project
   */
  async createProject(projectData: Partial<Project>): Promise<Project> {
    const project = this.projectRepo.create(projectData);
    return this.projectRepo.save(project);
  }

  /**
   * Update project
   */
  async updateProject(
    id: string,
    projectData: Partial<Project>
  ): Promise<void> {
    await this.projectRepo.update(id, projectData);
  }

  /**
   * Delete project
   */
  async deleteProject(id: string): Promise<void> {
    await this.projectRepo.delete(id);
  }

  /**
   * Check if project key is unique
   */
  async isProjectKeyUnique(
    projectKey: string,
    excludeId?: string
  ): Promise<boolean> {
    let query = this.projectRepo.createQueryBuilder("p");
    query.where("p.projectKey = :projectKey", { projectKey });

    if (excludeId) {
      query.andWhere("p.id != :excludeId", { excludeId });
    }

    const count = await query.getCount();
    return count === 0;
  }

  // ===== Space CRUD =====

  /**
   * Find space by ID
   */
  async findSpaceById(id: string): Promise<Space | null> {
    return this.spaceRepo.findOne({
      where: { id },
      relations: ["project"],
    });
  }

  /**
   * Get all spaces for a project
   */
  async findSpacesByProjectId(projectId: string): Promise<Space[]> {
    return this.spaceRepo.find({
      where: { projectId },
      relations: ["project"],
      order: { createdAt: "DESC" },
    });
  }

  /**
   * Create space
   */
  async createSpace(spaceData: Partial<Space>): Promise<Space> {
    const space = this.spaceRepo.create(spaceData);
    return this.spaceRepo.save(space);
  }

  /**
   * Update space
   */
  async updateSpace(id: string, spaceData: Partial<Space>): Promise<void> {
    await this.spaceRepo.update(id, spaceData);
  }

  /**
   * Delete space
   */
  async deleteSpace(id: string): Promise<void> {
    await this.spaceRepo.delete(id);
  }

  /**
   * Get spaces by project with CR count
   */
  async findSpacesWithStats(projectId: string): Promise<any[]> {
    return this.spaceRepo
      .createQueryBuilder("s")
      .leftJoinAndSelect("s.project", "p")
      .leftJoin("change_requests", "cr", "cr.space_id = s.id")
      .where("s.project_id = :projectId", { projectId })
      .select("s.*")
      .addSelect("COUNT(cr.id)", "cr_count")
      .groupBy("s.id")
      .orderBy("s.created_at", "DESC")
      .getRawMany();
  }


  // ===== Sprint CRUD =====

  /**
   * Get sprints for a space
   */
  async findSprintsBySpaceId(spaceId: string): Promise<Sprint[]> {
    return this.sprintRepo.find({
      where: { spaceId },
      relations: ["space"],
      order: { startDate: "DESC" },
    });
  }

  /**
   * Create sprint
   */
  async createSprint(sprintData: Partial<Sprint>): Promise<Sprint> {
    const sprint = this.sprintRepo.create(sprintData);
    return this.sprintRepo.save(sprint);
  }

  /**
   * Update sprint
   */
  async updateSprint(id: string, sprintData: Partial<Sprint>): Promise<void> {
    await this.sprintRepo.update(id, sprintData);
  }

  /**
   * Delete sprint
   */
  async deleteSprint(id: string): Promise<void> {
    await this.sprintRepo.delete(id);
  }
}
