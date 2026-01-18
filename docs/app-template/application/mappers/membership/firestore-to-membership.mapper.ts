/**
 * 摘要 (Summary): FirestoreToMembership Mapper - Firestore Document to Membership映射器
 * 
 * 用途 (Purpose): 將 Firestore 文件轉換為 Membership 領域模型
 * 
 * 功能 (Features):
 * - 資料結構轉換
 * - 類型映射
 * - Timestamp 轉換為 Date
 * - 空值處理
 * 
 * 責任 (Responsibilities):
 * - 提供資料映射邏輯
 * - 確保類型安全的轉換
 * - 處理邊界情況
 */

import { Timestamp } from '@angular/fire/firestore';
import { 
  Membership,
  MembershipRole,
  MembershipStatus,
  Permissions
} from '../../../domain/workspace-membership';

/**
 * Firestore document data structure for Membership
 */
export interface FirestoreMembershipData {
  id: string;
  accountId: string;
  workspaceId: string;
  role: string;
  status: string;
  permissions: {
    canView: boolean;
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canInviteMembers: boolean;
    canManageMembers: boolean;
    canManageSettings: boolean;
    canManageBilling: boolean;
    customPermissions?: Record<string, boolean>;
  };
  lastAccessedAt: Timestamp;
  joinedAt: Timestamp;
  updatedAt: Timestamp;
  invitedBy?: string;
  invitedAt?: Timestamp;
  metadata?: Record<string, any>;
}

/**
 * Convert Firestore document to Membership domain model
 * 
 * @param doc - Firestore document data
 * @returns Membership domain entity
 */
export function firestoreToMembership(doc: FirestoreMembershipData): Membership {
  const permissions: Permissions = {
    canView: doc.permissions.canView,
    canCreate: doc.permissions.canCreate,
    canEdit: doc.permissions.canEdit,
    canDelete: doc.permissions.canDelete,
    canInviteMembers: doc.permissions.canInviteMembers,
    canManageMembers: doc.permissions.canManageMembers,
    canManageSettings: doc.permissions.canManageSettings,
    canManageBilling: doc.permissions.canManageBilling,
    customPermissions: doc.permissions.customPermissions,
  };

  return {
    id: doc.id,
    accountId: doc.accountId,
    workspaceId: doc.workspaceId,
    role: doc.role as MembershipRole,
    status: doc.status as MembershipStatus,
    permissions,
    lastAccessedAt: doc.lastAccessedAt.toDate(),
    joinedAt: doc.joinedAt.toDate(),
    updatedAt: doc.updatedAt.toDate(),
    invitedBy: doc.invitedBy,
    invitedAt: doc.invitedAt?.toDate(),
    metadata: doc.metadata,
  };
}

/**
 * Convert array of Firestore documents to Membership array
 * 
 * @param docs - Array of Firestore document data
 * @returns Array of Membership domain entities
 */
export function firestoreToMemberships(docs: FirestoreMembershipData[]): Membership[] {
  return docs.map(firestoreToMembership);
}
