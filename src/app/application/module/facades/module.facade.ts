import { inject, computed } from '@angular/core';
import { signalStore, withComputed, withMethods } from '@ngrx/signals';
import { ModuleStore } from '../stores/module.store';
import { ContextStore } from '@application/context/stores/context.store';
import { Module } from '@domain/module';

/**
 * Module Facade
 * 
 * ╔═══════════════════════════════════════════════════════════════════╗
 * ║  APPLICATION LAYER: Module Operations Orchestration              ║
 * ╚═══════════════════════════════════════════════════════════════════╝
 * 
 * ARCHITECTURAL ROLE:
 * ===================
 * Single point of entry for all module-related operations.
 * Coordinates ModuleStore + ContextStore interactions.
 * 
 * RESPONSIBILITIES:
 * =================
 * 1. Provide unified ViewModel for sidebar and module navigation
 * 2. Orchestrate module reordering with workspace context validation
 * 3. Encapsulate cross-store coordination logic
 * 4. Expose high-level intent-based API to UI
 * 
 * DDD LAYER SEPARATION:
 * =====================
 * ✅ Presentation → ModuleFacade (ONLY)
 * ✅ ModuleFacade → ModuleStore + ContextStore
 * ✅ Zero business logic in presentation layer
 */
export const ModuleFacade = signalStore(
  { providedIn: 'root' },
  
  // ViewModel consolidating module state
  withComputed(() => {
    const moduleStore = inject(ModuleStore);
    const contextStore = inject(ContextStore);
    
    return {
      /**
       * Single computed ViewModel for sidebar
       * Consolidates all reactive state into one signal
       */
      viewModel: computed(() => {
        const currentWorkspaceId = contextStore.currentWorkspaceId();
        const modules = moduleStore.modules();
        
        return {
          // Module lists
          modules,
          enabledModules: moduleStore.enabledModules(),
          
          // Current workspace context
          currentWorkspaceId,
          
          // Active module (TODO: integrate with router)
          activeModuleId: null as string | null,
          
          // Loading state
          isLoading: moduleStore.loading(),
          
          // Validation flags
          canReorderModules: !!currentWorkspaceId && modules.length > 1,
          hasWorkspaceContext: !!currentWorkspaceId
        };
      })
    };
  }),
  
  // Orchestration methods
  withMethods((store) => {
    const moduleStore = inject(ModuleStore);
    const contextStore = inject(ContextStore);
    
    return {
      /**
       * Reorder modules via drag-and-drop
       * 
       * ORCHESTRATION:
       * ==============
       * 1. Validate workspace context exists
       * 2. Extract workspaceId from ContextStore
       * 3. Call ModuleStore.updateModuleOrder() with validated context
       * 4. Store handles persistence + state update
       * 
       * BUSINESS RULES:
       * ===============
       * - Workspace context required (no orphan module reordering)
       * - At least 2 modules required for reordering
       */
      reorderModules(modules: Module[]): void {
        const workspaceId = contextStore.currentWorkspaceId();
        
        // Business rule: Workspace context required
        if (!workspaceId) {
          console.warn('Cannot reorder modules: No workspace context');
          return;
        }
        
        // Business rule: Modules must belong to current workspace
        const allBelongToWorkspace = modules.every(m => m.workspaceId === workspaceId);
        if (!allBelongToWorkspace) {
          console.error('Cannot reorder modules: Modules belong to different workspaces');
          return;
        }
        
        // Build order update payload
        const orders = modules.map((m, index) => ({ 
          id: m.id, 
          order: index 
        }));
        
        // Delegate to store with validated context
        moduleStore.updateModuleOrder({ workspaceId, orders });
      },
      
      /**
       * Load modules for current workspace
       * 
       * ORCHESTRATION:
       * ==============
       * 1. Validate workspace context exists
       * 2. Extract workspaceId from ContextStore
       * 3. Call ModuleStore.loadModules()
       */
      loadModulesForCurrentWorkspace(): void {
        const workspaceId = contextStore.currentWorkspaceId();
        
        // Business rule: Workspace context required
        if (!workspaceId) {
          console.warn('Cannot load modules: No workspace context');
          return;
        }
        
        // Delegate to store with workspaceId
        moduleStore.loadWorkspaceModules(workspaceId);
      },
      
      /**
       * Enable module for current workspace
       * 
       * ORCHESTRATION:
       * ==============
       * 1. Validate workspace context exists
       * 2. Call ModuleStore.toggleModuleEnabled() with enabled: true
       */
      enableModule(moduleId: string): void {
        const workspaceId = contextStore.currentWorkspaceId();
        
        // Business rule: Workspace context required
        if (!workspaceId) {
          console.warn('Cannot enable module: No workspace context');
          return;
        }
        
        // Delegate to store
        moduleStore.toggleModuleEnabled({ moduleId, enabled: true });
      },
      
      /**
       * Disable module for current workspace
       * 
       * ORCHESTRATION:
       * ==============
       * 1. Validate workspace context exists
       * 2. Call ModuleStore.toggleModuleEnabled() with enabled: false
       */
      disableModule(moduleId: string): void {
        const workspaceId = contextStore.currentWorkspaceId();
        
        // Business rule: Workspace context required
        if (!workspaceId) {
          console.warn('Cannot disable module: No workspace context');
          return;
        }
        
        // Delegate to store
        moduleStore.toggleModuleEnabled({ moduleId, enabled: false });
      }
    };
  })
);
