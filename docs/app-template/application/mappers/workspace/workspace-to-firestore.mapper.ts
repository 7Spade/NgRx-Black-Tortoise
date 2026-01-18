/**
 * 摘要 (Summary): WorkspaceToFirestore Mapper - WorkspaceMetadata to Firestore Document映射器
 * 
 * 用途 (Purpose): 將 WorkspaceMetadata 領域模型轉換為 Firestore 文件格式
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
import { WorkspaceMetadata } from '../../../domain/workspace';
import { FirestoreWorkspaceData } from './firestore-to-workspace.mapper';

/**
 * Convert WorkspaceMetadata domain model to Firestore document format
 * 
 * @param workspace - WorkspaceMetadata domain entity
 * @returns Firestore document data
 */
export function workspaceToFirestore(workspace: WorkspaceMetadata): Omit<FirestoreWorkspaceData, 'id'> {
  return {
    name: workspace.identity.name,
    slug: workspace.identity.slug,
    displayName: workspace.identity.displayName,
    description: workspace.identity.description,
    type: workspace.type,
    lifecycle: workspace.lifecycle,
    ownerId: workspace.ownerId,
    iconUrl: workspace.iconUrl,
    createdAt: Timestamp.fromDate(workspace.createdAt),
    updatedAt: Timestamp.fromDate(workspace.updatedAt),
  };
}
