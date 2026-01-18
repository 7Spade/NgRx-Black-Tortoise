/**
 * 稽核動作類型
 */
export enum AuditActionType {
  // 工作區
  WORKSPACE_CREATED = 'workspace.created',
  WORKSPACE_UPDATED = 'workspace.updated',
  WORKSPACE_DELETED = 'workspace.deleted',
  
  // 成員
  MEMBER_ADDED = 'member.added',
  MEMBER_REMOVED = 'member.removed',
  MEMBER_ROLE_CHANGED = 'member.role_changed',
  MEMBER_INVITED = 'member.invited',
  
  // 文件
  DOCUMENT_CREATED = 'document.created',
  DOCUMENT_UPDATED = 'document.updated',
  DOCUMENT_DELETED = 'document.deleted',
  DOCUMENT_MOVED = 'document.moved',
  DOCUMENT_SHARED = 'document.shared',
  
  // 任務
  TASK_CREATED = 'task.created',
  TASK_UPDATED = 'task.updated',
  TASK_DELETED = 'task.deleted',
  TASK_ASSIGNED = 'task.assigned',
  TASK_COMPLETED = 'task.completed',
  
  // 權限
  PERMISSION_GRANTED = 'permission.granted',
  PERMISSION_REVOKED = 'permission.revoked',
  ROLE_CREATED = 'role.created',
  ROLE_UPDATED = 'role.updated',
  ROLE_DELETED = 'role.deleted',
  
  // 設定
  SETTINGS_UPDATED = 'settings.updated',
  MODULE_ENABLED = 'module.enabled',
  MODULE_DISABLED = 'module.disabled',
  
  // 認證
  USER_LOGIN = 'user.login',
  USER_LOGOUT = 'user.logout',
  USER_FAILED_LOGIN = 'user.failed_login'
}

/**
 * 稽核嚴重性
 */
export enum AuditSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

/**
 * 稽核條目值物件
 */
export interface AuditEntryData {
  readonly id: string;
  
  // 基本資訊
  workspaceId: string;
  actionType: AuditActionType;
  severity: AuditSeverity;
  
  // 執行者
  actorId: string;
  actorName: string;
  actorEmail: string;
  actorIP?: string;
  actorUserAgent?: string;
  
  // 資源
  resourceType: string;
  resourceId: string;
  resourceName?: string;
  
  // 變更內容
  changes?: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
  
  // 元數據
  metadata?: Record<string, any>;
  
  // 時間戳
  timestamp: Date;
  
  // 描述
  description: string;
  details?: string;
}

/**
 * 稽核條目值物件
 */
export class AuditEntry {
  private constructor(private readonly data: AuditEntryData) {}

  /**
   * 創建稽核條目
   */
  static create(
    workspaceId: string,
    actionType: AuditActionType,
    actorId: string,
    actorName: string,
    actorEmail: string,
    resourceType: string,
    resourceId: string,
    description: string,
    options?: {
      severity?: AuditSeverity;
      resourceName?: string;
      changes?: AuditEntryData['changes'];
      metadata?: Record<string, any>;
      actorIP?: string;
      actorUserAgent?: string;
      details?: string;
    }
  ): AuditEntry {
    const data: AuditEntryData = {
      id: crypto.randomUUID(),
      workspaceId,
      actionType,
      severity: options?.severity || AuditEntry.getSeverityFromAction(actionType),
      actorId,
      actorName,
      actorEmail,
      actorIP: options?.actorIP,
      actorUserAgent: options?.actorUserAgent,
      resourceType,
      resourceId,
      resourceName: options?.resourceName,
      changes: options?.changes,
      metadata: options?.metadata,
      timestamp: new Date(),
      description,
      details: options?.details
    };

    return new AuditEntry(data);
  }

  /**
   * 從數據創建
   */
  static fromData(data: AuditEntryData): AuditEntry {
    return new AuditEntry(data);
  }

  /**
   * 根據動作類型判斷嚴重性
   */
  private static getSeverityFromAction(actionType: AuditActionType): AuditSeverity {
    const criticalActions = [
      AuditActionType.WORKSPACE_DELETED,
      AuditActionType.MEMBER_REMOVED,
      AuditActionType.PERMISSION_REVOKED
    ];

    const warningActions = [
      AuditActionType.USER_FAILED_LOGIN,
      AuditActionType.DOCUMENT_DELETED,
      AuditActionType.TASK_DELETED
    ];

    if (criticalActions.includes(actionType)) {
      return AuditSeverity.CRITICAL;
    }

    if (warningActions.includes(actionType)) {
      return AuditSeverity.WARNING;
    }

    return AuditSeverity.INFO;
  }

  /**
   * 獲取 ID
   */
  getId(): string {
    return this.data.id;
  }

  /**
   * 獲取完整數據
   */
  getData(): Readonly<AuditEntryData> {
    return { ...this.data };
  }

  /**
   * 獲取動作類型
   */
  getActionType(): AuditActionType {
    return this.data.actionType;
  }

  /**
   * 獲取嚴重性
   */
  getSeverity(): AuditSeverity {
    return this.data.severity;
  }

  /**
   * 獲取描述
   */
  getDescription(): string {
    return this.data.description;
  }

  /**
   * 獲取時間戳
   */
  getTimestamp(): Date {
    return this.data.timestamp;
  }

  /**
   * 格式化為可讀字串
   */
  toString(): string {
    return `[${this.data.severity.toUpperCase()}] ${this.data.actorName} (${this.data.actorEmail}) - ${this.data.description} at ${this.data.timestamp.toISOString()}`;
  }

  /**
   * 轉換為 JSON
   */
  toJSON(): AuditEntryData {
    return { ...this.data };
  }
}

/**
 * 稽核條目篩選器
 */
export interface AuditEntryFilter {
  workspaceId?: string;
  actionTypes?: AuditActionType[];
  severities?: AuditSeverity[];
  actorIds?: string[];
  resourceTypes?: string[];
  resourceIds?: string[];
  startDate?: Date;
  endDate?: Date;
  searchQuery?: string;
}

/**
 * 稽核統計
 */
export interface AuditStats {
  total: number;
  bySeverity: Record<AuditSeverity, number>;
  byActionType: Record<AuditActionType, number>;
  byResourceType: Record<string, number>;
  topActors: { actorId: string; actorName: string; count: number }[];
  timeline: { date: string; count: number }[];
}
