# 02 - 狀態管理架構設計 (ngrx/signals)

## 🎯 目標

使用 `@ngrx/signals` 建立響應式狀態管理系統,管理應用程式的全局與局部狀態。

## 📁 文件結構

```
src/app/application/store/
├── workspace/
│   ├── workspace.store.ts
│   └── workspace.effects.ts
│
├── module/
│   ├── module.store.ts
│   └── module.effects.ts
│
├── account/
│   ├── account.store.ts
│   └── account.effects.ts
│
├── ui/
│   ├── sidebar.store.ts
│   ├── header.store.ts
│   └── notification.store.ts
│
└── index.ts
```

## 🏗 Store 架構設計

### 核心概念

- **Signal Store**: 使用 `signalStore` 建立響應式狀態容器
- **Computed Signals**: 使用 `computed` 衍生狀態
- **Effects**: 使用 `rxMethod` 處理副作用
- **Immutability**: 使用 `patchState` 更新狀態

### 狀態分層

1. **全局狀態** (Application-wide)
   - Account (當前使用者)
   - Current Workspace (當前工作區)
   - Notifications (通知中心)

2. **功能狀態** (Feature-specific)
   - Modules List (模組列表)
   - Documents List (文件列表)
   - Tasks List (任務列表)

3. **UI 狀態** (UI-specific)
   - Sidebar (側邊欄狀態)
   - Header (標頭狀態)
   - Search (搜尋狀態)

## 📝 Store 實現

### 1. Workspace Store

**檔案**: `src/app/application/store/workspace/workspace.store.ts`

```typescript
import { computed, inject } from '@angular/core';
import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, catchError, of } from 'rxjs';
import { tapResponse } from '@ngrx/operators';

import { Workspace } from '@/domain/workspace/entities';
import { IWorkspaceRepository } from '@/domain/workspace/repositories';

/**
 * 工作區狀態介面
 */
interface WorkspaceState {
  // 當前工作區
  currentWorkspace: Workspace | null;
  
  // 所有工作區列表
  workspaces: Workspace[];
  
  // 載入狀態
  isLoading: boolean;
  
  // 錯誤狀態
  error: string | null;
  
  // 最後更新時間
  lastUpdated: Date | null;
}

/**
 * 初始狀態
 */
const initialState: WorkspaceState = {
  currentWorkspace: null,
  workspaces: [],
  isLoading: false,
  error: null,
  lastUpdated: null
};

/**
 * 工作區 Signal Store
 */
export const WorkspaceStore = signalStore(
  { providedIn: 'root' },
  
  // 定義狀態
  withState(initialState),
  
  // 計算屬性
  withComputed((store) => ({
    // 當前工作區 ID
    currentWorkspaceId: computed(() => store.currentWorkspace()?.id ?? null),
    
    // 工作區總數
    workspaceCount: computed(() => store.workspaces().length),
    
    // 是否有當前工作區
    hasCurrentWorkspace: computed(() => store.currentWorkspace() !== null),
    
    // 工作區選項 (用於下拉選單)
    workspaceOptions: computed(() => 
      store.workspaces().map(ws => ({
        id: ws.id,
        name: ws.name,
        iconUrl: ws.iconUrl
      }))
    ),
    
    // 當前工作區統計資訊
    currentWorkspaceStats: computed(() => 
      store.currentWorkspace()?.stats ?? null
    )
  })),
  
  // 方法
  withMethods((store, workspaceRepo = inject(WorkspaceRepository)) => ({
    /**
     * 載入所有工作區
     */
    loadWorkspaces: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap((accountId) =>
          workspaceRepo.findByAccountId(accountId).pipe(
            tapResponse({
              next: (workspaces) => {
                patchState(store, {
                  workspaces,
                  isLoading: false,
                  lastUpdated: new Date()
                });
              },
              error: (error: Error) => {
                patchState(store, {
                  isLoading: false,
                  error: error.message
                });
                console.error('Failed to load workspaces:', error);
              }
            })
          )
        )
      )
    ),
    
    /**
     * 設定當前工作區
     */
    setCurrentWorkspace: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap((workspaceId) =>
          workspaceRepo.findById(workspaceId).pipe(
            tapResponse({
              next: (workspace) => {
                patchState(store, {
                  currentWorkspace: workspace,
                  isLoading: false,
                  lastUpdated: new Date()
                });
              },
              error: (error: Error) => {
                patchState(store, {
                  isLoading: false,
                  error: error.message
                });
                console.error('Failed to load workspace:', error);
              }
            })
          )
        )
      )
    ),
    
    /**
     * 切換工作區
     */
    switchWorkspace(workspaceId: string): void {
      const workspace = store.workspaces().find(ws => ws.id === workspaceId);
      if (workspace) {
        patchState(store, {
          currentWorkspace: workspace,
          lastUpdated: new Date()
        });
      }
    },
    
    /**
     * 更新當前工作區
     */
    updateCurrentWorkspace: rxMethod<Partial<Workspace>>(
      pipe(
        switchMap((updates) => {
          const currentId = store.currentWorkspace()?.id;
          if (!currentId) {
            return of(null);
          }
          
          return workspaceRepo.update(currentId, updates).pipe(
            switchMap(() => workspaceRepo.findById(currentId)),
            tapResponse({
              next: (workspace) => {
                if (workspace) {
                  patchState(store, {
                    currentWorkspace: workspace,
                    workspaces: store.workspaces().map(ws =>
                      ws.id === currentId ? workspace : ws
                    ),
                    lastUpdated: new Date()
                  });
                }
              },
              error: (error: Error) => {
                console.error('Failed to update workspace:', error);
              }
            })
          );
        })
      )
    ),
    
    /**
     * 清除錯誤
     */
    clearError(): void {
      patchState(store, { error: null });
    },
    
    /**
     * 重置狀態
     */
    reset(): void {
      patchState(store, initialState);
    }
  }))
);
```

### 2. Module Store

**檔案**: `src/app/application/store/module/module.store.ts`

```typescript
import { computed, inject } from '@angular/core';
import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';

import { Module, ModuleType } from '../../../domain/entities/module.entity';
import { ModuleRepository } from '../../../domain/repositories/module.repository';

/**
 * 模組狀態介面
 */
interface ModuleState {
  // 模組列表
  modules: Module[];
  
  // 當前選中的模組
  activeModuleType: ModuleType | null;
  
  // 載入狀態
  isLoading: boolean;
  
  // 錯誤狀態
  error: string | null;
}

/**
 * 初始狀態
 */
const initialState: ModuleState = {
  modules: [],
  activeModuleType: null,
  isLoading: false,
  error: null
};

/**
 * 模組 Signal Store
 */
export const ModuleStore = signalStore(
  { providedIn: 'root' },
  
  withState(initialState),
  
  withComputed((store) => ({
    // 啟用的模組 (已排序)
    enabledModules: computed(() =>
      store.modules()
        .filter(m => m.enabled && m.visible)
        .sort((a, b) => a.order - b.order)
    ),
    
    // 當前活動模組
    activeModule: computed(() => {
      const activeType = store.activeModuleType();
      return activeType
        ? store.modules().find(m => m.type === activeType) ?? null
        : null;
    }),
    
    // 有徽章的模組數量
    modulesWithBadgeCount: computed(() =>
      store.modules().filter(m => m.badge && m.badge.count && m.badge.count > 0).length
    ),
    
    // 取得特定類型模組
    getModuleByType: computed(() => (type: ModuleType) =>
      store.modules().find(m => m.type === type) ?? null
    )
  })),
  
  withMethods((store, moduleRepo = inject(ModuleRepository)) => ({
    /**
     * 載入工作區模組
     */
    loadModules: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap((workspaceId) =>
          moduleRepo.findByWorkspaceId(workspaceId).pipe(
            tapResponse({
              next: (modules) => {
                patchState(store, {
                  modules,
                  isLoading: false,
                  // 如果沒有活動模組,設定第一個啟用的模組為活動
                  activeModuleType: store.activeModuleType() ?? modules[0]?.type ?? null
                });
              },
              error: (error: Error) => {
                patchState(store, {
                  isLoading: false,
                  error: error.message
                });
                console.error('Failed to load modules:', error);
              }
            })
          )
        )
      )
    ),
    
    /**
     * 設定活動模組
     */
    setActiveModule(moduleType: ModuleType): void {
      const module = store.modules().find(m => m.type === moduleType);
      if (module && module.enabled) {
        patchState(store, { activeModuleType: moduleType });
      }
    },
    
    /**
     * 更新模組順序
     */
    updateModuleOrder: rxMethod<{ workspaceId: string; orders: Array<{ id: string; order: number }> }>(
      pipe(
        switchMap(({ workspaceId, orders }) =>
          moduleRepo.updateOrder(workspaceId, orders).pipe(
            tap(() => {
              // 更新本地狀態
              const updatedModules = store.modules().map(module => {
                const newOrder = orders.find(o => o.id === module.id);
                return newOrder ? { ...module, order: newOrder.order } : module;
              });
              patchState(store, { modules: updatedModules });
            }),
            tapResponse({
              next: () => {},
              error: (error: Error) => {
                console.error('Failed to update module order:', error);
              }
            })
          )
        )
      )
    ),
    
    /**
     * 更新模組徽章
     */
    updateModuleBadge(moduleType: ModuleType, badge: Module['badge']): void {
      const updatedModules = store.modules().map(module =>
        module.type === moduleType ? { ...module, badge } : module
      );
      patchState(store, { modules: updatedModules });
    },
    
    /**
     * 重置狀態
     */
    reset(): void {
      patchState(store, initialState);
    }
  }))
);
```

### 3. Account Store

**檔案**: `src/app/application/store/account/account.store.ts`

```typescript
import { computed } from '@angular/core';
import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';

import { Account } from '../../../domain/entities/account.entity';

/**
 * 帳戶狀態介面
 */
interface AccountState {
  // 當前帳戶
  account: Account | null;
  
  // 認證狀態
  isAuthenticated: boolean;
  
  // 載入狀態
  isLoading: boolean;
}

/**
 * 初始狀態
 */
const initialState: AccountState = {
  account: null,
  isAuthenticated: false,
  isLoading: false
};

/**
 * 帳戶 Signal Store
 */
export const AccountStore = signalStore(
  { providedIn: 'root' },
  
  withState(initialState),
  
  withComputed((store) => ({
    // 帳戶 ID
    accountId: computed(() => store.account()?.id ?? null),
    
    // 顯示名稱
    displayName: computed(() => store.account()?.displayName ?? 'Guest'),
    
    // 電子郵件
    email: computed(() => store.account()?.email ?? ''),
    
    // 頭像 URL
    photoUrl: computed(() => store.account()?.photoUrl ?? null),
    
    // 用戶偏好
    preferences: computed(() => store.account()?.preferences ?? null),
    
    // 主題設定
    theme: computed(() => store.account()?.preferences.theme ?? 'auto'),
    
    // 側邊欄展開狀態
    sidebarExpanded: computed(() => store.account()?.preferences.sidebarExpanded ?? true)
  })),
  
  withMethods((store) => ({
    /**
     * 設定帳戶
     */
    setAccount(account: Account | null): void {
      patchState(store, {
        account,
        isAuthenticated: account !== null
      });
    },
    
    /**
     * 更新帳戶偏好
     */
    updatePreferences(preferences: Partial<Account['preferences']>): void {
      const currentAccount = store.account();
      if (currentAccount) {
        patchState(store, {
          account: {
            ...currentAccount,
            preferences: {
              ...currentAccount.preferences,
              ...preferences
            }
          }
        });
      }
    },
    
    /**
     * 切換側邊欄
     */
    toggleSidebar(): void {
      const currentAccount = store.account();
      if (currentAccount) {
        patchState(store, {
          account: {
            ...currentAccount,
            preferences: {
              ...currentAccount.preferences,
              sidebarExpanded: !currentAccount.preferences.sidebarExpanded
            }
          }
        });
      }
    },
    
    /**
     * 設定載入狀態
     */
    setLoading(isLoading: boolean): void {
      patchState(store, { isLoading });
    },
    
    /**
     * 登出
     */
    logout(): void {
      patchState(store, initialState);
    }
  }))
);
```

### 4. Sidebar Store (UI State)

**檔案**: `src/app/application/store/ui/sidebar.store.ts`

```typescript
import { computed } from '@angular/core';
import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';

/**
 * 側邊欄狀態介面
 */
interface SidebarState {
  // 展開/收合
  expanded: boolean;
  
  // 移動裝置側邊欄開啟狀態
  mobileOpen: boolean;
  
  // 展開的子項目 ID
  expandedSubItems: Set<string>;
}

/**
 * 初始狀態
 */
const initialState: SidebarState = {
  expanded: true,
  mobileOpen: false,
  expandedSubItems: new Set()
};

/**
 * 側邊欄 Signal Store
 */
export const SidebarStore = signalStore(
  { providedIn: 'root' },
  
  withState(initialState),
  
  withComputed((store) => ({
    // 側邊欄寬度
    sidebarWidth: computed(() => store.expanded() ? 240 : 64),
    
    // 是否顯示文字
    showText: computed(() => store.expanded()),
    
    // 子項目是否展開
    isSubItemExpanded: computed(() => (id: string) =>
      store.expandedSubItems().has(id)
    )
  })),
  
  withMethods((store) => ({
    /**
     * 切換側邊欄
     */
    toggle(): void {
      patchState(store, { expanded: !store.expanded() });
    },
    
    /**
     * 設定展開狀態
     */
    setExpanded(expanded: boolean): void {
      patchState(store, { expanded });
    },
    
    /**
     * 切換移動端側邊欄
     */
    toggleMobile(): void {
      patchState(store, { mobileOpen: !store.mobileOpen() });
    },
    
    /**
     * 關閉移動端側邊欄
     */
    closeMobile(): void {
      patchState(store, { mobileOpen: false });
    },
    
    /**
     * 切換子項目展開狀態
     */
    toggleSubItem(id: string): void {
      const expandedItems = new Set(store.expandedSubItems());
      if (expandedItems.has(id)) {
        expandedItems.delete(id);
      } else {
        expandedItems.add(id);
      }
      patchState(store, { expandedSubItems: expandedItems });
    },
    
    /**
     * 重置狀態
     */
    reset(): void {
      patchState(store, initialState);
    }
  }))
);
```

### 5. Notification Store

**檔案**: `src/app/application/store/ui/notification.store.ts`

```typescript
import { computed, inject } from '@angular/core';
import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';

import { Notification } from '../../../domain/entities/notification.entity';
import { NotificationRepository } from '../../../domain/repositories/notification.repository';

/**
 * 通知狀態介面
 */
interface NotificationState {
  // 通知列表
  notifications: Notification[];
  
  // 抽屜開啟狀態
  drawerOpen: boolean;
  
  // 載入狀態
  isLoading: boolean;
}

/**
 * 初始狀態
 */
const initialState: NotificationState = {
  notifications: [],
  drawerOpen: false,
  isLoading: false
};

/**
 * 通知 Signal Store
 */
export const NotificationStore = signalStore(
  { providedIn: 'root' },
  
  withState(initialState),
  
  withComputed((store) => ({
    // 未讀通知數量
    unreadCount: computed(() =>
      store.notifications().filter(n => !n.read).length
    ),
    
    // 未讀通知
    unreadNotifications: computed(() =>
      store.notifications().filter(n => !n.read)
    ),
    
    // 已讀通知
    readNotifications: computed(() =>
      store.notifications().filter(n => n.read)
    ),
    
    // 有未讀通知
    hasUnread: computed(() =>
      store.notifications().some(n => !n.read)
    )
  })),
  
  withMethods((store, notificationRepo = inject(NotificationRepository)) => ({
    /**
     * 載入通知
     */
    loadNotifications: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((accountId) =>
          notificationRepo.findByRecipientId(accountId).pipe(
            tapResponse({
              next: (notifications) => {
                patchState(store, {
                  notifications,
                  isLoading: false
                });
              },
              error: (error: Error) => {
                patchState(store, { isLoading: false });
                console.error('Failed to load notifications:', error);
              }
            })
          )
        )
      )
    ),
    
    /**
     * 標記為已讀
     */
    markAsRead: rxMethod<string>(
      pipe(
        switchMap((notificationId) =>
          notificationRepo.markAsRead(notificationId).pipe(
            tap(() => {
              const updatedNotifications = store.notifications().map(n =>
                n.id === notificationId ? { ...n, read: true, readAt: new Date() } : n
              );
              patchState(store, { notifications: updatedNotifications });
            }),
            tapResponse({
              next: () => {},
              error: (error: Error) => {
                console.error('Failed to mark notification as read:', error);
              }
            })
          )
        )
      )
    ),
    
    /**
     * 全部標記為已讀
     */
    markAllAsRead: rxMethod<void>(
      pipe(
        switchMap(() =>
          notificationRepo.markAllAsRead().pipe(
            tap(() => {
              const now = new Date();
              const updatedNotifications = store.notifications().map(n => ({
                ...n,
                read: true,
                readAt: now
              }));
              patchState(store, { notifications: updatedNotifications });
            }),
            tapResponse({
              next: () => {},
              error: (error: Error) => {
                console.error('Failed to mark all as read:', error);
              }
            })
          )
        )
      )
    ),
    
    /**
     * 切換抽屜
     */
    toggleDrawer(): void {
      patchState(store, { drawerOpen: !store.drawerOpen() });
    },
    
    /**
     * 關閉抽屜
     */
    closeDrawer(): void {
      patchState(store, { drawerOpen: false });
    },
    
    /**
     * 新增通知
     */
    addNotification(notification: Notification): void {
      patchState(store, {
        notifications: [notification, ...store.notifications()]
      });
    }
  }))
);
```

## 🔗 索引檔案

**檔案**: `src/app/application/store/index.ts`

```typescript
// Store exports
export { WorkspaceStore } from './workspace/workspace.store';
export { ModuleStore } from './module/module.store';
export { AccountStore } from './account/account.store';
export { SidebarStore } from './ui/sidebar.store';
export { NotificationStore } from './ui/notification.store';
```

## 💡 使用範例

### 在組件中使用 Store

```typescript
import { Component, inject, effect } from '@angular/core';
import { WorkspaceStore } from '@/application/store';

@Component({
  selector: 'app-workspace-list',
  standalone: true,
  template: `
    @if (store.isLoading()) {
      <div>Loading...</div>
    } @else {
      @for (workspace of store.workspaces(); track workspace.id) {
        <div>{{ workspace.name }}</div>
      }
    }
  `
})
export class WorkspaceListComponent {
  // 注入 Store
  store = inject(WorkspaceStore);
  
  constructor() {
    // 載入工作區
    this.store.loadWorkspaces('account-id');
    
    // 監聽變化
    effect(() => {
      console.log('Current workspace:', this.store.currentWorkspace());
    });
  }
}
```

## ✅ 實施步驟

### Step 1: 安裝依賴

```bash
yarn add @ngrx/signals @ngrx/operators
```

### Step 2: 建立 Store 目錄結構

```bash
mkdir -p src/app/application/store/workspace
mkdir -p src/app/application/store/module
mkdir -p src/app/application/store/account
mkdir -p src/app/application/store/ui
```

### Step 3: 建立 Store 檔案

依序建立上述所有 Store 檔案。

### Step 4: 測試 Store

建立單元測試確保 Store 運作正常。

## 🧪 測試檢查清單

- [ ] WorkspaceStore 建立完成
- [ ] ModuleStore 建立完成
- [ ] AccountStore 建立完成
- [ ] SidebarStore 建立完成
- [ ] NotificationStore 建立完成
- [ ] 所有 computed signals 運作正常
- [ ] 所有 methods 運作正常
- [ ] TypeScript 編譯無錯誤

## 📝 注意事項

1. **Immutability**: 使用 `patchState` 更新狀態,不要直接修改
2. **Computed Signals**: 充分利用 computed 來衍生狀態
3. **Effects**: 使用 `rxMethod` 處理副作用和非同步操作
4. **Error Handling**: 妥善處理錯誤並更新錯誤狀態
5. **Memory Leaks**: 注意訂閱管理,使用 `rxMethod` 自動管理訂閱

---

**完成此步驟後,請繼續 `03-FIREBASE-INTEGRATION.md`**
