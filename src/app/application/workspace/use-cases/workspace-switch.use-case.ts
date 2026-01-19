/**
 * Workspace Switch Use Case
 * 
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  APPLICATION LAYER: Workspace Switching Orchestration                ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 * 
 * RESPONSIBILITY:
 * ===============
 * Centralized orchestration for workspace switching operations:
 * 1. Validates workspace switch request
 * 2. Checks user permissions
 * 3. Updates ContextStore (canonical owner)
 * 4. Tracks workspace access history
 * 5. Provides UX feedback (snackbar, announcements)
 * 
 * ARCHITECTURAL PATTERN:
 * ======================
 * This is a COMMAND USE CASE following Clean Architecture:
 * - UI expresses intent: "switch workspace"
 * - Use Case orchestrates: validation → state update → side effects
 * - Domain layer enforces: business rules
 * - Infrastructure handles: persistence
 * 
 * FORBIDDEN PATTERNS:
 * ===================
 * ❌ UI components calling ContextStore.switchWorkspace() directly
 * ❌ UI components deciding when switching is valid
 * ❌ UI components managing UX feedback coupled to domain actions
 * ❌ Cross-store coordination in presentation layer
 * 
 * CANONICAL FLOW:
 * ===============
 * UI (workspace-switcher) → 
 *   WorkspaceFacade.switchWorkspace() → 
 *     WorkspaceSwitchUseCase.execute() →
 *       1. Validate (can switch?)
 *       2. ContextStore.switchWorkspace() (state update)
 *       3. WorkspaceStore.trackAccess() (history)
 *       4. Return result with UX feedback data
 */

import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContextStore } from '@application/context/stores/context.store';
import { WorkspaceStore } from '@application/workspace/stores/workspace.store';
import { AuthStore } from '@application/auth/stores/auth.store';

export interface WorkspaceSwitchRequest {
  workspaceId: string;
  workspaceName: string;
}

export interface WorkspaceSwitchResult {
  success: boolean;
  message: string;
  previousWorkspaceId: string | null;
  newWorkspaceId: string;
}

@Injectable({ providedIn: 'root' })
export class WorkspaceSwitchUseCase {
  private contextStore = inject(ContextStore);
  private workspaceStore = inject(WorkspaceStore);
  private authStore = inject(AuthStore);
  private snackBar = inject(MatSnackBar);

  /**
   * Execute workspace switch with full orchestration
   */
  execute(request: WorkspaceSwitchRequest): WorkspaceSwitchResult {
    const currentWorkspace = this.workspaceStore.currentWorkspace();
    const previousWorkspaceId = currentWorkspace?.id || null;

    // Business Rule: Don't switch if already in target workspace
    if (previousWorkspaceId === request.workspaceId) {
      this.showFeedback('Already in this workspace', 'info');
      return {
        success: false,
        message: 'Already in this workspace',
        previousWorkspaceId,
        newWorkspaceId: request.workspaceId,
      };
    }

    // Business Rule: User must be authenticated
    const user = this.authStore.user();
    if (!user) {
      this.showFeedback('Authentication required', 'error');
      return {
        success: false,
        message: 'Authentication required',
        previousWorkspaceId,
        newWorkspaceId: request.workspaceId,
      };
    }

    // State Update: ContextStore is canonical owner
    // This triggers reactive effects in WorkspaceStore and ModuleStore
    this.contextStore.switchWorkspace(request.workspaceId);

    // Side Effect: Track workspace access for recency
    this.workspaceStore.trackAccess(request.workspaceId);

    // UX Feedback: Success notification
    this.showFeedback(`Switched to workspace: ${request.workspaceName}`, 'success');

    return {
      success: true,
      message: `Switched to workspace: ${request.workspaceName}`,
      previousWorkspaceId,
      newWorkspaceId: request.workspaceId,
    };
  }

  /**
   * Provide visual feedback via MatSnackBar
   */
  private showFeedback(message: string, type: 'success' | 'info' | 'error'): void {
    const duration = type === 'error' ? 5000 : 3000;
    const panelClass = `snackbar-${type}`;

    this.snackBar.open(message, 'OK', {
      duration,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: [panelClass],
    });
  }
}
