import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { WorkspaceStore } from '@application/workspace/stores/workspace.store';
import { ModuleStore } from '@application/module/stores/module.store';

/**
 * Search Dialog Component
 * 
 * Provides global search functionality for:
 * - Workspaces
 * - Modules
 * - Documents
 * - Tasks
 * - Members
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
  private workspaceStore = inject(WorkspaceStore);
  private moduleStore = inject(ModuleStore);

  // Search state
  searchQuery = signal('');
  selectedIndex = signal(0);

  // Search results
  workspaceResults = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return [];
    
    return this.workspaceStore.workspaces()
      .filter(ws => 
        ws.name.toLowerCase().includes(query) || 
        ws.description?.toLowerCase().includes(query)
      )
      .slice(0, 3);
  });

  moduleResults = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return [];
    
    return this.moduleStore.enabledModules()
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
   */
  navigateToResult(type: 'workspace' | 'module', item: any): void {
    if (type === 'workspace') {
      this.workspaceStore.setCurrentWorkspace(item);
      this.router.navigate(['/workspace', 'overview']);
    } else if (type === 'module') {
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
