/**
 * ============================================================
 * 檔案名稱： workspace.repository.ts
 * 功能說明： Workspace Firestore Repository - 完整工作區資料存取
 * 所屬模組： infrastructure/firebase/repositories
 * ============================================================
 *
 * 【業務背景 / 使用情境】
 * - 提供完整工作區的 CRUD 操作與即時同步
 * - 管理工作區成員子集合
 * - 追蹤工作區使用統計
 *
 * 【核心職責（這個檔案「只」做什麼）】
 * ✔ 負責：
 * - 工作區文檔的 Firestore 操作
 * - 成員子集合的查詢與管理
 * - 即時資料同步 (Observable-based)
 *
 * ✘ 不負責：
 * - 業務邏輯驗證 (Domain Layer)
 * - 狀態管理 (Application Layer)
 * - UI 呈現邏輯
 *
 * 【設計假設】
 * - Firebase Authentication 已完成
 * - Firestore 安全規則已配置
 * - 使用 Observable 模式，不手動管理訂閱
 *
 * 【限制與風險】
 * - 大量成員可能影響查詢效能
 * - 需注意 Firestore 配額限制
 *
 * 【資料流 / 流程簡述】
 * 1. Application Layer 調用 repository 方法
 * 2. Repository 執行 Firestore 查詢/寫入
 * 3. 返回 Observable 供 Application Layer 訂閱
 *
 * 【相依關係】
 * - 依賴：
 *   - @angular/fire/firestore
 *   - domain/workspace 實體定義
 *
 * - 被使用於：
 *   - application/store/workspace (WorkspaceStore)
 *
 * 【錯誤處理策略】
 * - Firestore 錯誤透過 Observable error 傳遞
 * - 使用 catchError 提供友善錯誤訊息
 * - 權限錯誤返回空結果或錯誤通知
 *
 * 【未來擴充 / TODO】
 * - ⏳ 實作工作區設定批次更新
 * - ⏳ 實作工作區複製功能
 * - ⏳ 實作工作區範本支援
 */

import { inject, Injectable } from '@angular/core';
import {
  Firestore,
  doc,
  docData,
  collection,
  collectionData,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  DocumentReference,
  QueryConstraint,
} from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Workspace } from '../../../domain/workspace/entities/workspace.entity';
import { Membership } from '../../../domain/workspace-membership/entities/workspace-membership.entity';

/**
 * WorkspaceRepository
 * 
 * Provides comprehensive Firestore access for workspace operations.
 * 
 * Features:
 * - Load full workspace details
 * - Real-time workspace subscription
 * - Member subcollection management
 * - Workspace settings updates
 * - Usage statistics tracking
 */
@Injectable({
  providedIn: 'root'
})
export class WorkspaceRepository {
  private readonly firestore = inject(Firestore);
  private readonly workspacesCollection = 'workspaces';
  private readonly membersSubcollection = 'members';

  /**
   * Get workspace by ID (one-time fetch)
   * 
   * @param workspaceId - Workspace identifier
   * @returns Observable of Workspace or null if not found
   */
  getWorkspace(workspaceId: string): Observable<Workspace | null> {
    const workspaceDoc = doc(this.firestore, `${this.workspacesCollection}/${workspaceId}`);
    
    return docData(workspaceDoc, { idField: 'id' }).pipe(
      map((data) => (data ? this.mapFirestoreToWorkspace(data as any) : null)),
      catchError((error) => {
        console.error('Error loading workspace:', error);
        return of(null);
      })
    );
  }

  /**
   * Subscribe to real-time workspace updates
   * 
   * @param workspaceId - Workspace identifier
   * @returns Observable that emits workspace changes
   */
  subscribeToWorkspace(workspaceId: string): Observable<Workspace | null> {
    const workspaceDoc = doc(this.firestore, `${this.workspacesCollection}/${workspaceId}`);
    
    return docData(workspaceDoc, { idField: 'id' }).pipe(
      map((data) => (data ? this.mapFirestoreToWorkspace(data as any) : null)),
      catchError((error) => {
        console.error('Error subscribing to workspace:', error);
        return of(null);
      })
    );
  }

  /**
   * Update workspace details
   * 
   * @param workspaceId - Workspace identifier
   * @param updates - Partial workspace updates
   * @returns Promise that resolves when update completes
   */
  async updateWorkspace(workspaceId: string, updates: Partial<Workspace>): Promise<void> {
    const workspaceDoc = doc(this.firestore, `${this.workspacesCollection}/${workspaceId}`);
    const firestoreData = this.mapWorkspaceToFirestore(updates);
    
    await updateDoc(workspaceDoc, {
      ...firestoreData,
      updatedAt: Timestamp.now()
    });
  }

  /**
   * Load workspace members
   * 
   * @param workspaceId - Workspace identifier
   * @returns Observable of member array
   */
  getWorkspaceMembers(workspaceId: string): Observable<Membership[]> {
    const membersCollection = collection(
      this.firestore,
      `${this.workspacesCollection}/${workspaceId}/${this.membersSubcollection}`
    );
    
    const membersQuery = query(membersCollection, orderBy('joinedAt', 'desc'));
    
    return collectionData(membersQuery, { idField: 'id' }).pipe(
      map((members) => members.map(m => this.mapFirestoreToMembership(m as any))),
      catchError((error) => {
        console.error('Error loading workspace members:', error);
        return of([]);
      })
    );
  }

  /**
   * Subscribe to real-time member updates
   * 
   * @param workspaceId - Workspace identifier
   * @returns Observable that emits member changes
   */
  subscribeToMembers(workspaceId: string): Observable<Membership[]> {
    const membersCollection = collection(
      this.firestore,
      `${this.workspacesCollection}/${workspaceId}/${this.membersSubcollection}`
    );
    
    const membersQuery = query(membersCollection, orderBy('joinedAt', 'desc'));
    
    return collectionData(membersQuery, { idField: 'id' }).pipe(
      map((members) => members.map(m => this.mapFirestoreToMembership(m as any))),
      catchError((error) => {
        console.error('Error subscribing to members:', error);
        return of([]);
      })
    );
  }

  /**
   * Add member to workspace
   * 
   * @param workspaceId - Workspace identifier
   * @param membership - Membership data
   * @returns Promise that resolves when member is added
   */
  async addMember(workspaceId: string, membership: Membership): Promise<void> {
    const memberDoc = doc(
      this.firestore,
      `${this.workspacesCollection}/${workspaceId}/${this.membersSubcollection}/${membership.id}`
    );
    
    const firestoreData = this.mapMembershipToFirestore(membership);
    await setDoc(memberDoc, firestoreData);
  }

  /**
   * Update member role or permissions
   * 
   * @param workspaceId - Workspace identifier
   * @param memberId - Member identifier
   * @param updates - Membership updates
   * @returns Promise that resolves when update completes
   */
  async updateMember(
    workspaceId: string,
    memberId: string,
    updates: Partial<Membership>
  ): Promise<void> {
    const memberDoc = doc(
      this.firestore,
      `${this.workspacesCollection}/${workspaceId}/${this.membersSubcollection}/${memberId}`
    );
    
    const firestoreData = this.mapMembershipToFirestore(updates as Membership);
    await updateDoc(memberDoc, {
      ...firestoreData,
      updatedAt: Timestamp.now()
    });
  }

  /**
   * Remove member from workspace
   * 
   * @param workspaceId - Workspace identifier
   * @param memberId - Member identifier
   * @returns Promise that resolves when member is removed
   */
  async removeMember(workspaceId: string, memberId: string): Promise<void> {
    const memberDoc = doc(
      this.firestore,
      `${this.workspacesCollection}/${workspaceId}/${this.membersSubcollection}/${memberId}`
    );
    
    await deleteDoc(memberDoc);
  }

  /**
   * Map Firestore document to Workspace entity
   * 
   * @param data - Firestore document data
   * @returns Workspace entity
   */
  private mapFirestoreToWorkspace(data: any): Workspace {
    return {
      id: data.id || data.workspaceId,
      identity: {
        name: data.name || '',
        slug: data.slug || '',
        displayName: data.displayName || data.name || ''
      },
      type: data.type || 'PERSONAL',
      lifecycle: data.lifecycle || 'ACTIVE',
      ownerId: data.ownerId || '',
      iconUrl: data.iconUrl,
      createdAt: data.createdAt?.toDate?.() || new Date(),
      updatedAt: data.updatedAt?.toDate?.() || new Date(),
      settings: data.settings || {
        language: 'zh-TW',
        timezone: 'Asia/Taipei',
        visibility: 'PRIVATE',
        allowMemberInvites: true,
        requireAdminApproval: false
      },
      quota: data.quota || {
        maxMembers: 10,
        maxStorage: 1024 * 1024 * 1024, // 1GB
        usedStorage: 0
      },
      features: data.features || {
        collaboration: false,
        versionControl: false,
        apiAccess: false,
        customBranding: false,
        sso: false,
        auditLogs: false
      },
      archiveMetadata: data.archiveMetadata ? {
        archivedAt: data.archiveMetadata.archivedAt?.toDate?.() || new Date(),
        archivedBy: data.archiveMetadata.archivedBy || '',
        reason: data.archiveMetadata.reason,
        scheduledDeletionAt: data.archiveMetadata.scheduledDeletionAt?.toDate?.()
      } : undefined
    };
  }

  /**
   * Map Workspace entity to Firestore document
   * 
   * @param workspace - Workspace entity
   * @returns Firestore document data
   */
  private mapWorkspaceToFirestore(workspace: Partial<Workspace>): any {
    const data: any = {};
    
    if (workspace.identity) {
      data.name = workspace.identity.name;
      data.slug = workspace.identity.slug;
      data.displayName = workspace.identity.displayName;
    }
    
    if (workspace.type) data.type = workspace.type;
    if (workspace.lifecycle) data.lifecycle = workspace.lifecycle;
    if (workspace.ownerId) data.ownerId = workspace.ownerId;
    if (workspace.iconUrl !== undefined) data.iconUrl = workspace.iconUrl;
    if (workspace.settings) data.settings = workspace.settings;
    if (workspace.quota) data.quota = workspace.quota;
    if (workspace.features) data.features = workspace.features;
    if (workspace.archiveMetadata) {
      data.archiveMetadata = {
        archivedAt: Timestamp.fromDate(workspace.archiveMetadata.archivedAt),
        archivedBy: workspace.archiveMetadata.archivedBy,
        reason: workspace.archiveMetadata.reason,
        scheduledDeletionAt: workspace.archiveMetadata.scheduledDeletionAt
          ? Timestamp.fromDate(workspace.archiveMetadata.scheduledDeletionAt)
          : null
      };
    }
    
    return data;
  }

  /**
   * Map Firestore document to Membership entity
   * 
   * @param data - Firestore document data
   * @returns Membership entity
   */
  private mapFirestoreToMembership(data: any): Membership {
    return {
      id: data.id || data.membershipId,
      accountId: data.accountId || '',
      workspaceId: data.workspaceId || '',
      role: data.role || 'MEMBER',
      status: data.status || 'ACTIVE',
      permissions: data.permissions || {
        canRead: true,
        canWrite: false,
        canDelete: false,
        canManageMembers: false,
        canManageSettings: false
      },
      lastAccessedAt: data.lastAccessedAt?.toDate?.() || new Date(),
      joinedAt: data.joinedAt?.toDate?.() || new Date(),
      updatedAt: data.updatedAt?.toDate?.() || new Date(),
      invitedBy: data.invitedBy,
      invitedAt: data.invitedAt?.toDate?.(),
      metadata: data.metadata
    };
  }

  /**
   * Map Membership entity to Firestore document
   * 
   * @param membership - Membership entity
   * @returns Firestore document data
   */
  private mapMembershipToFirestore(membership: Membership): any {
    return {
      accountId: membership.accountId,
      workspaceId: membership.workspaceId,
      role: membership.role,
      status: membership.status,
      permissions: membership.permissions,
      lastAccessedAt: Timestamp.fromDate(membership.lastAccessedAt),
      joinedAt: Timestamp.fromDate(membership.joinedAt),
      updatedAt: Timestamp.fromDate(membership.updatedAt),
      invitedBy: membership.invitedBy,
      invitedAt: membership.invitedAt ? Timestamp.fromDate(membership.invitedAt) : null,
      metadata: membership.metadata
    };
  }
}
