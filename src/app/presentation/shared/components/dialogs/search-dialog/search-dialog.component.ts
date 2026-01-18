import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { ContextFacade } from '@application/context/facades/context.facade';
import { Router } from '@angular/router';

/**
 * Search Dialog Component
 * 
 * ╔═══════════════════════════════════════════════════════════════════╗
 * ║  PRESENTATION LAYER: Global Search UI                            ║
 * ╚═══════════════════════════════════════════════════════════════════╝
 * 
 * ARCHITECTURAL COMPLIANCE:
 * =========================
 * ✅ Uses ContextFacade ONLY (no direct store imports)
 * ✅ Binds to facade.viewModel() for search data
 * ✅ Delegates orchestration to Application layer
 * ✅ Expresses user intent (switchToWorkspace, navigateToModule)
 * ✅ Component performs ONLY UI-level filtering (not business logic)
 * 
 * Provides global search functionality for:
 * - Workspaces
 * - Modules
 * - Documents (future)
 * - Tasks (future)
 * - Members (future)
 * 
 * Keyboard shortcuts:
 * - Cmd/Ctrl + K: Open search
 * - Esc: Close search
 * - Enter: Navigate to first result
 * - Arrow keys: Navigate results
 */
@Component({
  selector: 'app-search-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatDividerModule
  ],
  templateUrl: './search-dialog.component.html',
  styleUrl: './search-dialog.component.scss'
})
export class SearchDialogComponent {
  private dialogRef = inject(MatDialogRef<SearchDialogComponent>);
  private router = inject(Router);
  
  /**
   * FACADE - Single dependency for all data and orchestration
   * 
   * ARCHITECTURAL ENFORCEMENT:
   * ==========================
   * Component uses ONLY ContextFacade.viewModel() for data access.
   * No direct WorkspaceStore or ModuleStore imports.
   */
  protected contextFacade = inject(ContextFacade);

  // Search state (component-local UI state)
  searchQuery = signal('');
  selectedIndex = signal(0);

  /**
   * Search results - Component-level filtering of facade data
   * 
   * NOTE: This is UI-level filtering, not business logic.
   * The facade provides ALL workspaces/modules.
   * Component filters based on search query for display.
   */
  workspaceResults = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return [];
    
    return this.contextFacade.viewModel().allWorkspaces
      .filter(ws => 
        ws.name.toLowerCase().includes(query) || 
        ws.description?.toLowerCase().includes(query)
      )
      .slice(0, 3);
  });

  moduleResults = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return [];
    
    return this.contextFacade.viewModel().allModules
      .filter(mod => 
        mod.name.toLowerCase().includes(query) || 
        mod.description?.toLowerCase().includes(query)
      )
      .slice(0, 3);
  });

  allResults = computed(() => [
    ...this.workspaceResults().map(ws => ({ type: 'workspace' as const, item: ws })),
    ...this.moduleResults().map(mod => ({ type: 'module' as const, item: mod }))
  ]);

  hasResults = computed(() => this.allResults().length > 0);
  showEmpty = computed(() => this.searchQuery().trim().length > 0 && !this.hasResults());

  /**
   * Handle search query change
   */
  onSearchChange(query: string): void {
    this.searchQuery.set(query);
    this.selectedIndex.set(0);
  }

  /**
   * Navigate to selected result
   * 
   * ARCHITECTURAL COMPLIANCE:
   * =========================
   * ✅ Delegates workspace switching to ContextFacade.switchToWorkspace()
   * ✅ No direct store mutation from UI
   * ✅ Navigation coordinated with switch orchestration
   */
  navigateToResult(type: 'workspace' | 'module', item: any): void {
    if (type === 'workspace') {
      // Delegate to ContextFacade for orchestration
      // This handles:
      // - Workspace switching validation
      // - Context store updates
      // - Workspace store access tracking
      // - UX feedback (snackbar)
      // - Navigation
      this.contextFacade.switchToWorkspace(
        item.id, 
        item.name, 
        '/workspace/overview'
      );
    } else if (type === 'module') {
      // Direct navigation for module routes (no context switch needed)
      this.router.navigate(['/workspace', item.route]);
    }
    this.closeDialog();
  }

  /**
   * Handle keyboard navigation
   */
  handleKeydown(event: KeyboardEvent): void {
    const results = this.allResults();
    
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.selectedIndex.update(i => Math.min(i + 1, results.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.selectedIndex.update(i => Math.max(i - 1, 0));
    } else if (event.key === 'Enter' && results.length > 0) {
      event.preventDefault();
      const selected = results[this.selectedIndex()];
      if (selected) {
        this.navigateToResult(selected.type, selected.item);
      }
    } else if (event.key === 'Escape') {
      this.closeDialog();
    }
  }

  /**
   * Close dialog
   */
  closeDialog(): void {
    this.dialogRef.close();
  }

  /**
   * Get icon for result type
   */
  getIcon(type: 'workspace' | 'module'): string {
    return type === 'workspace' ? 'folder' : 'dashboard';
  }
}
