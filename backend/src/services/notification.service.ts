import { AppDataSource } from "../config/database";
import { Notification } from "../entities/quotation.entity";

export class NotificationService {
  private notificationRepository = AppDataSource.getRepository(Notification);

  /**
   * Get all notifications for a specific user
   */
  async getNotificationsByUserId(userId: string): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: { userId },
      order: { createdAt: "DESC" },
    });
  }

  /**
   * Mark a notification as read
   */
  async markAsRead(id: string, userId: string): Promise<Notification | null> {
    const notification = await this.notificationRepository.findOne({
      where: { id, userId },
    });

    if (!notification) {
      return null;
    }

    notification.isRead = true;
    return this.notificationRepository.save(notification);
  }

  /**
   * Create a new notification
   */
  async createNotification(
    userId: string,
    title: string,
    message: string,
    type: string = "INFO",
    relatedId: string | null = null,
    relatedType: string | null = null
  ): Promise<Notification> {
    const notification = this.notificationRepository.create({
      userId,
      title,
      message,
      type,
      relatedId,
      relatedType,
    });
    return this.notificationRepository.save(notification);
  }
}

export const notificationService = new NotificationService();
