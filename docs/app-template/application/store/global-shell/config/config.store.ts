/**
 * 摘要 (Summary): Config Store - 應用配置狀態管理
 * 
 * 用途 (Purpose): 管理應用程式的配置、功能開關等設定
 * 
 * 功能 (Features):
 * - 載入應用配置
 * - 提供配置查詢介面
 * - 功能開關管理
 * 
 * 責任 (Responsibilities):
 * - 維護應用配置狀態
 * - 提供配置相關的 computed signals
 * - 從環境或 Firestore 載入配置
 */

import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { pipe, of, tap } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { AppConfig, ConfigState } from './config.models';

/**
 * Initial state for Config Store
 */
const initialState: ConfigState = {
  appConfig: null,
  loading: false,
  error: null,
};

/**
 * Config Store
 * 
 * NgRx Signals-based store for application configuration management.
 * 
 * State:
 * - appConfig: Current application configuration
 * - loading: Loading state
 * - error: Error message
 * 
 * Computed:
 * - isProduction: Whether running in production mode
 * - canCreateWorkspace: Whether workspace creation is enabled
 * 
 * Methods:
 * - loadAppConfig: Load configuration from environment
 */
export const ConfigStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((state) => ({
    /**
     * Check if running in production mode
     */
    isProduction: computed(() => state.appConfig()?.environment === 'production'),
    
    /**
     * Check if workspace creation is enabled
     */
    canCreateWorkspace: computed(() => state.appConfig()?.features?.workspaceCreation !== false),
  })),
  withMethods(() => ({
    /**
     * Load application configuration
     * 
     * For Phase 1, loads from environment.
     * Future: Load from Firebase Remote Config or Firestore.
     */
    loadAppConfig: rxMethod<void>(
      pipe(
        tap(() => patchState(ConfigStore, { loading: true, error: null })),
        // For now, create config from environment
        // Future: switchMap to Firestore or Remote Config
        tap(() => {
          const config: AppConfig = {
            version: '1.0.0',
            environment: environment.production ? 'production' : 'development',
            features: {
              workspaceCreation: true,
              advancedFeatures: !environment.production,
            },
          };
          
          patchState(ConfigStore, {
            appConfig: config,
            loading: false,
            error: null,
          });
        }),
        tapResponse({
          next: () => {
            // Success handled in tap above
          },
          error: (error: Error) => {
            patchState(ConfigStore, {
              error: error.message,
              loading: false,
            });
          },
        })
      )
    ),
  }))
);
