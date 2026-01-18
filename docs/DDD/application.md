# Application Layer 檔案樹結構

> **術語說明**: 請參考 [專業術語對照表 (GLOSSARY.md)](./GLOSSARY.md) 了解本文件使用的標準術語。

根據您的 NgRx Signals 純響應式架構,以下是 `src/app/application` 的完整檔案樹:

```
src/app/application/
│
├── store/                                     # NgRx Signals Stores
│   │
│   ├── global-shell/                         # GlobalShell 全域殼層 (Root Level)
│   │   ├── auth/                             # 認證相關
│   │   │   ├── auth.store.ts                # Auth Store (providedIn: 'root')
│   │   │   ├── auth.models.ts               # Auth 相關的介面和類型
│   │   │   └── index.ts
│   │   │
│   │   ├── config/                           # 配置相關
│   │   │   ├── config.store.ts              # Config Store (providedIn: 'root')
│   │   │   ├── config.models.ts             # Config 相關的介面和類型
│   │   │   └── index.ts
│   │   │
│   │   ├── layout/                           # 布局相關
│   │   │   ├── layout.store.ts              # Layout Store (providedIn: 'root')
│   │   │   ├── layout.models.ts             # Layout 相關的介面和類型
│   │   │   └── index.ts
│   │   │
│   │   ├── router/                           # 路由相關
│   │   │   ├── router.store.ts              # Router Store (providedIn: 'root')
│   │   │   ├── router.models.ts             # Router 相關的介面和類型
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts                          # GlobalShell 總匯出
│   │
│   ├── workspace-list/                       # WorkspaceList 工作區列表層 (Account Level)
│   │   ├── workspace-list.store.ts          # WorkspaceList Store (providedIn: 'root')
│   │   ├── workspace-list.models.ts         # WorkspaceList 相關的介面和類型
│   │   ├── workspace-list.selectors.ts      # Computed Selectors (可選)
│   │   └── index.ts
│   │
│   ├── workspace/                            # Workspace 工作區層 (Context Store)
│   │   ├── workspace.store.ts               # Workspace Store (providedIn: 'root')
│   │   ├── workspace.models.ts              # Workspace 相關的介面和類型
│   │   ├── workspace.selectors.ts           # Computed Selectors (可選)
│   │   └── index.ts
│   │
│   ├── features/                             # Feature Stores 功能模組層
│   │   │
│   │   ├── overview/                         # Overview 模組
│   │   │   ├── overview.store.ts            # Overview Store (providedIn: 'root')
│   │   │   ├── overview.models.ts           # Overview 相關的介面和類型
│   │   │   └── index.ts
│   │   │
│   │   ├── documents/                        # Documents 模組
│   │   │   ├── documents.store.ts           # Documents Store (providedIn: 'root')
│   │   │   ├── documents.models.ts          # Documents 相關的介面和類型
│   │   │   ├── documents.selectors.ts       # Computed Selectors
│   │   │   └── index.ts
│   │   │
│   │   ├── tasks/                            # Tasks 模組
│   │   │   ├── tasks.store.ts               # Tasks Store (providedIn: 'root')
│   │   │   ├── tasks.models.ts              # Tasks 相關的介面和類型
│   │   │   ├── tasks.selectors.ts           # Computed Selectors
│   │   │   └── index.ts
│   │   │
│   │   ├── members/                          # Members 模組
│   │   │   ├── members.store.ts             # Members Store (providedIn: 'root')
│   │   │   ├── members.models.ts            # Members 相關的介面和類型
│   │   │   └── index.ts
│   │   │
│   │   ├── permissions/                      # Permissions 模組
│   │   │   ├── permissions.store.ts         # Permissions Store (providedIn: 'root')
│   │   │   ├── permissions.models.ts        # Permissions 相關的介面和類型
│   │   │   └── index.ts
│   │   │
│   │   ├── audit/                            # Audit 模組
│   │   │   ├── audit.store.ts               # Audit Store (providedIn: 'root')
│   │   │   ├── audit.models.ts              # Audit 相關的介面和類型
│   │   │   └── index.ts
│   │   │
│   │   ├── settings/                         # Settings 模組
│   │   │   ├── settings.store.ts            # Settings Store (providedIn: 'root')
│   │   │   ├── settings.models.ts           # Settings 相關的介面和類型
│   │   │   └── index.ts
│   │   │
│   │   ├── journal/                          # Journal 模組
│   │   │   ├── journal.store.ts             # Journal Store (providedIn: 'root')
│   │   │   ├── journal.models.ts            # Journal 相關的介面和類型
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts                          # Features 總匯出
│   │
│   ├── entities/                             # Entity Stores 實體層
│   │   │
│   │   ├── task-entity/                      # Task Entity Store
│   │   │   ├── task-entity.store.ts         # Task Entity Store (providedIn: 'root')
│   │   │   ├── task-entity.adapter.ts       # Entity Adapter (normalize)
│   │   │   ├── task-entity.models.ts        # Entity State 介面
│   │   │   └── index.ts
│   │   │
│   │   ├── document-entity/                  # Document Entity Store
│   │   │   ├── document-entity.store.ts     # Document Entity Store
│   │   │   ├── document-entity.adapter.ts   # Entity Adapter
│   │   │   ├── document-entity.models.ts    # Entity State 介面
│   │   │   └── index.ts
│   │   │
│   │   ├── member-entity/                    # Member Entity Store
│   │   │   ├── member-entity.store.ts       # Member Entity Store
│   │   │   ├── member-entity.adapter.ts     # Entity Adapter
│   │   │   ├── member-entity.models.ts      # Entity State 介面
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts                          # Entities 總匯出
│   │
│   └── index.ts                               # Store 總匯出
│
├── effects/                                   # rxMethod Effects (副作用處理)
│   │
│   ├── workspace/                            # Workspace 相關 Effects
│   │   ├── workspace-sync.effect.ts         # 同步 Workspace 資料
│   │   ├── workspace-switch.effect.ts       # 切換 Workspace 邏輯
│   │   ├── workspace-cleanup.effect.ts      # Workspace 清理邏輯
│   │   └── index.ts
│   │
│   ├── tasks/                                # Tasks 相關 Effects
│   │   ├── tasks-sync.effect.ts             # 同步 Tasks 資料
│   │   ├── task-optimistic-update.effect.ts # 樂觀更新邏輯
│   │   └── index.ts
│   │
│   ├── documents/                            # Documents 相關 Effects
│   │   ├── documents-sync.effect.ts         # 同步 Documents 資料
│   │   ├── document-upload.effect.ts        # 文件上傳邏輯
│   │   └── index.ts
│   │
│   └── index.ts                              # Effects 總匯出
│
├── commands/                                  # Command Handlers (命令處理器)
│   │
│   ├── workspace/                            # Workspace 命令處理器
│   │   ├── create-workspace.handler.ts      # 創建 Workspace 處理器
│   │   ├── update-workspace.handler.ts      # 更新 Workspace 處理器
│   │   ├── archive-workspace.handler.ts     # 封存 Workspace 處理器
│   │   ├── invite-member.handler.ts         # 邀請成員處理器
│   │   └── index.ts
│   │
│   ├── tasks/                                # Task 命令處理器
│   │   ├── create-task.handler.ts           # 創建 Task 處理器
│   │   ├── update-task.handler.ts           # 更新 Task 處理器
│   │   ├── assign-task.handler.ts           # 分配 Task 處理器
│   │   ├── complete-task.handler.ts         # 完成 Task 處理器
│   │   └── index.ts
│   │
│   ├── documents/                            # Document 命令處理器
│   │   ├── create-document.handler.ts       # 創建 Document 處理器
│   │   ├── update-document.handler.ts       # 更新 Document 處理器
│   │   ├── share-document.handler.ts        # 分享 Document 處理器
│   │   └── index.ts
│   │
│   ├── base/                                 # 基礎命令處理器
│   │   ├── command-handler.interface.ts     # CommandHandler 介面
│   │   ├── command-bus.service.ts           # CommandBus 服務 (可選)
│   │   └── index.ts
│   │
│   └── index.ts                              # Commands 總匯出
│
├── queries/                                   # Query Handlers (查詢處理器)
│   │
│   ├── workspace/                            # Workspace 查詢處理器
│   │   ├── get-workspace.handler.ts         # 取得 Workspace 處理器
│   │   ├── list-workspaces.handler.ts       # 列出 Workspaces 處理器
│   │   ├── get-workspace-members.handler.ts # 取得成員處理器
│   │   └── index.ts
│   │
│   ├── tasks/                                # Task 查詢處理器
│   │   ├── get-task.handler.ts              # 取得 Task 處理器
│   │   ├── list-tasks.handler.ts            # 列出 Tasks 處理器
│   │   ├── get-task-by-status.handler.ts    # 依狀態查詢處理器
│   │   └── index.ts
│   │
│   ├── documents/                            # Document 查詢處理器
│   │   ├── get-document.handler.ts          # 取得 Document 處理器
│   │   ├── list-documents.handler.ts        # 列出 Documents 處理器
│   │   └── index.ts
│   │
│   ├── base/                                 # 基礎查詢處理器
│   │   ├── query-handler.interface.ts       # QueryHandler 介面
│   │   ├── query-bus.service.ts             # QueryBus 服務 (可選)
│   │   └── index.ts
│   │
│   └── index.ts                              # Queries 總匯出
│
├── services/                                  # Application Services (應用服務)
│   │
│   ├── workspace/                            # Workspace 相關服務
│   │   ├── workspace-guard.service.ts       # Workspace 守衛服務
│   │   ├── workspace-context.service.ts     # Workspace 上下文服務
│   │   ├── workspace-switch.service.ts      # Workspace 切換服務
│   │   └── index.ts
│   │
│   ├── permissions/                          # 權限相關服務
│   │   ├── permission-checker.service.ts    # 權限檢查服務
│   │   ├── permission-enforcer.service.ts   # 權限強制執行服務
│   │   └── index.ts
│   │
│   ├── quota/                                # 配額相關服務
│   │   ├── quota-enforcer.service.ts        # 配額強制執行服務
│   │   ├── quota-calculator.service.ts      # 配額計算服務
│   │   └── index.ts
│   │
│   ├── event-bus/                            # 事件總線服務
│   │   ├── event-bus.service.ts             # EventBus 服務
│   │   ├── event-publisher.service.ts       # Event 發布服務
│   │   ├── event-subscriber.service.ts      # Event 訂閱服務
│   │   └── index.ts
│   │
│   ├── notification/                         # 通知相關服務
│   │   ├── notification.service.ts          # 通知服務
│   │   ├── toast.service.ts                 # Toast 通知服務
│   │   └── index.ts
│   │
│   └── index.ts                              # Services 總匯出
│
├── mappers/                                   # Data Mappers (資料映射器)
│   │
│   ├── workspace/                            # Workspace 映射器
│   │   ├── workspace-to-dto.mapper.ts       # Workspace Entity → DTO
│   │   ├── dto-to-workspace.mapper.ts       # DTO → Workspace Entity
│   │   ├── workspace-to-firestore.mapper.ts # Workspace → Firestore Document
│   │   ├── firestore-to-workspace.mapper.ts # Firestore Document → Workspace
│   │   └── index.ts
│   │
│   ├── tasks/                                # Task 映射器
│   │   ├── task-to-dto.mapper.ts            # Task Entity → DTO
│   │   ├── dto-to-task.mapper.ts            # DTO → Task Entity
│   │   ├── task-to-firestore.mapper.ts      # Task → Firestore Document
│   │   ├── firestore-to-task.mapper.ts      # Firestore Document → Task
│   │   └── index.ts
│   │
│   ├── documents/                            # Document 映射器
│   │   ├── document-to-dto.mapper.ts        # Document Entity → DTO
│   │   ├── dto-to-document.mapper.ts        # DTO → Document Entity
│   │   ├── document-to-firestore.mapper.ts  # Document → Firestore Document
│   │   ├── firestore-to-document.mapper.ts  # Firestore Document → Document
│   │   └── index.ts
│   │
│   └── index.ts                              # Mappers 總匯出
│
├── validators/                                # Validators (驗證器)
│   │
│   ├── workspace/                            # Workspace 驗證器
│   │   ├── workspace-name.validator.ts      # Workspace 名稱驗證
│   │   ├── workspace-slug.validator.ts      # Workspace Slug 驗證
│   │   ├── workspace-quota.validator.ts     # Workspace 配額驗證
│   │   └── index.ts
│   │
│   ├── tasks/                                # Task 驗證器
│   │   ├── task-title.validator.ts          # Task 標題驗證
│   │   ├── task-deadline.validator.ts       # Task 截止日期驗證
│   │   └── index.ts
│   │
│   ├── documents/                            # Document 驗證器
│   │   ├── document-name.validator.ts       # Document 名稱驗證
│   │   ├── file-size.validator.ts           # 檔案大小驗證
│   │   └── index.ts
│   │
│   └── index.ts                              # Validators 總匯出
│
├── guards/                                    # Route Guards (路由守衛)
│   │
│   ├── auth.guard.ts                         # 認證守衛
│   ├── workspace.guard.ts                    # Workspace 守衛
│   ├── workspace-member.guard.ts             # Workspace 成員守衛
│   ├── workspace-owner.guard.ts              # Workspace 擁有者守衛
│   ├── module-permission.guard.ts            # 模組權限守衛
│   └── index.ts
│
├── interceptors/                              # HTTP Interceptors (HTTP 攔截器)
│   │
│   ├── auth.interceptor.ts                   # 認證攔截器
│   ├── workspace-context.interceptor.ts      # Workspace 上下文攔截器
│   ├── error-handler.interceptor.ts          # 錯誤處理攔截器
│   ├── loading.interceptor.ts                # Loading 狀態攔截器
│   └── index.ts
│
├── pipes/                                     # Custom Pipes (自訂管道)
│   │
│   ├── workspace-filter.pipe.ts              # Workspace 過濾管道
│   ├── task-status.pipe.ts                   # Task 狀態管道
│   ├── member-role.pipe.ts                   # 成員角色管道
│   ├── date-format.pipe.ts                   # 日期格式化管道
│   └── index.ts
│
├── directives/                                # Custom Directives (自訂指令)
│   │
│   ├── has-permission.directive.ts           # 權限檢查指令
│   ├── workspace-scoped.directive.ts         # Workspace 範圍指令
│   └── index.ts
│
├── models/                                    # Application Models (應用模型)
│   │
│   ├── common/                               # 通用模型
│   │   ├── api-response.model.ts            # API 回應模型
│   │   ├── pagination.model.ts              # 分頁模型
│   │   ├── sort.model.ts                    # 排序模型
│   │   ├── filter.model.ts                  # 過濾模型
│   │   └── index.ts
│   │
│   ├── dto/                                  # Data Transfer Objects
│   │   ├── workspace.dto.ts                 # Workspace DTO
│   │   ├── task.dto.ts                      # Task DTO
│   │   ├── document.dto.ts                  # Document DTO
│   │   ├── member.dto.ts                    # Member DTO
│   │   └── index.ts
│   │
│   ├── view-models/                          # View Models (視圖模型)
│   │   ├── workspace-list.view-model.ts     # WorkspaceList ViewModel
│   │   ├── task-detail.view-model.ts        # TaskDetail ViewModel
│   │   ├── document-tree.view-model.ts      # DocumentTree ViewModel
│   │   └── index.ts
│   │
│   └── index.ts                              # Models 總匯出
│
├── utils/                                     # Utility Functions (工具函數)
│   │
│   ├── store/                                # Store 相關工具
│   │   ├── create-entity-adapter.util.ts    # Entity Adapter 建立工具
│   │   ├── patch-state-helper.util.ts       # patchState 輔助函數
│   │   └── index.ts
│   │
│   ├── operators/                            # RxJS 自訂操作符
│   │   ├── filter-by-workspace.operator.ts  # Workspace 過濾操作符
│   │   ├── retry-with-backoff.operator.ts   # 重試操作符
│   │   └── index.ts
│   │
│   ├── helpers/                              # 輔助函數
│   │   ├── workspace-context.helper.ts      # Workspace 上下文輔助
│   │   ├── permission.helper.ts             # 權限輔助函數
│   │   └── index.ts
│   │
│   └── index.ts                              # Utils 總匯出
│
├── constants/                                 # Constants (常數)
│   │
│   ├── api.constants.ts                      # API 相關常數
│   ├── routes.constants.ts                   # 路由常數
│   ├── storage-keys.constants.ts             # Storage Key 常數
│   ├── permission.constants.ts               # 權限常數
│   └── index.ts
│
└── index.ts                                   # Application Layer 總匯出
```

## 關鍵設計原則

### 1. NgRx Signals Store 架構

#### Store 分層
```typescript
// GlobalShell (Root Level) - Application-wide state
providedIn: 'root'
Signals: authUser, appConfig, layoutMode, currentRoute
Computed: isAuthenticated, effectiveTheme, canAccessWorkspaces
Methods: updateAuthUser, setConfig, toggleLayout, navigate
Effects: rxMethod for async operations

// WorkspaceList (Account Level) - User's workspaces
providedIn: 'root'
Signals: workspaces, currentWorkspaceId, loading, error
Computed: ownedWorkspaces, memberWorkspaces, currentWorkspace
Methods: loadWorkspaces, selectWorkspace, addWorkspace
Effects: fetchWorkspacesFromFirestore, subscribeToWorkspaceChanges

// Workspace (Context Store) - Current workspace context
providedIn: 'root'
Signals: workspace, permissions, preferences, members, modules
Computed: workspaceName, currentUserRole, enabledModules
Methods: loadWorkspace, updateWorkspace, addMember
Effects: fetchWorkspaceFromFirestore, syncPermissions

// Feature Stores (Module Level) - Module-specific state
providedIn: 'root' or scoped
Signals: entities, selectedEntity, filters, sorting, pagination
Computed: filteredEntities, sortedEntities, paginatedEntities
Methods: loadEntities, addEntity, updateEntity, deleteEntity
Effects: fetchEntitiesFromFirestore, persistEntity

// Entity Stores (Entity Level) - Normalized entity cache
providedIn: 'root' or scoped
Signals: entities, ids, selectedIds
Computed: entitiesArray, entitiesMap, entityById
Methods: setAllEntities, addOneEntity, updateOneEntity
Effects: syncWithFirestore, handleRealtimeUpdates
```

#### Store 組成結構 (withState, withComputed, withMethods, withHooks)
```typescript
// 典型的 Store 檔案結構
export const TasksStore = signalStore(
  { providedIn: 'root' },
  
  // State
  withState<TasksState>({
    tasks: [],
    selectedTaskId: null,
    filters: {},
    loading: false,
    error: null
  }),
  
  // Computed
  withComputed((store) => ({
    filteredTasks: computed(() => /* ... */),
    selectedTask: computed(() => /* ... */),
    canCreateTask: computed(() => /* ... */)
  })),
  
  // Methods
  withMethods((store, 
    firestoreService = inject(FirestoreService),
    workspaceStore = inject(WorkspaceStore)
  ) => ({
    loadTasks: rxMethod<void>(/* ... */),
    addTask: (task: Task) => { patchState(store, /* ... */) },
    updateTask: (id: string, changes: Partial<Task>) => { /* ... */ }
  })),
  
  // Hooks
  withHooks({
    onInit(store) { /* ... */ },
    onDestroy(store) { /* ... */ }
  })
);
```

### 2. 依賴注入模式

```typescript
// Store 之間的依賴
withMethods((store,
  // Firebase Services
  firestore = inject(Firestore),
  auth = inject(Auth),
  
  // Other Stores
  workspaceStore = inject(WorkspaceStore),
  authStore = inject(AuthStore),
  
  // Application Services
  permissionChecker = inject(PermissionCheckerService),
  eventBus = inject(EventBusService)
) => ({
  // Methods implementation
}))
```

### 3. 命令與查詢分離 (CQRS)

```typescript
// Command Handler Pattern
export class CreateWorkspaceHandler implements CommandHandler<CreateWorkspaceCommand> {
  constructor(
    private firestore: Firestore,
    private workspaceListStore: WorkspaceListStore,
    private eventBus: EventBusService
  ) {}
  
  async execute(command: CreateWorkspaceCommand): Promise<void> {
    // 1. Validate command
    // 2. Execute business logic
    // 3. Update store (optimistic)
    // 4. Persist to Firestore
    // 5. Publish domain event
    // 6. Handle errors (rollback if needed)
  }
}

// Query Handler Pattern
export class GetWorkspaceHandler implements QueryHandler<GetWorkspaceQuery, Workspace> {
  constructor(
    private firestore: Firestore,
    private workspaceStore: WorkspaceStore
  ) {}
  
  async execute(query: GetWorkspaceQuery): Promise<Workspace> {
    // 1. Check cache (store)
    // 2. If not in cache, fetch from Firestore
    // 3. Transform to domain entity
    // 4. Return result
  }
}
```

### 4. 效應模式 (rxMethod)

```typescript
// rxMethod Pattern for Effects
export const TasksStore = signalStore(
  withMethods((store, firestore = inject(Firestore)) => ({
    
    // Effect: Load tasks from Firestore
    loadTasks: rxMethod<string>( // workspaceId
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => patchState(store, { loading: true })),
        switchMap((workspaceId) =>
          collectionData(
            query(
              collection(firestore, 'tasks'),
              where('workspaceId', '==', workspaceId)
            )
          ).pipe(
            tapResponse({
              next: (tasks) => patchState(store, { tasks, loading: false }),
              error: (error) => patchState(store, { error, loading: false })
            })
          )
        )
      )
    ),
    
    // Effect: Create task with optimistic update
    createTask: rxMethod<Task>(
      pipe(
        tap((task) => {
          // Optimistic update
          patchState(store, (state) => ({
            tasks: [...state.tasks, task]
          }));
        }),
        switchMap((task) =>
          from(addDoc(collection(firestore, 'tasks'), task)).pipe(
            tapResponse({
              next: (docRef) => {
                // Update with real ID
                patchState(store, (state) => ({
                  tasks: state.tasks.map(t => 
                    t.id === task.id ? { ...t, id: docRef.id } : t
                  )
                }));
              },
              error: (error) => {
                // Rollback on error
                patchState(store, (state) => ({
                  tasks: state.tasks.filter(t => t.id !== task.id),
                  error
                }));
              }
            })
          )
        )
      )
    )
  }))
);
```

### 5. 狀態隔離與切換

```typescript
// Workspace Switch Effect
export const WorkspaceSwitchEffect = {
  
  // Listen to workspace changes
  handleWorkspaceSwitch: rxMethod<string>( // newWorkspaceId
    pipe(
      distinctUntilChanged(),
      tap(() => {
        // 1. Clear all workspace-scoped stores
        tasksStore.reset();
        documentsStore.reset();
        membersStore.reset();
        
        // 2. Clear entity caches
        taskEntityStore.clear();
        documentEntityStore.clear();
        
        // 3. Keep global shell state
        // (authStore, configStore, layoutStore remain unchanged)
      }),
      switchMap((workspaceId) =>
        // 4. Load new workspace context
        workspaceStore.loadWorkspace(workspaceId)
      )
    )
  )
};
```

### 6. 資料映射層

```typescript
// Domain Entity ↔ DTO ↔ Firestore Document

// Firestore → Domain
export class FirestoreToWorkspaceMapper {
  static toDomain(doc: DocumentSnapshot): Workspace {
    const data = doc.data();
    return new Workspace({
      id: new WorkspaceId(doc.id),
      identity: new WorkspaceIdentity({
        name: data.name,
        slug: new Slug(data.slug),
        description: data.description
      }),
      // ... map other fields
    });
  }
}

// Domain → Firestore
export class WorkspaceToFirestoreMapper {
  static toDocument(workspace: Workspace): any {
    return {
      name: workspace.identity.name,
      slug: workspace.identity.slug.value,
      description: workspace.identity.description,
      // ... map other fields
    };
  }
}
```

### 7. 錯誤處理策略

```typescript
// Centralized Error Handling in Effects
export const errorHandler = {
  
  handleFirestoreError: (error: any) => {
    if (error.code === 'permission-denied') {
      return new AuthorizationError('沒有權限執行此操作');
    } else if (error.code === 'not-found') {
      return new NotFoundError('找不到資源');
    } else {
      return new DomainError('發生未知錯誤');
    }
  },
  
  handleValidationError: (error: ValidationError) => {
    // Show toast notification
    toastService.error(error.message);
    return error;
  }
};

// Usage in rxMethod
rxMethod<T>(
  pipe(
    switchMap((input) => /* ... */),
    catchError((error) => {
      const domainError = errorHandler.handleFirestoreError(error);
      patchState(store, { error: domainError });
      return EMPTY;
    })
  )
)
```

### 8. 樂觀更新模式

```typescript
// Optimistic Update Pattern
export class OptimisticUpdateService {
  
  updateTaskWithOptimism(
    task: Task,
    changes: Partial<Task>
  ): Observable<Task> {
    // 1. Generate optimistic result
    const optimisticTask = { ...task, ...changes };
    
    // 2. Update store immediately
    tasksStore.updateTask(optimisticTask);
    
    // 3. Persist to backend
    return this.firestore.update(task.id, changes).pipe(
      tapResponse({
        next: (result) => {
          // 4. Update with server result
          tasksStore.updateTask(result);
        },
        error: (error) => {
          // 5. Rollback on error
          tasksStore.updateTask(task);
          throw error;
        }
      })
    );
  }
}
```

## 檔案命名規範

- **Store**: `{feature}.store.ts` (例: `tasks.store.ts`)
- **Models**: `{feature}.models.ts` (例: `tasks.models.ts`)
- **Selectors**: `{feature}.selectors.ts` (例: `tasks.selectors.ts`)
- **Effect**: `{action}-{feature}.effect.ts` (例: `tasks-sync.effect.ts`)
- **Command Handler**: `{action}-{entity}.handler.ts` (例: `create-task.handler.ts`)
- **Query Handler**: `{action}-{entity}.handler.ts` (例: `get-task.handler.ts`)
- **Mapper**: `{source}-to-{target}.mapper.ts` (例: `firestore-to-task.mapper.ts`)
- **Service**: `{feature}.service.ts` (例: `workspace-guard.service.ts`)
- **Guard**: `{feature}.guard.ts` (例: `workspace.guard.ts`)
- **Validator**: `{field}.validator.ts` (例: `task-title.validator.ts`)

## 與 Domain Layer 的關係

```
Domain Layer (Pure Business Logic)
        ↑ (uses)
Application Layer (Orchestration & State Management)
        ↓ (calls)
Infrastructure Layer (Firebase, External Services)
```

Application Layer 職責:
1. 協調 Domain Layer 的業務邏輯
2. 管理應用狀態 (NgRx Signals Stores)
3. 處理副作用 (rxMethod Effects)
4. 轉換資料格式 (Mappers)
5. 執行命令和查詢 (CQRS)
6. 發布和訂閱事件 (EventBus)
7. 路由守衛和攔截器

## TypeScript 類型安全

```typescript
// Strict typing for Store State
interface TasksState {
  readonly tasks: ReadonlyArray<Task>;
  readonly selectedTaskId: string | null;
  readonly filters: TaskFilters;
  readonly loading: boolean;
  readonly error: DomainError | null;
}

// Branded types for IDs
type TaskId = string & { readonly brand: unique symbol };
type WorkspaceId = string & { readonly brand: unique symbol };

// Discriminated unions for results
type Result<T, E = Error> =
  | { success: true; value: T }
  | { success: false; error: E };
```

## 測試策略

```typescript
// Store 測試
describe('TasksStore', () => {
  it('should load tasks', async () => {
    const store = new TasksStore();
    await store.loadTasks('workspace-1');
    expect(store.tasks()).toHaveLength(5);
  });
});

// Effect 測試
describe('TasksSyncEffect', () => {
  it('should sync tasks from Firestore', (done) => {
    const effect = TasksSyncEffect.syncTasks;
    effect('workspace-1').subscribe({
      next: (tasks) => {
        expect(tasks).toBeDefined();
        done();
      }
    });
  });
});

// Handler 測試
describe('CreateTaskHandler', () => {
  it('should create task', async () => {
    const handler = new CreateTaskHandler(/* deps */);
    const command = new CreateTaskCommand(/* ... */);
    await handler.execute(command);
    expect(tasksStore.tasks()).toContain(/* ... */);
  });
});
```