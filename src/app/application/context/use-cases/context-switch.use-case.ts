/**
 * Context Switch Use Case
 * 
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  APPLICATION LAYER: Context Switching Orchestration                  ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 * 
 * RESPONSIBILITY:
 * ===============
 * Centralized orchestration for ALL context switching operations:
 * - Organization switching
 * - Team switching
 * - Partner switching
 * - User (Personal) switching
 * 
 * ARCHITECTURAL PATTERN:
 * =====================
 * USE CASE PATTERN - Single responsibility orchestrator:
 * 
 * UI Component (MenuService, Header, Switcher)
 *   ↓ emits intent
 * ContextFacade.switchToOrganization/Team/Partner
 *   ↓ delegates to →
 * ContextSwitchUseCase (this file)
 *   ↓ orchestrates →
 *   ├─ Validation (already in context?)
 *   ├─ ContextStore.switchContext() (state mutation)
 *   ├─ Router.navigate() (navigation)
 *   └─ MatSnackBar (UX feedback)
 * 
 * WHAT THIS ELIMINATES:
 * =====================
 * ❌ MenuService directly calling ContextStore.switchContext()
 * ❌ UI components performing validation
 * ❌ UI components deciding navigation routes
 * ❌ UI components managing snackbar feedback
 * ❌ Inline action callbacks in menu configuration
 * 
 * CORRECT USAGE:
 * ==============
 * ```typescript
 * // From ContextFacade
 * switchToOrganization(orgContext: AppContext): void {
 *   this.contextSwitchUseCase.execute({ context: orgContext });
 * }
 * 
 * // From MenuService (returns config, NOT action)
 * {
 *   id: 'context-org-123',
 *   type: 'action',
 *   label: 'Acme Corp',
 *   contextId: org.organizationId,
 *   contextType: 'organization'
 *   // NO action: () => callback
 * }
 * 
 * // UI executes via facade when menu item clicked
 * onMenuItemClick(item: MenuItem) {
 *   if (item.contextId && item.contextType) {
 *     this.facade.switchTo(item.contextType, item.contextId);
 *   }
 * }
 * ```
 */

import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContextStore } from '../stores/context.store';
import { AppContext } from '@domain/context';

/**
 * Context Switch Request
 */
export interface ContextSwitchRequest {
  context: AppContext;
  navigateTo?: string; // Optional navigation override
}

/**
 * Context Switch Result
 */
export interface ContextSwitchResult {
  success: boolean;
  message: string;
  navigated: boolean;
}

@Injectable({ providedIn: 'root' })
export class ContextSwitchUseCase {
  private contextStore = inject(ContextStore);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  /**
   * Execute context switch with full orchestration
   * 
   * ORCHESTRATION STEPS:
   * ====================
   * 1. Validate: Already in this context?
   * 2. Execute: ContextStore.switchContext()
   * 3. Navigate: Determine and navigate to appropriate route
   * 4. Feedback: Show snackbar confirmation
   * 
   * @param request - Context switch request
   * @returns Result with success status and message
   */
  execute(request: ContextSwitchRequest): ContextSwitchResult {
    const { context, navigateTo } = request;

    // Step 1: Validation - Already in this context?
    const currentContext = this.contextStore.current();
    if (this.isSameContext(currentContext, context)) {
      return {
        success: false,
        message: 'Already in this context',
        navigated: false
      };
    }

    // Step 2: Execute state mutation
    this.contextStore.switchContext(context);

    // Step 3: Navigate to appropriate route
    const route = navigateTo || this.getDefaultRouteForContext(context);
    this.router.navigate([route]);

    // Step 4: UX Feedback
    const contextName = this.getContextDisplayName(context);
    this.snackBar.open(`Switched to ${contextName}`, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });

    console.log('[ContextSwitchUseCase] Switched to:', context.type, contextName);

    return {
      success: true,
      message: `Switched to ${contextName}`,
      navigated: true
    };
  }

  /**
   * Check if target context is same as current
   */
  private isSameContext(current: AppContext | null, target: AppContext): boolean {
    if (!current) return false;

    if (current.type !== target.type) return false;

    switch (target.type) {
      case 'organization':
        return current.type === 'organization' &&
               (current as any).organizationId === (target as any).organizationId;
      case 'team':
        return current.type === 'team' &&
               (current as any).teamId === (target as any).teamId;
      case 'partner':
        return current.type === 'partner' &&
               (current as any).partnerId === (target as any).partnerId;
      case 'user':
        return current.type === 'user' &&
               current.userId === target.userId;
      default:
        return false;
    }
  }

  /**
   * Get default navigation route for context type
   */
  private getDefaultRouteForContext(context: AppContext): string {
    switch (context.type) {
      case 'organization':
        return `/organization/${(context as any).organizationId}`;
      case 'team':
        return `/team/${(context as any).teamId}`;
      case 'partner':
        return `/partner/${(context as any).partnerId}`;
      case 'user':
        return '/dashboard';
      default:
        return '/dashboard';
    }
  }

  /**
   * Get display name for context
   */
  private getContextDisplayName(context: AppContext): string {
    switch (context.type) {
      case 'organization':
      case 'team':
      case 'partner':
        return (context as any).name;
      case 'user':
        return 'Personal';
      default:
        return 'Unknown';
    }
  }
}
