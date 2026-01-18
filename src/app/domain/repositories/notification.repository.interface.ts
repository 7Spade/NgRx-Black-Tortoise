/**
 * NotificationRepository contract for notification data access.
 */
import { Observable } from 'rxjs';
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
  getUserNotifications(userId: string, limit?: number): Observable<Notification[]>;
  
  /**
   * 獲取未讀通知
   */
  getUnreadNotifications(userId: string): Observable<Notification[]>;
  
  /**
   * 獲取單個通知
   */
  getNotification(id: string): Observable<Notification | null>;
  
  /**
   * 創建通知
   */
  createNotification(notification: Omit<Notification, 'id'>): Observable<string>;
  
  /**
   * 批量創建通知
   */
  createNotifications(notifications: Omit<Notification, 'id'>[]): Observable<string[]>;
  
  /**
   * 標記為已讀
   */
  markAsRead(id: string): Observable<void>;
  
  /**
   * 批量標記為已讀
   */
  markAllAsRead(userId: string): Observable<void>;
  
  /**
   * 標記為已歸檔
   */
  markAsArchived(id: string): Observable<void>;
  
  /**
   * 刪除通知
   */
  deleteNotification(id: string): Observable<void>;
  
  /**
   * 批量刪除通知
   */
  deleteNotifications(ids: string[]): Observable<void>;
  
  /**
   * 清理過期通知
   */
  cleanupExpiredNotifications(): Observable<void>;
  
  /**
   * 獲取通知統計
   */
  getNotificationStats(userId: string): Observable<NotificationStats>;
  
  // 通知設定相關
  
  /**
   * 獲取使用者通知設定
   */
  getNotificationSettings(userId: string): Observable<NotificationSettings | null>;
  
  /**
   * 更新通知設定
   */
  updateNotificationSettings(userId: string, settings: Partial<NotificationSettings>): Observable<void>;
  
  /**
   * 創建預設通知設定
   */
  createDefaultNotificationSettings(userId: string): Observable<NotificationSettings>;
}
