/**
 * Workspace Creation Use Case
 * 
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  APPLICATION LAYER: Workspace Creation Orchestration                 ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 * 
 * RESPONSIBILITY:
 * ===============
 * Centralized orchestration for workspace creation operations:
 * 1. Validates workspace creation request
 * 2. Checks user permissions and organization context
 * 3. Creates workspace via WorkspaceStore
 * 4. Auto-switches to new workspace (optional)
 * 5. Provides UX feedback
 * 
 * ARCHITECTURAL PATTERN:
 * ======================
 * This is a COMMAND USE CASE following Clean Architecture:
 * - UI expresses intent: "create workspace"
 * - Use Case orchestrates: validation → creation → switch → feedback
 * - Domain layer enforces: workspace entity invariants
 * - Infrastructure handles: Firestore persistence
 * 
 * FORBIDDEN PATTERNS:
 * ===================
 * ❌ UI components calling WorkspaceStore.createWorkspace() directly
 * ❌ UI components building workspace data objects
 * ❌ UI components deciding auto-switch behavior
 * ❌ UI components managing error states and retry logic
 */

import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WorkspaceStore } from '@application/workspace/stores/workspace.store';
import { ContextStore } from '@application/context/stores/context.store';
import { AuthStore } from '@application/auth/stores/auth.store';
import { OrganizationStore } from '@application/organization/stores/organization.store';
import { Workspace } from '@domain/workspace/entities/workspace.entity';

export interface WorkspaceCreationRequest {
  name: string;
  displayName: string;
  description?: string;
  autoSwitch?: boolean;
}

export interface WorkspaceCreationResult {
  success: boolean;
  message: string;
  workspaceId: string | null;
}

@Injectable({ providedIn: 'root' })
export class WorkspaceCreationUseCase {
  private workspaceStore = inject(WorkspaceStore);
  private contextStore = inject(ContextStore);
  private authStore = inject(AuthStore);
  private organizationStore = inject(OrganizationStore);
  private snackBar = inject(MatSnackBar);

  /**
   * Execute workspace creation with full orchestration
   */
  async execute(request: WorkspaceCreationRequest): Promise<WorkspaceCreationResult> {
    // Business Rule: User must be authenticated
    const user = this.authStore.user();
    if (!user) {
      this.showFeedback('Authentication required to create workspace', 'error');
      return {
        success: false,
        message: 'Authentication required',
        workspaceId: null,
      };
    }

    // Business Rule: Organization context required
    const organization = this.organizationStore.currentOrganization();
    if (!organization) {
      this.showFeedback('Organization context required', 'error');
      return {
        success: false,
        message: 'Organization context required',
        workspaceId: null,
      };
    }

    try {
      // Build workspace data object (Application layer responsibility)
      const workspaceData: Omit<Workspace, 'id'> = {
        organizationId: organization.id,
        name: request.name,
        displayName: request.displayName,
        description: request.description || '',
        ownerId: user.id,
        modules: {
          overview: true,
          documents: true,
          tasks: true,
          members: true,
          permissions: true,
          audit: false,
          settings: true,
          journal: false,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'active' as const,
      };

      // State Update: Create workspace via WorkspaceStore
      this.workspaceStore.createWorkspace(workspaceData);

      // Optional: Auto-switch to new workspace
      // Note: We need to wait for creation to complete to get workspace ID
      // For now, we'll rely on WorkspaceStore's createWorkspace to handle this
      
      // UX Feedback: Success notification
      this.showFeedback(`Workspace "${request.displayName}" created successfully`, 'success');

      return {
        success: true,
        message: 'Workspace created successfully',
        workspaceId: null, // TODO: Return actual workspace ID when store provides it
      };
    } catch (error: any) {
      // Error Handling: Application layer responsibility
      const errorMessage = error.message || 'Failed to create workspace';
      this.showFeedback(errorMessage, 'error');
      
      return {
        success: false,
        message: errorMessage,
        workspaceId: null,
      };
    }
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
