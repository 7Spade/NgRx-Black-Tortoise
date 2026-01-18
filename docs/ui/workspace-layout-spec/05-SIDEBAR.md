# 05 - 側邊欄導航組件 (Sidebar)

## 🎯 目標

實現可展開/收合的側邊欄導航,顯示工作區模組列表並支援拖曳排序。

## 📁 文件結構

```
src/app/presentation/layouts/sidebar/
├── sidebar.component.ts
├── sidebar.component.html
├── sidebar.component.scss
├── components/
│   ├── module-item/
│   │   ├── module-item.component.ts
│   │   ├── module-item.component.html
│   │   └── module-item.component.scss
│   └── sidebar-footer/
│       ├── sidebar-footer.component.ts
│       ├── sidebar-footer.component.html
│       └── sidebar-footer.component.scss
└── index.ts
```

## 🎨 視覺規格

### 尺寸規格
- **展開寬度**: 240px (Desktop) / 280px (Mobile)
- **收合寬度**: 64px
- **高度**: `100vh - 64px` (扣除 Header)
- **模組項目高度**: 48px
- **圖標大小**: 20x20px
- **文字大小**: 14px / 500

## 📝 組件實現

### 1. Sidebar Component

**檔案**: `src/app/presentation/layouts/sidebar/sidebar.component.ts`

```typescript
import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

// Material Components
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';

// Stores
import { ModuleStore } from '@/application/store/module/module.store';
import { SidebarStore } from '@/application/store/ui/sidebar.store';
import { WorkspaceStore } from '@/application/store/workspace/workspace.store';
import { AccountStore } from '@/application/store/account/account.store';

// Child Components
import { ModuleItemComponent } from './components/module-item/module-item.component';

/**
 * 側邊欄導航組件
 */
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    DragDropModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatBadgeModule,
    ModuleItemComponent
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  // Stores
  protected moduleStore = inject(ModuleStore);
  protected sidebarStore = inject(SidebarStore);
  protected workspaceStore = inject(WorkspaceStore);
  protected accountStore = inject(AccountStore);
  protected router = inject(Router);

  // 啟用的模組列表
  protected modules = computed(() => this.moduleStore.enabledModules());

  // 側邊欄展開狀態
  protected expanded = computed(() => this.sidebarStore.expanded());

  // 當前工作區 ID
  protected workspaceId = computed(() => this.workspaceStore.currentWorkspaceId());

  // 拖曳模式
  protected isDragging = signal(false);

  /**
   * 切換側邊欄
   */
  protected toggleSidebar(): void {
    this.sidebarStore.toggle();
    // 同時更新帳戶偏好
    this.accountStore.toggleSidebar();
  }

  /**
   * 拖曳排序完成
   */
  protected onDrop(event: CdkDragDrop<any>): void {
    if (event.previousIndex === event.currentIndex) {
      return;
    }

    const modules = [...this.modules()];
    moveItemInArray(modules, event.previousIndex, event.currentIndex);

    // 更新順序
    const orders = modules.map((module, index) => ({
      id: module.id,
      order: index
    }));

    const workspaceId = this.workspaceId();
    if (workspaceId) {
      this.moduleStore.updateModuleOrder({ workspaceId, orders });
    }
  }

  /**
   * 導航到模組
   */
  protected navigateToModule(moduleRoute: string): void {
    const workspaceId = this.workspaceId();
    if (workspaceId) {
      this.router.navigate(['/workspace', workspaceId, moduleRoute]);
    }
  }
}
```

**檔案**: `src/app/presentation/layouts/sidebar/sidebar.component.html`

```html
<aside 
  class="sidebar"
  [class.expanded]="expanded()"
  [class.collapsed]="!expanded()">
  
  <!-- Module List -->
  <nav class="sidebar-nav">
    <mat-nav-list 
      class="module-list"
      cdkDropList
      [cdkDropListDisabled]="!isDragging()"
      (cdkDropListDropped)="onDrop($event)">
      
      @for (module of modules(); track module.id) {
        <div cdkDrag>
          <app-module-item
            [module]="module"
            [expanded]="expanded()"
            [workspaceId]="workspaceId()!"
            (navigate)="navigateToModule(module.route)" />
        </div>
      }
    </mat-nav-list>
  </nav>

  <!-- Sidebar Footer -->
  <div class="sidebar-footer">
    <!-- Collapse/Expand Button -->
    <button
      mat-icon-button
      class="collapse-button"
      (click)="toggleSidebar()"
      [matTooltip]="expanded() ? '收合側邊欄' : '展開側邊欄'"
      matTooltipPosition="right"
      aria-label="切換側邊欄">
      <mat-icon>
        {{ expanded() ? 'chevron_left' : 'chevron_right' }}
      </mat-icon>
    </button>
  </div>
</aside>
```

**檔案**: `src/app/presentation/layouts/sidebar/sidebar.component.scss`

```scss
.sidebar {
  position: fixed;
  left: 0;
  top: 64px; // Header 高度
  bottom: 0;
  
  display: flex;
  flex-direction: column;
  
  background-color: var(--mat-sidenav-container-background-color);
  border-right: 1px solid var(--mat-divider-color);
  
  transition: width 300ms cubic-bezier(0.4, 0, 0.2, 1);
  
  z-index: 100;
  
  &.expanded {
    width: 240px;
  }
  
  &.collapsed {
    width: 64px;
  }
}

// Navigation
.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  
  // Custom scrollbar
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
    
    &:hover {
      background: rgba(0, 0, 0, 0.3);
    }
  }
}

.module-list {
  padding: 8px 0;
  
  ::ng-deep .mat-mdc-list-item {
    height: auto !important;
    padding: 0 !important;
  }
}

// Footer
.sidebar-footer {
  padding: 12px;
  border-top: 1px solid var(--mat-divider-color);
  
  display: flex;
  justify-content: center;
}

.collapse-button {
  width: 40px;
  height: 40px;
}

// 響應式: Mobile
@media (max-width: 767px) {
  .sidebar {
    &.expanded {
      width: 280px;
    }
  }
}
```

### 2. Module Item Component

**檔案**: `src/app/presentation/layouts/sidebar/components/module-item/module-item.component.ts`

```typescript
import { Component, Input, Output, EventEmitter, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

// Material Components
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';

// Domain
import { Module } from '@/domain/entities/module.entity';

/**
 * 模組項目組件
 */
@Component({
  selector: 'app-module-item',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatListModule,
    MatIconModule,
    MatRippleModule,
    MatTooltipModule,
    MatBadgeModule
  ],
  templateUrl: './module-item.component.html',
  styleUrls: ['./module-item.component.scss']
})
export class ModuleItemComponent {
  @Input({ required: true }) module!: Module;
  @Input({ required: true }) expanded!: boolean;
  @Input({ required: true }) workspaceId!: string;
  
  @Output() navigate = new EventEmitter<void>();

  // 路由路徑
  protected routePath = computed(() => 
    `/workspace/${this.workspaceId}/${this.module.route}`
  );

  // 是否有徽章
  protected hasBadge = computed(() => 
    this.module.badge && this.module.badge.count && this.module.badge.count > 0
  );

  // 徽章數量
  protected badgeCount = computed(() => 
    this.module.badge?.count ?? 0
  );

  /**
   * 點擊處理
   */
  protected handleClick(): void {
    this.navigate.emit();
  }
}
```

**檔案**: `src/app/presentation/layouts/sidebar/components/module-item/module-item.component.html`

```html
<a
  [routerLink]="routePath()"
  routerLinkActive="active"
  class="module-item"
  [class.expanded]="expanded"
  [class.collapsed]="!expanded"
  [matTooltip]="expanded ? '' : module.name"
  matTooltipPosition="right"
  matRipple
  (click)="handleClick()">
  
  <!-- Icon -->
  <mat-icon 
    class="module-icon"
    [matBadge]="badgeCount()"
    [matBadgeHidden]="!hasBadge()"
    matBadgeColor="warn"
    matBadgeSize="small"
    [matBadgePosition]="expanded ? 'after' : 'above after'">
    {{ module.icon }}
  </mat-icon>
  
  <!-- Name (只在展開時顯示) -->
  @if (expanded) {
    <span class="module-name">{{ module.name }}</span>
  }
  
  <!-- Badge (展開時顯示文字徽章) -->
  @if (expanded && hasBadge()) {
    <span class="module-badge">{{ badgeCount() }}</span>
  }
</a>
```

**檔案**: `src/app/presentation/layouts/sidebar/components/module-item/module-item.component.scss`

```scss
.module-item {
  display: flex;
  align-items: center;
  gap: 12px;
  
  height: 48px;
  padding: 0 16px;
  
  text-decoration: none;
  color: var(--mat-text-primary);
  
  border-left: 3px solid transparent;
  
  cursor: pointer;
  user-select: none;
  
  transition: all 200ms ease;
  
  // Hover 狀態
  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
    color: var(--mat-text-primary);
  }
  
  // Active 狀態
  &.active {
    background-color: rgba(var(--mat-primary-rgb), 0.08);
    color: var(--mat-primary);
    border-left-color: var(--mat-primary);
    
    .module-icon {
      color: var(--mat-primary);
    }
    
    .module-name {
      font-weight: 600;
    }
  }
  
  // Collapsed 狀態
  &.collapsed {
    justify-content: center;
    padding: 0 12px;
  }
}

.module-icon {
  font-size: 20px;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  
  color: rgba(0, 0, 0, 0.6);
  
  transition: color 200ms ease;
}

.module-name {
  flex: 1;
  min-width: 0;
  
  font-size: 14px;
  font-weight: 500;
  
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.module-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  
  background-color: var(--mat-warn);
  color: white;
  
  font-size: 11px;
  font-weight: 600;
  
  border-radius: 10px;
}

// Dark Mode
@media (prefers-color-scheme: dark) {
  .module-item {
    &:hover {
      background-color: rgba(255, 255, 255, 0.08);
    }
  }
  
  .module-icon {
    color: rgba(255, 255, 255, 0.7);
  }
}
```

## 📱 響應式行為

### Mobile Sidebar

**檔案**: `src/app/presentation/layouts/sidebar/sidebar-mobile.component.ts`

```typescript
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

// Material Components
import { MatSidenavModule } from '@angular/material/sidenav';

// Stores
import { SidebarStore } from '@/application/store/ui/sidebar.store';

// Components
import { SidebarComponent } from './sidebar.component';

/**
 * 移動端側邊欄 (Drawer 模式)
 */
@Component({
  selector: 'app-sidebar-mobile',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    SidebarComponent
  ],
  template: `
    <mat-drawer
      mode="over"
      [opened]="sidebarStore.mobileOpen()"
      (closedStart)="sidebarStore.closeMobile()">
      <app-sidebar />
    </mat-drawer>
  `,
  styles: [`
    mat-drawer {
      width: 280px;
    }
  `]
})
export class SidebarMobileComponent {
  protected sidebarStore = inject(SidebarStore);
}
```

## 🎯 拖曳排序功能

### 啟用拖曳模式

在 Sidebar Component 中添加:

```typescript
/**
 * 啟用拖曳模式 (長按 1 秒)
 */
protected enableDragMode(event: MouseEvent | TouchEvent): void {
  event.preventDefault();
  
  const timer = setTimeout(() => {
    this.isDragging.set(true);
  }, 1000);
  
  const cleanup = () => {
    clearTimeout(timer);
    document.removeEventListener('mouseup', cleanup);
    document.removeEventListener('touchend', cleanup);
  };
  
  document.addEventListener('mouseup', cleanup);
  document.addEventListener('touchend', cleanup);
}

/**
 * 停用拖曳模式
 */
protected disableDragMode(): void {
  this.isDragging.set(false);
}
```

## ✅ 實施步驟

### Step 1: 安裝 CDK

```bash
yarn add @angular/cdk
```

### Step 2: 建立組件目錄結構

```bash
mkdir -p src/app/presentation/layouts/sidebar/components/{module-item,sidebar-footer}
```

### Step 3: 建立 Sidebar Component

建立上述所有 Sidebar 相關檔案。

### Step 4: 建立 Module Item Component

建立模組項目組件。

### Step 5: 整合到主布局

在主布局中引入 Sidebar 組件。

### Step 6: 測試拖曳功能

測試模組拖曳排序功能。

## 🧪 測試檢查清單

- [ ] Sidebar 組件建立完成
- [ ] 展開/收合動畫流暢
- [ ] Module Item 顯示正常
- [ ] 路由高亮運作正常
- [ ] 徽章顯示正常
- [ ] 拖曳排序運作正常
- [ ] 響應式行為正確
- [ ] 無障礙標籤完整

## 📝 注意事項

1. **動畫效能**: 使用 CSS transform 而非 width 來提升動畫效能
2. **滾動行為**: 為長列表添加自訂滾動條樣式
3. **拖曳體驗**: 提供視覺回饋指示可拖曳狀態
4. **持久化**: 保存用戶的展開/收合偏好
5. **鍵盤導航**: 支援 Tab 鍵導航和 Enter 鍵選擇

---

**完成此步驟後,請繼續 `06-MAIN-CONTENT-AREA.md`**
