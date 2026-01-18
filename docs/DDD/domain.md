# Domain Layer 檔案樹結構

> **術語說明**: 請參考 [專業術語對照表 (GLOSSARY.md)](./GLOSSARY.md) 了解本文件使用的標準術語。

根據您的多工作區團隊協作系統架構,以下是 `src/app/domain` 的完整檔案樹:

```
src/app/domain/
│
├── shared/                                    # 共享領域概念
│   ├── value-objects/                        # 值物件
│   │   ├── id.value-object.ts               # 通用 ID 值物件
│   │   ├── email.value-object.ts            # Email 值物件
│   │   ├── slug.value-object.ts             # Slug 值物件
│   │   ├── timestamp.value-object.ts        # 時間戳值物件
│   │   └── index.ts
│   │
│   ├── enums/                                # 列舉
│   │   ├── lifecycle-status.enum.ts         # 生命週期狀態
│   │   ├── index.ts
│   │   └── types.ts
│   │
│   ├── interfaces/                           # 共享介面
│   │   ├── identifiable.interface.ts        # 可識別介面
│   │   ├── auditable.interface.ts           # 可審計介面
│   │   ├── versionable.interface.ts         # 可版本化介面
│   │   └── index.ts
│   │
│   └── errors/                               # 領域錯誤
│       ├── domain.error.ts                   # 基礎領域錯誤
│       ├── validation.error.ts              # 驗證錯誤
│       ├── authorization.error.ts           # 授權錯誤
│       └── index.ts
│
├── account/                                   # Account 身份層領域
│   ├── entities/                             # 實體
│   │   ├── account.entity.ts                # Account 實體基類
│   │   ├── user.entity.ts                   # User 實體
│   │   ├── organization.entity.ts           # Organization 實體
│   │   ├── bot.entity.ts                    # Bot 實體
│   │   ├── sub-unit.entity.ts               # SubUnit 實體基類
│   │   ├── team.entity.ts                   # Team 實體
│   │   ├── partner.entity.ts                # Partner 實體
│   │   └── index.ts
│   │
│   ├── value-objects/                        # 值物件
│   │   ├── account-id.value-object.ts       # AccountId
│   │   ├── profile.value-object.ts          # Profile
│   │   ├── preferences.value-object.ts      # Preferences
│   │   ├── domain.value-object.ts           # Domain
│   │   ├── branding.value-object.ts         # Branding
│   │   ├── api-key.value-object.ts          # ApiKey
│   │   └── index.ts
│   │
│   ├── enums/                                # 列舉
│   │   ├── account-type.enum.ts             # AccountType
│   │   └── index.ts
│   │
│   └── index.ts
│
├── workspace-membership/                      # 工作區成員關係領域
│   ├── entities/                             # 實體
│   │   ├── workspace-membership.entity.ts   # WorkspaceMembership 實體
│   │   └── index.ts
│   │
│   ├── value-objects/                        # 值物件
│   │   ├── membership-id.value-object.ts    # MembershipId
│   │   ├── permissions.value-object.ts      # Permissions
│   │   └── index.ts
│   │
│   ├── enums/                                # 列舉
│   │   ├── membership-role.enum.ts          # MembershipRole
│   │   ├── membership-status.enum.ts        # MembershipStatus
│   │   └── index.ts
│   │
│   └── index.ts
│
├── workspace/                                 # Workspace 工作區層領域
│   ├── entities/                             # 實體
│   │   ├── workspace.entity.ts              # Workspace 實體
│   │   └── index.ts
│   │
│   ├── value-objects/                        # 值物件
│   │   ├── workspace-id.value-object.ts     # WorkspaceId
│   │   ├── workspace-identity.value-object.ts # WorkspaceIdentity
│   │   ├── workspace-quota.value-object.ts  # WorkspaceQuota
│   │   └── index.ts
│   │
│   ├── enums/                                # 列舉
│   │   ├── workspace-type.enum.ts           # WorkspaceType
│   │   ├── workspace-lifecycle.enum.ts      # WorkspaceLifecycle
│   │   └── index.ts
│   │
│   ├── aggregates/                           # 聚合根
│   │   ├── workspace.aggregate.ts           # Workspace 聚合
│   │   └── index.ts
│   │
│   └── index.ts
│
├── modules/                                   # Module 功能模組層領域
│   ├── shared/                               # 模組共享
│   │   ├── enums/
│   │   │   ├── module-type.enum.ts          # ModuleType (overview | documents | tasks...)
│   │   │   ├── module-visibility.enum.ts    # ModuleVisibility
│   │   │   └── index.ts
│   │   │
│   │   ├── value-objects/
│   │   │   ├── module-id.value-object.ts    # ModuleId
│   │   │   ├── module-permission.value-object.ts # ModulePermission
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts
│   │
│   ├── overview/                             # Overview 模組
│   │   ├── entities/
│   │   │   ├── dashboard.entity.ts          # Dashboard 實體
│   │   │   └── index.ts
│   │   │
│   │   ├── value-objects/
│   │   │   ├── health-status.value-object.ts
│   │   │   ├── usage-stats.value-object.ts
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts
│   │
│   ├── documents/                            # Documents 模組
│   │   ├── entities/
│   │   │   ├── document.entity.ts           # Document 實體
│   │   │   ├── folder.entity.ts             # Folder 實體
│   │   │   ├── document-version.entity.ts   # DocumentVersion 實體
│   │   │   └── index.ts
│   │   │
│   │   ├── value-objects/
│   │   │   ├── document-id.value-object.ts
│   │   │   ├── folder-id.value-object.ts
│   │   │   ├── file-metadata.value-object.ts
│   │   │   ├── sharing-settings.value-object.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── enums/
│   │   │   ├── document-type.enum.ts
│   │   │   ├── sharing-level.enum.ts
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts
│   │
│   ├── tasks/                                # Tasks 模組
│   │   ├── entities/
│   │   │   ├── task.entity.ts               # Task 實體
│   │   │   ├── subtask.entity.ts            # Subtask 實體
│   │   │   ├── workflow.entity.ts           # Workflow 實體
│   │   │   └── index.ts
│   │   │
│   │   ├── value-objects/
│   │   │   ├── task-id.value-object.ts
│   │   │   ├── assignment.value-object.ts   # Assignment
│   │   │   ├── deadline.value-object.ts     # Deadline
│   │   │   ├── priority.value-object.ts     # Priority
│   │   │   └── index.ts
│   │   │
│   │   ├── enums/
│   │   │   ├── task-status.enum.ts          # TaskStatus
│   │   │   ├── priority-level.enum.ts       # PriorityLevel
│   │   │   └── index.ts
│   │   │
│   │   ├── aggregates/
│   │   │   ├── task.aggregate.ts            # Task 聚合
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts
│   │
│   ├── members/                              # Members 模組
│   │   ├── entities/
│   │   │   ├── member.entity.ts             # Member 實體
│   │   │   ├── invitation.entity.ts         # Invitation 實體
│   │   │   └── index.ts
│   │   │
│   │   ├── value-objects/
│   │   │   ├── member-id.value-object.ts
│   │   │   ├── invitation-link.value-object.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── enums/
│   │   │   ├── invitation-status.enum.ts
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts
│   │
│   ├── permissions/                          # Permissions 模組
│   │   ├── entities/
│   │   │   ├── role.entity.ts               # Role 實體
│   │   │   ├── policy.entity.ts             # Policy 實體
│   │   │   └── index.ts
│   │   │
│   │   ├── value-objects/
│   │   │   ├── role-id.value-object.ts
│   │   │   ├── policy-id.value-object.ts
│   │   │   ├── permission-scope.value-object.ts
│   │   │   ├── permission-override.value-object.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── enums/
│   │   │   ├── permission-action.enum.ts    # Read | Write | Admin | Custom
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts
│   │
│   ├── audit/                                # Audit 模組
│   │   ├── entities/
│   │   │   ├── audit-log.entity.ts          # AuditLog 實體
│   │   │   └── index.ts
│   │   │
│   │   ├── value-objects/
│   │   │   ├── audit-log-id.value-object.ts
│   │   │   ├── audit-metadata.value-object.ts
│   │   │   ├── retention-policy.value-object.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── enums/
│   │   │   ├── audit-event-type.enum.ts
│   │   │   ├── audit-severity.enum.ts
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts
│   │
│   ├── settings/                             # Settings 模組
│   │   ├── entities/
│   │   │   ├── workspace-setting.entity.ts  # WorkspaceSetting 實體
│   │   │   ├── feature-flag.entity.ts       # FeatureFlag 實體
│   │   │   └── index.ts
│   │   │
│   │   ├── value-objects/
│   │   │   ├── setting-id.value-object.ts
│   │   │   ├── integration-config.value-object.ts
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts
│   │
│   ├── journal/                              # Journal 模組
│   │   ├── entities/
│   │   │   ├── journal-entry.entity.ts      # JournalEntry 實體
│   │   │   ├── activity.entity.ts           # Activity 實體
│   │   │   └── index.ts
│   │   │
│   │   ├── value-objects/
│   │   │   ├── journal-entry-id.value-object.ts
│   │   │   ├── activity-metadata.value-object.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── enums/
│   │   │   ├── activity-type.enum.ts
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts
│   │
│   └── index.ts
│
├── events/                                    # 事件系統領域
│   ├── base/                                 # 基礎事件
│   │   ├── domain-event.base.ts             # 領域事件基類
│   │   ├── event-metadata.ts                # 事件元數據
│   │   └── index.ts
│   │
│   ├── account/                              # Account 事件
│   │   ├── account-created.event.ts
│   │   ├── account-updated.event.ts
│   │   ├── account-deleted.event.ts
│   │   └── index.ts
│   │
│   ├── workspace/                            # Workspace 事件
│   │   ├── workspace-created.event.ts
│   │   ├── workspace-updated.event.ts
│   │   ├── workspace-archived.event.ts
│   │   ├── workspace-deleted.event.ts
│   │   ├── member-joined.event.ts
│   │   ├── member-left.event.ts
│   │   ├── ownership-transferred.event.ts
│   │   └── index.ts
│   │
│   ├── tasks/                                # Task 事件
│   │   ├── task-created.event.ts
│   │   ├── task-updated.event.ts
│   │   ├── task-status-changed.event.ts
│   │   ├── task-assigned.event.ts
│   │   ├── task-completed.event.ts
│   │   └── index.ts
│   │
│   ├── documents/                            # Document 事件
│   │   ├── document-created.event.ts
│   │   ├── document-updated.event.ts
│   │   ├── document-shared.event.ts
│   │   ├── document-version-created.event.ts
│   │   └── index.ts
│   │
│   └── index.ts
│
├── commands/                                  # 命令領域
│   ├── base/                                 # 基礎命令
│   │   ├── command.base.ts                  # 命令基類
│   │   ├── command-result.ts                # 命令結果
│   │   └── index.ts
│   │
│   ├── workspace/                            # Workspace 命令
│   │   ├── create-workspace.command.ts
│   │   ├── update-workspace.command.ts
│   │   ├── archive-workspace.command.ts
│   │   ├── invite-member.command.ts
│   │   └── index.ts
│   │
│   ├── tasks/                                # Task 命令
│   │   ├── create-task.command.ts
│   │   ├── update-task.command.ts
│   │   ├── assign-task.command.ts
│   │   ├── complete-task.command.ts
│   │   └── index.ts
│   │
│   ├── documents/                            # Document 命令
│   │   ├── create-document.command.ts
│   │   ├── update-document.command.ts
│   │   ├── share-document.command.ts
│   │   └── index.ts
│   │
│   └── index.ts
│
├── queries/                                   # 查詢領域
│   ├── base/                                 # 基礎查詢
│   │   ├── query.base.ts                    # 查詢基類
│   │   ├── query-result.ts                  # 查詢結果
│   │   ├── pagination.ts                    # 分頁
│   │   └── index.ts
│   │
│   ├── workspace/                            # Workspace 查詢
│   │   ├── get-workspace.query.ts
│   │   ├── list-workspaces.query.ts
│   │   ├── get-workspace-members.query.ts
│   │   └── index.ts
│   │
│   ├── tasks/                                # Task 查詢
│   │   ├── get-task.query.ts
│   │   ├── list-tasks.query.ts
│   │   ├── get-task-by-status.query.ts
│   │   └── index.ts
│   │
│   └── index.ts
│
├── repositories/                              # 儲存庫介面
│   ├── account.repository.interface.ts
│   ├── workspace.repository.interface.ts
│   ├── workspace-membership.repository.interface.ts
│   ├── task.repository.interface.ts
│   ├── document.repository.interface.ts
│   ├── audit-log.repository.interface.ts
│   └── index.ts
│
├── services/                                  # 領域服務介面
│   ├── workspace-guard.service.interface.ts  # WorkspaceGuard
│   ├── permission-checker.service.interface.ts # PermissionChecker
│   ├── quota-enforcer.service.interface.ts   # QuotaEnforcer
│   └── index.ts
│
└── index.ts                                   # Domain 層總匯出

```

## 關鍵設計原則

### 1. 值物件 (Value Objects)
- **不可變性**: 所有值物件都是不可變的
- **相等性**: 基於值相等,不是引用相等
- **驗證**: 在建構時進行驗證
- **無副作用**: 純函數,無副作用

### 2. 實體 (Entities)
- **身份識別**: 有唯一 ID
- **生命週期**: 有明確的生命週期
- **業務邏輯**: 封裝業務規則
- **不可變性**: 盡可能保持不可變,變更透過方法

### 3. 聚合 (Aggregates)
- **一致性邊界**: 確保一致性的邊界
- **根實體**: 對外的唯一入口
- **交易邊界**: 一個交易單位
- **不變量**: 維護業務不變量

### 4. 領域事件 (Domain Events)
- **過去式命名**: 表示已發生的事實
- **不可變**: 事件一旦產生就不可變
- **元數據**: 包含完整的追蹤資訊
- **WorkspaceScoped**: 包含 workspaceId

### 5. 命令 (Commands)
- **意圖表達**: 表達使用者意圖
- **驗證**: 包含基本驗證
- **上下文**: 包含 WorkspaceContext
- **授權檢查**: 在執行前檢查權限

### 6. 查詢 (Queries)
- **讀取模型**: 專注於讀取
- **投影**: 只返回需要的數據
- **WorkspaceFiltered**: 自動過濾 Workspace
- **分頁**: 支援分頁和排序

## 檔案命名規範

- **實體**: `{name}.entity.ts` (例: `workspace.entity.ts`)
- **值物件**: `{name}.value-object.ts` (例: `workspace-id.value-object.ts`)
- **聚合**: `{name}.aggregate.ts` (例: `workspace.aggregate.ts`)
- **事件**: `{name}.event.ts` (例: `workspace-created.event.ts`)
- **命令**: `{action}-{entity}.command.ts` (例: `create-workspace.command.ts`)
- **查詢**: `{action}-{entity}.query.ts` (例: `get-workspace.query.ts`)
- **列舉**: `{name}.enum.ts` (例: `workspace-type.enum.ts`)
- **介面**: `{name}.interface.ts` (例: `workspace.repository.interface.ts`)
- **錯誤**: `{name}.error.ts` (例: `domain.error.ts`)

## TypeScript 類型安全

所有領域物件都應該:
1. 使用嚴格的 TypeScript 類型
2. 避免 `any` 類型
3. 使用 `readonly` 確保不可變性
4. 使用 Type Guards 進行類型檢查
5. 使用 Branded Types 增強類型安全

## 與 NgRx Signals 整合

- **領域模型 ≠ Store State**: 領域模型是純業務邏輯,Store State 是應用狀態
- **轉換層**: 在 Store 與 Domain 之間需要轉換層
- **領域事件 → Effects**: 領域事件可觸發 NgRx Effects
- **Commands → Methods**: Store Methods 可以執行 Commands
- **Queries → Computed**: Computed Signals 可以執行 Queries

## 依賴方向

```
Presentation Layer (Components)
        ↓
Application Layer (Stores, Effects)
        ↓
Domain Layer (Entities, Value Objects, Events, Commands)
        ↓
Infrastructure Layer (Firebase, Repositories)
```

領域層不依賴任何外部層,保持純粹的業務邏輯。