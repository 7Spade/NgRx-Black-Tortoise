/**
 * Sidebar Store
 * 
 * Manages sidebar UI state using NgRx Signals.
 * Handles sidebar collapsed state, pinning, and width adjustments.
 * 
 * UI State Management:
 * - Collapsed/expanded state
 * - Pinned/unpinned state
 * - Custom width for resizable sidebar
 * - Responsive behavior
 */

import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import { computed } from '@angular/core';

/**
 * Sidebar State Interface
 */
export interface SidebarState {
  isCollapsed: boolean;
  isPinned: boolean;
  width: number;
  minWidth: number;
  maxWidth: number;
  defaultWidth: number;
}

/**
 * Initial Sidebar State
 */
const initialState: SidebarState = {
  isCollapsed: false,
  isPinned: true,
  width: 280,
  minWidth: 200,
  maxWidth: 400,
  defaultWidth: 280
};

/**
 * Sidebar Store
 * 
 * Provides reactive sidebar state management for UI components.
 */
export const SidebarStore = signalStore(
  { providedIn: 'root' },
  
  withState(initialState),
  
  withComputed(({ isCollapsed, isPinned, width }) => ({
    /**
     * Collapsed state (alias for isCollapsed for component compatibility)
     */
    collapsed: computed(() => isCollapsed()),
    
    /**
     * Pinned state (alias for isPinned for component compatibility)
     */
    pinned: computed(() => isPinned()),
    
    /**
     * Sidebar is visible (expanded or pinned)
     */
    isVisible: computed(() => !isCollapsed() || isPinned()),
    
    /**
     * Sidebar can be resized (not collapsed and pinned)
     */
    isResizable: computed(() => !isCollapsed() && isPinned()),
    
    /**
     * Current effective width
     */
    effectiveWidth: computed(() => 
      isCollapsed() ? 0 : width()
    )
  })),
  
  withMethods((store) => ({
    /**
     * Toggle sidebar collapsed state
     */
    toggleCollapsed() {
      patchState(store, (state) => ({
        isCollapsed: !state.isCollapsed
      }));
    },
    
    /**
     * Toggle sidebar pinned state
     */
    togglePinned() {
      patchState(store, (state) => ({
        isPinned: !state.isPinned
      }));
    },
    
    /**
     * Collapse sidebar
     */
    collapse() {
      patchState(store, { isCollapsed: true });
    },
    
    /**
     * Expand sidebar
     */
    expand() {
      patchState(store, { isCollapsed: false });
    },
    
    /**
     * Pin sidebar
     */
    pin() {
      patchState(store, { isPinned: true });
    },
    
    /**
     * Unpin sidebar
     */
    unpin() {
      patchState(store, { isPinned: false });
    },
    
    /**
     * Set custom sidebar width
     */
    setWidth(width: number) {
      patchState(store, (state) => ({
        width: Math.max(state.minWidth, Math.min(state.maxWidth, width))
      }));
    },
    
    /**
     * Reset to default width
     */
    resetWidth() {
      patchState(store, (state) => ({
        width: state.defaultWidth
      }));
    },
    
    /**
     * Reset to initial state
     */
    reset() {
      patchState(store, initialState);
    }
  }))
);
