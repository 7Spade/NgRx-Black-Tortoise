# Infrastructure Layer 檔案樹結構

> **術語說明**: 請參考 [專業術語對照表 (GLOSSARY.md)](./GLOSSARY.md) 了解本文件使用的標準術語。

按照開發順序,下一層應該是 **Infrastructure Layer (基礎設施層)**,因為它提供了 Domain 和 Application 層所需的具體實現。

根據您的架構,以下是 `src/app/infrastructure` 的完整檔案樹:

```
src/app/infrastructure/
│
├── firebase/                                  # Firebase 整合層
│   │
│   ├── config/                               # Firebase 配置
│   │   ├── firebase.config.ts               # Firebase 配置檔 (環境變數)
│   │   ├── firebase-app.provider.ts         # Firebase App Provider
│   │   ├── firestore.provider.ts            # Firestore Provider (含設定)
│   │   ├── auth.provider.ts                 # Auth Provider (含設定)
│   │   ├── storage.provider.ts              # Storage Provider (含設定)
│   │   ├── functions.provider.ts            # Functions Provider (含設定)
│   │   ├── performance.provider.ts          # Performance Provider
│   │   ├── analytics.provider.ts            # Analytics Provider
│   │   └── index.ts
│   │
│   ├── converters/                           # Firestore Converters (資料轉換器)
│   │   ├── base/                            # 基礎 Converter
│   │   │   ├── firestore-converter.interface.ts  # Converter 介面
│   │   │   ├── base-firestore.converter.ts       # 基礎 Converter 實作
│   │   │   └── index.ts
│   │   │
│   │   ├── workspace.firestore-converter.ts      # Workspace Converter
│   │   ├── task.firestore-converter.ts           # Task Converter
│   │   ├── document.firestore-converter.ts       # Document Converter
│   │   ├── member.firestore-converter.ts         # Member Converter
│   │   ├── workspace-membership.firestore-converter.ts  # WorkspaceMembership Converter
│   │   ├── audit-log.firestore-converter.ts      # AuditLog Converter
│   │   └── index.ts
│   │
│   ├── collections/                          # Firestore Collection 定義
│   │   ├── collection-paths.const.ts        # Collection Path 常數
│   │   ├── collection-refs.service.ts       # Collection References 服務
│   │   └── index.ts
│   │
│   ├── queries/                              # Firestore Query 建構器
│   │   ├── base/                            # 基礎 Query Builder
│   │   │   ├── query-builder.interface.ts   # QueryBuilder 介面
│   │   │   ├── base-query.builder.ts        # 基礎 QueryBuilder
│   │   │   └── index.ts
│   │   │
│   │   ├── workspace-query.builder.ts       # Workspace Query Builder
│   │   ├── task-query.builder.ts            # Task Query Builder
│   │   ├── document-query.builder.ts        # Document Query Builder
│   │   ├── member-query.builder.ts          # Member Query Builder
│   │   └── index.ts
│   │
│   ├── transactions/                         # Firestore Transaction 處理
│   │   ├── transaction.service.ts           # Transaction Service
│   │   ├── batch.service.ts                 # Batch Service
│   │   └── index.ts
│   │
│   ├── realtime/                             # Realtime Sync 處理
│   │   ├── realtime-sync.service.ts         # Realtime Sync Service
│   │   ├── snapshot-listener.service.ts     # Snapshot Listener Service
│   │   └── index.ts
│   │
│   ├── security/                             # Security Rules 整合
│   │   ├── security-context.service.ts      # Security Context Service
│   │   ├── custom-claims.service.ts         # Custom Claims Service
│   │   └── index.ts
│   │
│   └── index.ts                              # Firebase 總匯出
│
├── persistence/                               # 資料持久化層 (Repository 實作)
│   │
│   ├── base/                                 # 基礎 Repository
│   │   ├── base-firestore.repository.ts     # 基礎 Firestore Repository
│   │   ├── repository-error.handler.ts      # Repository 錯誤處理
│   │   └── index.ts
│   │
│   ├── account/                              # Account Repository 實作
│   │   ├── account-firestore.repository.ts  # Account Repository (實作 domain 介面)
│   │   ├── user-firestore.repository.ts     # User Repository
│   │   ├── organization-firestore.repository.ts  # Organization Repository
│   │   └── index.ts
│   │
│   ├── workspace/                            # Workspace Repository 實作
│   │   ├── workspace-firestore.repository.ts     # Workspace Repository
│   │   ├── workspace-cache.repository.ts         # Workspace Cache Repository (裝飾器模式)
│   │   └── index.ts
│   │
│   ├── workspace-membership/                 # WorkspaceMembership Repository 實作
│   │   ├── workspace-membership-firestore.repository.ts  # WorkspaceMembership Repository
│   │   └── index.ts
│   │
│   ├── tasks/                                # Task Repository 實作
│   │   ├── task-firestore.repository.ts     # Task Repository
│   │   ├── task-cache.repository.ts         # Task Cache Repository
│   │   └── index.ts
│   │
│   ├── documents/                            # Document Repository 實作
│   │   ├── document-firestore.repository.ts # Document Repository
│   │   ├── document-metadata-firestore.repository.ts  # Document Metadata Repository
│   │   └── index.ts
│   │
│   ├── members/                              # Member Repository 實作
│   │   ├── member-firestore.repository.ts   # Member Repository
│   │   └── index.ts
│   │
│   ├── audit/                                # Audit Repository 實作
│   │   ├── audit-log-firestore.repository.ts     # AuditLog Repository
│   │   └── index.ts
│   │
│   └── index.ts                              # Persistence 總匯出
│
├── storage/                                   # 檔案儲存層
│   │
│   ├── services/                             # Storage 服務
│   │   ├── file-upload.service.ts           # 檔案上傳服務
│   │   ├── file-download.service.ts         # 檔案下載服務
│   │   ├── file-delete.service.ts           # 檔案刪除服務
│   │   └── index.ts
│   │
│   ├── strategies/                           # Upload Strategy (策略模式)
│   │   ├── upload-strategy.interface.ts     # Upload Strategy 介面
│   │   ├── direct-upload.strategy.ts        # 直接上傳策略
│   │   ├── resumable-upload.strategy.ts     # 可恢復上傳策略
│   │   ├── chunked-upload.strategy.ts       # 分塊上傳策略
│   │   └── index.ts
│   │
│   ├── models/                               # Storage Models
│   │   ├── upload-progress.model.ts         # 上傳進度模型
│   │   ├── file-metadata.model.ts           # 檔案元數據模型
│   │   └── index.ts
│   │
│   └── index.ts                              # Storage 總匯出
│
├── auth/                                      # 認證層
│   │
│   ├── services/                             # Auth 服務
│   │   ├── auth-firestore.service.ts        # Firebase Auth Service
│   │   ├── token-refresh.service.ts         # Token 刷新服務
│   │   ├── session-manager.service.ts       # Session 管理服務
│   │   └── index.ts
│   │
│   ├── strategies/                           # Auth Strategy (策略模式)
│   │   ├── auth-strategy.interface.ts       # Auth Strategy 介面
│   │   ├── email-password-auth.strategy.ts  # Email/Password 認證策略
│   │   ├── google-auth.strategy.ts          # Google 認證策略
│   │   ├── github-auth.strategy.ts          # GitHub 認證策略
│   │   └── index.ts
│   │
│   ├── models/                               # Auth Models
│   │   ├── auth-user.model.ts               # Auth User 模型
│   │   ├── auth-token.model.ts              # Auth Token 模型
│   │   ├── auth-session.model.ts            # Auth Session 模型
│   │   └── index.ts
│   │
│   └── index.ts                              # Auth 總匯出
│
├── domain-services/                           # Domain Services 實作
│   │
│   ├── workspace/                            # Workspace Domain Services
│   │   ├── workspace-guard-impl.service.ts  # WorkspaceGuard 實作
│   │   ├── workspace-quota-enforcer-impl.service.ts  # QuotaEnforcer 實作
│   │   └── index.ts
│   │
│   ├── permissions/                          # Permission Domain Services
│   │   ├── permission-checker-impl.service.ts    # PermissionChecker 實作
│   │   ├── permission-evaluator-impl.service.ts  # PermissionEvaluator 實作
│   │   └── index.ts
│   │
│   └── index.ts                              # Domain Services 總匯出
│
├── event-sourcing/                            # 事件溯源層
│   │
│   ├── event-store/                          # Event Store
│   │   ├── firestore-event-store.service.ts # Firestore Event Store
│   │   ├── event-serializer.service.ts      # Event 序列化服務
│   │   ├── event-deserializer.service.ts    # Event 反序列化服務
│   │   └── index.ts
│   │
│   ├── event-bus/                            # Event Bus 實作
│   │   ├── firestore-event-bus.service.ts   # Firestore-based Event Bus
│   │   ├── in-memory-event-bus.service.ts   # In-Memory Event Bus (開發用)
│   │   └── index.ts
│   │
│   ├── projections/                          # Event Projections
│   │   ├── workspace-projection.service.ts  # Workspace Projection
│   │   ├── task-projection.service.ts       # Task Projection
│   │   └── index.ts
│   │
│   └── index.ts                              # Event Sourcing 總匯出
│
├── caching/                                   # 快取層
│   │
│   ├── services/                             # Cache 服務
│   │   ├── memory-cache.service.ts          # 記憶體快取服務
│   │   ├── indexed-db-cache.service.ts      # IndexedDB 快取服務
│   │   ├── cache-invalidation.service.ts    # 快取失效服務
│   │   └── index.ts
│   │
│   ├── strategies/                           # Cache Strategy
│   │   ├── cache-strategy.interface.ts      # Cache Strategy 介面
│   │   ├── lru-cache.strategy.ts            # LRU 快取策略
│   │   ├── ttl-cache.strategy.ts            # TTL 快取策略
│   │   └── index.ts
│   │
│   ├── decorators/                           # Cache Decorators
│   │   ├── cacheable.decorator.ts           # @Cacheable 裝飾器
│   │   ├── cache-evict.decorator.ts         # @CacheEvict 裝飾器
│   │   └── index.ts
│   │
│   └── index.ts                              # Caching 總匯出
│
├── logging/                                   # 日誌層
│   │
│   ├── services/                             # Logging 服務
│   │   ├── logger.service.ts                # Logger Service (抽象)
│   │   ├── console-logger.service.ts        # Console Logger (開發用)
│   │   ├── firebase-logger.service.ts       # Firebase Analytics Logger
│   │   └── index.ts
│   │
│   ├── models/                               # Logging Models
│   │   ├── log-entry.model.ts               # Log Entry 模型
│   │   ├── log-level.enum.ts                # Log Level 列舉
│   │   └── index.ts
│   │
│   └── index.ts                              # Logging 總匯出
│
├── monitoring/                                # 監控層
│   │
│   ├── services/                             # Monitoring 服務
│   │   ├── performance-monitor.service.ts   # 效能監控服務
│   │   ├── error-tracker.service.ts         # 錯誤追蹤服務
│   │   ├── analytics-tracker.service.ts     # 分析追蹤服務
│   │   └── index.ts
│   │
│   ├── decorators/                           # Monitoring Decorators
│   │   ├── track-performance.decorator.ts   # @TrackPerformance 裝飾器
│   │   ├── track-error.decorator.ts         # @TrackError 裝飾器
│   │   └── index.ts
│   │
│   └── index.ts                              # Monitoring 總匯出
│
├── external-services/                         # 外部服務整合
│   │
│   ├── email/                                # Email 服務
│   │   ├── email.service.interface.ts       # Email Service 介面
│   │   ├── firebase-email.service.ts        # Firebase Email (via Functions)
│   │   └── index.ts
│   │
│   ├── notification/                         # 通知服務
│   │   ├── push-notification.service.ts     # Push Notification Service
│   │   ├── in-app-notification.service.ts   # In-App Notification Service
│   │   └── index.ts
│   │
│   └── index.ts                              # External Services 總匯出
│
├── adapters/                                  # Adapters (適配器模式)
│   │
│   ├── firebase-to-domain.adapter.ts        # Firebase → Domain 適配器
│   ├── domain-to-firebase.adapter.ts        # Domain → Firebase 適配器
│   └── index.ts
│
├── dto/                                       # DTOs (資料傳輸物件)
│   │
│   ├── firebase/                             # Firebase DTOs
│   │   ├── workspace-firebase.dto.ts        # Workspace Firestore DTO
│   │   ├── task-firebase.dto.ts             # Task Firestore DTO
│   │   ├── document-firebase.dto.ts         # Document Firestore DTO
│   │   ├── member-firebase.dto.ts           # Member Firestore DTO
│   │   └── index.ts
│   │
│   └── index.ts                              # DTOs 總匯出
│
├── providers/                                 # Dependency Injection Providers
│   │
│   ├── repository.providers.ts              # Repository Providers (DI 配置)
│   ├── service.providers.ts                 # Service Providers (DI 配置)
│   └── index.ts
│
├── errors/                                    # Infrastructure 錯誤
│   │
│   ├── firebase.error.ts                    # Firebase 錯誤
│   ├── network.error.ts                     # 網路錯誤
│   ├── storage.error.ts                     # Storage 錯誤
│   └── index.ts
│
└── index.ts                                   # Infrastructure Layer 總匯出
```

---

## 關鍵設計原則

### 1. 命名規範 - 避免 Copilot 混淆

#### Repository 命名
```
✅ CORRECT (避免混淆):
- workspace-firestore.repository.ts    # Firestore 實作
- workspace-cache.repository.ts        # Cache 裝飾器實作
- account-firestore.repository.ts      # Account Repository

❌ WRONG (容易混淆):
- workspace.repository.ts              # 太模糊,不知道是介面還是實作
- repository.ts                        # 完全無法識別
- workspace-repo.ts                    # 縮寫不清楚
```

#### Service 命名
```
✅ CORRECT:
- workspace-guard-impl.service.ts      # Domain Service 實作 (加 -impl 後綴)
- permission-checker-impl.service.ts   # Domain Service 實作
- auth-firestore.service.ts            # Firebase Auth 服務
- file-upload.service.ts               # 具體功能服務

❌ WRONG:
- workspace-guard.service.ts           # 與 application 層衝突
- permission.service.ts                # 太模糊
- auth.service.ts                      # 與 domain 層介面衝突
```

#### Converter 命名
```
✅ CORRECT:
- workspace.firestore-converter.ts     # Firestore Converter (中綴命名)
- task.firestore-converter.ts
- document.firestore-converter.ts

❌ WRONG:
- workspace-converter.ts               # 不知道轉換什麼格式
- firestore-workspace.ts               # 順序混亂
- workspace.mapper.ts                  # Mapper 是 application 層的
```

#### DTO 命名
```
✅ CORRECT:
- workspace-firebase.dto.ts            # Firebase DTO (後綴命名)
- task-firebase.dto.ts
- document-firebase.dto.ts

❌ WRONG:
- workspace.dto.ts                     # 不知道給哪個系統用
- firebase-workspace.ts                # 順序混亂
- workspace-firestore.ts               # 與 repository 混淆
```

#### Query Builder 命名
```
✅ CORRECT:
- workspace-query.builder.ts           # Query Builder (中綴命名)
- task-query.builder.ts
- document-query.builder.ts

❌ WRONG:
- workspace-builder.ts                 # 不知道建構什麼
- query-workspace.ts                   # 順序混亂
- workspace.query.ts                   # 與 domain 層 query 混淆
```

---

### 2. 檔案位置規則 - 清晰的層級定位

```
Domain Layer (domain/)
├── repositories/
│   └── workspace.repository.interface.ts    # ❗ 介面定義 (抽象)

Infrastructure Layer (infrastructure/)
├── persistence/
│   └── workspace/
│       └── workspace-firestore.repository.ts  # ❗ 具體實作

Application Layer (application/)
├── mappers/
│   └── workspace/
│       └── workspace-to-dto.mapper.ts        # ❗ 應用層映射

---

規則:
1. Interface 在 Domain Layer
2. Implementation 在 Infrastructure Layer (加 -impl 或 -firestore 後綴)
3. Mapper 在 Application Layer
4. Converter 在 Infrastructure Layer
```

---

### 3. Dependency Injection 配置

```typescript
// infrastructure/providers/repository.providers.ts

import { Provider } from '@angular/core';
import { 
  WORKSPACE_REPOSITORY_TOKEN,    // ← Domain 層定義的 Token
  TASK_REPOSITORY_TOKEN,
  DOCUMENT_REPOSITORY_TOKEN
} from '@domain/repositories';

import {
  WorkspaceFirestoreRepository,  // ← Infrastructure 層實作
  TaskFirestoreRepository,
  DocumentFirestoreRepository
} from '@infrastructure/persistence';

export const REPOSITORY_PROVIDERS: Provider[] = [
  {
    provide: WORKSPACE_REPOSITORY_TOKEN,
    useClass: WorkspaceFirestoreRepository  // ❗ 綁定實作
  },
  {
    provide: TASK_REPOSITORY_TOKEN,
    useClass: TaskFirestoreRepository
  },
  {
    provide: DOCUMENT_REPOSITORY_TOKEN,
    useClass: DocumentFirestoreRepository
  }
];

// 在 app.config.ts 中提供
export const appConfig: ApplicationConfig = {
  providers: [
    ...REPOSITORY_PROVIDERS,
    ...SERVICE_PROVIDERS,
    // ...
  ]
};
```

---

### 4. 基礎 Repository 模式

```typescript
// infrastructure/persistence/base/base-firestore.repository.ts

/**
 * 基礎 Firestore Repository
 * 所有 Firestore Repository 都應該繼承此類
 * 
 * 命名規則:
 * - 檔案名稱: base-firestore.repository.ts
 * - 類別名稱: BaseFirestoreRepository<T, ID>
 */
export abstract class BaseFirestoreRepository<T extends Entity, ID> {
  
  constructor(
    protected firestore: Firestore,
    protected collectionPath: string,
    protected converter: FirestoreDataConverter<T>
  ) {}
  
  abstract findById(id: ID): Promise<T | null>;
  abstract findAll(): Promise<T[]>;
  abstract save(entity: T): Promise<T>;
  abstract delete(id: ID): Promise<void>;
  
  // 通用方法
  protected getCollection(): CollectionReference<T> {
    return collection(this.firestore, this.collectionPath)
      .withConverter(this.converter);
  }
  
  protected handleError(error: any): never {
    // 統一錯誤處理
    throw RepositoryErrorHandler.handle(error);
  }
}
```

```typescript
// infrastructure/persistence/workspace/workspace-firestore.repository.ts

/**
 * Workspace Firestore Repository 實作
 * 實作 Domain 層的 IWorkspaceRepository 介面
 * 
 * 命名規則:
 * - 檔案名稱: workspace-firestore.repository.ts (明確標示是 Firestore 實作)
 * - 類別名稱: WorkspaceFirestoreRepository
 * - Injectable: @Injectable() 提供 DI
 */
@Injectable()
export class WorkspaceFirestoreRepository 
  extends BaseFirestoreRepository<Workspace, WorkspaceId>
  implements IWorkspaceRepository  // ← 實作 Domain 介面
{
  constructor(
    firestore: Firestore,
    private workspaceConverter: WorkspaceFirestoreConverter
  ) {
    super(
      firestore,
      COLLECTION_PATHS.WORKSPACES,  // ← 使用常數
      workspaceConverter
    );
  }
  
  async findById(id: WorkspaceId): Promise<Workspace | null> {
    try {
      const docRef = doc(this.getCollection(), id.value);
      const snapshot = await getDoc(docRef);
      return snapshot.exists() ? snapshot.data() : null;
    } catch (error) {
      this.handleError(error);
    }
  }
  
  async findByOwnerId(ownerId: AccountId): Promise<Workspace[]> {
    // Workspace 特有的查詢方法
    // ...
  }
  
  // 實作其他介面方法...
}
```

---

### 5. Firestore Converter 模式

```typescript
// infrastructure/firebase/converters/workspace.firestore-converter.ts

/**
 * Workspace Firestore Converter
 * 負責 Firestore Document ↔ Domain Entity 的轉換
 * 
 * 命名規則:
 * - 檔案名稱: workspace.firestore-converter.ts (中綴命名,清楚表示是 Firestore Converter)
 * - 類別名稱: WorkspaceFirestoreConverter
 * - 實作: FirestoreDataConverter<Workspace>
 */
@Injectable()
export class WorkspaceFirestoreConverter 
  implements FirestoreDataConverter<Workspace> 
{
  
  /**
   * Domain Entity → Firestore Document
   */
  toFirestore(workspace: Workspace): DocumentData {
    return {
      id: workspace.id.value,
      name: workspace.identity.name,
      slug: workspace.identity.slug.value,
      description: workspace.identity.description,
      ownerId: workspace.ownerId.value,
      type: workspace.type,
      lifecycle: workspace.lifecycle,
      quota: {
        maxMembers: workspace.quota.maxMembers,
        maxStorage: workspace.quota.maxStorage,
        // ...
      },
      createdAt: Timestamp.fromDate(workspace.createdAt),
      updatedAt: Timestamp.fromDate(workspace.updatedAt),
      // ...
    };
  }
  
  /**
   * Firestore Document → Domain Entity
   */
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Workspace {
    const data = snapshot.data(options);
    
    return new Workspace({
      id: new WorkspaceId(data.id),
      identity: new WorkspaceIdentity({
        name: data.name,
        slug: new Slug(data.slug),
        description: data.description,
        // ...
      }),
      ownerId: new AccountId(data.ownerId),
      type: data.type as WorkspaceType,
      lifecycle: data.lifecycle as WorkspaceLifecycle,
      quota: new WorkspaceQuota({
        maxMembers: data.quota.maxMembers,
        maxStorage: data.quota.maxStorage,
        // ...
      }),
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
      // ...
    });
  }
}
```

---

### 6. Query Builder 模式

```typescript
// infrastructure/firebase/queries/workspace-query.builder.ts

/**
 * Workspace Query Builder
 * 建構 Firestore Query 的流暢介面
 * 
 * 命名規則:
 * - 檔案名稱: workspace-query.builder.ts (中綴命名)
 * - 類別名稱: WorkspaceQueryBuilder
 */
@Injectable()
export class WorkspaceQueryBuilder extends BaseQueryBuilder<Workspace> {
  
  constructor(
    firestore: Firestore,
    converter: WorkspaceFirestoreConverter
  ) {
    super(
      firestore,
      COLLECTION_PATHS.WORKSPACES,
      converter
    );
  }
  
  /**
   * 查詢指定 Owner 的 Workspaces
   */
  whereOwnerId(ownerId: AccountId): this {
    this.addConstraint(
      where('ownerId', '==', ownerId.value)
    );
    return this;
  }
  
  /**
   * 查詢指定類型的 Workspaces
   */
  whereType(type: WorkspaceType): this {
    this.addConstraint(
      where('type', '==', type)
    );
    return this;
  }
  
  /**
   * 查詢指定生命週期的 Workspaces
   */
  whereLifecycle(lifecycle: WorkspaceLifecycle): this {
    this.addConstraint(
      where('lifecycle', '==', lifecycle)
    );
    return this;
  }
  
  /**
   * 只查詢活躍的 Workspaces
   */
  onlyActive(): this {
    return this.whereLifecycle(WorkspaceLifecycle.Active);
  }
  
  /**
   * 排序
   */
  orderByCreatedAt(direction: 'asc' | 'desc' = 'desc'): this {
    this.addConstraint(
      orderBy('createdAt', direction)
    );
    return this;
  }
  
  /**
   * 執行查詢
   */
  async execute(): Promise<Workspace[]> {
    const q = this.build();
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data());
  }
}
```

---

### 7. Domain Service 實作命名

```typescript
// infrastructure/domain-services/workspace/workspace-guard-impl.service.ts

/**
 * Workspace Guard 實作
 * 實作 Domain 層的 IWorkspaceGuardService 介面
 * 
 * 命名規則:
 * - 檔案名稱: workspace-guard-impl.service.ts (加 -impl 後綴,表示是實作)
 * - 類別名稱: WorkspaceGuardImplService
 * - 與 Application 層的 WorkspaceGuardService 區分
 */
@Injectable()
export class WorkspaceGuardImplService implements IWorkspaceGuardService {
  
  constructor(
    @Inject(WORKSPACE_REPOSITORY_TOKEN)
    private workspaceRepository: IWorkspaceRepository,
    
    @Inject(WORKSPACE_MEMBERSHIP_REPOSITORY_TOKEN)
    private membershipRepository: IWorkspaceMembershipRepository
  ) {}
  
  async hasWorkspaceAccess(
    accountId: AccountId, 
    workspaceId: WorkspaceId
  ): Promise<boolean> {
    // 實作邏輯
  }
  
  async isWorkspaceMember(
    accountId: AccountId,
    workspaceId: WorkspaceId
  ): Promise<boolean> {
    // 實作邏輯
  }
  
  async isWorkspaceOwner(
    accountId: AccountId,
    workspaceId: WorkspaceId
  ): Promise<boolean> {
    // 實作邏輯
  }
  
  async hasModulePermission(
    accountId: AccountId,
    workspaceId: WorkspaceId,
    moduleType: ModuleType,
    permission: ModulePermission
  ): Promise<boolean> {
    // 實作邏輯
  }
}
```

---

### 8. Collection Paths 常數

```typescript
// infrastructure/firebase/collections/collection-paths.const.ts

/**
 * Firestore Collection Paths
 * 集中管理所有 Collection 路徑
 * 
 * 命名規則:
 * - 使用常數定義
 * - 使用 UPPER_SNAKE_CASE
 * - 支援動態路徑 (函數)
 */
export const COLLECTION_PATHS = {
  // Top-level collections
  ACCOUNTS: 'accounts',
  WORKSPACES: 'workspaces',
  
  // Workspace sub-collections (動態路徑)
  WORKSPACE_MEMBERS: (workspaceId: string) => 
    `workspaces/${workspaceId}/members`,
  
  WORKSPACE_TASKS: (workspaceId: string) => 
    `workspaces/${workspaceId}/tasks`,
  
  WORKSPACE_DOCUMENTS: (workspaceId: string) => 
    `workspaces/${workspaceId}/documents`,
  
  WORKSPACE_AUDIT_LOGS: (workspaceId: string) => 
    `workspaces/${workspaceId}/auditLogs`,
  
  // Task sub-collections
  TASK_COMMENTS: (workspaceId: string, taskId: string) => 
    `workspaces/${workspaceId}/tasks/${taskId}/comments`,
  
  // Events
  WORKSPACE_EVENTS: (workspaceId: string) => 
    `workspaces/${workspaceId}/events`,
  
} as const;

/**
 * Collection Groups (用於跨 Workspace 查詢)
 */
export const COLLECTION_GROUPS = {
  TASKS: 'tasks',
  DOCUMENTS: 'documents',
  MEMBERS: 'members',
  AUDIT_LOGS: 'auditLogs',
} as const;
```

---

### 9. 錯誤處理策略

```typescript
// infrastructure/persistence/base/repository-error.handler.ts

/**
 * Repository 錯誤處理器
 * 將 Firebase 錯誤轉換為 Domain 錯誤
 */
export class RepositoryErrorHandler {
  
  static handle(error: any): never {
    
    // Firestore 錯誤碼對應
    if (error.code) {
      switch (error.code) {
        case 'permission-denied':
          throw new AuthorizationError(
            '沒有權限執行此操作',
            { cause: error }
          );
          
        case 'not-found':
          throw new NotFoundError(
            '找不到資源',
            { cause: error }
          );
          
        case 'already-exists':
          throw new ConflictError(
            '資源已存在',
            { cause: error }
          );
          
        case 'failed-precondition':
          throw new ValidationError(
            '前置條件不符合',
            { cause: error }
          );
          
        case 'unavailable':
        case 'deadline-exceeded':
          throw new NetworkError(
            '網路錯誤或逾時',
            { cause: error }
          );
          
        default:
          throw new InfrastructureError(
            `Firestore 錯誤: ${error.message}`,
            { cause: error }
          );
      }
    }
    
    // 未知錯誤
    throw new InfrastructureError(
      '發生未知的基礎設施錯誤',
      { cause: error }
    );
  }
}
```

---

## 層級架構總覽

```
┌─────────────────────────────────────────────────────────┐
│                    Presentation Layer                    │
│                      (Components)                        │
└─────────────────────────────────────────────────────────┘
                           ↓ uses
┌─────────────────────────────────────────────────────────┐
│                   Application Layer                      │
│     (Stores, Effects, Commands, Queries, Mappers)       │
└─────────────────────────────────────────────────────────┘
                           ↓ uses
┌─────────────────────────────────────────────────────────┐
│                     Domain Layer                         │
│    (Entities, Value Objects, Aggregates, Interfaces)    │
└─────────────────────────────────────────────────────────┘
                           ↑ implemented by
┌─────────────────────────────────────────────────────────┐
│                 Infrastructure Layer                     │
│   (Repositories, Converters, Firebase, Services)        │
└─────────────────────────────────────────────────────────┘
```

---

## Copilot 友善的命名檢查清單

### ✅ 檔案命名檢查
- [ ] Repository 實作檔案包含 `-firestore` 後綴
- [ ] Converter 檔案使用 `.firestore-converter` 中綴
- [ ] DTO 檔案使用 `-firebase.dto` 後綴
- [ ] Query Builder 使用 `-query.builder` 中綴
- [ ] Domain Service 實作使用 `-impl.service` 後綴

### ✅ 類別命名檢查
- [ ] Repository 類別名稱: `{Entity}FirestoreRepository`
- [ ] Converter 類別名稱: `{Entity}FirestoreConverter`
- [ ] DTO 類別名稱: `{Entity}FirebaseDto`
- [ ] Query Builder 類別名稱: `{Entity}QueryBuilder`
- [ ] Service 實作類別名稱: `{Feature}ImplService`

### ✅ 位置檢查
- [ ] Repository 介面在 `domain/repositories/`
- [ ] Repository 實作在 `infrastructure/persistence/{entity}/`
- [ ] Converter 在 `infrastructure/firebase/converters/`
- [ ] DTO 在 `infrastructure/dto/firebase/`
- [ ] Query Builder 在 `infrastructure/firebase/queries/`

### ✅ DI Token 檢查
- [ ] 使用 InjectionToken 定義在 Domain 層
- [ ] Provider 配置在 Infrastructure 層
- [ ] 使用 `@Inject(TOKEN)` 注入

---

## 開發順序建議

1. **Firebase 配置** (firebase/config/)
2. **Collection Paths** (firebase/collections/)
3. **Base Repository & Converter** (persistence/base/, firebase/converters/base/)
4. **Entity Converters** (firebase/converters/)
5. **Entity Repositories** (persistence/)
6. **Query Builders** (firebase/queries/)
7. **Domain Services 實作** (domain-services/)
8. **Event Store** (event-sourcing/)
9. **Cache Layer** (caching/)
10. **Monitoring & Logging** (monitoring/, logging/)

這樣的順序可以確保依賴關係正確,並且可以逐步測試每個元件。