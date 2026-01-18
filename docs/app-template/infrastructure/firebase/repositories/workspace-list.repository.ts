/**
 * 摘要 (Summary): WorkspaceListRepository - 工作空間列表資料儲存庫
 * 
 * 用途 (Purpose): 提供工作空間列表的 Firestore 資料存取
 * 
 * 功能 (Features):
 * - 查詢使用者的工作空間列表
 * - 即時訂閱工作空間變更
 * - 更新最後訪問時間
 * - 建立新工作空間
 * 
 * 責任 (Responsibilities):
 * - 封裝 Firestore 操作
 * - 返回 Observable (不手動 subscribe)
 * - 處理資料轉換 (透過 mappers)
 * - 處理錯誤
 */

import { inject, Injectable } from '@angular/core';
import { 
  Firestore, 
  collection, 
  query, 
  where, 
  orderBy,
  collectionData,
  doc,
  updateDoc,
  addDoc,
  Timestamp,
  getDoc,
  setDoc,
  DocumentReference
} from '@angular/fire/firestore';
import { Observable, from, switchMap, combineLatest, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { 
  WorkspaceMetadata, 
  WorkspaceType,
  WorkspaceLifecycle 
} from '../../../domain/workspace';
import { 
  Membership,
  MembershipRole,
  MembershipStatus 
} from '../../../domain/workspace-membership';
import { 
  firestoreToWorkspace,
  firestoreToWorkspaces,
  FirestoreWorkspaceData 
} from '../../../application/mappers/workspace';
import {
  firestoreToMembership,
  firestoreToMemberships,
  FirestoreMembershipData
} from '../../../application/mappers/membership';

/**
 * Data structure for creating a new workspace
 */
export interface CreateWorkspaceData {
  name: string;
  slug: string;
  displayName: string;
  description?: string;
  type: WorkspaceType;
  ownerId: string;
  iconUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class WorkspaceListRepository {
  private firestore = inject(Firestore);
  private workspacesCol = collection(this.firestore, 'workspaces');
  private membershipsCol = collection(this.firestore, 'memberships');

  /**
   * Subscribe to user's workspaces in real-time
   * 
   * Returns Observable that emits workspace array on changes.
   * Uses memberships collection to find all workspaces for the user.
   * 
   * @param accountId - User's account ID
   * @returns Observable of WorkspaceMetadata array
   */
  subscribeToWorkspaces(accountId: string): Observable<WorkspaceMetadata[]> {
    // Step 1: Query memberships for this user
    const membershipsQuery = query(
      this.membershipsCol,
      where('accountId', '==', accountId),
      where('status', '==', MembershipStatus.ACTIVE),
      orderBy('lastAccessedAt', 'desc')
    );

    // Step 2: Get real-time memberships
    return collectionData(membershipsQuery, { idField: 'id' }).pipe(
      switchMap((membershipDocs: any[]) => {
        if (membershipDocs.length === 0) {
          return of([]);
        }

        // Step 3: Get workspace IDs from memberships
        const workspaceIds = membershipDocs.map(m => m.workspaceId);

        // Step 4: Fetch all workspaces (Firestore has limit of 10 for 'in' queries, so we batch)
        const workspaceObservables: Observable<WorkspaceMetadata | null>[] = workspaceIds.map(workspaceId => {
          const workspaceDoc = doc(this.firestore, `workspaces/${workspaceId}`);
          return from(getDoc(workspaceDoc)).pipe(
            map(snapshot => {
              if (!snapshot.exists()) return null;
              const data = snapshot.data() as Omit<FirestoreWorkspaceData, 'id'>;
              return firestoreToWorkspace({ id: snapshot.id, ...data });
            }),
            catchError(() => of(null))
          );
        });

        // Step 5: Combine all workspace fetches
        if (workspaceObservables.length === 0) {
          return of([]);
        }

        return combineLatest(workspaceObservables).pipe(
          map(workspaces => workspaces.filter(w => w !== null) as WorkspaceMetadata[])
        );
      }),
      catchError((error) => {
        console.error('Error subscribing to workspaces:', error);
        return of([]);
      })
    );
  }

  /**
   * Get user's memberships
   * 
   * @param accountId - User's account ID
   * @returns Observable of Membership array
   */
  getUserMemberships(accountId: string): Observable<Membership[]> {
    const membershipsQuery = query(
      this.membershipsCol,
      where('accountId', '==', accountId),
      where('status', '==', MembershipStatus.ACTIVE),
      orderBy('lastAccessedAt', 'desc')
    );

    return collectionData(membershipsQuery, { idField: 'id' }).pipe(
      map((docs: any[]) => {
        return firestoreToMemberships(docs as FirestoreMembershipData[]);
      }),
      catchError((error) => {
        console.error('Error getting user memberships:', error);
        return of([]);
      })
    );
  }

  /**
   * Update last accessed timestamp for a membership
   * 
   * @param membershipId - Membership ID (format: accountId_workspaceId)
   * @param timestamp - Access timestamp
   * @returns Observable<void>
   */
  updateLastAccessed(membershipId: string, timestamp: Date): Observable<void> {
    const membershipDoc = doc(this.firestore, `memberships/${membershipId}`);
    
    return from(
      updateDoc(membershipDoc, {
        lastAccessedAt: Timestamp.fromDate(timestamp),
        updatedAt: Timestamp.fromDate(new Date())
      })
    ).pipe(
      map(() => void 0),
      catchError((error) => {
        console.error('Error updating last accessed:', error);
        throw error;
      })
    );
  }

  /**
   * Create a new workspace
   * 
   * Creates both workspace document and owner membership.
   * 
   * @param data - Workspace creation data
   * @returns Observable<WorkspaceMetadata>
   */
  createWorkspace(data: CreateWorkspaceData): Observable<WorkspaceMetadata> {
    const now = new Date();
    const nowTimestamp = Timestamp.fromDate(now);

    // Step 1: Create workspace document
    const workspaceData = {
      name: data.name,
      slug: data.slug,
      displayName: data.displayName,
      description: data.description,
      type: data.type,
      lifecycle: WorkspaceLifecycle.ACTIVE,
      ownerId: data.ownerId,
      iconUrl: data.iconUrl,
      createdAt: nowTimestamp,
      updatedAt: nowTimestamp,
    };

    return from(addDoc(this.workspacesCol, workspaceData)).pipe(
      switchMap((workspaceRef: DocumentReference) => {
        // Step 2: Create owner membership
        const membershipId = `${data.ownerId}_${workspaceRef.id}`;
        const membershipData: Omit<FirestoreMembershipData, 'id'> = {
          accountId: data.ownerId,
          workspaceId: workspaceRef.id,
          role: MembershipRole.OWNER,
          status: MembershipStatus.ACTIVE,
          permissions: {
            canView: true,
            canCreate: true,
            canEdit: true,
            canDelete: true,
            canInviteMembers: true,
            canManageMembers: true,
            canManageSettings: true,
            canManageBilling: true,
          },
          lastAccessedAt: nowTimestamp,
          joinedAt: nowTimestamp,
          updatedAt: nowTimestamp,
        };

        const membershipDoc = doc(this.firestore, `memberships/${membershipId}`);
        return from(setDoc(membershipDoc, membershipData)).pipe(
          map(() => {
            // Step 3: Return created workspace
            const createdWorkspace: WorkspaceMetadata = {
              id: workspaceRef.id,
              identity: {
                name: data.name,
                slug: data.slug,
                displayName: data.displayName,
                description: data.description,
              },
              type: data.type,
              lifecycle: WorkspaceLifecycle.ACTIVE,
              ownerId: data.ownerId,
              iconUrl: data.iconUrl,
              createdAt: now,
              updatedAt: now,
            };
            return createdWorkspace;
          })
        );
      }),
      catchError((error) => {
        console.error('Error creating workspace:', error);
        throw error;
      })
    );
  }
}
