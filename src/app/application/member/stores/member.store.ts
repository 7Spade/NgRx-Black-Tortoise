/**
 * Member Store
 * 
 * Manages workspace members state using NgRx Signals.
 * Handles member management, roles, and permissions.
 * 
 * Reactive Auto-loading:
 * - Loads members when workspace changes
 * - Filters active/inactive members
 * - Tracks member roles and permissions
 */

import { signalStore, withState, withComputed, withMethods, withHooks, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { computed, effect, inject } from '@angular/core';
import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';

// Domain
import { Member, MemberRole, MemberStatus } from '@domain/member';
import { MemberRepository } from '@domain/repositories/member.repository.interface';

// Application
import { MEMBER_REPOSITORY } from '@application/tokens';
import { WorkspaceStore } from '@application/workspace/stores/workspace.store';

/**
 * Member State Interface
 */
export interface MemberState {
  members: Member[];
  loading: boolean;
  error: string | null;
}

/**
 * Initial Member State
 */
const initialState: MemberState = {
  members: [],
  loading: false,
  error: null
};

/**
 * Member Store
 * 
 * Provides reactive member management with auto-loading when workspace changes.
 */
export const MemberStore = signalStore(
  { providedIn: 'root' },
  
  withState(initialState),
  
  withComputed(({ members }) => ({
    /**
     * Get active members only
     */
    activeMembers: computed(() => 
      members().filter(m => m.status === 'active')
    ),
    
    /**
     * Get pending members (invited but not joined)
     */
    pendingMembers: computed(() => 
      members().filter(m => m.status === 'pending')
    ),
    
    /**
     * Get suspended members
     */
    suspendedMembers: computed(() => 
      members().filter(m => m.status === 'suspended')
    ),
    
    /**
     * Get members by role
     */
    ownerMembers: computed(() => 
      members().filter(m => m.role === 'owner')
    ),
    
    adminMembers: computed(() => 
      members().filter(m => m.role === 'admin')
    ),
    
    editorMembers: computed(() => 
      members().filter(m => m.role === 'editor')
    ),
    
    viewerMembers: computed(() => 
      members().filter(m => m.role === 'viewer')
    ),
    
    /**
     * Get member count
     */
    memberCount: computed(() => members().length),
    
    activeMemberCount: computed(() => 
      members().filter(m => m.status === 'active').length
    ),
    
    /**
     * Check if members are loaded
     */
    hasMembers: computed(() => members().length > 0)
  })),
  
  withMethods((store, memberRepository = inject(MEMBER_REPOSITORY)) => ({
    /**
     * Load all members for a workspace
     */
    loadWorkspaceMembers: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((workspaceId) => memberRepository.getWorkspaceMembers(workspaceId)),
        tapResponse({
          next: (members) => patchState(store, { members, loading: false }),
          error: (error: Error) => patchState(store, { 
            error: error.message, 
            loading: false 
          })
        })
      )
    ),
    
    /**
     * Load active members only
     */
    loadActiveMembers: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((workspaceId) => memberRepository.getActiveMembers(workspaceId)),
        tapResponse({
          next: (members) => patchState(store, { members, loading: false }),
          error: (error: Error) => patchState(store, { 
            error: error.message, 
            loading: false 
          })
        })
      )
    ),
    
    /**
     * Add a member to workspace
     */
    addMember: rxMethod<Omit<Member, 'id' | 'joinedAt' | 'updatedAt'>>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((memberData) => memberRepository.addMember(memberData)),
        tapResponse({
          next: (member) => patchState(store, (state) => ({
            members: [...state.members, member],
            loading: false
          })),
          error: (error: Error) => patchState(store, { 
            error: error.message, 
            loading: false 
          })
        })
      )
    ),
    
    /**
     * Update member role
     */
    updateMemberRole: rxMethod<{ memberId: string; role: MemberRole }>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(({ memberId, role }) => 
          memberRepository.updateMemberRole(memberId, role)
        ),
        tapResponse({
          next: () => {
            // Update local state optimistically
            patchState(store, (state) => ({
              members: state.members.map(m => 
                m.id === memberId ? { ...m, role } : m
              ),
              loading: false
            }));
          },
          error: (error: Error) => patchState(store, { 
            error: error.message, 
            loading: false 
          })
        })
      )
    ),
    
    /**
     * Update member status
     */
    updateMemberStatus: rxMethod<{ memberId: string; status: MemberStatus }>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(({ memberId, status }) => 
          memberRepository.updateMemberStatus(memberId, status)
        ),
        tapResponse({
          next: () => {
            // Update local state optimistically
            patchState(store, (state) => ({
              members: state.members.map(m => 
                m.id === memberId ? { ...m, status } : m
              ),
              loading: false
            }));
          },
          error: (error: Error) => patchState(store, { 
            error: error.message, 
            loading: false 
          })
        })
      )
    ),
    
    /**
     * Remove a member
     */
    removeMember: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((memberId) => memberRepository.removeMember(memberId)),
        tapResponse({
          next: () => {
            // Remove from local state
            patchState(store, (state) => ({
              members: state.members.filter(m => m.id !== memberId),
              loading: false
            }));
          },
          error: (error: Error) => patchState(store, { 
            error: error.message, 
            loading: false 
          })
        })
      )
    ),
    
    /**
     * Clear all members
     */
    clearMembers() {
      patchState(store, initialState);
    }
  })),
  
  withHooks({
    onInit(store, workspaceStore = inject(WorkspaceStore)) {
      // Auto-load members when workspace changes
      effect(() => {
        const currentWorkspace = workspaceStore.currentWorkspace();
        
        if (currentWorkspace) {
          store.loadWorkspaceMembers(currentWorkspace.id);
        } else {
          patchState(store, initialState);
        }
      });
    }
  })
);
