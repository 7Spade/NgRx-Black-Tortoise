import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BreakpointObserver } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { ModuleFacade } from '@application/module/facades/module.facade';
import { SidebarStore } from '@application/ui/stores/sidebar.store';
import { Module } from '@domain/module';
import { BREAKPOINTS } from '@shared/constants/breakpoints.constant';
import { ModuleItemComponent } from './module-item/module-item.component';

/**
 * Sidebar Component
 * 
 * ╔═══════════════════════════════════════════════════════════════════╗
 * ║  PRESENTATION LAYER: Sidebar UI (PASSIVE RENDERER)               ║
 * ╚═══════════════════════════════════════════════════════════════════╝
 * 
 * ARCHITECTURAL COMPLIANCE:
 * =========================
 * ✅ Uses ModuleFacade for ALL module operations (no direct store access)
 * ✅ Binds to single facade.viewModel() signal
 * ✅ Delegates module reordering orchestration to Application layer
 * ✅ Zero business logic - pure passive renderer + event emitter
 *
 * Displays workspace modules sidebar with:
 * - Collapsible/expandable sidebar
 * - Drag-and-drop module reordering
 * - Active module indicator
 * - Module icons and badges
 * - Responsive behavior (auto-collapse on mobile/tablet)
 * - Pin/unpin functionality
 * - ARIA labels for accessibility
 *
 * @example
 * <app-sidebar />
 */
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatTooltipModule,
    ModuleItemComponent
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  private breakpointObserver = inject(BreakpointObserver);
  
  // FACADE INJECTION (ONLY)
  protected moduleFacade = inject(ModuleFacade);
  protected sidebarStore = inject(SidebarStore);

  // Sidebar state
  collapsed = this.sidebarStore.collapsed;
  pinned = this.sidebarStore.pinned;

  // Responsive - auto-collapse on mobile/tablet
  private isHandsetOrTablet = toSignal(
    this.breakpointObserver.observe([
      `(max-width: ${BREAKPOINTS.TABLET_MAX}px)`
    ])
      .pipe(map(result => result.matches)),
    { initialValue: false }
  );

  // Computed modules for template binding
  protected modules = computed(() => this.moduleFacade.viewModel().modules);

  /**
   * Toggle sidebar collapsed state
   */
  toggleCollapsed(): void {
    this.sidebarStore.toggle();
  }

  /**
   * Toggle sidebar pinned state
   */
  togglePinned(): void {
    this.sidebarStore.togglePinned();
  }

  /**
   * Handle module reordering via drag-and-drop
   * 
   * DELEGATION:
   * ===========
   * Delegates to ModuleFacade.reorderModules()
   * Facade handles:
   * - Workspace context validation
   * - Cross-workspace module check
   * - Persistence
   */
  onModulesDrop(event: CdkDragDrop<Module[]>): void {
    const modules = [...this.moduleFacade.viewModel().modules];
    moveItemInArray(modules, event.previousIndex, event.currentIndex);
    
    // Delegate to facade for orchestration
    this.moduleFacade.reorderModules(modules);
  }

  /**
   * Navigate to module
   */
  onModuleClick(module: Module): void {
    // TODO: Implement navigation
    console.log('Navigate to module:', module.id);
  }

  /**
   * Check if module is active
   */
  isModuleActive(module: Module): boolean {
    return this.moduleFacade.viewModel().activeModuleId === module.id;
  }
}
