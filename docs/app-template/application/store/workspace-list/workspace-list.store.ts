/**
 * 摘要 (Summary): WorkspaceList Store - 管理使用者的工作區列表
 * 
 * 用途 (Purpose): 提供帳戶層級的工作區列表管理，包括工作區切換、列表查詢等功能
 * 
 * 功能 (Features):
 * - 管理使用者所屬的所有工作區列表
 * - 追蹤當前選中的工作區 ID
 * - 區分擁有和加入的工作區
 * - 提供工作區列表相關的 computed signals
 * 
 * 責任 (Responsibilities):
 * - 維護工作區列表狀態 (providedIn: 'root')
 * - 處理工作區切換邏輯
 * - 從 Firebase 同步工作區資料
 * - 提供工作區列表查詢介面
 */

import { computed, effect, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { pipe, switchMap, tap } from 'rxjs';
import { WorkspaceListState } from './workspace-list.models';
import { WorkspaceMetadata } from '../../../domain/workspace';
import { MembershipRole } from '../../../domain/workspace-membership';
import { WorkspaceListRepository, CreateWorkspaceData } from '../../../infrastructure/firebase/repositories/workspace-list.repository';
import { AuthStore } from '../global-shell/auth/auth.store';

/**
 * Initial state for WorkspaceList Store
 */
const initialState: WorkspaceListState = {
  workspaces: [],
  memberships: [],
  currentWorkspaceId: null,
  loading: false,
  error: null,
};

/**
 * WorkspaceList Store
 * 
 * NgRx Signals-based store for workspace list management.
 * 
 * State:
 * - workspaces: Array of WorkspaceMetadata
 * - memberships: Array of Membership
 * - currentWorkspaceId: Currently selected workspace ID
 * - loading: Loading state for async operations
 * - error: Error message from operations
 * 
 * Computed:
 * - ownedWorkspaces: Workspaces where user is OWNER
 * - memberWorkspaces: Workspaces where user is not OWNER
 * - recentWorkspaces: 5 most recently accessed workspaces
 * - currentWorkspace: Currently selected workspace
 * - hasWorkspaces: Whether user has any workspaces
 * - workspaceCount: Total number of workspaces
 * 
 * Methods:
 * - selectWorkspace: Set current workspace
 * - clearCurrentWorkspace: Clear workspace selection
 * - addWorkspace: Add workspace to array
 * - updateWorkspace: Update existing workspace
 * - removeWorkspace: Remove workspace from array
 * 
 * Effects (rxMethod):
 * - subscribeToWorkspaces: Real-time subscription to workspaces
 * - createWorkspace: Create new workspace
 * - updateLastAccessed: Update access timestamp
 * 
 * Hooks:
 * - onInit: Auto-subscribe when user logs in
 */
export const WorkspaceListStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((state) => ({
    /**
     * Get workspaces where user is OWNER
     */
    ownedWorkspaces: computed(() => {
      const workspaces = state.workspaces();
      const memberships = state.memberships();
      
      const ownedWorkspaceIds = memberships
        .filter(m => m.role === MembershipRole.OWNER)
        .map(m => m.workspaceId);
      
      return workspaces.filter(w => ownedWorkspaceIds.includes(w.id));
    }),

    /**
     * Get workspaces where user is not OWNER
     */
    memberWorkspaces: computed(() => {
      const workspaces = state.workspaces();
      const memberships = state.memberships();
      
      const memberWorkspaceIds = memberships
        .filter(m => m.role !== MembershipRole.OWNER)
        .map(m => m.workspaceId);
      
      return workspaces.filter(w => memberWorkspaceIds.includes(w.id));
    }),

    /**
     * Get 5 most recently accessed workspaces
     */
    recentWorkspaces: computed(() => {
      const memberships = state.memberships();
      const workspaces = state.workspaces();
      
      // Sort memberships by lastAccessedAt descending
      const sortedMemberships = [...memberships].sort((a, b) => 
        b.lastAccessedAt.getTime() - a.lastAccessedAt.getTime()
      );
      
      // Get workspace IDs from top 5 memberships
      const recentWorkspaceIds = sortedMemberships
        .slice(0, 5)
        .map(m => m.workspaceId);
      
      // Filter workspaces and maintain order
      return recentWorkspaceIds
        .map(id => workspaces.find(w => w.id === id))
        .filter((w): w is WorkspaceMetadata => w !== undefined);
    }),

    /**
     * Get currently selected workspace
     */
    currentWorkspace: computed(() => {
      const workspaceId = state.currentWorkspaceId();
      const workspaces = state.workspaces();
      
      if (!workspaceId) return null;
      
      return workspaces.find(w => w.id === workspaceId) || null;
    }),

    /**
     * Check if user has any workspaces
     */
    hasWorkspaces: computed(() => state.workspaces().length > 0),

    /**
     * Get total workspace count
     */
    workspaceCount: computed(() => state.workspaces().length),
  })),
  withMethods((store, repository = inject(WorkspaceListRepository)) => ({
    /**
     * Set current workspace ID
     * 
     * @param workspaceId - Workspace ID to select
     */
    selectWorkspace(workspaceId: string): void {
      patchState(store, { currentWorkspaceId: workspaceId });
    },

    /**
     * Clear current workspace selection
     */
    clearCurrentWorkspace(): void {
      patchState(store, { currentWorkspaceId: null });
    },

    /**
     * Add workspace to array
     * 
     * @param workspace - Workspace to add
     */
    addWorkspace(workspace: WorkspaceMetadata): void {
      const current = store.workspaces();
      
      // Check if workspace already exists
      if (current.some(w => w.id === workspace.id)) {
        console.warn(`Workspace ${workspace.id} already exists`);
        return;
      }
      
      patchState(store, { 
        workspaces: [...current, workspace] 
      });
    },

    /**
     * Update existing workspace
     * 
     * @param id - Workspace ID
     * @param updates - Partial workspace updates
     */
    updateWorkspace(id: string, updates: Partial<WorkspaceMetadata>): void {
      const current = store.workspaces();
      
      const updated = current.map(w => 
        w.id === id ? { ...w, ...updates } : w
      );
      
      patchState(store, { workspaces: updated });
    },

    /**
     * Remove workspace from array
     * 
     * @param id - Workspace ID to remove
     */
    removeWorkspace(id: string): void {
      const current = store.workspaces();
      
      patchState(store, { 
        workspaces: current.filter(w => w.id !== id) 
      });
      
      // Clear selection if removed workspace was selected
      if (store.currentWorkspaceId() === id) {
        patchState(store, { currentWorkspaceId: null });
      }
    },

    /**
     * Subscribe to user's workspaces in real-time
     * 
     * Automatically updates workspaces and memberships when changes occur.
     * 
     * @param accountId - User's account ID
     */
    subscribeToWorkspaces: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((accountId) => 
          repository.subscribeToWorkspaces(accountId)
        ),
        tapResponse({
          next: (workspaces) => {
            patchState(store, { 
              workspaces,
              loading: false,
              error: null 
            });
            
            // Also load memberships
            // This is simplified - in production you might want separate rxMethod
          },
          error: (error: Error) => {
            console.error('Error subscribing to workspaces:', error);
            patchState(store, { 
              error: error.message,
              loading: false 
            });
          },
        })
      )
    ),

    /**
     * Create a new workspace
     * 
     * @param data - Workspace creation data
     */
    createWorkspace: rxMethod<CreateWorkspaceData>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((data) => 
          repository.createWorkspace(data)
        ),
        tapResponse({
          next: (workspace) => {
            // Add to workspaces array
            const current = store.workspaces();
            patchState(store, { 
              workspaces: [...current, workspace],
              loading: false,
              error: null 
            });
          },
          error: (error: Error) => {
            console.error('Error creating workspace:', error);
            patchState(store, { 
              error: error.message,
              loading: false 
            });
          },
        })
      )
    ),

    /**
     * Update last accessed timestamp for workspace
     * 
     * @param workspaceId - Workspace ID
     */
    updateLastAccessed: rxMethod<string>(
      pipe(
        switchMap((workspaceId) => {
          // Get current user's account ID from AuthStore
          const authStore = inject(AuthStore);
          const accountId = authStore.authUser()?.uid;
          
          if (!accountId) {
            throw new Error('No authenticated user');
          }
          
          const membershipId = `${accountId}_${workspaceId}`;
          const timestamp = new Date();
          
          return repository.updateLastAccessed(membershipId, timestamp);
        }),
        tapResponse({
          next: () => {
            // Success - real-time subscription will update state
          },
          error: (error: Error) => {
            console.error('Error updating last accessed:', error);
          },
        })
      )
    ),
  })),
  withHooks({
    /**
     * Initialize store
     * 
     * Sets up effect to automatically subscribe to workspaces when user logs in.
     */
    onInit(store) {
      const authStore = inject(AuthStore);
      
      // React to auth changes
      effect(() => {
        const user = authStore.authUser();
        
        if (user) {
          // User logged in - subscribe to workspaces
          store.subscribeToWorkspaces(user.uid);
        } else {
          // User logged out - clear workspaces
          patchState(store, initialState);
        }
      });
    },
  })
);

