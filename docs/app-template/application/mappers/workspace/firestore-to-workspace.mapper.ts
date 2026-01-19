/**
 * 摘要 (Summary): FirestoreToWorkspace Mapper - Firestore Document to WorkspaceMetadata映射器
 * 
 * 用途 (Purpose): 將 Firestore 文件轉換為 WorkspaceMetadata 領域模型
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
  WorkspaceMetadata, 
  WorkspaceType, 
  WorkspaceLifecycle,
  WorkspaceIdentity
} from '../../../domain/workspace';

/**
 * Firestore document data structure
 */
export interface FirestoreWorkspaceData {
  id: string;
  name: string;
  slug: string;
  displayName: string;
  description?: string;
  type: string;
  lifecycle: string;
  ownerId: string;
  iconUrl?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Convert Firestore document to WorkspaceMetadata domain model
 * 
 * @param doc - Firestore document data
 * @returns WorkspaceMetadata domain entity
 */
export function firestoreToWorkspace(doc: FirestoreWorkspaceData): WorkspaceMetadata {
  const identity: WorkspaceIdentity = {
    name: doc.name,
    slug: doc.slug,
    displayName: doc.displayName,
    description: doc.description,
  };

  return {
    id: doc.id,
    identity,
    type: doc.type as WorkspaceType,
    lifecycle: doc.lifecycle as WorkspaceLifecycle,
    ownerId: doc.ownerId,
    iconUrl: doc.iconUrl,
    createdAt: doc.createdAt.toDate(),
    updatedAt: doc.updatedAt.toDate(),
  };
}

/**
 * Convert array of Firestore documents to WorkspaceMetadata array
 * 
 * @param docs - Array of Firestore document data
 * @returns Array of WorkspaceMetadata domain entities
 */
export function firestoreToWorkspaces(docs: FirestoreWorkspaceData[]): WorkspaceMetadata[] {
  return docs.map(firestoreToWorkspace);
}
