/**
 * 摘要 (Summary): Layout Store - 版面配置狀態管理
 * 
 * 用途 (Purpose): 管理應用程式的版面配置狀態（側邊欄、主題等）
 * 
 * 功能 (Features):
 * - 側邊欄展開/收合狀態
 * - 主題切換（亮色/暗色/自動）
 * - LocalStorage 持久化
 * 
 * 責任 (Responsibilities):
 * - 維護版面配置狀態
 * - 提供版面相關的 computed signals
 * - 持久化版面設定到 localStorage
 */

import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { LAYOUT_STORAGE_KEYS, LayoutState, Theme } from './layout.models';

/**
 * Initial state for Layout Store
 */
const initialState: LayoutState = {
  sidebarCollapsed: false,
  theme: 'auto',
};

/**
 * Load layout state from localStorage
 */
function loadFromLocalStorage(): Partial<LayoutState> {
  const state: Partial<LayoutState> = {};
  
  try {
    const savedSidebarCollapsed = localStorage.getItem(LAYOUT_STORAGE_KEYS.SIDEBAR_COLLAPSED);
    if (savedSidebarCollapsed !== null) {
      state.sidebarCollapsed = JSON.parse(savedSidebarCollapsed);
    }
    
    const savedTheme = localStorage.getItem(LAYOUT_STORAGE_KEYS.THEME);
    if (savedTheme !== null) {
      state.theme = savedTheme as Theme;
    }
  } catch (error) {
    console.error('Failed to load layout state from localStorage:', error);
  }
  
  return state;
}

/**
 * Layout Store
 * 
 * NgRx Signals-based store for layout state management.
 * 
 * State:
 * - sidebarCollapsed: Whether sidebar is collapsed
 * - theme: Current theme ('light' | 'dark' | 'auto')
 * 
 * Computed:
 * - effectiveTheme: Resolved theme (converts 'auto' to 'light' or 'dark')
 * 
 * Methods:
 * - toggleSidebar: Toggle sidebar collapsed state
 * - setSidebarCollapsed: Set sidebar collapsed state
 * - setTheme: Set theme and persist to localStorage
 */
export const LayoutStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((state) => ({
    /**
     * Effective theme after resolving 'auto' to 'light' or 'dark'
     * based on system preferences
     */
    effectiveTheme: computed(() => {
      const theme = state.theme();
      
      if (theme !== 'auto') {
        return theme;
      }
      
      // Check system preference
      if (typeof window !== 'undefined' && window.matchMedia) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return prefersDark ? 'dark' : 'light';
      }
      
      // Default to light if matchMedia not available
      return 'light';
    }),
  })),
  withMethods((store) => ({
    /**
     * Toggle sidebar collapsed state
     */
    toggleSidebar(): void {
      const newState = !store.sidebarCollapsed();
      patchState(store, { sidebarCollapsed: newState });
      
      try {
        localStorage.setItem(
          LAYOUT_STORAGE_KEYS.SIDEBAR_COLLAPSED,
          JSON.stringify(newState)
        );
      } catch (error) {
        console.error('Failed to save sidebar state to localStorage:', error);
      }
    },
    
    /**
     * Set sidebar collapsed state
     */
    setSidebarCollapsed(collapsed: boolean): void {
      patchState(store, { sidebarCollapsed: collapsed });
      
      try {
        localStorage.setItem(
          LAYOUT_STORAGE_KEYS.SIDEBAR_COLLAPSED,
          JSON.stringify(collapsed)
        );
      } catch (error) {
        console.error('Failed to save sidebar state to localStorage:', error);
      }
    },
    
    /**
     * Set theme and persist to localStorage
     */
    setTheme(theme: Theme): void {
      patchState(store, { theme });
      
      try {
        localStorage.setItem(LAYOUT_STORAGE_KEYS.THEME, theme);
      } catch (error) {
        console.error('Failed to save theme to localStorage:', error);
      }
    },
  })),
  withHooks({
    /**
     * Load persisted state from localStorage on initialization
     */
    onInit(store): void {
      const savedState = loadFromLocalStorage();
      if (Object.keys(savedState).length > 0) {
        patchState(store, savedState);
      }
    },
  })
);
