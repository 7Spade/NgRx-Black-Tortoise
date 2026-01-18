/**
 * Module Store
 * 
 * Manages workspace modules state using NgRx Signals.
 * Modules represent features/sections within a workspace (Tasks, Documents, etc.)
 * 
 * Reactive Auto-loading:
 * - Loads modules when workspace changes via WorkspaceStore
 * - Resets state when workspace changes
 * - Tracks enabled modules and module ordering
 */

import { signalStore, withState, withComputed, withMethods, withHooks, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { computed, effect, inject } from '@angular/core';
import { pipe, switchMap, tap, map, from } from 'rxjs';
import { tapResponse } from '@ngrx/operators';

// Domain
import { Module } from '@domain/module';
import { ModuleRepository } from '@domain/repositories/module.repository.interface';

// Application
import { MODULE_REPOSITORY } from '@application/tokens';
import { WorkspaceStore } from '@application/workspace/stores/workspace.store';

/**
 * Module State Interface
 */
export interface ModuleState {
  modules: Module[];
  loading: boolean;
  error: string | null;
}

/**
 * Initial Module State
 */
const initialState: ModuleState = {
  modules: [],
  loading: false,
  error: null
};

/**
 * Module Store
 * 
 * Provides reactive module management with auto-loading when workspace changes.
 */
export const ModuleStore = signalStore(
  { providedIn: 'root' },
  
  withState(initialState),
  
  withComputed(({ modules }) => ({
    /**
     * Get enabled modules only
     */
    enabledModules: computed(() => 
      modules().filter(m => m.enabled)
    ),
    
    /**
     * Get modules sorted by order
     */
    sortedModules: computed(() => 
      [...modules()].sort((a, b) => a.order - b.order)
    ),
    
    /**
     * Get enabled and sorted modules for display
     */
    displayModules: computed(() => 
      modules()
        .filter(m => m.enabled)
        .sort((a, b) => a.order - b.order)
    ),
    
    /**
     * Get module count
     */
    moduleCount: computed(() => modules().length),
    
    /**
     * Check if modules are loaded
     */
    hasModules: computed(() => modules().length > 0),
    
    /**
     * Get modules with badges
     */
    modulesWithBadges: computed(() => 
      modules().filter(m => m.badge !== null)
    )
  })),
  
  withMethods((store, moduleRepository = inject(MODULE_REPOSITORY)) => ({
    /**
     * Load modules for a workspace
     */
    loadWorkspaceModules: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((workspaceId) => moduleRepository.getWorkspaceModules(workspaceId)),
        tapResponse({
          next: (modules) => patchState(store, { modules, loading: false }),
          error: (error: Error) => patchState(store, { 
            error: error.message, 
            loading: false 
          })
        })
      )
    ),
    
    /**
     * Load enabled modules only
     */
    loadEnabledModules: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((workspaceId) => moduleRepository.getWorkspaceModules(workspaceId)),
        tapResponse({
          next: (allModules: Module[]) => patchState(store, { 
            modules: allModules.filter(m => m.enabled), 
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
     * Update module order
     */
    updateModuleOrder: rxMethod<{ workspaceId: string; orders: Array<{ id: string; order: number }> }>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(({ workspaceId, orders }) => 
          moduleRepository.updateModuleOrder(workspaceId, orders)
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
     * Toggle module enabled state
     */
    toggleModuleEnabled: rxMethod<{ moduleId: string; enabled: boolean }>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(({ moduleId, enabled }) => 
          from(moduleRepository.toggleModuleEnabled(moduleId, enabled)).pipe(
            map(() => ({ moduleId, enabled }))
          )
        ),
        tapResponse({
          next: ({ moduleId, enabled }) => {
            // Update local state optimistically
            patchState(store, (state) => ({
              modules: state.modules.map(m => 
                m.id === moduleId ? { ...m, enabled } : m
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
     * Update local module badge
     */
    updateModuleBadge(moduleId: string, badge: Module['badge']) {
      patchState(store, (state) => {
        const updatedModules = state.modules.map(m => {
          if (m.id === moduleId) {
            const updated: Module = { ...m };
            if (badge !== undefined) {
              updated.badge = badge;
            }
            return updated;
          }
          return m;
        });
        
        return {
          ...state,
          modules: updatedModules
        };
      });
    },
    
    /**
     * Clear all modules
     */
    clearModules() {
      patchState(store, initialState);
    }
  })),
  
  withHooks({
    onInit(store, workspaceStore = inject(WorkspaceStore)) {
      // Auto-load modules when workspace changes
      effect(() => {
        const currentWorkspace = workspaceStore.currentWorkspace();
        
        if (currentWorkspace) {
          store.loadWorkspaceModules(currentWorkspace.id);
        } else {
          patchState(store, initialState);
        }
      });
    }
  })
);
