/**
 * WorkspaceStore - Application Layer
 * 
 * Manages workspace state with NgRx Signals.
 * Includes recent and favorite workspace tracking.
 */
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
  withHooks,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { computed, inject } from '@angular/core';
import { pipe, switchMap, tap, catchError, of } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { initialWorkspaceState } from './workspace.state';
import { Workspace } from '@domain/workspace';
import { WORKSPACE_REPOSITORY } from '@application/tokens';
import { OrganizationStore } from '@application/organization/stores/organization.store';
import { AuthStore } from '@application/auth/stores/auth.store';

export const WorkspaceStore = signalStore(
  { providedIn: 'root' },
  withState(initialWorkspaceState),
  withComputed(({ currentWorkspace, workspaces, recentWorkspaces, favoriteWorkspaces, loading }) => ({
    hasWorkspace: computed(() => currentWorkspace() !== null),
    workspaceCount: computed(() => workspaces().length),
    isLoading: computed(() => loading()),
    
    // Recent workspaces (last 5 accessed)
    recentWorkspacesList: computed(() => {
      const recent = recentWorkspaces();
      return workspaces().filter((w) => recent.includes(w.id));
    }),
    
    // Favorite workspaces
    favoriteWorkspacesList: computed(() => {
      const favorites = favoriteWorkspaces();
      return workspaces().filter((w) => favorites.includes(w.id));
    }),
    
    // My workspaces (all workspaces user has access to)
    myWorkspaces: computed(() => workspaces()),
    
    // Check if current workspace is favorited
    isCurrentWorkspaceFavorite: computed(() => {
      const current = currentWorkspace();
      const favorites = favoriteWorkspaces();
      return current ? favorites.includes(current.id) : false;
    }),
  })),
  withMethods((store, workspaceService = inject(WORKSPACE_REPOSITORY)) => {
    // Load workspaces for organization
    const loadOrganizationWorkspacesEffect = rxMethod<string>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((orgId) => workspaceService.getOrganizationWorkspaces(orgId)),
        tapResponse({
          next: (workspaces) => {
            patchState(store, {
              workspaces,
              loading: false,
            });
          },
          error: (error: Error) => {
            patchState(store, {
              error: error.message || 'Failed to load workspaces',
              loading: false,
            });
          },
        })
      )
    );

    // Create a new workspace
    const createWorkspaceEffect = rxMethod<Omit<Workspace, 'id'>>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((workspace) => workspaceService.createWorkspace(workspace)),
        tapResponse({
          next: (workspaceId) => {
            console.log('Workspace created:', workspaceId);
            // Reload workspaces after creation
            const orgStore = inject(OrganizationStore);
            const org = orgStore.currentOrganization();
            if (org) {
              loadOrganizationWorkspacesEffect(org.id);
            } else {
              patchState(store, { loading: false });
            }
          },
          error: (error: Error) => {
            patchState(store, {
              error: error.message || 'Failed to create workspace',
              loading: false,
            });
          },
        })
      )
    );

    return {
      // Async operations
      loadOrganizationWorkspaces(orgId: string): void {
        loadOrganizationWorkspacesEffect(orgId);
      },
      createWorkspace(workspace: Omit<Workspace, 'id'>): void {
        createWorkspaceEffect(workspace);
      },

      // Synchronous state updates
      /**
       * Set current workspace and propagate to dependent stores
       * This ensures workspace switching triggers module availability updates
       */
      setCurrentWorkspace(workspace: Workspace | null) {
        patchState(store, { currentWorkspace: workspace });
        
        // Track access when workspace is selected
        if (workspace) {
          this.trackAccess(workspace.id);
          
          // Propagate workspace switch to ModuleStore
          // Import lazily to avoid circular dependencies
          import('@application/module/stores/module.store').then(({ ModuleStore }) => {
            const moduleStore = inject(ModuleStore);
            
            // Load modules for the selected workspace
            moduleStore.loadWorkspaceModules(workspace.id);
          });
        }
      },
      setWorkspaces(workspaces: Workspace[]) {
        patchState(store, { workspaces });
      },
      setLoading(loading: boolean) {
        patchState(store, { loading });
      },
      setError(error: string | null) {
        patchState(store, { error });
      },

      // Favorites management
      toggleFavorite(workspaceId: string) {
        patchState(store, (state) => {
          const favorites = state.favoriteWorkspaces;
          const newFavorites = favorites.includes(workspaceId)
            ? favorites.filter((id) => id !== workspaceId)
            : [...favorites, workspaceId];
          return { favoriteWorkspaces: newFavorites };
        });
        // TODO: Persist to user preferences in Firestore
      },

      // Recent workspaces tracking
      trackAccess(workspaceId: string) {
        patchState(store, (state) => {
          // Add to recent, remove duplicates, keep last 5
          const recent = [workspaceId, ...state.recentWorkspaces.filter((id) => id !== workspaceId)].slice(0, 5);
          return { recentWorkspaces: recent };
        });
        // TODO: Persist to user preferences in Firestore
      },

      // Reset store state
      reset() {
        patchState(store, initialWorkspaceState);
      },
    };
  }),
  withHooks({
    onInit(store) {
      const orgStore = inject(OrganizationStore);
      const authStore = inject(AuthStore);

      // Reactive method to sync workspaces with organization/auth changes
      const syncWorkspaces = rxMethod<void>(
        pipe(
          switchMap(() => {
            const org = orgStore.currentOrganization();
            const user = authStore.user();
            
            if (org) {
              // Load organization workspaces
              return of({ type: 'org' as const, id: org.id });
            } else if (user) {
              // Load personal workspaces (if user has no org selected)
              // For now, just reset - later can implement personal workspace loading
              store.reset();
              return of(null);
            } else {
              // No user, reset store
              store.reset();
              return of(null);
            }
          }),
          tap((context) => {
            if (context?.type === 'org') {
              store.loadOrganizationWorkspaces(context.id);
            }
          }),
          catchError((error) => {
            console.error('Workspace sync error:', error);
            return of(null);
          })
        )
      );

      // Start syncing workspaces
      syncWorkspaces();
    },
  })
);
