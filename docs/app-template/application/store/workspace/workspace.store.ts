/**
 * ============================================================
 * 檔案名稱： workspace.store.ts
 * 功能說明： Workspace Store - 管理當前工作區的完整狀態
 * 所屬模組： application/store/workspace
 * ============================================================
 *
 * 【業務背景 / 使用情境】
 * - 作為工作區上下文 Store，管理當前工作區的所有資訊和權限
 * - 追蹤使用者在工作區中的權限
 * - 管理工作區偏好設定、成員列表、啟用的模組
 *
 * 【核心職責（這個檔案「只」做什麼）】
 * ✔ 負責：
 * - 維護工作區上下文狀態 (providedIn: 'root')
 * - 從 Firebase 載入工作區完整資料
 * - 同步權限和偏好設定
 * - 提供工作區資訊查詢介面
 *
 * ✘ 不負責：
 * - Firestore 資料存取 (Repository)
 * - 業務邏輯驗證 (Domain Layer)
 * - UI 呈現邏輯
 *
 * 【設計假設】
 * - WorkspaceListStore 提供 currentWorkspaceId
 * - AuthStore 提供當前用戶資訊
 * - WorkspaceRepository 提供資料存取
 *
 * 【限制與風險】
 * - 大量成員時需注意效能
 * - 權限計算需與後端一致
 *
 * 【資料流 / 流程簡述】
 * 1. WorkspaceListStore.currentWorkspaceId 變化
 * 2. WorkspaceStore 監聽並載入新工作區
 * 3. 訂閱即時更新
 * 4. 計算權限與派生狀態
 * 5. UI 自動更新
 *
 * 【相依關係】
 * - 依賴：
 *   - WorkspaceRepository (Infrastructure)
 *   - WorkspaceListStore (Application)
 *   - AuthStore (Application)
 *   - Domain entities
 *
 * - 被使用於：
 *   - Presentation Layer components
 *   - Feature Stores
 *
 * 【錯誤處理策略】
 * - 載入失敗顯示錯誤訊息
 * - 權限不足自動導航回列表
 * - 網路錯誤顯示離線指示
 *
 * 【未來擴充 / TODO】
 * - ⏳ 實作工作區複製功能
 * - ⏳ 實作批次成員操作
 * - ⏳ 實作工作區範本
 */

import { computed, effect, inject } from '@angular/core';
import { signalStore, withState, withComputed, withMethods, withHooks, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';

import { Workspace } from '../../../domain/workspace/entities/workspace.entity';
import { Membership } from '../../../domain/workspace-membership/entities/workspace-membership.entity';
import { MembershipRole } from '../../../domain/workspace-membership/enums/membership-role.enum';
import { WorkspaceRepository } from '../../../infrastructure/firebase/repositories/workspace.repository';
import { WorkspaceListStore } from '../workspace-list/workspace-list.store';
import { AuthStore } from '../global-shell/auth/auth.store';

/**
 * WorkspaceState
 * 
 * State shape for Workspace Store
 */
export interface WorkspaceState {
  /**
   * Current workspace details (null if none selected)
   */
  workspace: Workspace | null;
  
  /**
   * Workspace members
   */
  members: Membership[];
  
  /**
   * Loading state
   */
  loading: boolean;
  
  /**
   * Members loading state
   */
  membersLoading: boolean;
  
  /**
   * Error message
   */
  error: string | null;
}

/**
 * Initial WorkspaceState
 */
const initialState: WorkspaceState = {
  workspace: null,
  members: [],
  loading: false,
  membersLoading: false,
  error: null
};

/**
 * WorkspaceStore
 * 
 * NgRx Signals Store for managing current workspace state.
 * 
 * Features:
 * - Workspace details management
 * - Member list management
 * - Permission calculation
 * - Real-time synchronization
 * - Auto-integration with WorkspaceListStore
 */
export const WorkspaceStore = signalStore(
  { providedIn: 'root' },
  
  // State
  withState(initialState),
  
  // Computed Signals
  withComputed((store, authStore = inject(AuthStore)) => ({
    /**
     * Current workspace ID
     */
    workspaceId: computed(() => store.workspace()?.id || null),
    
    /**
     * Current workspace name
     */
    workspaceName: computed(() => store.workspace()?.identity.name || ''),
    
    /**
     * Current workspace owner ID
     */
    workspaceOwnerId: computed(() => store.workspace()?.ownerId || null),
    
    /**
     * Find current user's membership in this workspace
     */
    currentUserMembership: computed(() => {
      const currentUser = authStore.authUser();
      const members = store.members();
      
      if (!currentUser) return null;
      
      return members.find(m => m.accountId === currentUser.uid) || null;
    }),
    
    /**
     * Current user's role in this workspace
     */
    currentUserRole: computed(() => {
      const currentUser = authStore.authUser();
      const members = store.members();
      
      if (!currentUser) return null;
      
      const membership = members.find(m => m.accountId === currentUser.uid);
      return membership?.role || null;
    }),
    
    /**
     * Check if current user is workspace owner
     */
    isOwner: computed(() => {
      const currentUser = authStore.authUser();
      const workspace = store.workspace();
      
      if (!currentUser || !workspace) return false;
      
      return workspace.ownerId === currentUser.uid;
    }),
    
    /**
     * Check if current user is admin (Owner or Admin role)
     */
    isAdmin: computed(() => {
      const currentUser = authStore.authUser();
      const members = store.members();
      
      if (!currentUser) return false;
      
      const membership = members.find(m => m.accountId === currentUser.uid);
      return membership?.role === MembershipRole.OWNER || 
             membership?.role === MembershipRole.ADMIN;
    }),
    
    /**
     * Current user's permissions
     */
    currentUserPermissions: computed(() => {
      const currentUser = authStore.authUser();
      const members = store.members();
      
      if (!currentUser) return null;
      
      const membership = members.find(m => m.accountId === currentUser.uid);
      return membership?.permissions || null;
    }),
    
    /**
     * Check if current user can invite members
     */
    canInviteMembers: computed(() => {
      const permissions = store.currentUserPermissions();
      const role = store.currentUserRole();
      
      // Admins can always invite
      if (role === MembershipRole.OWNER || role === MembershipRole.ADMIN) {
        return true;
      }
      
      // Check custom permissions
      return permissions?.canManageMembers || false;
    }),
    
    /**
     * Check if current user can remove members
     */
    canRemoveMembers: computed(() => {
      const role = store.currentUserRole();
      return role === MembershipRole.OWNER || role === MembershipRole.ADMIN;
    }),
    
    /**
     * Check if current user can change member roles
     */
    canChangeRoles: computed(() => {
      const role = store.currentUserRole();
      return role === MembershipRole.OWNER || role === MembershipRole.ADMIN;
    }),
    
    /**
     * Check if current user can edit workspace
     */
    canEditWorkspace: computed(() => {
      const role = store.currentUserRole();
      return role === MembershipRole.OWNER || role === MembershipRole.ADMIN;
    }),
    
    /**
     * Check if current user can delete workspace
     */
    canDeleteWorkspace: computed(() => {
      return store.isOwner();
    }),
    
    /**
     * Member count
     */
    memberCount: computed(() => store.members().length),
    
    /**
     * Active members (status = ACTIVE)
     */
    activeMembers: computed(() => 
      store.members().filter(m => m.status === 'ACTIVE')
    ),
    
    /**
     * Pending invites (status = INVITED)
     */
    pendingInvites: computed(() => 
      store.members().filter(m => m.status === 'INVITED')
    ),
    
    /**
     * Workspace owner (find member with OWNER role)
     */
    workspaceOwner: computed(() => 
      store.members().find(m => m.role === MembershipRole.OWNER) || null
    ),
    
    /**
     * Check if workspace has data loaded
     */
    hasWorkspace: computed(() => store.workspace() !== null),
    
    /**
     * Check if quota limits are reached
     */
    quotaStatus: computed(() => {
      const workspace = store.workspace();
      const memberCount = store.memberCount();
      
      if (!workspace) return null;
      
      const quota = workspace.quota;
      
      return {
        members: {
          current: memberCount,
          limit: quota.maxMembers,
          percentage: (memberCount / quota.maxMembers) * 100,
          nearLimit: memberCount >= quota.maxMembers * 0.9
        },
        storage: {
          used: quota.usedStorage,
          limit: quota.maxStorage,
          percentage: (quota.usedStorage / quota.maxStorage) * 100,
          nearLimit: quota.usedStorage >= quota.maxStorage * 0.8
        }
      };
    })
  })),
  
  // Methods
  withMethods((store, workspaceRepository = inject(WorkspaceRepository)) => ({
    /**
     * Set workspace data
     */
    setWorkspace(workspace: Workspace | null) {
      patchState(store, { workspace, error: null });
    },
    
    /**
     * Update workspace data
     */
    updateWorkspaceData(updates: Partial<Workspace>) {
      const current = store.workspace();
      if (!current) return;
      
      patchState(store, {
        workspace: { ...current, ...updates }
      });
    },
    
    /**
     * Set members data
     */
    setMembers(members: Membership[]) {
      patchState(store, { members, membersLoading: false });
    },
    
    /**
     * Add member to local state
     */
    addMember(member: Membership) {
      patchState(store, (state) => ({
        members: [...state.members, member]
      }));
    },
    
    /**
     * Update member in local state
     */
    updateMember(memberId: string, updates: Partial<Membership>) {
      patchState(store, (state) => ({
        members: state.members.map(m => 
          m.id === memberId ? { ...m, ...updates } : m
        )
      }));
    },
    
    /**
     * Remove member from local state
     */
    removeMemberFromState(memberId: string) {
      patchState(store, (state) => ({
        members: state.members.filter(m => m.id !== memberId)
      }));
    },
    
    /**
     * Clear all workspace state
     */
    reset() {
      patchState(store, initialState);
    },
    
    /**
     * Load workspace details (one-time)
     */
    loadWorkspace: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((workspaceId) => workspaceRepository.getWorkspace(workspaceId)),
        tapResponse({
          next: (workspace) => patchState(store, { 
            workspace, 
            loading: false 
          }),
          error: (error: Error) => patchState(store, { 
            error: error.message, 
            loading: false 
          })
        })
      )
    ),
    
    /**
     * Subscribe to real-time workspace updates
     */
    subscribeToWorkspace: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((workspaceId) => workspaceRepository.subscribeToWorkspace(workspaceId)),
        tapResponse({
          next: (workspace) => patchState(store, { 
            workspace, 
            loading: false 
          }),
          error: (error: Error) => patchState(store, { 
            error: error.message, 
            loading: false 
          })
        })
      )
    ),
    
    /**
     * Load workspace members
     */
    loadMembers: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { membersLoading: true })),
        switchMap((workspaceId) => workspaceRepository.getWorkspaceMembers(workspaceId)),
        tapResponse({
          next: (members) => patchState(store, { 
            members, 
            membersLoading: false 
          }),
          error: (error: Error) => {
            console.error('Error loading members:', error);
            patchState(store, { membersLoading: false });
          }
        })
      )
    ),
    
    /**
     * Subscribe to real-time member updates
     */
    subscribeToMembers: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { membersLoading: true })),
        switchMap((workspaceId) => workspaceRepository.subscribeToMembers(workspaceId)),
        tapResponse({
          next: (members) => patchState(store, { 
            members, 
            membersLoading: false 
          }),
          error: (error: Error) => {
            console.error('Error subscribing to members:', error);
            patchState(store, { membersLoading: false });
          }
        })
      )
    ),
    
    /**
     * Update workspace settings
     */
    updateWorkspace: rxMethod<{ id: string; updates: Partial<Workspace> }>(
      pipe(
        switchMap(({ id, updates }) => 
          workspaceRepository.updateWorkspace(id, updates)
            .then(() => updates)
        ),
        tapResponse({
          next: (updates) => {
            const current = store.workspace();
            if (current) {
              patchState(store, {
                workspace: { ...current, ...updates }
              });
            }
          },
          error: (error: Error) => patchState(store, { 
            error: error.message 
          })
        })
      )
    ),
    
    /**
     * Invite member to workspace
     */
    inviteMember: rxMethod<Membership>(
      pipe(
        switchMap((membership) => {
          const workspaceId = store.workspaceId();
          if (!workspaceId) {
            throw new Error('No workspace selected');
          }
          return workspaceRepository.addMember(workspaceId, membership)
            .then(() => membership);
        }),
        tapResponse({
          next: (membership) => {
            // Member will be added via real-time subscription
            console.log('Member invited successfully');
          },
          error: (error: Error) => patchState(store, { 
            error: error.message 
          })
        })
      )
    ),
    
    /**
     * Change member role
     */
    changeMemberRole: rxMethod<{ memberId: string; newRole: MembershipRole }>(
      pipe(
        switchMap(({ memberId, newRole }) => {
          const workspaceId = store.workspaceId();
          if (!workspaceId) {
            throw new Error('No workspace selected');
          }
          return workspaceRepository.updateMember(workspaceId, memberId, { role: newRole } as any)
            .then(() => ({ memberId, newRole }));
        }),
        tapResponse({
          next: ({ memberId, newRole }) => {
            // Update will be reflected via real-time subscription
            console.log('Member role changed successfully');
          },
          error: (error: Error) => patchState(store, { 
            error: error.message 
          })
        })
      )
    ),
    
    /**
     * Remove member from workspace
     */
    removeMember: rxMethod<string>(
      pipe(
        switchMap((memberId) => {
          const workspaceId = store.workspaceId();
          if (!workspaceId) {
            throw new Error('No workspace selected');
          }
          return workspaceRepository.removeMember(workspaceId, memberId)
            .then(() => memberId);
        }),
        tapResponse({
          next: (memberId) => {
            // Member will be removed via real-time subscription
            console.log('Member removed successfully');
          },
          error: (error: Error) => patchState(store, { 
            error: error.message 
          })
        })
      )
    )
  })),
  
  // Hooks
  withHooks({
    onInit(store) {
      const workspaceListStore = inject(WorkspaceListStore);
      
      // React to workspace selection changes
      effect(() => {
        const currentWorkspaceId = workspaceListStore.currentWorkspaceId();
        
        if (currentWorkspaceId) {
          // Load new workspace
          store.subscribeToWorkspace(currentWorkspaceId);
          store.subscribeToMembers(currentWorkspaceId);
        } else {
          // Clear workspace state
          store.reset();
        }
      });
    }
  })
);
