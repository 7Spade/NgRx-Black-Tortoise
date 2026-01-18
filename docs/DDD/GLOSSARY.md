# 專業術語對照表 (Terminology Glossary)

本文件定義專案中使用的專業術語,避免同義混用,確保團隊溝通一致性。

## 架構層級術語 (Architecture Layers)

| 中文 | 英文 | 標準檔案路徑 | 說明 |
|------|------|--------------|------|
| 領域層 | Domain Layer | `src/app/domain/` | 核心業務邏輯層,包含實體、值物件、聚合等 |
| 應用層 | Application Layer | `src/app/application/` | 協調層,包含 Store、Command、Query 等 |
| 基礎設施層 | Infrastructure Layer | `src/app/infrastructure/` | 外部系統整合層,包含 Repository 實作、Firebase 等 |
| 展示層 / 介面層 | Presentation Layer / Interface Layer | `src/app/presentation/` | UI 層,包含 Angular 元件 |
| 共享層 | Shared Layer | `src/app/shared/` | 跨層共享的工具、元件等 |

## DDD 核心術語 (DDD Core Concepts)

| 中文 | 英文 | 檔案後綴 | 說明 |
|------|------|---------|------|
| 實體 | Entity | `.entity.ts` | 具有唯一識別的領域物件 |
| 值物件 | Value Object | `.value-object.ts` | 不可變的領域物件,無唯一識別 |
| 聚合 | Aggregate | `.aggregate.ts` | 一致性邊界,包含實體和值物件 |
| 聚合根 | Aggregate Root | `.aggregate.ts` | 聚合的根實體,對外的唯一入口 |
| 領域事件 | Domain Event | `.event.ts` | 業務重要的狀態變更 |
| 領域服務 | Domain Service | `.service.ts` (在 domain 層) | 不屬於實體或值物件的業務邏輯 |
| 儲存庫 (介面) | Repository (Interface) | `.repository.interface.ts` | 資料持久化契約 (定義於 domain) |
| 儲存庫 (實作) | Repository (Implementation) | `-firestore.repository.ts` | 資料持久化實作 (定義於 infrastructure) |
| 工廠 | Factory | `.factory.ts` | 負責建立複雜物件 |
| 規格 | Specification | `.specification.ts` | 封裝業務規則的查詢條件 |

## 應用層術語 (Application Layer Concepts)

| 中文 | 英文 | 檔案後綴 | 說明 |
|------|------|---------|------|
| Store (狀態管理) | Store | `.store.ts` | NgRx Signals Store,管理應用狀態 |
| 命令 | Command | `.command.ts` | 寫入操作的請求物件 |
| 查詢 | Query | `.query.ts` | 讀取操作的請求物件 |
| 命令處理器 | Command Handler | `.handler.ts` | 處理命令的邏輯 |
| 查詢處理器 | Query Handler | `.handler.ts` | 處理查詢的邏輯 |
| 資料傳輸物件 | DTO (Data Transfer Object) | `.dto.ts` | 跨層傳輸的資料結構 |
| 映射器 | Mapper | `.mapper.ts` | 資料格式轉換 (Domain ↔ DTO) |
| 效應 | Effect | `.effect.ts` | 副作用處理 (rxMethod) |
| 應用服務 | Application Service | `.service.ts` (在 application 層) | 協調領域邏輯和基礎設施 |

## 基礎設施層術語 (Infrastructure Layer Concepts)

| 中文 | 英文 | 檔案後綴 / 位置 | 說明 |
|------|------|----------------|------|
| Firestore 儲存庫 | Firestore Repository | `-firestore.repository.ts` | Firestore 的儲存庫實作 |
| Firestore 轉換器 | Firestore Converter | `.firestore-converter.ts` | Firestore Document ↔ Domain Entity |
| Firebase DTO | Firebase DTO | `-firebase.dto.ts` | Firebase 使用的資料結構 |
| 查詢建構器 | Query Builder | `-query.builder.ts` | 建構 Firestore 查詢 |
| 事件儲存 | Event Store | `event-store.service.ts` | 儲存領域事件的服務 |
| 事件匯流排 | Event Bus | `event-bus.service.ts` | 發布/訂閱領域事件 |

## 狀態管理術語 (State Management with NgRx Signals)

| 中文 | 英文 | 說明 |
|------|------|------|
| 信號 | Signal | 響應式的狀態值 (`signal()`) |
| 計算信號 | Computed Signal | 衍生狀態 (`computed()`) |
| 效應 | Effect | 副作用處理 (`effect()` 或 `rxMethod()`) |
| 修補狀態 | Patch State | 更新狀態的方法 (`patchState()`) |
| 信號 Store | Signal Store | 使用 `signalStore()` 建立的狀態容器 |
| 全域殼層 | Global Shell | Root 層級的全域狀態 (Auth, Config, Layout) |
| 工作區列表 | Workspace List | 帳號層級的工作區列表狀態 |
| 工作區 / 上下文 Store | Workspace / Context Store | 當前工作區的狀態 |
| 功能 Store | Feature Store | 模組層級的狀態 (Tasks, Documents) |
| 實體 Store | Entity Store | 實體層級的正規化快取 |

## 工作區架構術語 (Workspace Architecture)

| 中文 | 英文 | 說明 |
|------|------|------|
| 帳號 | Account | 使用者帳號 |
| 使用者 | User | 使用者 (Firebase Auth) |
| 組織 | Organization | 組織實體 |
| 工作區 | Workspace | 協作空間 |
| 工作區成員 | Workspace Member | 工作區中的成員 |
| 工作區擁有者 | Workspace Owner | 工作區的擁有者 |
| 工作區類型 | Workspace Type | 個人 (Personal) / 團隊 (Team) / 企業 (Enterprise) |
| 工作區生命週期 | Workspace Lifecycle | Active / Archived / Suspended |
| 模組 | Module | 工作區中的功能模組 (Tasks, Documents 等) |
| 模組權限 | Module Permission | 模組的存取權限 (Read, Write, Admin) |
| 配額 | Quota | 工作區的使用限制 |

## 常見同義詞對照 (Common Synonyms)

以下是常見的同義詞,請統一使用**標準用法**:

| 標準用法 | 避免使用 | 說明 |
|---------|---------|------|
| Store | State, 狀態管理器 | 使用 Store 統一稱呼 |
| Entity | 領域物件, Domain Object | 使用 Entity 稱呼具有 ID 的物件 |
| Value Object | 值類型, 數值物件 | 使用 Value Object 稱呼不可變物件 |
| Repository | 資料存取層, DAO | 使用 Repository 統一稱呼 |
| Command | 指令, 動作 | 使用 Command 統一稱呼寫入操作 |
| Query | 查詢請求 | 使用 Query 統一稱呼讀取操作 |
| DTO | 傳輸物件, Transfer Object | 使用 DTO 統一稱呼 |
| Mapper | 轉換器, Converter | 使用 Mapper (應用層),Converter (基礎設施層) 區分 |
| Event | 事件, Message | 使用 Event 統一稱呼 |
| Effect | 副作用, Side Effect | 使用 Effect 統一稱呼 |

## 檔案命名規範 (File Naming Conventions)

### Domain Layer

```
workspace.entity.ts              ✓ 實體
workspace-id.value-object.ts     ✓ 值物件
workspace.aggregate.ts           ✓ 聚合
workspace-created.event.ts       ✓ 事件
workspace-type.enum.ts           ✓ 列舉
workspace.repository.interface.ts ✓ 儲存庫介面
```

### Application Layer

```
workspace.store.ts               ✓ Store
workspace.models.ts              ✓ Store Models
create-workspace.command.ts      ✓ 命令
get-workspace.query.ts           ✓ 查詢
create-workspace.handler.ts      ✓ 命令處理器
workspace-to-dto.mapper.ts       ✓ 映射器
```

### Infrastructure Layer

```
workspace-firestore.repository.ts     ✓ Firestore 儲存庫
workspace.firestore-converter.ts      ✓ Firestore 轉換器
workspace-firebase.dto.ts             ✓ Firebase DTO
workspace-query.builder.ts            ✓ 查詢建構器
workspace-guard-impl.service.ts       ✓ 領域服務實作
```

### Presentation Layer

```
workspace-list.component.ts      ✓ 元件
workspace-detail-page.component.ts ✓ 頁面元件
workspace-layout.component.ts    ✓ 布局元件
```

### Shared Layer

```
avatar.component.ts              ✓ 共享元件
has-permission.directive.ts      ✓ 指令
date-ago.pipe.ts                 ✓ 管道
dialog.service.ts                ✓ 服務
array.utils.ts                   ✓ 工具函數
```

## 層級相依性規則 (Layer Dependency Rules)

```
✓ 允許的相依性:
  Presentation → Application
  Presentation → Shared
  
  Application → Domain
  Application → Shared
  
  Infrastructure → Domain
  Infrastructure → Shared
  
  Domain → (nothing)
  Shared → (nothing)

✗ 禁止的相依性:
  Domain → Application
  Domain → Infrastructure
  Domain → Presentation
  
  Infrastructure → Application
  Infrastructure → Presentation
  
  Application → Infrastructure (直接)
```

## 專案特定術語 (Project-Specific Terms)

| 中文 | 英文 | 說明 |
|------|------|------|
| 身份切換器 | Identity Switcher | 使用者身份切換 UI 元件 |
| 工作區切換器 | Workspace Switcher | 工作區切換 UI 元件 |
| 全域標頭 | Global Header | 應用程式頂部導航列 |
| 側邊欄 | Sidebar | 應用程式側邊導航 |
| 命令面板 | Command Palette | 快捷命令介面 |
| 稽核日誌 | Audit Log | 操作記錄 |
| 日誌 | Journal | 工作日誌模組 |

## 技術術語 (Technical Terms)

| 中文 | 英文 | 說明 |
|------|------|------|
| 純響應式架構 | Pure Reactive Architecture | 使用 Angular Signals 的響應式架構 |
| 樂觀更新 | Optimistic Update | 先更新 UI,再同步後端 |
| 事件溯源 | Event Sourcing | 透過事件重建狀態 |
| CQRS | Command Query Responsibility Segregation | 命令查詢責任分離 |
| 依賴注入 | Dependency Injection (DI) | Angular 的依賴注入系統 |
| 獨立元件 | Standalone Component | Angular 20 的獨立元件 |
| 變更檢測 | Change Detection | Angular 的變更檢測機制 |
| OnPush 策略 | OnPush Change Detection | 效能優化的變更檢測策略 |

## 使用範例 (Usage Examples)

### 錯誤範例 (Incorrect Usage)

```typescript
// ❌ 同義混用
import { WorkspaceState } from './workspace.state';  // 應使用 Store
import { WorkspaceDAO } from './workspace.dao';      // 應使用 Repository
import { WorkspaceAction } from './workspace.action'; // 應使用 Command

// ❌ 檔案命名不一致
workspace.repo.ts                  // 應使用 workspace-firestore.repository.ts
workspaceConverter.ts              // 應使用 workspace.firestore-converter.ts
WorkspaceDTO.ts                    // 應使用 workspace-firebase.dto.ts
```

### 正確範例 (Correct Usage)

```typescript
// ✓ 統一術語
import { WorkspaceStore } from '@application/store/workspace';
import { IWorkspaceRepository } from '@domain/repositories';
import { CreateWorkspaceCommand } from '@application/commands';

// ✓ 檔案命名一致
workspace-firestore.repository.ts
workspace.firestore-converter.ts
workspace-firebase.dto.ts
```

## 更新記錄 (Change Log)

| 日期 | 版本 | 變更內容 |
|------|------|---------|
| 2026-01-17 | 1.0.0 | 初始版本,建立術語對照表 |

## 相關文件 (Related Documents)

- [專案結構與命名規範](./.github/instructions/project-structure.instructions.md)
- [領域層架構](./domain.md)
- [應用層架構](./application.md)
- [基礎設施層架構](./infrastructure.md)
- [共享層架構](./shared.md)
- [PRD 產品需求文件](../prd.md)

## 術語提交流程 (Term Submission Process)

如發現新術語或需要更新術語定義:

1. 在團隊會議中討論並達成共識
2. 提交 Pull Request 更新此文件
3. 經團隊 Review 後合併
4. 更新相關文件中的術語使用

## 聯絡方式 (Contact)

如有術語相關疑問,請聯繫:
- 架構負責人: [待補充]
- 團隊 Slack 頻道: #architecture
