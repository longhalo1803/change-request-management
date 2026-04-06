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
        "attachments",
        "statusHistory",
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
}
