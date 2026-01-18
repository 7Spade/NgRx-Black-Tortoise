import { Component, computed, inject, signal, DestroyRef, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { WorkspaceStore } from '@application/workspace/stores/workspace.store';
import { ContextStore } from '@application/context/stores/context.store';
import { Workspace } from '@domain/workspace';
import { BREAKPOINTS } from '@shared/constants/breakpoints.constant';

/**
 * Workspace Switcher Component
 * 
 * Displays a dropdown menu for switching between workspaces with:
 * - Search functionality
 * - Workspace grouping (recent, favorites, my workspaces)
 * - Create workspace option
 * - Responsive design (desktop/tablet/mobile)
 * - Accessibility (ARIA attributes, keyboard navigation)
 * - Material Design 3 styling
 * 
 * Integrates with WorkspaceStore and ContextStore for state management.
 */
@Component({
  selector: 'app-workspace-switcher',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
  templateUrl: './workspace-switcher.component.html',
  styleUrl: './workspace-switcher.component.scss'
})
export class WorkspaceSwitcherComponent implements OnInit {
  // Stores
  protected workspaceStore = inject(WorkspaceStore);
  protected contextStore = inject(ContextStore);
  private breakpointObserver = inject(BreakpointObserver);
  private destroyRef = inject(DestroyRef);
  
  // Responsive states
  protected isMobile = signal(false);
  protected isTablet = signal(false);
  
  // Menu state
  protected isMenuOpen = signal(false);
  protected searchQuery = signal('');
  
  // Screen reader announcement
  protected announceMessage = signal('');
  
  // Computed values
  protected currentWorkspace = computed(() => {
    return this.workspaceStore.currentWorkspace();
  });
  
  protected currentWorkspaceName = computed(() => {
    const workspace = this.currentWorkspace();
    return workspace?.displayName || workspace?.name || 'Select workspace';
  });
  
  protected allWorkspaces = computed(() => {
    return this.workspaceStore.workspaces();
  });
  
  protected filteredWorkspaces = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const workspaces = this.allWorkspaces();
    
    if (!query) return workspaces;
    
    return workspaces.filter(ws => 
      ws.name.toLowerCase().includes(query) ||
      ws.displayName.toLowerCase().includes(query) ||
      ws.description?.toLowerCase().includes(query)
    );
  });
  
  protected recentWorkspaces = computed(() => {
    // TODO: Implement recent workspaces logic based on lastAccessedAt
    return this.filteredWorkspaces().slice(0, 3);
  });
  
  protected myWorkspaces = computed(() => {
    // Get all filtered workspaces excluding recent ones
    return this.filteredWorkspaces();
  });
  
  ngOnInit(): void {
    // Detect mobile devices
    this.breakpointObserver
      .observe([BREAKPOINTS.mobile])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => {
        this.isMobile.set(result.matches);
      });
    
    // Detect tablets
    this.breakpointObserver
      .observe([BREAKPOINTS.tablet])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => {
        this.isTablet.set(result.matches);
      });
  }
  
  /**
   * Keyboard navigation handler
   */
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (!this.isMenuOpen()) return;
    
    switch (event.key) {
      case 'Escape':
        // Close menu
        this.isMenuOpen.set(false);
        event.preventDefault();
        break;
    }
  }
  
  /**
   * Menu opened event handler
   */
  onMenuOpened(): void {
    this.isMenuOpen.set(true);
    this.searchQuery.set(''); // Reset search on open
  }
  
  /**
   * Menu closed event handler
   */
  onMenuClosed(): void {
    this.isMenuOpen.set(false);
    this.searchQuery.set('');
  }
  
  /**
   * Handle workspace selection
   */
  selectWorkspace(workspace: Workspace): void {
    this.workspaceStore.setCurrentWorkspace(workspace);
    // TODO: Navigate to workspace or trigger workspace change event
    console.log('Selected workspace:', workspace.id);
    
    // Announce to screen readers
    this.announceMessage.set(`Switched to workspace ${workspace.displayName || workspace.name}`);
    setTimeout(() => this.announceMessage.set(''), 1000);
  }
  
  /**
   * Check if workspace is currently selected
   */
  isWorkspaceActive(workspaceId: string): boolean {
    return this.currentWorkspace()?.id === workspaceId;
  }
  
  /**
   * Get workspace icon based on status or type
   */
  getWorkspaceIcon(workspace: Workspace): string {
    if (workspace.status === 'archived') return 'archive';
    if (workspace.status === 'suspended') return 'block';
    return 'workspace';
  }
  
  /**
   * Handle create new workspace
   */
  createWorkspace(): void {
    // TODO: Navigate to workspace creation page or open dialog
    console.log('Create new workspace');
  }
}
