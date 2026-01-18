/**
 * 摘要 (Summary): Router Store - 路由狀態管理
 * 
 * 用途 (Purpose): 追蹤當前路由和導航狀態
 * 
 * 功能 (Features):
 * - 當前路由追蹤
 * - 前一個路由記錄
 * - 導航狀態管理
 * 
 * 責任 (Responsibilities):
 * - 維護路由狀態
 * - 記錄路由歷史
 * - 提供路由查詢介面
 */

import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

/**
 * Router State Interface
 */
export interface RouterState {
  /** Current route path */
  currentRoute: string | null;
  
  /** Previous route path */
  previousRoute: string | null;
  
  /** Whether navigation is in progress */
  isNavigating: boolean;
}

/**
 * Initial state for Router Store
 */
const initialState: RouterState = {
  currentRoute: null,
  previousRoute: null,
  isNavigating: false,
};

/**
 * Router Store
 * 
 * NgRx Signals-based store for router state management.
 * 
 * State:
 * - currentRoute: Current route path
 * - previousRoute: Previous route path
 * - isNavigating: Navigation in progress flag
 * 
 * Methods:
 * - updateRoute: Update current route (moves current to previous)
 * - setNavigating: Set navigation in progress state
 */
export const RouterStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    /**
     * Update the current route
     * 
     * Automatically moves the current route to previousRoute
     * and sets the new route as currentRoute.
     * 
     * @param route - The new route path
     */
    updateRoute(route: string): void {
      patchState(store, {
        previousRoute: store.currentRoute(),
        currentRoute: route,
        isNavigating: false,
      });
    },
    
    /**
     * Set navigation in progress state
     * 
     * @param navigating - Whether navigation is in progress
     */
    setNavigating(navigating: boolean): void {
      patchState(store, { isNavigating: navigating });
    },
    
    /**
     * Reset router state
     */
    reset(): void {
      patchState(store, initialState);
    },
  }))
);
