import { AppDataSource } from "../config/database";
import {
  ChangeRequest,
  ChangeRequestComment,
  ChangeRequestStatusHistory,
  ChangeRequestAttachment,
} from "../entities/change-request.entity";

interface ActivityItem {
  id: string;
  type: string;
  user: { name: string; avatar: null };
  crId: string;
  crDbId: string;
  crTitle: string;
  status?: string;
  timestamp: Date;
  timeAgo: string;
}

interface ActivityGroup {
  date: string;
  label: string;
  activities: ActivityItem[];
}

export class DashboardService {
  private crRepo = AppDataSource.getRepository(ChangeRequest);
  private statusHistoryRepo = AppDataSource.getRepository(
    ChangeRequestStatusHistory
  );
  private commentRepo = AppDataSource.getRepository(ChangeRequestComment);
  private attachmentRepo = AppDataSource.getRepository(ChangeRequestAttachment);

  private buildBaseQuery(userId: string, role: string) {
    let query = this.crRepo
      .createQueryBuilder("cr")
      .leftJoinAndSelect("cr.status", "status")
      .leftJoinAndSelect("cr.priority", "priority");

    if (role === "customer") {
      query.andWhere(
        "((cr.createdBy = :userId AND status.name = 'DRAFT') OR status.name != 'DRAFT')",
        { userId }
      );
    } else if (role === "pm") {
      query.andWhere("status.name != 'DRAFT'");
    }

    return query;
  }

  async getStats(userId: string, role: string) {
    const totalQuery = this.buildBaseQuery(userId, role);
    const total = await totalQuery.getCount();

    const completedQuery = this.buildBaseQuery(userId, role);
    const completed = await completedQuery
      .andWhere("status.name IN ('CLOSED', 'APPROVED', 'ON_GOING')")
      .getCount();

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const createdQuery = this.buildBaseQuery(userId, role);
    const created = await createdQuery
      .andWhere("cr.createdAt >= :sevenDaysAgo", { sevenDaysAgo })
      .getCount();

    const updatedQuery = this.buildBaseQuery(userId, role);
    const updated = await updatedQuery
      .andWhere("cr.updatedAt >= :sevenDaysAgo", { sevenDaysAgo })
      .getCount();

    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    const now = new Date();

    const dueSoonQuery = this.buildBaseQuery(userId, role);
    const dueSoon = await dueSoonQuery
      .andWhere(
        "cr.dueDate IS NOT NULL AND cr.dueDate BETWEEN :now AND :threeDaysFromNow",
        { now, threeDaysFromNow }
      )
      .getCount();

    return {
      total,
      completed,
      updated,
      created,
      dueSoon,
    };
  }

  async getStatusOverview(userId: string, role: string) {
    const query = this.buildBaseQuery(userId, role);

    const result = await query
      .select("status.name", "name")
      .addSelect("status.color", "color")
      .addSelect("COUNT(cr.id)", "count")
      .groupBy("status.name")
      .addGroupBy("status.color")
      .getRawMany();

    return result.map((item) => ({
      status: item.name || "Unknown",
      count: parseInt(item.count, 10),
      color: item.color || "#ccc",
      label: item.name || "Unknown",
    }));
  }

  async getRecentActivities(userId: string, role: string) {
    const baseCrs = await this.buildBaseQuery(userId, role)
      .select("cr.id")
      .getMany();
    const crIds = baseCrs.map((c) => c.id);

    if (crIds.length === 0) return [];

    let activities: Array<Omit<ActivityItem, "timeAgo">> = [];

    // Chunk to avoid too many IDs
    const crs = await this.crRepo
      .createQueryBuilder("cr")
      .leftJoinAndSelect("cr.creator", "creator")
      .leftJoinAndSelect("cr.status", "status")
      .where("cr.id IN (:...crIds)", { crIds })
      .orderBy("cr.createdAt", "DESC")
      .take(10)
      .getMany();

    const statusChanges = await this.statusHistoryRepo
      .createQueryBuilder("sc")
      .leftJoinAndSelect("sc.changeRequest", "cr")
      .leftJoinAndSelect("sc.changedByUser", "user")
      .leftJoinAndSelect("sc.status", "status")
      .where("sc.changeRequestId IN (:...crIds)", { crIds })
      .orderBy("sc.createdAt", "DESC")
      .take(10)
      .getMany();

    const comments = await this.commentRepo
      .createQueryBuilder("c")
      .leftJoinAndSelect("c.changeRequest", "cr")
      .leftJoinAndSelect("c.commenter", "user")
      .where("c.changeRequestId IN (:...crIds)", { crIds })
      .orderBy("c.createdAt", "DESC")
      .take(10)
      .getMany();

    const attachments = await this.attachmentRepo
      .createQueryBuilder("a")
      .leftJoinAndSelect("a.changeRequest", "cr")
      .leftJoinAndSelect("a.uploader", "user")
      .where("a.changeRequestId IN (:...crIds)", { crIds })
      .orderBy("a.createdAt", "DESC")
      .take(10)
      .getMany();

    crs.forEach((cr) => {
      activities.push({
        id: `cr_${cr.id}`,
        type: "cr_created",
        user: { name: cr.creator?.fullName || "Unknown", avatar: null },
        crId: cr.crKey,
        crDbId: cr.id,
        crTitle: cr.title,
        status: cr.status?.name,
        timestamp: cr.createdAt,
      });
    });

    statusChanges.forEach((sc) => {
      activities.push({
        id: `sc_${sc.id}`,
        type: "status_change",
        user: { name: sc.changedByUser?.fullName || "Unknown", avatar: null },
        crId: sc.changeRequest?.crKey,
        crDbId: sc.changeRequestId,
        crTitle: sc.changeRequest?.title,
        status: sc.status?.name,
        timestamp: sc.createdAt,
      });
    });

    comments.forEach((c) => {
      activities.push({
        id: `comment_${c.id}`,
        type: "comment",
        user: { name: c.commenter?.fullName || "Unknown", avatar: null },
        crId: c.changeRequest?.crKey,
        crDbId: c.changeRequestId,
        crTitle: c.changeRequest?.title,
        timestamp: c.createdAt,
      });
    });

    attachments.forEach((a) => {
      activities.push({
        id: `attachment_${a.id}`,
        type: "attachment",
        user: { name: a.uploader?.fullName || "Unknown", avatar: null },
        crId: a.changeRequest?.crKey,
        crDbId: a.changeRequestId,
        crTitle: a.changeRequest?.title,
        timestamp: a.createdAt,
      });
    });

    activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    const formattedActivities = activities.slice(0, 15).map((act) => {
      const diffMs = new Date().getTime() - act.timestamp.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      let timeAgo = "";
      if (diffMins < 60) timeAgo = `${diffMins}m ago`;
      else if (diffHours < 24) timeAgo = `${diffHours}h ago`;
      else timeAgo = `${diffDays}d ago`;

      return {
        ...act,
        timeAgo,
      };
    });

    // Group by dateLabel
    const grouped: ActivityGroup[] = [];
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    for (const act of formattedActivities) {
      let label = "Older";
      if (act.timestamp.toDateString() === today.toDateString()) {
        label = "Today";
      } else if (act.timestamp.toDateString() === yesterday.toDateString()) {
        label = "Yesterday";
      }

      let group = grouped.find((g) => g.label === label);
      if (!group) {
        group = { date: label.toLowerCase(), label, activities: [] };
        grouped.push(group);
      }
      group.activities.push(act);
    }

    return grouped;
  }
}

export const dashboardService = new DashboardService();
