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
      members().filter(m => m.status === MemberStatus.ACTIVE)
    ),
    
    /**
     * Get pending members (invited but not joined)
     */
    pendingMembers: computed(() => 
      members().filter(m => m.status === MemberStatus.PENDING)
    ),
    
    /**
     * Get suspended members
     */
    suspendedMembers: computed(() => 
      members().filter(m => m.status === MemberStatus.SUSPENDED)
    ),
    
    /**
     * Get members by role
     */
    ownerMembers: computed(() => 
      members().filter(m => m.role === MemberRole.OWNER)
    ),
    
    adminMembers: computed(() => 
      members().filter(m => m.role === MemberRole.ADMIN)
    ),
    
    memberMembers: computed(() => 
      members().filter(m => m.role === MemberRole.MEMBER)
    ),
    
    guestMembers: computed(() => 
      members().filter(m => m.role === MemberRole.GUEST)
    ),
    
    /**
     * Get member count
     */
    memberCount: computed(() => members().length),
    
    /**
     * Get active member count
     */
    activeMemberCount: computed(() => 
      members().filter(m => m.status === MemberStatus.ACTIVE).length
    )
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
     * Add a member to workspace
     */
    addMember: rxMethod<Omit<Member, 'id'>>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((memberData) => memberRepository.addMember(memberData)),
        tapResponse({
          next: () => patchState(store, { loading: false }),
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
        switchMap(({ memberId, role }) => 
          memberRepository.updateMemberRole(memberId, role).pipe(
            tap(() => {
              // Update local state optimistically
              patchState(store, (state) => ({
                members: state.members.map(m => 
                  m.id === memberId ? { ...m, role } : m
                )
              }));
            })
          )
        ),
        tapResponse({
          next: () => patchState(store, { loading: false }),
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
        switchMap(({ memberId, status }) => 
          memberRepository.updateMemberStatus(memberId, status).pipe(
            tap(() => {
              // Update local state optimistically
              patchState(store, (state) => ({
                members: state.members.map(m => 
                  m.id === memberId ? { ...m, status } : m
                )
              }));
            })
          )
        ),
        tapResponse({
          next: () => patchState(store, { loading: false }),
          error: (error: Error) => patchState(store, { 
            error: error.message, 
            loading: false 
          })
        })
      )
    ),
    
    /**
     * Remove a member from workspace
     */
    removeMember: rxMethod<string>(
      pipe(
        switchMap((memberId) => 
          memberRepository.removeMember(memberId).pipe(
            tap(() => {
              // Remove from local state
              patchState(store, (state) => ({
                members: state.members.filter(m => m.id !== memberId)
              }));
            })
          )
        ),
        tapResponse({
          next: () => patchState(store, { loading: false }),
          error: (error: Error) => patchState(store, { 
            error: error.message, 
            loading: false 
          })
        })
      )
    ),
    
    /**
     * Update member's last active time
     */
    updateLastActive: rxMethod<string>(
      pipe(
        switchMap((memberId) => memberRepository.updateLastActive(memberId)),
        tapResponse({
          next: () => {},
          error: (error: Error) => console.error('Failed to update last active:', error)
        })
      )
    )
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
