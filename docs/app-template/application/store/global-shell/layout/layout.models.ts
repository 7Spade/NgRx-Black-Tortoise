/**
 * 摘要 (Summary): Layout Models - 版面配置相關的類型定義
 * 
 * 用途 (Purpose): 定義版面狀態、主題等類型
 * 
 * 功能 (Features):
 * - Theme 類型定義
 * - LayoutState 介面定義
 * 
 * 責任 (Responsibilities):
 * - 提供 Layout Store 使用的類型定義
 * - 定義版面配置相關的狀態結構
 */

/**
 * Theme Type
 * 
 * Represents the available theme options.
 * - 'light': Light theme
 * - 'dark': Dark theme
 * - 'auto': Automatically detect from system preferences
 */
export type Theme = 'light' | 'dark' | 'auto';

/**
 * Layout State Interface
 * 
 * Represents the state of the Layout Store.
 */
export interface LayoutState {
  /** Whether the sidebar is collapsed */
  sidebarCollapsed: boolean;
  
  /** Current theme setting */
  theme: Theme;
}

/**
 * LocalStorage keys for Layout persistence
 */
export const LAYOUT_STORAGE_KEYS = {
  SIDEBAR_COLLAPSED: 'app.layout.sidebarCollapsed',
  THEME: 'app.layout.theme',
} as const;
