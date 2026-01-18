/**
 * Context Facade
 * 
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  APPLICATION LAYER: Context Unified API                              ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 * 
 * RESPONSIBILITY:
 * ===============
 * Provides a simplified, unified API for UI components to interact with
 * context switching operations (workspace, organization, team, partner).
 * Centralizes orchestration of context-related workflows.
 * 
 * ARCHITECTURE PATTERN:
 * =====================
 * FACADE PATTERN - Single entry point for context operations:
 * 
 * UI Component (search-dialog, header)
 *   ↓
 * ContextFacade (this file)
 *   ↓ delegates to →
 *   ├─ WorkspaceSwitchUseCase (workspace switching + navigation)
 *   ├─ ContextStore (context queries and mutations)
 *   └─ Router (navigation after context switch)
 * 
 * EXPOSED API (UI-friendly):
 * ===========================
 * State (read-only):
 * - viewModel() - Single computed ViewModel for UI rendering
 * - currentContext() - Active context (org/team/partner/user)
 * - currentWorkspaceId() - Active workspace ID
 * - availableContexts() - All available contexts
 * 
 * Commands (intent expression):
 * - switchToWorkspace(workspaceId, workspaceName, navigateTo?)
 * - switchToOrganization(orgId)
 * - switchToTeam(teamId)
 * - switchToPartner(partnerId)
 * 
 * FORBIDDEN PATTERNS:
 * ===================
 * ❌ UI importing ContextStore directly for switching
 * ❌ UI importing WorkspaceStore for context queries
 * ❌ UI implementing navigation logic
 * ❌ UI managing snackbar/announcements
 * 
 * CORRECT USAGE IN UI:
 * ====================
 * ```typescript
 * export class SearchDialogComponent {
 *   facade = inject(ContextFacade);
 *   
 *   onWorkspaceClick(workspace: Workspace) {
 *     this.facade.switchToWorkspace(
 *       workspace.id, 
 *       workspace.displayName,
 *       '/workspace/overview'
 *     );
 *     this.closeDialog();
 *   }
 * }
 * ```
 */

import { computed, inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ContextStore } from '../stores/context.store';
import { WorkspaceSwitchUseCase } from '@application/workspace/use-cases/workspace-switch.use-case';
import { ContextSwitchUseCase } from '../use-cases/context-switch.use-case';
import { AppContext } from '@domain/context';
import { WorkspaceStore } from '@application/workspace/stores/workspace.store';
import { ModuleStore } from '@application/module/stores/module.store';
import { Workspace } from '@domain/workspace';
import { Module } from '@domain/module';

/**
 * ViewModel for Context UI Components
 * Single source of truth for reactive rendering
 */
export interface ContextViewModel {
  // Current Context
  currentContextType: string | null;
  currentContextId: string | null;
  currentContextName: string | null;
  currentWorkspaceId: string | null;
  
  // Available Contexts
  hasOrganizations: boolean;
  hasTeams: boolean;
  hasPartners: boolean;
  canSwitchContext: boolean;
  
  // UI State
  hasWorkspace: boolean;
  
  // Search Data (for global search dialog)
  allWorkspaces: Workspace[];
  allModules: Module[];
}

@Injectable({ providedIn: 'root' })
export class ContextFacade {
  // Dependencies
  private contextStore = inject(ContextStore);
  private workspaceStore = inject(WorkspaceStore);
  private moduleStore = inject(ModuleStore);
  private workspaceSwitchUseCase = inject(WorkspaceSwitchUseCase);
  private contextSwitchUseCase = inject(ContextSwitchUseCase);
  private router = inject(Router);

  /**
   * Single ViewModel consolidating ALL context state for UI consumption
   * 
   * ARCHITECTURAL RULE:
   * ===================
   * UI components MUST bind to this ViewModel ONLY.
   * No direct contextStore signal reads in templates.
   * 
   * SEARCH INTEGRATION:
   * ===================
   * Includes allWorkspaces and allModules for global search dialog.
   * Search dialog filters these in its own computed signals.
   */
  viewModel = computed((): ContextViewModel => ({
    currentContextType: this.contextStore.currentContextType(),
    currentContextId: this.contextStore.currentContextId(),
    currentContextName: this.contextStore.currentContextName(),
    currentWorkspaceId: this.contextStore.currentWorkspaceId(),
    hasOrganizations: this.contextStore.hasOrganizations(),
    hasTeams: this.contextStore.hasTeams(),
    hasPartners: this.contextStore.hasPartners(),
    canSwitchContext: this.contextStore.canSwitchContext(),
    hasWorkspace: this.contextStore.hasWorkspace(),
    // Search data
    allWorkspaces: this.workspaceStore.workspaces(),
    allModules: this.moduleStore.enabledModules()
  }));

  /**
   * Switch to a workspace with navigation
   * 
   * ORCHESTRATION:
   * ==============
   * 1. Validates workspace switch via WorkspaceSwitchUseCase
   * 2. Navigates to specified route (default: /workspace/overview)
   * 3. Provides UX feedback via use case
   * 
   * @param workspaceId - Target workspace ID
   * @param workspaceName - Workspace display name (for UX feedback)
   * @param navigateTo - Optional route to navigate to after switch
   */
  switchToWorkspace(
    workspaceId: string, 
    workspaceName: string,
    navigateTo: string = '/workspace/overview'
  ): void {
    // Delegate to WorkspaceSwitchUseCase for orchestration
    const result = this.workspaceSwitchUseCase.execute({
      workspaceId,
      workspaceName
    });

    // Navigate on success
    if (result.success) {
      this.router.navigate([navigateTo]);
    }
  }

  /**
   * Switch to an organization context
   * 
   * ORCHESTRATION:
   * ==============
   * Delegates to ContextSwitchUseCase for:
   * - Validation (already in context?)
   * - State mutation (ContextStore.switchContext)
   * - Navigation (Router)
   * - UX feedback (MatSnackBar)
   * 
   * @param organizationContext - Target organization context
   */
  switchToOrganization(organizationContext: AppContext): void {
    if (organizationContext.type !== 'organization') {
      throw new Error('Invalid context type for switchToOrganization');
    }
    this.contextSwitchUseCase.execute({ context: organizationContext });
  }

  /**
   * Switch to a team context
   * 
   * ORCHESTRATION:
   * ==============
   * Delegates to ContextSwitchUseCase for full orchestration.
   * 
   * @param teamContext - Target team context
   */
  switchToTeam(teamContext: AppContext): void {
    if (teamContext.type !== 'team') {
      throw new Error('Invalid context type for switchToTeam');
    }
    this.contextSwitchUseCase.execute({ context: teamContext });
  }

  /**
   * Switch to a partner context
   * 
   * ORCHESTRATION:
   * ==============
   * Delegates to ContextSwitchUseCase for full orchestration.
   * 
   * @param partnerContext - Target partner context
   */
  switchToPartner(partnerContext: AppContext): void {
    if (partnerContext.type !== 'partner') {
      throw new Error('Invalid context type for switchToPartner');
    }
    this.contextSwitchUseCase.execute({ context: partnerContext });
  }

  /**
   * Direct access to current context for conditional logic
   * (Use sparingly - prefer viewModel for template bindings)
   */
  get currentContext(): AppContext | null {
    return this.contextStore.current();
  }

  /**
   * Direct access to current workspace ID for conditional logic
   * (Use sparingly - prefer viewModel for template bindings)
   */
  get currentWorkspaceId(): string | null {
    return this.contextStore.currentWorkspaceId();
  }
}
