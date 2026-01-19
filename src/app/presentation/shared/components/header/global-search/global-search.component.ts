import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { BreakpointObserver } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { WorkspaceStore } from '@application/workspace/stores/workspace.store';
import { BREAKPOINTS } from '@shared/constants/breakpoints.constant';
import { SearchDialogComponent } from '../../dialogs/search-dialog/search-dialog.component';

/**
 * Global Search Component
 *
 * Provides workspace-wide search functionality with:
 * - Search input with Material Design 3 styling
 * - Integration with WorkspaceStore for recent workspaces
 * - Responsive visibility (hides on mobile/tablet)
 * - Keyboard shortcuts (Cmd/Ctrl + K)
 * - ARIA labels for accessibility
 *
 * @example
 * <app-global-search />
 */
@Component({
  selector: 'app-global-search',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './global-search.component.html',
  styleUrl: './global-search.component.scss'
})
export class GlobalSearchComponent {
  private breakpointObserver = inject(BreakpointObserver);
  private workspaceStore = inject(WorkspaceStore);
  private dialog = inject(MatDialog);

  // Responsive visibility
  private isHandsetOrTablet = toSignal(
    this.breakpointObserver.observe([`(max-width: ${BREAKPOINTS.TABLET_MAX}px)`])
      .pipe(map(result => result.matches)),
    { initialValue: false }
  );

  isVisible = computed(() => !this.isHandsetOrTablet());

  // Search state
  searchQuery = signal('');

  /**
   * Opens the search dialog/overlay
   */
  openSearch(): void {
    this.dialog.open(SearchDialogComponent, {
      width: '600px',
      maxWidth: '90vw',
      maxHeight: '80vh',
      panelClass: 'search-dialog-panel',
      autoFocus: true,
      restoreFocus: true
    });
  }

  /**
   * Handles keyboard shortcut (Cmd/Ctrl + K)
   */
  handleKeyboardShortcut(event: KeyboardEvent): void {
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault();
      this.openSearch();
    }
  }
}
