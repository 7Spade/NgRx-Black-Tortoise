/**
 * ============================================================
 * 檔案名稱： workspace.entity.ts
 * 功能說明： 負責Entity定義與共用行為，支援 domain/workspace/entities 相關流程。
 * 所屬模組： domain/workspace/entities
 * ============================================================
 *
 * 【業務背景 / 使用情境】
 * - 在領域模型中用於模組核心規則與一致性控制。
 * - 使用者：應用層用例/系統服務。
 * - 解決問題：封裝商業概念與不變條件。
 *
 * 【核心職責（這個檔案「只」做什麼）】
 * ✔ 負責：
 * - 封裝領域物件的狀態、規則與一致性。
 * - 提供模組必要的最小可用能力。
 *
 * ✘ 不負責：
 * - 不處理外部 I/O 或持久化。
 * - 不負責 UI 呈現或路由。
 *
 * 【設計假設】
 * - 僅依賴 domain/shared 型別與規範。
 * - 由應用層負責生命週期與調度。
 *
 * 【限制與風險】
 * - 規則未同步可能導致一致性風險。
 * - 跨聚合協作需事件協調避免耦合。
 *
 * 【資料流 / 流程簡述】
 * 1. 應用層建立或調用領域物件。
 * 2. 領域內執行驗證與規則運算。
 * 3. 結果/事件回傳給上層處理。
 *
 * 【相依關係】
 * - 依賴：
 *   - domain/shared 通用型別。
 *   - 同模組 value-objects/enums。
 *
 * - 被使用於：
 *   - application layer handlers/stores。
 *   - infrastructure repositories (interfaces)。
 *
 * 【錯誤處理策略】
 * - 預期錯誤：
 *   - 輸入驗證失敗。
 *   - 權限或狀態不合法。
 * - 非預期錯誤：
 *   - 未知狀態或不可預期例外。
 *
 * 【未來擴充 / TODO】
 * - ⏳ 補齊商業規則與邊界條件。
 * - ⏳ 補齊單元測試與事件案例。
 */

import { WorkspaceType, WorkspaceLifecycle } from '../enums';
import { WorkspaceId, WorkspaceIdentity, WorkspaceQuota } from '../value-objects';

/**
 * WorkspaceMetadata Entity
 * 
 * Lightweight workspace information for list views.
 * Contains essential data without full workspace details.
 */
export interface WorkspaceMetadata {
  /**
   * Unique workspace identifier
   */
  id: WorkspaceId;

  /**
   * Workspace identity (name, slug, displayName)
   */
  identity: WorkspaceIdentity;

  /**
   * Workspace type
   */
  type: WorkspaceType;

  /**
   * Workspace lifecycle state
   */
  lifecycle: WorkspaceLifecycle;

  /**
   * Owner's account ID
   */
  ownerId: string;

  /**
   * Icon/avatar URL (optional)
   */
  iconUrl?: string;

  /**
   * Creation timestamp
   */
  createdAt: Date;

  /**
   * Last update timestamp
   */
  updatedAt: Date;
}

/**
 * Workspace Entity
 * 
 * Complete workspace entity with all details.
 * Used when full workspace information is needed (Phase 3+).
 */
export interface Workspace extends WorkspaceMetadata {
  /**
   * Workspace settings
   */
  settings: WorkspaceSettings;

  /**
   * Usage quota
   */
  quota: WorkspaceQuota;

  /**
   * Feature flags
   */
  features: WorkspaceFeatures;

  /**
   * Metadata for archiving/deletion
   */
  archiveMetadata?: ArchiveMetadata;
}

/**
 * Workspace Settings
 * 
 * Configuration settings for the workspace.
 */
export interface WorkspaceSettings {
  /**
   * Default language
   */
  language: string;

  /**
   * Timezone
   */
  timezone: string;

  /**
   * Visibility (public/private)
   */
  visibility: 'PUBLIC' | 'PRIVATE';

  /**
   * Allow member invitations
   */
  allowMemberInvites: boolean;

  /**
   * Require admin approval for new members
   */
  requireAdminApproval: boolean;
}

/**
 * Workspace Features
 * 
 * Feature flags for the workspace.
 */
export interface WorkspaceFeatures {
  /**
   * Advanced collaboration features
   */
  collaboration: boolean;

  /**
   * Version control integration
   */
  versionControl: boolean;

  /**
   * API access
   */
  apiAccess: boolean;

  /**
   * Custom branding
   */
  customBranding: boolean;

  /**
   * SSO integration
   */
  sso: boolean;

  /**
   * Audit logs
   */
  auditLogs: boolean;
}

/**
 * Archive Metadata
 * 
 * Metadata for archived or deleted workspaces.
 */
export interface ArchiveMetadata {
  /**
   * Archive/deletion timestamp
   */
  archivedAt: Date;

  /**
   * User who archived/deleted
   */
  archivedBy: string;

  /**
   * Reason for archiving/deletion
   */
  reason?: string;

  /**
   * Scheduled permanent deletion date (for deleted workspaces)
   */
  scheduledDeletionAt?: Date;
}
