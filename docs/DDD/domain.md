# Domain Layer 檔案樹結構

> **術語說明**: 請參考 [專業術語對照表 (GLOSSARY.md)](./GLOSSARY.md) 了解本文件使用的標準術語。

## 🎯 RULE OF THUMB
```
If it can authenticate → Identity
If it only groups users → Membership  
Team/Partner NEVER authenticate
```

### Identity Layer: user, organization, bot
**⚠️ EXPLICIT EXCLUSION:** NO Team/Partner

### Membership Layer: team, partner (NON-identity)

### 🚫 Forbidden
```typescript
// ❌ WRONG
type IdentityType = 'user' | 'organization' | 'bot' | 'team' | 'partner';
```

---

根據您的多工作區團隊協作系統架構,以下是 `src/app/domain` 的完整檔案樹:

```
src/app/domain/
│
├── shared/
│   ├── value-objects/
│   │   ├── id.value-object.ts
│   │   ├── email.value-object.ts
│   │   ├── slug.value-object.ts
│   │   ├── timestamp.value-object.ts
│   │   └── index.ts
│   │
│   ├── enums/
│   │   ├── lifecycle-status.enum.ts
│   │   └── index.ts
│   │
│   ├── interfaces/
│   │   ├── identifiable.interface.ts
│   │   ├── auditable.interface.ts
│   │   ├── versionable.interface.ts
│   │   └── index.ts
│   │
│   └── errors/
│       ├── domain.error.ts
│       ├── validation.error.ts
│       ├── authorization.error.ts
│       └── index.ts
│
├── identity/                                # Identity = 可驗證 / 可登入
│   ├── entities/
│   │   ├── user.entity.ts
│   │   ├── organization.entity.ts
│   │   ├── bot.entity.ts
│   │   └── index.ts
│   │
│   ├── value-objects/
│   │   ├── identity-id.value-object.ts
│   │   ├── profile.value-object.ts
│   │   ├── preferences.value-object.ts
│   │   ├── domain.value-object.ts
│   │   ├── branding.value-object.ts
│   │   └── index.ts
│   │
│   ├── identity.types.ts                   # 唯一 IdentityType 定義
│   └── index.ts
│
├── membership/                              # NON-identity（只描述關係）
│   ├── entities/
│   │   ├── organization-membership.entity.ts
│   │   ├── team.entity.ts
│   │   ├── partner.entity.ts
│   │   └── index.ts
│   │
│   ├── value-objects/
│   │   ├── membership-id.value-object.ts
│   │   ├── permissions.value-object.ts
│   │   └── index.ts
│   │
│   ├── enums/
│   │   ├── membership-role.enum.ts
│   │   ├── membership-status.enum.ts
│   │   └── index.ts
│   │
│   └── index.ts
│
├── workspace/
│   ├── entities/
│   │   ├── workspace.entity.ts
│   │   └── index.ts
│   │
│   ├── value-objects/
│   │   ├── workspace-id.value-object.ts
│   │   ├── workspace-owner.value-object.ts
│   │   ├── workspace-quota.value-object.ts
│   │   └── index.ts
│   │
│   ├── enums/
│   │   ├── workspace-lifecycle.enum.ts
│   │   └── index.ts
│   │
│   ├── aggregates/
│   │   ├── workspace.aggregate.ts
│   │   └── index.ts
│   │
│   └── index.ts
│
├── modules/
│   ├── shared/
│   │   ├── enums/
│   │   │   ├── module-type.enum.ts
│   │   │   ├── module-visibility.enum.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── value-objects/
│   │   │   ├── module-id.value-object.ts
│   │   │   ├── module-permission.value-object.ts
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts
│   │
│   ├── overview/
│   │   ├── entities/
│   │   │   ├── dashboard.entity.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── value-objects/
│   │   │   ├── health-status.value-object.ts
│   │   │   ├── usage-stats.value-object.ts
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts
│   │
│   ├── documents/
│   │   ├── entities/
│   │   │   ├── document.entity.ts
│   │   │   ├── folder.entity.ts
│   │   │   ├── document-version.entity.ts
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
│   ├── tasks/
│   │   ├── entities/
│   │   │   ├── task.entity.ts
│   │   │   ├── subtask.entity.ts
│   │   │   ├── workflow.entity.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── value-objects/
│   │   │   ├── task-id.value-object.ts
│   │   │   ├── assignment.value-object.ts
│   │   │   ├── deadline.value-object.ts
│   │   │   ├── priority.value-object.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── enums/
│   │   │   ├── task-status.enum.ts
│   │   │   ├── priority-level.enum.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── aggregates/
│   │   │   ├── task.aggregate.ts
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts
│   │
│   └── index.ts
│
├── events/
│   ├── base/
│   │   ├── domain-event.base.ts
│   │   ├── event-metadata.ts
│   │   └── index.ts
│   │
│   ├── identity/
│   │   ├── identity-created.event.ts
│   │   ├── identity-updated.event.ts
│   │   └── index.ts
│   │
│   ├── workspace/
│   │   ├── workspace-created.event.ts
│   │   ├── workspace-updated.event.ts
│   │   ├── workspace-archived.event.ts
│   │   ├── workspace-deleted.event.ts
│   │   └── index.ts
│   │
│   └── index.ts
│
├── commands/
│   ├── base/
│   │   ├── command.base.ts
│   │   ├── command-result.ts
│   │   └── index.ts
│   │
│   ├── workspace/
│   │   ├── create-workspace.command.ts
│   │   ├── update-workspace.command.ts
│   │   ├── archive-workspace.command.ts
│   │   └── index.ts
│   │
│   └── index.ts
│
├── queries/
│   ├── base/
│   │   ├── query.base.ts
│   │   ├── query-result.ts
│   │   ├── pagination.ts
│   │   └── index.ts
│   │
│   ├── workspace/
│   │   ├── get-workspace.query.ts
│   │   ├── list-workspaces.query.ts
│   │   └── index.ts
│   │
│   └── index.ts
│
├── repositories/
│   ├── identity.repository.interface.ts
│   ├── membership.repository.interface.ts
│   ├── workspace.repository.interface.ts
│   └── index.ts
│
├── services/
│   ├── permission-checker.service.interface.ts
│   ├── quota-enforcer.service.interface.ts
│   └── index.ts
│
└── index.ts
```

## 關鍵設計原則

### 1. 值物件 (Value Objects)

* **不可變性**: 所有值物件都是不可變的
* **相等性**: 基於值相等,不是引用相等
* **驗證**: 在建構時進行驗證
* **無副作用**: 純函數,無副作用
* **語意優先**: 不可退化為 primitive wrapper（例如只包一個 string 卻沒有規則）

---

### 2. 實體 (Entities)

* **身份識別**: 有唯一 ID（Value Object, 非 primitive）
* **生命週期**: 有明確的生命週期
* **業務邏輯**: 封裝業務規則,不只是資料容器
* **狀態變更**: 狀態變更只能透過明確的方法發生
* **不可變性**: 對外不可變,內部受控變更

---

### 3. 聚合 (Aggregates)

* **一致性邊界**: 聚合是強一致性的邊界
* **根實體**: 對外的唯一入口（Aggregate Root）
* **交易邊界**: 一個 Command 只修改一個 Aggregate
* **不變量**: 所有業務不變量只能在 Aggregate 內被維護
* **禁止跨聚合引用實體**: 只能引用其他聚合的 ID

---

### 4. 領域事件 (Domain Events)

* **過去式命名**: 表示已發生的事實
* **不可變**: 事件一旦產生就不可變
* **業務語意**: 事件描述的是業務事實,不是技術行為
* **最小必要資料**: 只攜帶重建事實所需的資料
* **Workspace 關聯**: 若事件發生於 Workspace 聚合內,才包含 workspaceId

> 備註：Workspace 並非全域事件的必要欄位,避免強迫所有事件 WorkspaceScoped。

---

### 5. 命令 (Commands)

* **意圖表達**: 明確表達使用者或系統的意圖
* **不包含業務邏輯**: Command 是資料 + 意圖,不是行為
* **驗證**: 僅包含結構與基本不變量驗證
* **上下文**: 可包含 WorkspaceContext / IdentityContext
* **授權檢查**: 授權發生在 Application Layer,不是 Domain 內

---

### 6. 查詢 (Queries)

* **讀取模型**: 不回傳 Domain Entity
* **投影導向**: 只回傳 UI / Use Case 所需資料
* **WorkspaceFiltered**: 查詢在 Application / Infrastructure 層套用 Workspace 過濾
* **無副作用**: Query 不得觸發任何狀態改變
* **可快取**: Query 結果應可安全快取

---

## 檔案命名規範

* **實體**: `{name}.entity.ts`
  例: `workspace.entity.ts`
* **值物件**: `{name}.value-object.ts`
  例: `workspace-id.value-object.ts`
* **聚合根**: `{name}.aggregate.ts`
  例: `workspace.aggregate.ts`
* **事件**: `{name}.event.ts`
  例: `workspace-created.event.ts`
* **命令**: `{action}-{entity}.command.ts`
  例: `create-workspace.command.ts`
* **查詢**: `{action}-{entity}.query.ts`
  例: `get-workspace.query.ts`
* **列舉**: `{name}.enum.ts`（僅限業務上封閉集合）
  例: `workspace-status.enum.ts`
* **介面**: `{name}.interface.ts`
  例: `workspace.repository.interface.ts`
* **錯誤**: `{name}.error.ts`
  例: `domain.error.ts`

> 補充規則：
> **Identity / Owner / Role 類型禁止使用 enum，必須使用 union type 作為單一真理來源。**

---

## TypeScript 類型安全

所有領域物件都應該:

1. 使用嚴格的 TypeScript 類型
2. 禁止 `any` 與隱性型別擴散
3. 使用 `readonly` 保護對外狀態
4. 使用 Type Guards 處理邊界型別
5. 使用 Branded Types / Value Objects 防止 ID 混用
6. 禁止在 Domain Layer 使用 framework-specific 型別

---

## 與 NgRx Signals 整合

* **Domain ≠ Store State**
  Domain Model 不等於 Store State
* **Anti-Corruption Layer**
  Store ↔ Domain 之間必須有轉換層
* **Domain Events → Effects**
  Effects 訂閱事件,不是 Entity
* **Commands → Store Methods**
  Store Methods 負責執行 Command
* **Queries → Computed Signals**
  Computed Signals 只依賴 Query 結果
* **Domain 不知道 NgRx**
  Domain Layer 不 import NgRx 任何東西

---

## 依賴方向

```
Presentation Layer (Components)
        ↓
Application Layer (Stores, UseCases, Effects)
        ↓
Domain Layer (Aggregates, Entities, Value Objects, Events)
        ↓
Infrastructure Layer (Firebase, Repository Implementations)
```

* Domain Layer **不依賴任何外部技術**
* Infrastructure **實作介面,不反向污染 Domain**
* Application **負責 orchestration,不是業務規則**

---

## 一句總結（這份文件的靈魂）

* **Identity ≠ Membership**
* **Aggregate 是邊界,不是資料夾**
* **Command 改狀態,Query 不碰狀態**
* **Domain 永遠不知道 Angular / NgRx / Firebase**
