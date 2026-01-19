/**
 * ============================================================
 * 檔案名稱： workspace-membership.entity.ts
 * 功能說明： 負責Entity定義與共用行為，支援 domain/workspace-membership/entities 相關流程。
 * 所屬模組： domain/workspace-membership/entities
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

import { MembershipRole, MembershipStatus } from '../enums';
import { MembershipId, Permissions } from '../value-objects';
import { WorkspaceId } from '../../workspace/value-objects';

/**
 * Membership Entity
 * 
 * Represents a user's membership in a workspace.
 * Links an account to a workspace with specific role and permissions.
 */
export interface Membership {
  /**
   * Unique membership identifier
   * Typically: ${accountId}_${workspaceId}
   */
  id: MembershipId;

  /**
   * Account ID (user ID)
   */
  accountId: string;

  /**
   * Workspace ID
   */
  workspaceId: WorkspaceId;

  /**
   * Member's role in the workspace
   */
  role: MembershipRole;

  /**
   * Membership status
   */
  status: MembershipStatus;

  /**
   * Granular permissions
   * May override or extend role-based permissions
   */
  permissions: Permissions;

  /**
   * Last time this member accessed the workspace
   * Used for sorting recent workspaces
   */
  lastAccessedAt: Date;

  /**
   * When the membership was created
   */
  joinedAt: Date;

  /**
   * When the membership was last updated
   */
  updatedAt: Date;

  /**
   * Who invited this member (optional)
   */
  invitedBy?: string;

  /**
   * When the invitation was sent (for INVITED status)
   */
  invitedAt?: Date;

  /**
   * Custom metadata
   */
  metadata?: Record<string, any>;
}
