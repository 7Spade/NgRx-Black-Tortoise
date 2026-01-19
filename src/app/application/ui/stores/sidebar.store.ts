/**
 * Sidebar Store
 * 
 * Manages sidebar UI state using NgRx Signals.
 * Handles collapse/expand, pinning, and width adjustments.
 * 
 * Persists user preferences to localStorage.
 */

import { signalStore, withState, withComputed, withMethods } from '@ngrx/signals';
import { computed } from '@angular/core';
import { patchState } from '@ngrx/signals';

/**
 * Sidebar State Interface
 */
export interface SidebarState {
  collapsed: boolean;
  pinned: boolean;
  width: number;
}

/**
 * Default sidebar width
 */
const DEFAULT_WIDTH = 280;
const MIN_WIDTH = 200;
const MAX_WIDTH = 400;

/**
 * Load sidebar state from localStorage
 */
function loadSidebarState(): SidebarState {
  try {
    const stored = localStorage.getItem('sidebar-state');
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        collapsed: parsed.collapsed ?? false,
        pinned: parsed.pinned ?? true,
        width: Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, parsed.width ?? DEFAULT_WIDTH))
      };
    }
  } catch (error) {
    console.error('Failed to load sidebar state:', error);
  }
  
  return {
    collapsed: false,
    pinned: true,
    width: DEFAULT_WIDTH
  };
}

/**
 * Save sidebar state to localStorage
 */
function saveSidebarState(state: SidebarState): void {
  try {
    localStorage.setItem('sidebar-state', JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save sidebar state:', error);
  }
}

/**
 * Initial Sidebar State
 */
const initialState: SidebarState = loadSidebarState();

/**
 * Sidebar Store
 * 
 * Provides reactive sidebar state management with localStorage persistence.
 */
export const SidebarStore = signalStore(
  { providedIn: 'root' },
  
  withState(initialState),
  
  withComputed(({ collapsed, pinned, width }) => ({
    /**
     * Get effective width (0 when collapsed)
     */
    effectiveWidth: computed(() => collapsed() ? 0 : width()),
    
    /**
     * Check if sidebar is visible
     */
    isVisible: computed(() => !collapsed()),
    
    /**
     * Check if sidebar is auto-hide mode
     */
    isAutoHide: computed(() => !pinned())
  })),
  
  withMethods((store) => ({
    /**
     * Toggle sidebar collapsed state
     */
    toggle() {
      patchState(store, (state) => {
        const newState = { ...state, collapsed: !state.collapsed };
        saveSidebarState(newState);
        return newState;
      });
    },
    
    /**
     * Expand sidebar
     */
    expand() {
      patchState(store, (state) => {
        const newState = { ...state, collapsed: false };
        saveSidebarState(newState);
        return newState;
      });
    },
    
    /**
     * Collapse sidebar
     */
    collapse() {
      patchState(store, (state) => {
        const newState = { ...state, collapsed: true };
        saveSidebarState(newState);
        return newState;
      });
    },
    
    /**
     * Toggle pinned state
     */
    togglePinned() {
      patchState(store, (state) => {
        const newState = { ...state, pinned: !state.pinned };
        saveSidebarState(newState);
        return newState;
      });
    },
    
    /**
     * Set sidebar width
     */
    setWidth(width: number) {
      const clampedWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, width));
      patchState(store, (state) => {
        const newState = { ...state, width: clampedWidth };
        saveSidebarState(newState);
        return newState;
      });
    },
    
    /**
     * Reset to default state
     */
    reset() {
      const newState = {
        collapsed: false,
        pinned: true,
        width: DEFAULT_WIDTH
      };
      patchState(store, newState);
      saveSidebarState(newState);
    }
  }))
);
