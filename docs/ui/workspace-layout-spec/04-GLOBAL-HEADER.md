# 04 - 全局標頭組件 (Global Header)

## 🎯 目標

實現固定在頂部的全局標頭,包含 Logo、工作區切換器、全局搜尋、通知圖標和身份切換器。

## 📁 文件結構

```
src/app/presentation/layouts/header/
├── header.component.ts
├── header.component.html
├── header.component.scss
├── components/
│   ├── workspace-switcher/
│   │   ├── workspace-switcher.component.ts
│   │   ├── workspace-switcher.component.html
│   │   └── workspace-switcher.component.scss
│   ├── global-search/
│   │   ├── global-search.component.ts
│   │   ├── global-search.component.html
│   │   └── global-search.component.scss
│   └── account-menu/
│       ├── account-menu.component.ts
│       ├── account-menu.component.html
│       └── account-menu.component.scss
└── index.ts
```

## 🎨 視覺規格

### 尺寸規格
- **高度**: 64px (固定)
- **Logo**: 32x32px,左邊距 24px
- **工作區切換器**: 高度 40px,寬度 280px
- **搜尋框**: 寬度 400px (Desktop),高度 40px
- **圖標**: 24x24px
- **右邊距**: 24px

### 色彩與樣式
```scss
// Light Mode
--header-bg: #FFFFFF;
--header-border: rgba(0, 0, 0, 0.08);
--header-text: rgba(0, 0, 0, 0.87);

// Dark Mode
--header-bg: #1E1E1E;
--header-border: rgba(255, 255, 255, 0.12);
--header-text: rgba(255, 255, 255, 0.87);

// Shadow
--header-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
```

## 📝 組件實現

### 1. Header Component

**檔案**: `src/app/presentation/layouts/header/header.component.ts`

```typescript
import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

// Material Components
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';

// Stores
import { AccountStore } from '@/application/store/account/account.store';
import { WorkspaceStore } from '@/application/store/workspace/workspace.store';
import { NotificationStore } from '@/application/store/ui/notification.store';

// Child Components
import { WorkspaceSwitcherComponent } from './components/workspace-switcher/workspace-switcher.component';
import { GlobalSearchComponent } from './components/global-search/global-search.component';
import { AccountMenuComponent } from './components/account-menu/account-menu.component';

/**
 * 全局標頭組件
 * 固定在頂部,包含導航和工具列
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    WorkspaceSwitcherComponent,
    GlobalSearchComponent,
    AccountMenuComponent
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  // Stores
  protected accountStore = inject(AccountStore);
  protected workspaceStore = inject(WorkspaceStore);
  protected notificationStore = inject(NotificationStore);

  // 滾動狀態 (用於控制陰影)
  protected isScrolled = signal(false);

  // 未讀通知數量
  protected unreadCount = computed(() => this.notificationStore.unreadCount());

  constructor() {
    // 監聽滾動事件
    this.setupScrollListener();
  }

  /**
   * 設定滾動監聽器
   */
  private setupScrollListener(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', () => {
        this.isScrolled.set(window.scrollY > 0);
      });
    }
  }

  /**
   * 開啟通知中心
   */
  protected openNotifications(): void {
    this.notificationStore.toggleDrawer();
  }

  /**
   * 開啟全局搜尋
   */
  protected openSearch(): void {
    // 觸發全局搜尋對話框
    // 實現將在 08-GLOBAL-SEARCH.md 中完成
  }
}
```

**檔案**: `src/app/presentation/layouts/header/header.component.html`

```html
<mat-toolbar 
  class="app-header"
  [class.elevated]="isScrolled()">
  
  <!-- Left Zone: Logo & Workspace Switcher -->
  <div class="header-left">
    <!-- Logo -->
    <a routerLink="/" class="logo-link">
      <img src="assets/logo.svg" alt="Logo" class="logo" />
    </a>

    <!-- Workspace Switcher -->
    @if (workspaceStore.hasCurrentWorkspace()) {
      <app-workspace-switcher />
    }
  </div>

  <!-- Center Zone: Global Search -->
  <div class="header-center">
    <app-global-search />
  </div>

  <!-- Right Zone: Actions & Account -->
  <div class="header-right">
    <!-- Notification Button -->
    <button
      mat-icon-button
      class="header-icon-button"
      (click)="openNotifications()"
      [matBadge]="unreadCount()"
      [matBadgeHidden]="unreadCount() === 0"
      matBadgeColor="warn"
      matBadgeSize="small"
      aria-label="通知中心">
      <mat-icon>notifications</mat-icon>
    </button>

    <!-- Settings Button -->
    <button
      mat-icon-button
      class="header-icon-button"
      routerLink="/settings"
      aria-label="設定">
      <mat-icon>settings</mat-icon>
    </button>

    <!-- Account Menu -->
    <app-account-menu />
  </div>
</mat-toolbar>
```

**檔案**: `src/app/presentation/layouts/header/header.component.scss`

```scss
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  
  height: 64px;
  padding: 0 24px;
  
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  
  background-color: var(--mat-toolbar-container-background-color);
  border-bottom: 1px solid var(--mat-divider-color);
  
  transition: box-shadow 200ms ease;
  
  // 滾動時顯示陰影
  &.elevated {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
}

// Left Zone
.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 0;
}

.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.logo {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

// Center Zone
.header-center {
  flex: 1;
  max-width: 600px;
  min-width: 0;
}

// Right Zone
.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-icon-button {
  width: 40px;
  height: 40px;
  
  mat-icon {
    font-size: 24px;
    width: 24px;
    height: 24px;
  }
}

// 響應式: Tablet
@media (max-width: 1023px) {
  .app-header {
    padding: 0 16px;
    gap: 16px;
  }
  
  .header-center {
    max-width: 400px;
  }
}

// 響應式: Mobile
@media (max-width: 767px) {
  .app-header {
    padding: 0 12px;
    gap: 8px;
  }
  
  .header-left {
    gap: 12px;
  }
  
  .header-center {
    display: none; // 移動端隱藏搜尋框
  }
  
  .header-right {
    gap: 4px;
  }
}
```

### 2. Workspace Switcher Component

**檔案**: `src/app/presentation/layouts/header/components/workspace-switcher/workspace-switcher.component.ts`

```typescript
import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// Material Components
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

// Stores
import { WorkspaceStore } from '@/application/store/workspace/workspace.store';

/**
 * 工作區切換器組件
 */
@Component({
  selector: 'app-workspace-switcher',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './workspace-switcher.component.html',
  styleUrls: ['./workspace-switcher.component.scss']
})
export class WorkspaceSwitcherComponent {
  private workspaceStore = inject(WorkspaceStore);
  private router = inject(Router);

  // 當前工作區
  protected currentWorkspace = computed(() => this.workspaceStore.currentWorkspace());

  // 所有工作區
  protected workspaces = computed(() => this.workspaceStore.workspaces());

  /**
   * 切換工作區
   */
  protected switchWorkspace(workspaceId: string): void {
    this.workspaceStore.switchWorkspace(workspaceId);
    this.router.navigate(['/workspace', workspaceId]);
  }

  /**
   * 建立新工作區
   */
  protected createWorkspace(): void {
    this.router.navigate(['/workspace/new']);
  }
}
```

**檔案**: `src/app/presentation/layouts/header/components/workspace-switcher/workspace-switcher.component.html`

```html
<button
  mat-button
  class="workspace-switcher-button"
  [matMenuTriggerFor]="workspaceMenu"
  aria-label="切換工作區">
  
  <!-- Workspace Icon -->
  @if (currentWorkspace()?.iconUrl) {
    <img 
      [src]="currentWorkspace()!.iconUrl" 
      alt="Workspace icon"
      class="workspace-icon" />
  } @else {
    <mat-icon class="workspace-icon-fallback">folder</mat-icon>
  }
  
  <!-- Workspace Name -->
  <span class="workspace-name">{{ currentWorkspace()?.name }}</span>
  
  <!-- Dropdown Icon -->
  <mat-icon class="dropdown-icon">arrow_drop_down</mat-icon>
</button>

<!-- Workspace Menu -->
<mat-menu #workspaceMenu="matMenu" class="workspace-menu">
  <!-- Current Workspace Section -->
  <div class="menu-section-title">當前工作區</div>
  <button 
    mat-menu-item 
    class="current-workspace-item"
    disabled>
    <mat-icon>check</mat-icon>
    <span>{{ currentWorkspace()?.name }}</span>
  </button>
  
  <mat-divider />
  
  <!-- Other Workspaces -->
  @if (workspaces().length > 1) {
    <div class="menu-section-title">切換到</div>
    @for (workspace of workspaces(); track workspace.id) {
      @if (workspace.id !== currentWorkspace()?.id) {
        <button 
          mat-menu-item
          (click)="switchWorkspace(workspace.id)">
          @if (workspace.iconUrl) {
            <img 
              [src]="workspace.iconUrl" 
              alt="Workspace icon"
              class="menu-workspace-icon" />
          } @else {
            <mat-icon>folder</mat-icon>
          }
          <span>{{ workspace.name }}</span>
        </button>
      }
    }
    
    <mat-divider />
  }
  
  <!-- Create New Workspace -->
  <button 
    mat-menu-item
    (click)="createWorkspace()">
    <mat-icon>add</mat-icon>
    <span>建立新工作區</span>
  </button>
</mat-menu>
```

**檔案**: `src/app/presentation/layouts/header/components/workspace-switcher/workspace-switcher.component.scss`

```scss
.workspace-switcher-button {
  height: 40px;
  min-width: 200px;
  max-width: 280px;
  
  padding: 0 12px;
  
  display: flex;
  align-items: center;
  gap: 8px;
  
  border-radius: 8px;
  border: 1px solid var(--mat-divider-color);
  
  background-color: transparent;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }
}

.workspace-icon {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  object-fit: cover;
}

.workspace-icon-fallback {
  font-size: 20px;
  width: 20px;
  height: 20px;
  color: var(--mat-icon-color);
}

.workspace-name {
  flex: 1;
  min-width: 0;
  
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  
  font-size: 14px;
  font-weight: 500;
}

.dropdown-icon {
  font-size: 20px;
  width: 20px;
  height: 20px;
}

// Menu Styles
.workspace-menu {
  min-width: 280px;
}

.menu-section-title {
  padding: 8px 16px;
  font-size: 12px;
  font-weight: 600;
  color: var(--mat-text-secondary);
  text-transform: uppercase;
}

.current-workspace-item {
  background-color: rgba(0, 0, 0, 0.04);
  
  mat-icon {
    color: var(--mat-primary);
  }
}

.menu-workspace-icon {
  width: 20px;
  height: 20px;
  margin-right: 12px;
  border-radius: 4px;
}

// 響應式: Mobile
@media (max-width: 767px) {
  .workspace-switcher-button {
    min-width: 160px;
    max-width: 200px;
  }
  
  .workspace-name {
    font-size: 13px;
  }
}
```

### 3. Account Menu Component

**檔案**: `src/app/presentation/layouts/header/components/account-menu/account-menu.component.ts`

```typescript
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// Material Components
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

// Services & Stores
import { AuthService } from '@/infrastructure/firebase/services/auth.service';
import { AccountStore } from '@/application/store/account/account.store';

/**
 * 帳戶選單組件
 */
@Component({
  selector: 'app-account-menu',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './account-menu.component.html',
  styleUrls: ['./account-menu.component.scss']
})
export class AccountMenuComponent {
  private authService = inject(AuthService);
  private accountStore = inject(AccountStore);
  private router = inject(Router);

  protected account = this.accountStore.account;
  protected displayName = this.accountStore.displayName;
  protected email = this.accountStore.email;
  protected photoUrl = this.accountStore.photoUrl;

  /**
   * 前往個人資料
   */
  protected goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  /**
   * 前往設定
   */
  protected goToSettings(): void {
    this.router.navigate(['/settings']);
  }

  /**
   * 登出
   */
  protected async logout(): Promise<void> {
    try {
      await this.authService.signOut();
      this.accountStore.logout();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }
}
```

**檔案**: `src/app/presentation/layouts/header/components/account-menu/account-menu.component.html`

```html
<button
  mat-button
  class="account-menu-button"
  [matMenuTriggerFor]="accountMenu"
  aria-label="帳戶選單">
  
  <!-- Avatar -->
  @if (photoUrl()) {
    <img 
      [src]="photoUrl()!" 
      [alt]="displayName()"
      class="avatar" />
  } @else {
    <div class="avatar-fallback">
      {{ displayName()[0]?.toUpperCase() }}
    </div>
  }
  
  <!-- Name (Desktop only) -->
  <span class="account-name">{{ displayName() }}</span>
  
  <!-- Dropdown Icon -->
  <mat-icon class="dropdown-icon">arrow_drop_down</mat-icon>
</button>

<!-- Account Menu -->
<mat-menu #accountMenu="matMenu" class="account-menu">
  <!-- User Info -->
  <div class="user-info">
    @if (photoUrl()) {
      <img 
        [src]="photoUrl()!" 
        [alt]="displayName()"
        class="user-avatar" />
    } @else {
      <div class="user-avatar-fallback">
        {{ displayName()[0]?.toUpperCase() }}
      </div>
    }
    
    <div class="user-details">
      <div class="user-name">{{ displayName() }}</div>
      <div class="user-email">{{ email() }}</div>
    </div>
  </div>
  
  <mat-divider />
  
  <!-- Menu Items -->
  <button mat-menu-item (click)="goToProfile()">
    <mat-icon>person</mat-icon>
    <span>個人資料</span>
  </button>
  
  <button mat-menu-item (click)="goToSettings()">
    <mat-icon>settings</mat-icon>
    <span>設定</span>
  </button>
  
  <mat-divider />
  
  <button mat-menu-item (click)="logout()">
    <mat-icon>logout</mat-icon>
    <span>登出</span>
  </button>
</mat-menu>
```

**檔案**: `src/app/presentation/layouts/header/components/account-menu/account-menu.component.scss`

```scss
.account-menu-button {
  height: 40px;
  padding: 0 8px;
  
  display: flex;
  align-items: center;
  gap: 8px;
  
  border-radius: 20px;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }
}

.avatar,
.avatar-fallback {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  
  background-color: var(--mat-primary);
  color: white;
  
  font-size: 14px;
  font-weight: 600;
}

.account-name {
  max-width: 120px;
  
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  
  font-size: 14px;
  font-weight: 500;
}

.dropdown-icon {
  font-size: 20px;
  width: 20px;
  height: 20px;
}

// Menu Styles
.account-menu {
  min-width: 280px;
}

.user-info {
  padding: 16px;
  
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar,
.user-avatar-fallback {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  flex-shrink: 0;
}

.user-avatar-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  
  background-color: var(--mat-primary);
  color: white;
  
  font-size: 20px;
  font-weight: 600;
}

.user-details {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 16px;
  font-weight: 600;
  
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-email {
  font-size: 14px;
  color: var(--mat-text-secondary);
  
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// 響應式: Mobile
@media (max-width: 767px) {
  .account-name {
    display: none; // 隱藏名稱,只顯示頭像
  }
}
```

## ✅ 實施步驟

### Step 1: 建立組件目錄結構

```bash
mkdir -p src/app/presentation/layouts/header/components/{workspace-switcher,global-search,account-menu}
```

### Step 2: 建立 Header Component

建立上述所有 Header 相關檔案。

### Step 3: 建立子組件

依序建立 Workspace Switcher、Global Search (簡化版)、Account Menu 組件。

### Step 4: 整合到主布局

在主布局中引入 Header 組件。

### Step 5: 測試響應式行為

測試不同螢幕尺寸下的顯示效果。

## 🧪 測試檢查清單

- [ ] Header 組件建立完成
- [ ] 固定定位運作正常
- [ ] 滾動陰影效果正常
- [ ] Workspace Switcher 運作正常
- [ ] Account Menu 運作正常
- [ ] 通知徽章顯示正常
- [ ] 響應式布局正確
- [ ] 無障礙標籤完整

## 📝 注意事項

1. **固定定位**: 使用 `position: fixed` 確保 Header 始終在頂部
2. **Z-index**: 設定適當的 z-index 確保不被其他元素遮擋
3. **響應式**: 移動端隱藏部分元素以節省空間
4. **無障礙**: 為所有互動元素添加 aria-label
5. **效能**: 避免在滾動事件中執行昂貴的操作

---

**完成此步驟後,請繼續 `05-SIDEBAR.md`**
