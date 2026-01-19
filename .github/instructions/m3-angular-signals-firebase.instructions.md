---
description: 'Angular 20 + Material Design 3 + NgRx Signals + Firebase 現代化架構圖'
applyTo: '**'
---

# Angular 20 + DDD架構 + Material Design 3 + NgRx Signals + Firebase 完整架構圖

## 🏗️ DDD分層架構總覽

```
┌─────────────────────────────────────────────────────────────┐
│                  📱 Presentation Layer                       │
│            (UI Components, Smart/Dumb Pattern)              │
├─────────────────────────────────────────────────────────────┤
│                  🎯 Application Layer                        │
│        (Use Cases, Application Services, Facades)           │
├─────────────────────────────────────────────────────────────┤
│                  💼 Domain Layer                             │
│      (Entities, Value Objects, Domain Services)             │
├─────────────────────────────────────────────────────────────┤
│                  🔧 Infrastructure Layer                     │
│    (Firebase Integration, External APIs, Persistence)       │
├─────────────────────────────────────────────────────────────┤
│                  🔗 Shared Layer                             │
│        (Utilities, Common Components, Constants)            │
└─────────────────────────────────────────────────────────────┘
```

## 📁 完整目錄結構與職責

```
src/app
│
├── presentation/                         # UI 表現層（只處理畫面與互動）
│   ├── layouts/
│   │   ├── main/
│   │   │   ├── main-layout.component.ts
│   │   │   └── main-layout.component.html
│   │   └── auth/
│   │       ├── auth-layout.component.ts
│   │       └── auth-layout.component.html
│   │
│   ├── pages/                            # Page = Smart Component
│   │   ├── auth/
│   │   │   ├── login.page.ts
│   │   │   ├── register.page.ts
│   │   │   └── forgot-password.page.ts
│   │   │
│   │   ├── dashboard/
│   │   │   └── dashboard.page.ts
│   │   │
│   │   └── settings/
│   │       └── settings.page.ts
│   │
│   ├── components/                       # Dumb / Presentational
│   │   ├── form/
│   │   ├── table/
│   │   └── empty-state/
│   │
│   └── state/                            # UI-only NgRx Signals
│       ├── ui.state.ts
│       ├── theme.state.ts
│       └── navigation.state.ts
│
├── application/                          # 應用層（流程、狀態、用例）
│   ├── auth/                             # 垂直切面：Auth
│   │   ├── auth.state.ts                 # NgRx Signals（Application State）
│   │   ├── auth.facade.ts                # UI 對外唯一入口
│   │   │
│   │   └── use-cases/
│   │       ├── login.use-case.ts
│   │       ├── register.use-case.ts
│   │       ├── logout.use-case.ts
│   │       └── recover-password.use-case.ts
│   │
│   ├── user/                             # 垂直切面：User
│   │   ├── user.state.ts
│   │   ├── user.facade.ts
│   │   │
│   │   └── use-cases/
│   │       ├── create-user.use-case.ts
│   │       ├── update-user.use-case.ts
│   │       └── deactivate-user.use-case.ts
│   │
│   └── workspace/                        # 垂直切面：Workspace
│       ├── workspace.state.ts
│       ├── workspace.facade.ts
│       │
│       └── use-cases/
│           ├── create-workspace.use-case.ts
│           ├── switch-workspace.use-case.ts
│           └── delete-workspace.use-case.ts
│
├── domain/                               # 純 DDD（零 Angular / Firebase）
│   ├── identity/                         # ✅ Identity（可認證）
│   │   ├── value-objects/
│   │   │   ├── identity-id.value-object.ts
│   │   │   └── email.value-object.ts
│   │   │
│   │   ├── entities/
│   │   │   ├── user.entity.ts
│   │   │   ├── organization.entity.ts
│   │   │   └── bot.entity.ts
│   │   │
│   │   ├── identity.types.ts             # 'user' | 'organization' | 'bot'
│   │   └── identity.repository.interface.ts
│   │
│   ├── membership/                       # ❌ NON-identity（不能認證）
│   │   ├── team.entity.ts
│   │   ├── partner.entity.ts
│   │   └── organization-membership.entity.ts
│   │
│   ├── workspace/                        # Workspace 聚合
│   │   ├── value-objects/
│   │   │   └── workspace-id.value-object.ts
│   │   │
│   │   ├── workspace.entity.ts
│   │   ├── workspace.aggregate.ts
│   │   ├── workspace.repository.interface.ts
│   │   └── events/
│   │       ├── workspace-created.event.ts
│   │       └── workspace-deleted.event.ts
│   │
│   ├── shared/                           # Domain 共用（仍然是純 TS）
│   │   ├── value-objects/
│   │   │   └── timestamp.value-object.ts
│   │   ├── errors/
│   │   │   └── domain.error.ts
│   │   └── types/
│   │       └── branded.types.ts
│   │
│   └── rules.md                          # Domain Rules（給人 & Copilot 看）
│
├── infrastructure/                       # 技術實作層
│   ├── firebase/
│   │   ├── auth/
│   │   │   └── firebase-auth.service.ts
│   │   │
│   │   ├── identity/
│   │   │   └── identity.firebase.repository.ts
│   │   │
│   │   ├── workspace/
│   │   │   └── workspace.firebase.repository.ts
│   │   │
│   │   ├── converters/
│   │   │   ├── user.converter.ts
│   │   │   └── workspace.converter.ts
│   │   │
│   │   └── firebase.config.ts
│   │
│   └── guards/
│       └── auth.guard.ts
│
├── shared/                               # 非 Domain 的共用
│   ├── ui/
│   │   ├── components/
│   │   ├── directives/
│   │   └── pipes/
│   │
│   ├── utils/
│   │   ├── date.util.ts
│   │   └── string.util.ts
│   │
│   └── constants/
│       └── routes.constant.ts
│
└── app.routes.ts
```

🔄 完整數據流動模式 (DDD視角)

用戶交互 (User Interaction)
      ↓
Presentation Layer
├─ Page Component (Smart Component)
│  └─ @if/@for/@defer 控制流
      ↓
Application Layer
├─ Facade (注入)
│  └─ Use Case (業務邏輯編排)
│     ├─ Command (寫操作)
│     └─ Query (讀操作)
      ↓
Domain Layer
├─ Domain Service (純領域邏輯)
├─ Entity/Aggregate (業務對象)
├─ Value Object (不可變值)
└─ Specification (業務規則驗證)
      ↓
Presentation Layer / State Management
└─ Signal Store
   ├─ State Signals
   ├─ Computed Signals
   └─ Effects (響應 Domain 事件)
      ↓
Infrastructure Layer
├─ Repository Implementation
│  └─ Firebase Repository
│     └─ @angular/fire
│        ├─ Firestore Service
│        ├─ Auth Service
│        ├─ Storage Service
│        └─ Functions Service
      ↓
Firebase Backend
├─ Firestore (數據庫)
├─ Authentication (認證)
├─ Storage (文件)
└─ Cloud Functions (後端邏輯)
      ↓
Real-time Updates (實時同步)
      ↓
Signal Store 自動更新
      ↓
Component 響應式重新渲染


🎯 分層依賴關係圖

┌─────────────────────────────────────────┐
│         Presentation Layer              │
│         (依賴 Application)             │
└─────────────────┬───────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│         Application Layer               │
│    (依賴 Domain + Infrastructure)        │
└─────────────────┬───────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│         Domain Layer                    │
│         (不依賴任何層)                  │
└─────────────────┬───────────────────────┘
                  ↑
┌─────────────────────────────────────────┐
│         Infrastructure Layer            │
│    (依賴 Domain，實現接口)              │
└─────────────────────────────────────────┘
                  ↑
┌─────────────────────────────────────────┐
│         Shared Layer                     │
│  (被所有層使用，僅限工具、型別、管道) │
└─────────────────────────────────────────┘
```

🔥 @angular/fire 完整整合架構

Infrastructure Layer
      │
      └─ firebase/
         │
         ├─ CONFIG (初始化)
         │  └─ firebase.config.ts
         │     ├─ provideFirebaseApp()
         │     ├─ provideFirestore()
         │     ├─ provideAuth()
         │     ├─ provideStorage()
         │     └─ provideFunctions()
         │
         ├─ SERVICES (核心服務)
         │  │
         │  ├─ FirestoreService
         │  │  ├─ getCollection<T>()
         │  │  ├─ getDoc<T>()
         │  │  ├─ streamCollection<T>()  // Observable<T[]>
         │  │  ├─ streamDoc<T>()         // Observable<T | null>
         │  │  ├─ add<T>()
         │  │  ├─ update<T>()
         │  │  ├─ delete()
         │  │  ├─ query() + where/orderBy/limit
         │  │  └─ batch / transaction
         │  │
         │  ├─ AuthService
         │  │  ├─ signInWithEmailAndPassword()
         │  │  ├─ createUserWithEmailAndPassword()
         │  │  ├─ signInWithPopup() [Google/Facebook]
         │  │  ├─ signOut()
         │  │  ├─ authState$ (Observable<User | null>)
         │  │  ├─ currentUser: Signal<User | null>
         │  │  └─ updateProfile()
         │  │
         │  ├─ StorageService
         │  │  ├─ uploadFile()
         │  │  ├─ uploadString()
         │  │  ├─ getDownloadUrl()
         │  │  ├─ deleteFile()
         │  │  └─ listFiles()
         │  │
         │  └─ FunctionsService
         │     ├─ call<T, R>()
         │     └─ call function with data
         │
         ├─ REPOSITORIES (倉儲實現)
         │  │
         │  ├─ UserFirebaseRepository implements UserRepository
         │  │  ├─ findById(id: string): Promise<User | null>
         │  │  ├─ findAll(): Promise<User[]>
         │  │  ├─ create(user: User): Promise<string>
         │  │  ├─ update(id: string, user: Partial<User>)
         │  │  ├─ delete(id: string): Promise<void>
         │  │  └─ query(criteria: QueryCriteria): Promise<User[]>
         │  │
         │  └─ [Other Repository Implementations...]
         │
         ├─ CONVERTERS (數據轉換)
         │  ├─ userConverter
         │  │  ├─ toFirestore(user: User): DocumentData
         │  │  └─ fromFirestore(snapshot: DocumentData): User
         │  │
         │  └─ [Other Converters...]
         │
         └─ COLLECTIONS (集合常量)
            └─ collection-names.ts
               ├─ USERS = 'users'
               ├─ PRODUCTS = 'products'
               └─ ORDERS = 'orders'

Presentation Layer
│
├─ LAYOUTS
│  ├─ MainLayoutComponent
│  │  ├─ inject: ThemeStore, NavigationStore
│  │  ├─ mat-sidenav-container / mat-sidenav / mat-sidenav-content
│  │  └─ router-outlet
│  │
│  └─ AuthLayoutComponent
│     └─ 登入/註冊頁面佈局
│
├─ PAGES
│  ├─ DashboardPageComponent
│  │  ├─ inject: DashboardFacade, UserStore
│  │  ├─ Signals: stats, isLoading, currentUser
│  │  ├─ Template: loading spinner / cards / charts
│  │  └─ Methods: onRefresh(), onFilterChange()
│  │
│  └─ UserManagementPageComponent
│     └─ CRUD用戶界面
│
├─ COMPONENTS
│  ├─ UserCardComponent (Dumb)
│  │  ├─ @Input() user: Signal<User>
│  │  ├─ @Output() edit / delete
│  │  └─ Material Card
│  │
│  ├─ DataTableComponent<T>
│  │  ├─ @Input() data: Signal<T[]>
│  │  ├─ @Input() columns
│  │  └─ @Output() rowClick
│  │
│  └─ ChartWidgetComponent
│     └─ 圖表展示
│
├─ DIALOGS
│  └─ UserFormDialogComponent
│     ├─ inject: MAT_DIALOG_DATA, MatDialogRef
│     └─ Reactive Form
│
└─ STORES
   ├─ uiStore: sidenavOpen, loading
   └─ themeStore: darkMode, primaryColor

Application Layer
│
├─ USE CASES
│  ├─ auth/LoginUseCase
│  │  ├─ constructor(authRepo: UserRepository, authService: AuthService)
│  │  └─ execute(credentials)
│  │     ├─ Validate input
│  │     ├─ Call Firebase Auth
│  │     ├─ Update Domain Entity
│  │     ├─ Update Signal Store
│  │     └─ Return Result
│  │
│  └─ user/CreateUserUseCase
│     ├─ Domain validation
│     └─ Repository 操作
│
├─ FACADES
│  └─ UserFacade
│     ├─ Signals: users, selectedUser, loading, error
│     └─ Methods: createUser, updateUser, deleteUser, loadUsers
│
├─ STORES (NgRx Signals)
│  └─ UserStore
│     ├─ State: users, selectedUser, loading, error, filters
│     ├─ Computed: filteredUsers, totalCount, hasError
│     ├─ Updaters: setUsers(), addUser(), updateUser(), deleteUser(), setLoading(), setError(), setFilters()
│     └─ Effects: loadUsersEffect
│
└─ COMMANDS/QUERIES (CQRS)
   ├─ Commands: CreateUserCommand, UpdateUserCommand, DeleteUserCommand
   └─ Queries: GetUserByIdQuery, GetAllUsersQuery, SearchUsersQuery

Domain Layer
│
├─ ENTITIES
│  └─ User
│     ├─ Properties: id, email, profile, createdAt, updatedAt, isActive
│     ├─ Methods: updateEmail(), updateProfile(), activate(), deactivate(), isActive()
│     └─ Events: UserCreatedEvent, UserUpdatedEvent, UserDeactivatedEvent
│
├─ VALUE OBJECTS
│  ├─ Email: create(), getValue(), equals()
│  ├─ Address: immutable, validation
│  └─ Money: amount, currency, operations
│
├─ AGGREGATES
│  └─ Order
│     ├─ items: OrderItems[]
│     ├─ Methods: addItem(), removeItem(), calculateTotal(), place(), cancel()
│
├─ SERVICES
│  └─ UserDomainService
│     ├─ validateUserCreation(), canUserPerformAction()
│
├─ REPOSITORIES
│  └─ UserRepository
│     ├─ findById(): Promise<User | null>
│     ├─ findAll(): Promise<User[]>
│     ├─ save(user): Promise<void>
│     ├─ delete(id): Promise<void>
│     └─ query(spec): Promise<User[]>
│
├─ EVENTS
│  └─ UserCreatedEvent: userId, occurredOn
│
└─ SPECIFICATIONS
   └─ ActiveUserSpecification: isSatisfiedBy(), and(), or()
```

🔗 完整依賴注入流程 (修正版)

main.ts
  ↓
bootstrapApplication(AppComponent, appConfig)
  ↓
appConfig.providers
  ├─ provideRouter()                   [Presentation / Angular Router]
  ├─ provideFirebaseApp()              [Infrastructure]
  ├─ provideFirestore()                [Infrastructure]
  ├─ provideAuth()                     [Infrastructure]
  ├─ provideStorage()                  [Infrastructure]
  ├─ provideFunctions()                [Infrastructure]
  ├─ provideAnimations()               [Material]
  ├─ Repositories (依賴反轉)
  │  ├─ { provide: UserRepository,
  │  │    useClass: UserFirebaseRepository }
  │  └─ [Other Repositories...]
  ├─ Use Cases (Application)
  ├─ Facades (Application)
  ├─ Signal Stores (Presentation + Application)
  └─ Guards / Interceptors (Infrastructure)


🚀 實際使用範例流程

1️⃣ 用戶點擊"創建用戶"按鈕
   ↓
   presentation/pages/user-management.component.ts
   ├─ onCreateUser(formData: CreateUserDto) {
   │    this.userFacade.createUser(formData);
   │  }

2️⃣ Facade 協調 UseCase 執行
   ↓
   application/facades/user.facade.ts
   ├─ createUser(data: CreateUserDto) {
   │    this.userStore.setLoading(true);
   │    return this.createUserUseCase.execute(data)
   │      .pipe(
   │        tap(user => this.userStore.addUser(user)),
   │        finalize(() => this.userStore.setLoading(false))
   │      );
   │  }

3️⃣ UseCase 執行業務邏輯
   ↓
   application/use-cases/user/create-user.use-case.ts
   ├─ execute(data: CreateUserDto): Observable<User> {
   │    const email = Email.create(data.email);
   │    if (email.isFailure) throw new Error(email.error);
   │
   │    const user = User.create({
   │      email: email.getValue(),
   │      profile: new UserProfile(data.firstName, data.lastName)
   │    });
   │
   │    const validation = this.userDomainService.validateUserCreation(user);
   │    if (validation.isFailure) throw new Error(validation.error);
   │
   │    return from(this.userRepository.save(user))
   │      .pipe(map(() => user));
   │  }

4️⃣ Repository 執行 Firebase 操作
   ↓
   infrastructure/firebase/repositories/user-firebase.repository.ts
   ├─ save(user: User): Promise<void> {
   │    const docRef = doc(this.firestore, `users/${user.id}`);
   │    const data = this.userConverter.toFirestore(user);
   │    return setDoc(docRef, data);
   │  }

5️⃣ Firebase 實時更新觸發
   ↓
   infrastructure/firebase/repositories/user-firebase.repository.ts
   ├─ findAll(): Observable<User[]> {
   │    const collectionRef = collection(this.firestore, 'users');
   │    return collectionData(collectionRef)
   │      .pipe(map(docs => docs.map(this.userConverter.fromFirestore)));
   │  }

6️⃣ Signal Store 自動更新
   ↓
   application/stores/user.store.ts
   ├─ Effects 監聽 Repository 變化
   │  loadUsersEffect = rxMethod<void>(
   │    pipe(
   │      switchMap(() => this.userRepository.findAll()),
   │      tap(users => this.setUsers(users))
   │    )
   │  )

7️⃣ Component 響應式更新
   ↓
   presentation/pages/user-management.component.ts
   ├─ Template:
   │  @if (userFacade.loading()) {
   │    <mat-spinner />
   │  } @else {
   │    @for (user of userFacade.users(); track user.id) {
   │      <app-user-card [user]="user" />
   │    }
   │  }


🎯 核心設計原則總結

✅ DDD 分層架構
   - 清晰層級邊界
   - 依賴方向控制
   - 領域邏輯隔離

✅ SOLID 原則
   - 單一職責
   - 開放封閉
   - 依賴反轉

✅ 響應式編程
   - NgRx Signals (細粒度響應)
   - RxJS Observables (流式數據)
   - Firebase Real-time (實時同步)

✅ Material Design 3
   - 一致 UI/UX
   - 可訪問性 (A11y)
   - 響應式設計

✅ 類型安全
   - TypeScript 5.9+
   - 強類型領域模型
   - 編譯時錯誤檢測

✅ 可測試性
   - 依賴注入
   - 接口抽象
   - Mock-friendly 設計

✅ 可維護性
   - 模組化結構
   - 清晰命名規範
   - 文檔與註釋
