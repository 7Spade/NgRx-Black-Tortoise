import { Component, inject, signal, DestroyRef, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { WorkspaceFacade } from '@application/workspace/facades/workspace.facade';
import { Workspace } from '@domain/workspace';
import { BREAKPOINTS } from '@shared/constants/breakpoints.constant';
import { CreateWorkspaceDialogComponent } from '../../dialogs/create-workspace-dialog/create-workspace-dialog.component';

/**
 * Workspace Switcher Component
 * 
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  PRESENTATION LAYER: Passive Renderer + Event Emitter ONLY          ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 * 
 * RESPONSIBILITY:
 * ===============
 * - Render workspace switcher UI
 * - Capture user interactions (clicks, search input)
 * - Delegate all orchestration to WorkspaceFacade
 * 
 * FORBIDDEN PATTERNS:
 * ===================
 * ❌ Direct store imports (WorkspaceStore, ContextStore)
 * ❌ Business logic (validation, orchestration)
 * ❌ Cross-store coordination
 * ❌ UX feedback management (snackbars, announcements)
 * ❌ Building domain objects
 * 
 * CORRECT PATTERN:
 * ================
 * ✅ Inject WorkspaceFacade ONLY
 * ✅ Bind template to facade.viewModel()
 * ✅ Express user intent via facade.switchWorkspace()
 * ✅ Open dialogs for complex operations
 * 
 * ARCHITECTURE COMPLIANCE:
 * ========================
 * UI → WorkspaceFacade → WorkspaceSwitchUseCase → ContextStore
 * 
 * This component is a PASSIVE RENDERER. All logic lives in Application layer.
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
    FormsModule,
    MatSnackBarModule
  ],
  templateUrl: './workspace-switcher.component.html',
  styleUrl: './workspace-switcher.component.scss'
})
export class WorkspaceSwitcherComponent implements OnInit {
  /**
   * ╔══════════════════════════════════════════════════════════════════════╗
   * ║  SINGLE FACADE INJECTION: All workspace operations via facade       ║
   * ╚══════════════════════════════════════════════════════════════════════╝
   */
  protected facade = inject(WorkspaceFacade);
  private breakpointObserver = inject(BreakpointObserver);
  private destroyRef = inject(DestroyRef);
  private dialog = inject(MatDialog);
  
  /**
   * ╔══════════════════════════════════════════════════════════════════════╗
   * ║  LOCAL UI STATE ONLY (no business logic, no derived data)           ║
   * ╚══════════════════════════════════════════════════════════════════════╝
   */
  // Responsive states
  protected isMobile = signal(false);
  protected isTablet = signal(false);
  
  // Menu state (pure UI concern)
  protected isMenuOpen = signal(false);
  
  /**
   * ╔══════════════════════════════════════════════════════════════════════╗
   * ║  SINGLE VIEWMODEL: Facade exposes consolidated reactive state       ║
   * ╚══════════════════════════════════════════════════════════════════════╝
   * 
   * Template binds ONLY to facade.viewModel()
   * No component-level computed signals for derived data
   */
  protected viewModel = this.facade.viewModel;
  
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
   * ╔══════════════════════════════════════════════════════════════════════╗
   * ║  EVENT HANDLERS: Express user intent, delegate to facade            ║
   * ╚══════════════════════════════════════════════════════════════════════╝
   */
  
  /**
   * Keyboard navigation handler (pure UI concern)
   */
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (!this.isMenuOpen()) return;
    
    switch (event.key) {
      case 'Escape':
        this.isMenuOpen.set(false);
        event.preventDefault();
        break;
    }
  }
  
  /**
   * Menu opened event handler (pure UI state)
   */
  onMenuOpened(): void {
    this.isMenuOpen.set(true);
    this.facade.clearSearch(); // Delegate search management to facade
  }
  
  /**
   * Menu closed event handler (pure UI state)
   */
  onMenuClosed(): void {
    this.isMenuOpen.set(false);
    this.facade.clearSearch();
  }
  
  /**
   * Search input handler
   * Delegates search logic to facade (filtering happens in ViewModel)
   */
  onSearchInput(query: string): void {
    this.facade.setSearchQuery(query);
  }
  
  /**
   * Select workspace - EXPRESS USER INTENT ONLY
   * 
   * ❌ BEFORE (VIOLATION):
   * - Component validated "already in workspace"
   * - Component called contextStore.switchWorkspace() directly
   * - Component managed MatSnackBar feedback
   * - Component implemented screen reader announcements
   * 
   * ✅ AFTER (COMPLIANT):
   * - Single line delegation to WorkspaceFacade
   * - All orchestration, validation, and UX feedback in Application layer
   * - Component is a passive event emitter
   */
  selectWorkspace(workspace: Workspace): void {
    this.facade.switchWorkspace(workspace.id, workspace.displayName || workspace.name);
  }
  
  /**
   * Check if workspace is currently active
   * Delegates to facade helper
   */
  isWorkspaceActive(workspaceId: string): boolean {
    return this.facade.isWorkspaceActive(workspaceId);
  }
  
  /**
   * Get workspace icon
   * Pure presentation logic (icon selection based on domain state)
   */
  getWorkspaceIcon(workspace: Workspace): string {
    if (workspace.status === 'archived') return 'archive';
    if (workspace.status === 'suspended') return 'block';
    return 'workspace';
  }
  
  /**
   * Handle create new workspace
   * Opens dialog for user input collection
   */
  createWorkspace(): void {
    this.dialog.open(CreateWorkspaceDialogComponent, {
      width: '600px',
      maxWidth: '90vw',
      panelClass: 'create-workspace-dialog-panel',
      autoFocus: true,
      restoreFocus: true,
      disableClose: false
    });
  }
}
