/**
 * Workspace Facade
 * 
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  APPLICATION LAYER: Workspace Unified API                            ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 * 
 * RESPONSIBILITY:
 * ===============
 * Provides a simplified, unified API for UI components to interact with
 * workspace operations. Hides complexity of stores, use cases, and cross-store
 * coordination.
 * 
 * ARCHITECTURE PATTERN:
 * =====================
 * FACADE PATTERN - Single entry point for workspace operations:
 * 
 * UI Component (workspace-switcher) 
 *   ↓
 * WorkspaceFacade (this file)
 *   ↓ delegates to →
 *   ├─ WorkspaceSwitchUseCase (switching orchestration)
 *   ├─ WorkspaceCreationUseCase (creation orchestration)
 *   └─ WorkspaceStore (state queries)
 * 
 * EXPOSED API (UI-friendly):
 * ===========================
 * State (read-only):
 * - viewModel() - Single computed ViewModel for UI rendering
 * - currentWorkspace() - Active workspace
 * - workspaces() - All available workspaces
 * - isLoading() - Loading state
 * 
 * Commands (intent expression):
 * - switchWorkspace(workspaceId, workspaceName)
 * - createWorkspace(data)
 * - toggleFavorite(workspaceId)
 * 
 * FORBIDDEN PATTERNS:
 * ===================
 * ❌ UI importing WorkspaceStore directly
 * ❌ UI importing ContextStore for switching
 * ❌ UI importing OrganizationStore for context
 * ❌ UI implementing orchestration logic
 * ❌ UI managing snackbar/announcements
 * 
 * CORRECT USAGE IN UI:
 * ====================
 * ```typescript
 * export class WorkspaceSwitcherComponent {
 *   facade = inject(WorkspaceFacade);
 *   
 *   // Read state via ViewModel
 *   vm = this.facade.viewModel;
 *   
 *   // Express intent
 *   onWorkspaceClick(workspace: Workspace) {
 *     this.facade.switchWorkspace(workspace.id, workspace.displayName);
 *   }
 * }
 * ```
 */

import { computed, inject, Injectable, signal } from '@angular/core';
import { WorkspaceStore } from '@application/workspace/stores/workspace.store';
import { ContextStore } from '@application/context/stores/context.store';
import { WorkspaceSwitchUseCase, WorkspaceSwitchRequest, WorkspaceSwitchResult } from '../use-cases/workspace-switch.use-case';
import { WorkspaceCreationUseCase, WorkspaceCreationRequest, WorkspaceCreationResult } from '../use-cases/workspace-creation.use-case';
import { Workspace } from '@domain/workspace/entities/workspace.entity';

/**
 * ViewModel for Workspace UI Components
 * Single source of truth for reactive rendering
 */
export interface WorkspaceViewModel {
  // Current State
  currentWorkspaceId: string | null;
  currentWorkspaceName: string;
  currentWorkspaceIcon: string;
  
  // Workspace Lists (filtered and sorted)
  recentWorkspaces: Workspace[];
  myWorkspaces: Workspace[];
  favoriteWorkspaces: Workspace[];
  
  // UI State
  isLoading: boolean;
  hasWorkspaces: boolean;
  
  // Search/Filter State
  searchQuery: string;
  filteredWorkspacesCount: number;
}

@Injectable({ providedIn: 'root' })
export class WorkspaceFacade {
  // Dependencies
  private workspaceStore = inject(WorkspaceStore);
  private contextStore = inject(ContextStore);
  private switchUseCase = inject(WorkspaceSwitchUseCase);
  private creationUseCase = inject(WorkspaceCreationUseCase);
  
  // Local UI state (managed by facade)
  private searchQuerySignal = signal('');
  
  /**
   * ╔══════════════════════════════════════════════════════════════════════╗
   * ║  SINGLE VIEWMODEL RULE: One computed ViewModel for entire UI        ║
   * ╚══════════════════════════════════════════════════════════════════════╝
   * 
   * Prevents signal-induced DOM rebuilds and menu flashing.
   * UI components bind ONLY to this ViewModel, never to individual signals.
   */
  readonly viewModel = computed<WorkspaceViewModel>(() => {
    const currentWorkspace = this.workspaceStore.currentWorkspace();
    const workspaces = this.workspaceStore.workspaces();
    const isLoading = this.workspaceStore.isLoading();
    const searchQuery = this.searchQuerySignal();
    
    // Derive current workspace info
    const currentWorkspaceId = currentWorkspace?.id || null;
    const currentWorkspaceName = currentWorkspace?.displayName || currentWorkspace?.name || 'Select Workspace';
    const currentWorkspaceIcon = this.getWorkspaceIcon(currentWorkspace);
    
    // Filter workspaces by search query
    const filteredWorkspaces = searchQuery
      ? workspaces.filter(w =>
          w.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          w.description?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : workspaces;
    
    // Sort by lastAccessedAt for recency (most recent first)
    const sortedByRecency = [...filteredWorkspaces].sort((a, b) => {
      const aTime = a.lastAccessedAt?.getTime() || 0;
      const bTime = b.lastAccessedAt?.getTime() || 0;
      return bTime - aTime;
    });
    
    // Recent workspaces (top 3 most recently accessed, excluding current)
    const recentWorkspaces = sortedByRecency
      .filter(w => w.id !== currentWorkspaceId && w.lastAccessedAt)
      .slice(0, 3);
    
    // My workspaces (all available workspaces for this user)
    const myWorkspaces = searchQuery ? filteredWorkspaces : sortedByRecency;
    
    // Favorite workspaces (filtered by isFavorite flag)
    const favoriteWorkspaces = filteredWorkspaces.filter(w => w.isFavorite);
    
    return {
      currentWorkspaceId,
      currentWorkspaceName,
      currentWorkspaceIcon,
      recentWorkspaces,
      myWorkspaces,
      favoriteWorkspaces,
      isLoading,
      hasWorkspaces: workspaces.length > 0,
      searchQuery,
      filteredWorkspacesCount: filteredWorkspaces.length,
    };
  });
  
  /**
   * ╔══════════════════════════════════════════════════════════════════════╗
   * ║  COMMANDS: UI Intent Expression (No Orchestration Logic)             ║
   * ╚══════════════════════════════════════════════════════════════════════╝
   */
  
  /**
   * Switch to a different workspace
   * Delegates to WorkspaceSwitchUseCase for orchestration
   */
  switchWorkspace(workspaceId: string, workspaceName: string): WorkspaceSwitchResult {
    const request: WorkspaceSwitchRequest = { workspaceId, workspaceName };
    return this.switchUseCase.execute(request);
  }
  
  /**
   * Create a new workspace
   * Delegates to WorkspaceCreationUseCase for orchestration
   */
  async createWorkspace(request: WorkspaceCreationRequest): Promise<WorkspaceCreationResult> {
    return await this.creationUseCase.execute(request);
  }
  
  /**
   * Toggle workspace favorite status
   */
  toggleFavorite(workspaceId: string): void {
    this.workspaceStore.toggleFavorite(workspaceId);
  }
  
  /**
   * Update search query (local UI state)
   */
  setSearchQuery(query: string): void {
    this.searchQuerySignal.set(query);
  }
  
  /**
   * Clear search query
   */
  clearSearch(): void {
    this.searchQuerySignal.set('');
  }
  
  /**
   * ╔══════════════════════════════════════════════════════════════════════╗
   * ║  HELPERS: UI-friendly utilities                                      ║
   * ╚══════════════════════════════════════════════════════════════════════╝
   */
  
  /**
   * Check if workspace is currently active
   */
  isWorkspaceActive(workspaceId: string): boolean {
    return this.viewModel().currentWorkspaceId === workspaceId;
  }
  
  /**
   * Get Material Design icon for workspace
   */
  private getWorkspaceIcon(workspace: Workspace | null): string {
    if (!workspace) return 'workspace';
    
    // Icon mapping based on workspace status or type
    if (workspace.status === 'archived') return 'archive';
    if (workspace.isFavorite) return 'star';
    
    return 'workspace';
  }
}
