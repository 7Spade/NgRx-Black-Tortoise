/**
 * NotificationRepository contract for notification data access.
 * 
 * Domain layer repository interface - framework-agnostic.
 * Returns Promises to avoid RxJS/framework dependencies in domain layer.
 */
import { 
  Notification, 
  NotificationSettings, 
  NotificationStats,
  NotificationType,
  NotificationPriority
} from '../notification/entities/notification.entity';

export interface NotificationRepository {
  /**
   * 獲取使用者的所有通知
   */
  getUserNotifications(userId: string, limit?: number): Promise<Notification[]>;
  
  /**
   * 獲取未讀通知
   */
  getUnreadNotifications(userId: string): Promise<Notification[]>;
  
  /**
   * 獲取單個通知
   */
  getNotification(id: string): Promise<Notification | null>;
  
  /**
   * 創建通知
   */
  createNotification(notification: Omit<Notification, 'id'>): Promise<string>;
  
  /**
   * 批量創建通知
   */
  createNotifications(notifications: Omit<Notification, 'id'>[]): Promise<string[]>;
  
  /**
   * 標記為已讀
   */
  markAsRead(id: string): Promise<void>;
  
  /**
   * 批量標記為已讀
   */
  markAllAsRead(userId: string): Promise<void>;
  
  /**
   * 標記為已歸檔
   */
  markAsArchived(id: string): Promise<void>;
  
  /**
   * 刪除通知
   */
  deleteNotification(id: string): Promise<void>;
  
  /**
   * 批量刪除通知
   */
  deleteNotifications(ids: string[]): Promise<void>;
  
  /**
   * 清理過期通知
   */
  cleanupExpiredNotifications(): Promise<void>;
  
  /**
   * 獲取通知統計
   */
  getNotificationStats(userId: string): Promise<NotificationStats>;
  
  // 通知設定相關
  
  /**
   * 獲取使用者通知設定
   */
  getNotificationSettings(userId: string): Promise<NotificationSettings | null>;
  
  /**
   * 更新通知設定
   */
  updateNotificationSettings(userId: string, settings: Partial<NotificationSettings>): Promise<void>;
  
  /**
   * 創建預設通知設定
   */
  createDefaultNotificationSettings(userId: string): Promise<NotificationSettings>;
}
