/**
 * 通知類型枚舉
 */
export enum NotificationType {
  // 系統通知
  SYSTEM = 'system',
  
  // 工作區通知
  WORKSPACE_INVITATION = 'workspace_invitation',
  WORKSPACE_UPDATED = 'workspace_updated',
  WORKSPACE_MEMBER_ADDED = 'workspace_member_added',
  WORKSPACE_MEMBER_REMOVED = 'workspace_member_removed',
  
  // 任務通知
  TASK_ASSIGNED = 'task_assigned',
  TASK_COMPLETED = 'task_completed',
  TASK_UPDATED = 'task_updated',
  TASK_COMMENT = 'task_comment',
  TASK_DUE_SOON = 'task_due_soon',
  TASK_OVERDUE = 'task_overdue',
  
  // 文件通知
  DOCUMENT_SHARED = 'document_shared',
  DOCUMENT_UPDATED = 'document_updated',
  DOCUMENT_COMMENT = 'document_comment',
  
  // 成員通知
  MEMBER_MENTION = 'member_mention',
  MEMBER_ROLE_CHANGED = 'member_role_changed',
  
  // 稽核通知
  AUDIT_ALERT = 'audit_alert'
}

/**
 * 通知優先級
 */
export enum NotificationPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent'
}

/**
 * 通知實體
 */
export interface Notification {
  readonly id: string;
  
  // 接收者
  recipientId: string;
  
  // 關聯資源
  workspaceId?: string;
  resourceType?: string;
  resourceId?: string;
  
  // 通知內容
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  icon?: string;
  avatarUrl?: string;
  
  // 動作
  actionLabel?: string;
  actionUrl?: string;
  
  // 狀態
  read: boolean;
  readAt?: Date;
  archived: boolean;
  archivedAt?: Date;
  
  // 時間戳
  createdAt: Date;
  expiresAt?: Date;
  
  // 發送者
  senderId?: string;
  senderName?: string;
  
  // 元數據
  metadata?: Record<string, any>;
}

/**
 * 通知設定
 */
export interface NotificationSettings {
  accountId: string;
  
  // 通知渠道
  emailNotifications: boolean;
  pushNotifications: boolean;
  inAppNotifications: boolean;
  
  // 通知類型偏好
  preferences: {
    [key in NotificationType]?: {
      enabled: boolean;
      email: boolean;
      push: boolean;
      inApp: boolean;
    };
  };
  
  // 勿擾模式
  doNotDisturb: boolean;
  doNotDisturbStart?: string; // HH:mm format
  doNotDisturbEnd?: string;
  
  // 摘要設定
  dailyDigest: boolean;
  weeklyDigest: boolean;
}

/**
 * 通知統計
 */
export interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<NotificationType, number>;
  byPriority: Record<NotificationPriority, number>;
}
