/**
 * 摘要 (Summary): Config Models - 應用配置相關的類型定義
 * 
 * 用途 (Purpose): 定義應用程式配置、功能開關等類型
 * 
 * 功能 (Features):
 * - AppConfig 介面定義
 * - 功能開關類型
 * - 環境相關配置
 * 
 * 責任 (Responsibilities):
 * - 提供 Config Store 使用的類型定義
 * - 定義應用程式配置結構
 */

/**
 * Application Configuration Interface
 * 
 * Represents the runtime configuration of the application.
 */
export interface AppConfig {
  /** Application version */
  version: string;
  
  /** Current environment */
  environment: 'development' | 'production';
  
  /** Feature flags and capabilities */
  features: {
    /** Whether users can create new workspaces */
    workspaceCreation: boolean;
    
    /** Whether advanced features are enabled */
    advancedFeatures?: boolean;
  };
  
  /** API endpoints configuration */
  api?: {
    baseUrl: string;
    timeout: number;
  };
}

/**
 * Config State Interface
 * 
 * Represents the state of the Config Store.
 */
export interface ConfigState {
  /** Current application configuration */
  appConfig: AppConfig | null;
  
  /** Loading state */
  loading: boolean;
  
  /** Error message */
  error: string | null;
}
