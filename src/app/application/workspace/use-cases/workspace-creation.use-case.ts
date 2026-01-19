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

    // Get current context to determine workspace ownership
    const currentContext = this.contextStore.current();

    try {
      // Build workspace data based on context type
      let workspaceData: Omit<Workspace, 'id'>;

      if (currentContext?.type === 'organization') {
        // Organization-owned workspace
        workspaceData = {
          ownerType: 'organization',
          ownerId: currentContext.organizationId,
          organizationId: currentContext.organizationId,
          name: request.name,
          displayName: request.displayName,
          description: request.description || '',
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
      } else if (currentContext?.type === 'user' || !currentContext) {
        // User-owned personal workspace
        workspaceData = {
          ownerType: 'user',
          ownerId: user.id,
          name: request.name,
          displayName: request.displayName,
          description: request.description || '',
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
      } else if (currentContext?.type === 'team' || currentContext?.type === 'partner') {
        /**
         * 🚨 CANONICAL MODEL ENFORCEMENT - RUNTIME VALIDATION 🚨
         * 
         * WHY THIS REJECTION EXISTS:
         * ==========================
         * Team and Partner are MEMBERSHIP CONSTRUCTS, not identities.
         * 
         * IDENTITY (can own workspaces):
         * - User → Personal account, can create personal workspaces
         * - Organization → Organizational account, can create org workspaces
         * - Bot → Service account (future implementation)
         * 
         * MEMBERSHIP (can ACCESS but NOT OWN workspaces):
         * - Team → Internal unit of Organization
         *   - Team has members (users)
         *   - Team has permissions (references workspaceId)
         *   - Team does NOT own workspaces
         * 
         * - Partner → External unit of Organization
         *   - Partner has members (users)
         *   - Partner has access grants (references workspaceId)
         *   - Partner does NOT own workspaces
         * 
         * ENFORCEMENT STRATEGY:
         * =====================
         * 1. COMPILE-TIME: WorkspaceOwnership type restricts ownerType to 'user' | 'organization'
         * 2. RUNTIME: This validation catches UI bugs where create button appears in team/partner context
         * 
         * ❌ ANTI-PATTERN: Allowing workspace creation and silently changing context to organization
         * ✅ CORRECT PATTERN: Explicit error message guiding user to switch to user/org context first
         * 
         * PREVENTS:
         * =========
         * - Confusing UI states where "Create Workspace" appears in invalid contexts
         * - Silent failures during workspace persistence
         * - Data inconsistency where workspace.ownerType doesn't match context
         * - Billing/quota enforcement bugs (who pays for team-owned workspace?)
         */
        // REJECT: Team and Partner cannot own workspaces
        this.showFeedback(
          'Workspaces can only be created in User or Organization context. ' +
          'Teams and Partners are membership constructs and cannot own workspaces.',
          'error'
        );
        return {
          success: false,
          message: 'Team and Partner contexts cannot create workspaces',
          workspaceId: null,
        };
      } else {
        // Unknown context type
        this.showFeedback('Invalid context for workspace creation', 'error');
        return {
          success: false,
          message: 'Invalid context',
          workspaceId: null,
        };
      }

      // State Update: Create workspace via WorkspaceStore
      this.workspaceStore.createWorkspace(workspaceData);

      // Optional: Auto-switch to new workspace
      // Note: We need to wait for creation to complete to get workspace ID
      // For now, we'll rely on WorkspaceStore's createWorkspace to handle this
      
      // UX Feedback: Success notification with ownership context
      const ownershipContext = workspaceData.ownerType === 'user' 
        ? 'personal workspace' 
        : 'organization workspace';
      this.showFeedback(
        `${ownershipContext} "${request.displayName}" created successfully`, 
        'success'
      );

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
