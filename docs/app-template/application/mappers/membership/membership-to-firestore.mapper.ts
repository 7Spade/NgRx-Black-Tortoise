/**
 * 摘要 (Summary): MembershipToFirestore Mapper - Membership to Firestore Document映射器
 * 
 * 用途 (Purpose): 將 Membership 領域模型轉換為 Firestore 文件格式
 * 
 * 功能 (Features):
 * - 資料結構轉換
 * - 類型映射
 * - Date 轉換為 Timestamp
 * - 空值處理
 * 
 * 責任 (Responsibilities):
 * - 提供資料映射邏輯
 * - 確保類型安全的轉換
 * - 處理邊界情況
 */

import { Timestamp } from '@angular/fire/firestore';
import { Membership } from '../../../domain/workspace-membership';
import { FirestoreMembershipData } from './firestore-to-membership.mapper';

/**
 * Convert Membership domain model to Firestore document format
 * 
 * @param membership - Membership domain entity
 * @returns Firestore document data
 */
export function membershipToFirestore(membership: Membership): Omit<FirestoreMembershipData, 'id'> {
  return {
    accountId: membership.accountId,
    workspaceId: membership.workspaceId,
    role: membership.role,
    status: membership.status,
    permissions: {
      canView: membership.permissions.canView,
      canCreate: membership.permissions.canCreate,
      canEdit: membership.permissions.canEdit,
      canDelete: membership.permissions.canDelete,
      canInviteMembers: membership.permissions.canInviteMembers,
      canManageMembers: membership.permissions.canManageMembers,
      canManageSettings: membership.permissions.canManageSettings,
      canManageBilling: membership.permissions.canManageBilling,
      customPermissions: membership.permissions.customPermissions,
    },
    lastAccessedAt: Timestamp.fromDate(membership.lastAccessedAt),
    joinedAt: Timestamp.fromDate(membership.joinedAt),
    updatedAt: Timestamp.fromDate(membership.updatedAt),
    invitedBy: membership.invitedBy,
    invitedAt: membership.invitedAt ? Timestamp.fromDate(membership.invitedAt) : undefined,
    metadata: membership.metadata,
  };
}
