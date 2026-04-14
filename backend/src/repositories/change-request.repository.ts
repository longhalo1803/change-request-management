import { Repository } from "typeorm";
import { AppDataSource } from "@/config/database";
import {
  ChangeRequest,
  ChangeRequestComment,
  ChangeRequestAttachment,
  ChangeRequestStatusHistory,
} from "@/entities/change-request.entity";

/**
 * ChangeRequest Repository
 *
 * Data access layer for ChangeRequest entity and related entities
 *
 * SOLID Principles:
 * - Single Responsibility: Only handles CR data access
 * - Interface Segregation: Provides specific methods for CR operations
 */

export class ChangeRequestRepository {
  private crRepository: Repository<ChangeRequest>;
  private commentRepository: Repository<ChangeRequestComment>;
  private attachmentRepository: Repository<ChangeRequestAttachment>;
  private historyRepository: Repository<ChangeRequestStatusHistory>;

  constructor() {
    this.crRepository = AppDataSource.getRepository(ChangeRequest);
    this.commentRepository = AppDataSource.getRepository(ChangeRequestComment);
    this.attachmentRepository = AppDataSource.getRepository(
      ChangeRequestAttachment
    );
    this.historyRepository = AppDataSource.getRepository(
      ChangeRequestStatusHistory
    );
  }

  // ===== Change Request CRUD =====

  /**
   * Find CR by ID with all relations
   */
  async findById(id: string): Promise<ChangeRequest | null> {
    return this.crRepository.findOne({
      where: { id },
      relations: [
        "space",
        "sprint",
        "status",
        "priority",
        "worktype",
        "creator",
        "assignee",
        "comments",
        "comments.commenter",
        "attachments",
        "attachments.uploader",
        "statusHistory",
        "statusHistory.changedByUser",
        "statusHistory.status",
      ],
    });
  }

  /**
   * Find CR by crKey (unique identifier)
   */
  async findByCrKey(crKey: string): Promise<ChangeRequest | null> {
    return this.crRepository.findOne({
      where: { crKey },
      relations: [
        "space",
        "sprint",
        "status",
        "priority",
        "worktype",
        "creator",
        "assignee",
      ],
    });
  }

  /**
   * Get all CRs for a space with pagination
   */
  async findBySpaceId(
    spaceId: string,
    options?: { skip?: number; take?: number }
  ): Promise<{ data: ChangeRequest[]; total: number }> {
    const [data, total] = await this.crRepository.findAndCount({
      where: { spaceId },
      relations: [
        "space",
        "sprint",
        "status",
        "priority",
        "worktype",
        "creator",
        "assignee",
      ],
      skip: options?.skip || 0,
      take: options?.take || 20,
      order: { createdAt: "DESC" },
    });
    return { data, total };
  }

  /**
   * Get all CRs assigned to a user
   */
  async findByAssigneeId(
    assigneeId: string,
    options?: { skip?: number; take?: number }
  ): Promise<{ data: ChangeRequest[]; total: number }> {
    const [data, total] = await this.crRepository.findAndCount({
      where: { assignedTo: assigneeId },
      relations: [
        "space",
        "sprint",
        "status",
        "priority",
        "worktype",
        "creator",
      ],
      skip: options?.skip || 0,
      take: options?.take || 20,
      order: { createdAt: "DESC" },
    });
    return { data, total };
  }

  /**
   * Get all CRs created by a user
   */
  async findByCreatedById(
    createdBy: string,
    options?: { skip?: number; take?: number }
  ): Promise<{ data: ChangeRequest[]; total: number }> {
    const [data, total] = await this.crRepository.findAndCount({
      where: { createdBy },
      relations: [
        "space",
        "sprint",
        "status",
        "priority",
        "worktype",
        "assignee",
      ],
      skip: options?.skip || 0,
      take: options?.take || 20,
      order: { createdAt: "DESC" },
    });
    return { data, total };
  }

  /**
   * Create new CR
   */
  async create(crData: Partial<ChangeRequest>): Promise<ChangeRequest> {
    const cr = this.crRepository.create(crData);
    return this.crRepository.save(cr);
  }

  /**
   * Update CR
   */
  async update(id: string, crData: Partial<ChangeRequest>): Promise<void> {
    await this.crRepository.update(id, crData);
  }

  /**
   * Delete CR (cascade will delete related comments, attachments, history)
   */
  async delete(id: string): Promise<void> {
    await this.crRepository.delete(id);
  }

  // ===== Comments =====

  /**
   * Get all comments for a CR
   */
  async findCommentsByCrId(crId: string): Promise<ChangeRequestComment[]> {
    return this.commentRepository.find({
      where: { changeRequestId: crId },
      relations: ["commenter"],
      order: { createdAt: "ASC" },
    });
  }

  /**
   * Create comment
   */
  async createComment(
    commentData: Partial<ChangeRequestComment>
  ): Promise<ChangeRequestComment> {
    const comment = this.commentRepository.create(commentData);
    return this.commentRepository.save(comment);
  }

  /**
   * Delete comment
   */
  async deleteComment(id: string): Promise<void> {
    await this.commentRepository.delete(id);
  }

  // ===== Attachments =====

  /**
   * Get all attachments for a CR
   */
  async findAttachmentsByCrId(
    crId: string
  ): Promise<ChangeRequestAttachment[]> {
    return this.attachmentRepository.find({
      where: { changeRequestId: crId },
      relations: ["uploader"],
      order: { createdAt: "DESC" },
    });
  }

  /**
   * Create attachment
   */
  async createAttachment(
    attachmentData: Partial<ChangeRequestAttachment>
  ): Promise<ChangeRequestAttachment> {
    const attachment = this.attachmentRepository.create(attachmentData);
    return this.attachmentRepository.save(attachment);
  }

  /**
   * Delete attachment
   */
  async deleteAttachment(id: string): Promise<void> {
    await this.attachmentRepository.delete(id);
  }

  // ===== Status History =====

  /**
   * Get status history for a CR
   */
  async findStatusHistoryByCrId(
    crId: string
  ): Promise<ChangeRequestStatusHistory[]> {
    return this.historyRepository.find({
      where: { changeRequestId: crId },
      relations: ["status", "changedByUser"],
      order: { createdAt: "DESC" },
    });
  }

  /**
   * Create status history record
   */
  async createStatusHistory(
    historyData: Partial<ChangeRequestStatusHistory>
  ): Promise<ChangeRequestStatusHistory> {
    const history = this.historyRepository.create(historyData);
    return this.historyRepository.save(history);
  }

  // ===== Advanced Search & Filter =====

  /**
   * Search and filter CRs with advanced options
   */
  async searchAndFilter(filters: {
    search?: string;
    status?: string;
    priority?: string;
    spaceId?: string;
    assignedTo?: string;
    createdBy?: string;
    excludeStatus?: string; // For excluding DRAFT status
    onlyUserDrafts?: string; // userId: If set, only return DRAFTs if createdBy matches this user
    sortBy?: "created_at" | "priority" | "status";
    sortOrder?: "ASC" | "DESC";
    skip?: number;
    take?: number;
  }): Promise<{ data: ChangeRequest[]; total: number }> {
    let query = this.crRepository.createQueryBuilder("cr");

    // Include relations
    query
      .leftJoinAndSelect("cr.space", "space")
      .leftJoinAndSelect("cr.sprint", "sprint")
      .leftJoinAndSelect("cr.status", "status")
      .leftJoinAndSelect("cr.priority", "priority")
      .leftJoinAndSelect("cr.worktype", "worktype")
      .leftJoinAndSelect("cr.creator", "creator")
      .leftJoinAndSelect("cr.assignee", "assignee");

    // Search by crKey, title, or creator name
    if (filters.search) {
      query.andWhere(
        `(cr.crKey LIKE :search OR cr.title LIKE :search OR creator.fullName LIKE :search)`,
        { search: `%${filters.search}%` }
      );
    }

    // Filter by status
    if (filters.status) {
      query.andWhere("status.id = :statusId", { statusId: filters.status });
    }

    // Role-based visibility
    if (filters.onlyUserDrafts) {
      // Customer: Only see DRAFTs if they created them. For non-DRAFTs, anyone can see them.
      query.andWhere(
        `(status.name != 'DRAFT' OR (status.name = 'DRAFT' AND cr.createdBy = :userId))`,
        { userId: filters.onlyUserDrafts }
      );
    } else if (filters.excludeStatus) {
      query.andWhere("status.id != :excludeStatusId", {
        excludeStatusId: filters.excludeStatus,
      });
    }

    // Filter by priority
    if (filters.priority) {
      query.andWhere("priority.id = :priorityId", {
        priorityId: filters.priority,
      });
    }

    // Filter by space
    if (filters.spaceId) {
      query.andWhere("cr.spaceId = :spaceId", { spaceId: filters.spaceId });
    }

    // Filter by assignee
    if (filters.assignedTo) {
      query.andWhere("cr.assignedTo = :assignedTo", {
        assignedTo: filters.assignedTo,
      });
    }

    // Filter by creator
    if (filters.createdBy) {
      query.andWhere("cr.createdBy = :createdBy", {
        createdBy: filters.createdBy,
      });
    }

    // Get total count before pagination
    const total = await query.getCount();

    // Sorting
    const sortBy = filters.sortBy || "created_at";
    const sortOrder = filters.sortOrder || "DESC";

    if (sortBy === "created_at") {
      query.orderBy("cr.createdAt", sortOrder);
    } else if (sortBy === "priority") {
      query.orderBy("priority.level", sortOrder);
    } else if (sortBy === "status") {
      query.orderBy("status.name", sortOrder);
    }

    // Pagination
    if (filters.skip !== undefined) {
      query.skip(filters.skip);
    }
    if (filters.take !== undefined) {
      query.take(filters.take);
    }

    const data = await query.getMany();

    return { data, total };
  }

  /**
   * Find all CRs visible to a user (based on role and status)
   */
  async findVisibleToUser(
    userId: string,
    userRole: string,
    filters?: {
      spaceId?: string;
      statusId?: string;
      skip?: number;
      take?: number;
      sortBy?: "created_at" | "priority" | "status";
      sortOrder?: "ASC" | "DESC";
    }
  ): Promise<{ data: ChangeRequest[]; total: number }> {
    let query = this.crRepository.createQueryBuilder("cr");

    query
      .leftJoinAndSelect("cr.space", "space")
      .leftJoinAndSelect("cr.sprint", "sprint")
      .leftJoinAndSelect("cr.status", "status")
      .leftJoinAndSelect("cr.priority", "priority")
      .leftJoinAndSelect("cr.worktype", "worktype")
      .leftJoinAndSelect("cr.creator", "creator")
      .leftJoinAndSelect("cr.assignee", "assignee");

    // Apply visibility rules based on role
    if (userRole === "CUSTOMER") {
      // Customer sees: Their own DRAFT CRs + all non-DRAFT CRs
      query.andWhere(
        `(cr.createdBy = :userId AND status.name = 'DRAFT') OR status.name != 'DRAFT'`,
        { userId }
      );
    } else if (userRole === "PM") {
      // PM sees: All CRs except DRAFT
      query.andWhere(`status.name != 'DRAFT'`);
    }
    // Admin sees everything (no filter needed)

    // Apply additional filters
    if (filters?.spaceId) {
      query.andWhere("cr.spaceId = :spaceId", { spaceId: filters.spaceId });
    }

    if (filters?.statusId) {
      query.andWhere("status.id = :statusId", { statusId: filters.statusId });
    }

    // Get total count
    const total = await query.getCount();

    // Sorting
    const sortBy = filters?.sortBy || "created_at";
    const sortOrder = filters?.sortOrder || "DESC";

    if (sortBy === "created_at") {
      query.orderBy("cr.createdAt", sortOrder);
    } else if (sortBy === "priority") {
      query.orderBy("priority.level", sortOrder);
    } else if (sortBy === "status") {
      query.orderBy("status.name", sortOrder);
    }

    // Pagination
    if (filters?.skip !== undefined) {
      query.skip(filters.skip);
    }
    if (filters?.take !== undefined) {
      query.take(filters.take);
    }

    const data = await query.getMany();

    return { data, total };
  }

  /**
   * Count CRs by status for kanban board
   */
  async countByStatus(statusNames: string[]): Promise<Record<string, number>> {
    const result = await this.crRepository
      .createQueryBuilder("cr")
      .leftJoinAndSelect("cr.status", "status")
      .where("status.name IN (:...statusNames)", { statusNames })
      .select("status.name", "name")
      .addSelect("COUNT(cr.id)", "count")
      .groupBy("status.name")
      .getRawMany();

    const counts: Record<string, number> = {};
    result.forEach((row) => {
      counts[row.name] = parseInt(row.count);
    });

    return counts;
  }

  /**
   * Get all CRs without pagination (for kanban board)
   */
  async findAllWithRelations(filters?: {
    spaceId?: string;
    excludeStatus?: string;
  }): Promise<ChangeRequest[]> {
    let query = this.crRepository.createQueryBuilder("cr");

    query
      .leftJoinAndSelect("cr.space", "space")
      .leftJoinAndSelect("cr.sprint", "sprint")
      .leftJoinAndSelect("cr.status", "status")
      .leftJoinAndSelect("cr.priority", "priority")
      .leftJoinAndSelect("cr.worktype", "worktype")
      .leftJoinAndSelect("cr.creator", "creator")
      .leftJoinAndSelect("cr.assignee", "assignee");

    if (filters?.spaceId) {
      query.andWhere("cr.spaceId = :spaceId", { spaceId: filters.spaceId });
    }

    if (filters?.excludeStatus) {
      query.andWhere("status.id != :excludeStatusId", {
        excludeStatusId: filters.excludeStatus,
      });
    }

    query.orderBy("cr.createdAt", "DESC");

    return query.getMany();
  }
}
