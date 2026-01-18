# 工作區布局專案架構說明

## 📁 專案結構

本專案採用 **Domain-Driven Design (DDD)** 架構,並配合 Angular 20+ 最佳實踐。

```
src/
├── app/
│   ├── application/           # 應用層:Stores 與應用服務
│   │   ├── store/           # NgRx Signals Stores
│   │   ├── services/        # 應用服務
│   │   └── guards/          # 路由守衛
│   │
│   ├── domain/              # 領域層:核心業務邏輯
│   │   ├── {entity}/        # 各領域實體 (account, workspace, etc.)
│   │   │   └── entities/    # 領域實體定義
│   │   ├── repositories/    # 倉儲介面
│   │   └── services/        # 領域服務介面
│   │
│   ├── infrastructure/      # 基礎設施層:技術實現
│   │   ├── {entity}/        # 各領域服務實作
│   │   │   └── services/    # 服務實作
│   │   ├── firebase/        # Firebase 整合
│   │   ├── auth/            # 認證服務
│   │   └── interceptors/    # HTTP 攔截器
│   │
│   ├── presentation/         # 展示層:UI 組件
│   │   ├── layouts/          # 布局組件
│   │   ├── features/         # 功能模組組件
│   │   ├── components/       # 共用展示組件
│   │   └── directives/       # 自定義指令
│   │
│   └── shared/               # 共享層:跨層共用資源
│       ├── models/           # 共用模型
│       ├── constants/        # 常量定義
│       ├── utils/            # 工具函式
│       ├── pipes/            # 自定義管道
│       └── types/            # TypeScript 類型定義
│
├── assets/                   # 靜態資源
└── environments/             # 環境配置
```

## 🎯 開發步驟文件清單

### 階段 1: 基礎設施與領域層
1. **01-DOMAIN-MODELS.md** - 領域模型與實體定義
2. **02-STATE-MANAGEMENT.md** - 狀態管理架構設計
3. **03-FIREBASE-INTEGRATION.md** - Firebase 整合配置

### 階段 2: 核心布局組件
4. **04-GLOBAL-HEADER.md** - 全局標頭組件
5. **05-SIDEBAR.md** - 側邊欄導航組件
6. **06-MAIN-CONTENT-AREA.md** - 主內容區域組件

### 階段 3: 功能模組
7. **07-WORKSPACE-SWITCHER.md** - 工作區切換器
8. **08-GLOBAL-SEARCH.md** - 全局搜尋功能
9. **09-NOTIFICATION-CENTER.md** - 通知中心

### 階段 4: 模組內容頁面
10. **10-OVERVIEW-MODULE.md** - 總覽模組
11. **11-DOCUMENTS-MODULE.md** - 文件管理模組
12. **12-TASKS-MODULE.md** - 任務管理模組
13. **13-MEMBERS-MODULE.md** - 成員管理模組
14. **14-OTHER-MODULES.md** - 其他輔助模組

### 階段 5: 進階功能與優化
15. **15-RESPONSIVE-DESIGN.md** - 響應式設計實現
16. **16-ACCESSIBILITY.md** - 無障礙功能實現
17. **17-PERFORMANCE-OPTIMIZATION.md** - 效能優化策略
18. **18-TESTING-STRATEGY.md** - 測試策略與實踐

## 🛠 技術棧

- **框架**: Angular 20.3.x
- **語言**: TypeScript 5.9.x
- **狀態管理**: @ngrx/signals
- **UI 框架**: Angular Material CDK + Material Design 3
- **後端**: Firebase (Firestore, Auth, Storage)
- **套件管理**: yarn
- **程式碼品質**: ESLint 9.x + Prettier

## 📋 開發原則

### Angular 20+ 新特性
- ✅ **使用新控制流語法**: `@if`, `@for`, `@switch`, `@defer`
- ✅ **使用 Signals**: `signal()`, `computed()`, `effect()`
- ✅ **使用 Standalone Components**: 不使用 NgModule
- ✅ **使用 inject()**: 在建構函式中注入依賴
- ❌ **禁止舊語法**: `*ngIf`, `*ngFor`, `*ngSwitch`

### 程式碼品質
- 遵循 **單一職責原則 (SRP)**
- 遵循 **開放封閉原則 (OCP)**
- 使用 **依賴注入 (DI)** 進行解耦
- 編寫 **類型安全** 的 TypeScript 程式碼
- 保持組件 **輕量化**,邏輯移至服務層

### 命名規範
- **Components**: `feature-name.component.ts`
- **Services**: `feature-name.service.ts`
- **Signals**: `featureNameSignal`
- **Constants**: `FEATURE_NAME_CONSTANT`
- **Interfaces**: `IFeatureName` 或 `FeatureName`

## 🚀 使用說明

### 安裝依賴
```bash
yarn install
```

### 開發伺服器
```bash
yarn start
# 或
ng serve
```

### 建置專案
```bash
yarn build
# 或
ng build
```

### 執行測試
```bash
yarn test
# 或
ng test
```

### 程式碼檢查
```bash
yarn lint
# 或
ng lint
```

## 📝 注意事項

1. **按順序實施**: 請按照文件編號順序進行開發
2. **完整測試**: 每個階段完成後進行功能測試
3. **程式碼審查**: 重要功能實現後進行 Code Review
4. **文件更新**: 如有變更請及時更新相關文件
5. **Git 提交**: 保持提交訊息清晰,遵循 Conventional Commits 規範

## 🔗 相關資源

- [Angular 官方文檔](https://angular.dev/)
- [Angular Material](https://material.angular.io/)
- [Firebase 文檔](https://firebase.google.com/docs)
- [NgRx Signals](https://ngrx.io/guide/signals)
- [TypeScript 手冊](https://www.typescriptlang.org/docs/)

---

**準備好了嗎?讓我們從 `01-DOMAIN-MODELS.md` 開始吧! 🎉**
