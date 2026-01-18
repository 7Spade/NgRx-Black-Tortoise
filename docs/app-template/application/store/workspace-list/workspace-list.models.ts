/**
 * 摘要 (Summary): WorkspaceList Models - 工作區列表相關的介面和類型定義
 * 
 * 用途 (Purpose): 定義工作區列表狀態、工作區摘要等相關的 TypeScript 類型
 * 
 * 功能 (Features):
 * - WorkspaceListState 介面定義
 * - WorkspaceSummary 類型定義
 * - 工作區相關的 enum
 * 
 * 責任 (Responsibilities):
 * - 提供 WorkspaceList Store 使用的類型定義
 * - 確保類型安全的工作區列表資料結構
 * - 定義工作區列表相關的業務模型
 */

import { WorkspaceMetadata } from '../../../domain/workspace';
import { Membership } from '../../../domain/workspace-membership';

/**
 * Workspace List State
 * 
 * State interface for WorkspaceList Store
 */
export interface WorkspaceListState {
  /**
   * List of workspaces the user has access to
   */
  workspaces: WorkspaceMetadata[];

  /**
   * List of user's memberships
   */
  memberships: Membership[];

  /**
   * Currently selected workspace ID
   */
  currentWorkspaceId: string | null;

  /**
   * Loading state for async operations
   */
  loading: boolean;

  /**
   * Error message (if any)
   */
  error: string | null;
}

