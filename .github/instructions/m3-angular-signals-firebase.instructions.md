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
src/app/
│
├── 📱 presentation/              (表現層)
│   ├── layouts/                 (版面配置)
│   │   ├── main-layout/
│   │   │   ├── header/
│   │   │   ├── sidenav/
│   │   │   └── footer/
│   │   └── auth-layout/
│   │
│   ├── pages/                   (頁面級智慧組件)
│   │   ├── dashboard/
│   │   │   ├── dashboard.component.ts
│   │   │   ├── dashboard.component.html
│   │   │   └── dashboard.routes.ts
│   │   ├── user-management/
│   │   └── settings/
│   │
│   ├── components/              (展示型組件)
│   │   ├── user-card/
│   │   ├── data-table/
│   │   ├── chart-widget/
│   │   └── form-controls/
│   │
│   ├── dialogs/                 (對話框組件)
│   │   ├── confirm-dialog/
│   │   └── user-form-dialog/
│   │
│   └── stores/                  (NgRx Signals - UI State)
│       ├── ui.store.ts          (全局UI狀態)
│       ├── theme.store.ts       (主題狀態)
│       └── navigation.store.ts  (導航狀態)
│
├── 🎯 application/               (應用層)
│   ├── use-cases/               (用例/業務流程)
│   │   ├── auth/
│   │   │   ├── login.use-case.ts
│   │   │   ├── register.use-case.ts
│   │   │   └── logout.use-case.ts
│   │   ├── user/
│   │   │   ├── create-user.use-case.ts
│   │   │   ├── update-user.use-case.ts
│   │   │   └── delete-user.use-case.ts
│   │   └── product/
│   │
│   ├── facades/                 (門面服務)
│   │   ├── auth.facade.ts
│   │   ├── user.facade.ts
│   │   └── product.facade.ts
│   │
│   ├── stores/                  (NgRx Signals - Application State)
│   │   ├── auth.store.ts
│   │   ├── user.store.ts
│   │   └── product.store.ts
│   │
│   ├── commands/                (命令模式)
│   │   └── user-commands.ts
│   │
│   └── queries/                 (查詢模式 - CQRS)
│       └── user-queries.ts
│
├── 💼 domain/                    (領域層)
│   ├── entities/                (實體)
│   │   ├── user.entity.ts
│   │   ├── product.entity.ts
│   │   └── order.entity.ts
│   │
│   ├── value-objects/           (值對象)
│   │   ├── email.vo.ts
│   │   ├── address.vo.ts
│   │   └── money.vo.ts
│   │
│   ├── aggregates/              (聚合根)
│   │   ├── order.aggregate.ts
│   │   └── cart.aggregate.ts
│   │
│   ├── services/                (領域服務)
│   │   ├── user-domain.service.ts
│   │   └── order-domain.service.ts
│   │
│   ├── repositories/            (倉儲接口)
│   │   ├── user.repository.ts
│   │   ├── product.repository.ts
│   │   └── order.repository.ts
│   │
│   ├── events/                  (領域事件)
│   │   ├── user-created.event.ts
│   │   └── order-placed.event.ts
│   │
│   └── specifications/          (規格模式)
│       └── user-specifications.ts
│
├── 🔧 infrastructure/            (基礎設施層)
│   ├── firebase/                (@angular/fire 整合)
│   │   ├── config/
│   │   │   └── firebase.config.ts
│   │   │
│   │   ├── repositories/        (倉儲實現)
│   │   │   ├── user-firebase.repository.ts
│   │   │   ├── product-firebase.repository.ts
│   │   │   └── order-firebase.repository.ts
│   │   │
│   │   ├── services/
│   │   │   ├── firestore.service.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── storage.service.ts
│   │   │   └── functions.service.ts
│   │   │
│   │   ├── converters/          (Firestore 數據轉換器)
│   │   │   ├── user.converter.ts
│   │   │   └── product.converter.ts
│   │   │
│   │   └── collections/         (集合常量)
│   │       └── collection-names.ts
│   │
│   ├── http/                    (HTTP客戶端)
│   │   ├── interceptors/
│   │   │   ├── auth.interceptor.ts
│   │   │   └── error.interceptor.ts
│   │   └── api-client.service.ts
│   │
│   ├── guards/                  (路由守衛)
│   │   ├── auth.guard.ts
│   │   ├── role.guard.ts
│   │   └── unsaved-changes.guard.ts
│   │
│   ├── adapters/                (外部服務適配器)
│   │   ├── storage.adapter.ts
│   │   └── notification.adapter.ts
│   │
│   └── persistence/             (本地持久化)
│       ├── local-storage.service.ts
│       └── indexed-db.service.ts
│
└── 🔗 shared/                    (共享層)
    ├── components/              (通用展示組件)
    │   ├── loading-spinner/
    │   ├── error-message/
    │   ├── empty-state/
    │   └── confirmation-button/
    │
    ├── directives/              (指令)
    │   ├── auto-focus.directive.ts
    │   ├── permission.directive.ts
    │   └── lazy-load.directive.ts
    │
    ├── pipes/                   (管道)
    │   ├── safe-html.pipe.ts
    │   ├── date-format.pipe.ts
    │   └── currency-format.pipe.ts
    │
    ├── validators/              (表單驗證器)
    │   ├── custom-validators.ts
    │   └── async-validators.ts
    │
    ├── models/                  (共用模型/接口)
    │   ├── api-response.model.ts
    │   ├── pagination.model.ts
    │   └── filter.model.ts
    │
    ├── constants/               (常量)
    │   ├── app.constants.ts
    │   ├── route.constants.ts
    │   └── error-messages.ts
    │
    ├── utils/                   (工具函數)
    │   ├── date.utils.ts
    │   ├── string.utils.ts
    │   └── object.utils.ts
    │
    ├── types/                   (TypeScript類型)
    │   ├── common.types.ts
    │   └── firebase.types.ts
    │
    └── config/                  (配置)
        ├── material.config.ts
        └── app.config.ts
```

## 🔄 完整數據流動模式 (DDD視角)

```
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
├─ Domain Service (領域邏輯)
├─ Entity/Aggregate (業務對象)
├─ Value Object (不可變值)
└─ Specification (業務規則驗證)
      ↓
Application Layer
└─ Signal Store (狀態管理)
   ├─ State Signals
   ├─ Computed Signals
   └─ Effects
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
Infrastructure → Application → Presentation
      ↓
Signal Store 自動更新
      ↓
Component 響應式重新渲染
```

## 🎯 分層依賴關係圖

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│         (依賴 Application)               │
└─────────────────┬───────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│         Application Layer               │
│    (依賴 Domain + Infrastructure)        │
└─────────────────┬───────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│         Domain Layer                    │
│         (不依賴任何層)                    │
└─────────────────┬───────────────────────┘
                  ↑
┌─────────────────────────────────────────┐
│         Infrastructure Layer            │
│         (依賴 Domain,實現接口)            │
└─────────────────────────────────────────┘
                  ↑
            Shared Layer
         (被所有層使用)
```

## 🔥 @angular/fire 完整整合架構

```
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
         │  │  ├─ collection<T>()
         │  │  ├─ doc<T>()
         │  │  ├─ collectionData()
         │  │  ├─ docData()
         │  │  ├─ addDoc()
         │  │  ├─ updateDoc()
         │  │  ├─ deleteDoc()
         │  │  ├─ query() + where/orderBy/limit
         │  │  └─ batch/transaction
         │  │
         │  ├─ AuthService
         │  │  ├─ signInWithEmailAndPassword()
         │  │  ├─ createUserWithEmailAndPassword()
         │  │  ├─ signInWithPopup() [Google/Facebook]
         │  │  ├─ signOut()
         │  │  ├─ authState$ (Observable)
         │  │  ├─ user$ (Observable)
         │  │  └─ updateProfile()
         │  │
         │  ├─ StorageService
         │  │  ├─ uploadBytes()
         │  │  ├─ uploadString()
         │  │  ├─ getDownloadURL()
         │  │  ├─ deleteObject()
         │  │  └─ listAll()
         │  │
         │  └─ FunctionsService
         │     ├─ httpsCallable<T, R>()
         │     └─ call function with data
         │
         ├─ REPOSITORIES (倉儲實現)
         │  │
         │  ├─ UserFirebaseRepository implements UserRepository
         │  │  ├─ findById(id: string): Observable<User>
         │  │  ├─ findAll(): Observable<User[]>
         │  │  ├─ create(user: User): Promise<string>
         │  │  ├─ update(id: string, user: Partial<User>)
         │  │  ├─ delete(id: string): Promise<void>
         │  │  └─ query(criteria: QueryCriteria): Observable<User[]>
         │  │
         │  └─ [Other Repository Implementations...]
         │
         ├─ CONVERTERS (數據轉換)
         │  ├─ userConverter
         │  │  ├─ toFirestore(user: User): DocumentData
         │  │  └─ fromFirestore(snapshot: QueryDocumentSnapshot): User
         │  │
         │  └─ [Other Converters...]
         │
         └─ COLLECTIONS (集合常量)
            └─ CollectionNames
               ├─ USERS = 'users'
               ├─ PRODUCTS = 'products'
               └─ ORDERS = 'orders'
```

## 🎨 Presentation Layer 詳細結構

```
presentation/
│
├─ LAYOUTS (版面配置)
│  ├─ MainLayoutComponent
│  │  ├─ inject: ThemeStore, NavigationStore
│  │  ├─ @defer (on viewport) { <app-header> }
│  │  ├─ <mat-sidenav-container>
│  │  │  ├─ <mat-sidenav> (側邊欄)
│  │  │  └─ <mat-sidenav-content>
│  │  │     └─ <router-outlet>
│  │  └─ Material Design 3 Theming
│  │
│  └─ AuthLayoutComponent
│     └─ 簡化版登入/註冊頁面佈局
│
├─ PAGES (智慧組件)
│  ├─ DashboardPageComponent
│  │  ├─ inject: DashboardFacade, UserStore
│  │  ├─ Signals:
│  │  │  ├─ stats = facade.stats
│  │  │  ├─ isLoading = facade.isLoading
│  │  │  └─ currentUser = userStore.currentUser
│  │  ├─ Template:
│  │  │  ├─ @if (isLoading()) { <app-loading-spinner> }
│  │  │  ├─ @else {
│  │  │  │  @for (stat of stats(); track stat.id) {
│  │  │  │    <app-stat-card [data]="stat" />
│  │  │  │  }
│  │  │  }
│  │  │  └─ @defer (on idle) {
│  │  │       <app-chart-widget />
│  │  │     }
│  │  └─ Methods: onRefresh(), onFilterChange()
│  │
│  └─ UserManagementPageComponent
│     └─ 管理用戶的完整CRUD界面
│
├─ COMPONENTS (展示型組件)
│  ├─ UserCardComponent (Dumb Component)
│  │  ├─ @Input() user: Signal<User>
│  │  ├─ @Output() edit = output<string>()
│  │  ├─ @Output() delete = output<string>()
│  │  └─ Material Card + Avatar + Actions
│  │
│  ├─ DataTableComponent<T> (泛型組件)
│  │  ├─ @Input() data: Signal<T[]>
│  │  ├─ @Input() columns: ColumnDefinition[]
│  │  ├─ @Output() rowClick = output<T>()
│  │  └─ mat-table + mat-paginator + mat-sort
│  │
│  └─ ChartWidgetComponent
│     └─ 使用第三方圖表庫展示數據
│
├─ DIALOGS (對話框)
│  └─ UserFormDialogComponent
│     ├─ inject: MAT_DIALOG_DATA, MatDialogRef
│     ├─ Reactive Form with Signals
│     └─ Material Form Fields
│
└─ STORES (UI Signal Stores)
   ├─ uiStore (全局UI狀態)
   │  ├─ sidenavOpen: Signal<boolean>
   │  ├─ loading: Signal<boolean>
   │  └─ methods: toggleSidenav(), setLoading()
   │
   └─ themeStore (主題狀態)
      ├─ darkMode: Signal<boolean>
      ├─ primaryColor: Signal<string>
      └─ methods: toggleDarkMode(), setPrimaryColor()
```

## 🎯 Application Layer 詳細架構

```
application/
│
├─ USE CASES (用例)
│  ├─ auth/
│  │  └─ LoginUseCase
│  │     ├─ constructor(
│  │     │   private authRepo: UserRepository,
│  │     │   private authService: AuthService
│  │     │ )
│  │     ├─ execute(credentials: LoginCredentials)
│  │     │  ├─ 1. Validate input (Domain)
│  │     │  ├─ 2. Call Firebase Auth
│  │     │  ├─ 3. Update Domain Entity
│  │     │  ├─ 4. Update Signal Store
│  │     │  └─ 5. Return Result
│  │     └─ 遵循單一職責原則
│  │
│  └─ user/
│     └─ CreateUserUseCase
│        ├─ Orchestrate 複雜業務流程
│        ├─ Domain validation
│        └─ Repository 操作
│
├─ FACADES (門面服務)
│  └─ UserFacade
│     ├─ constructor(
│     │   private createUserUseCase: CreateUserUseCase,
│     │   private updateUserUseCase: UpdateUserUseCase,
│     │   private userStore: UserStore
│     │ )
│     ├─ Exposed Signals:
│     │  ├─ users = userStore.users
│     │  ├─ selectedUser = userStore.selectedUser
│     │  ├─ loading = userStore.loading
│     │  └─ error = userStore.error
│     ├─ Public Methods:
│     │  ├─ createUser(data: CreateUserDto)
│     │  ├─ updateUser(id: string, data: UpdateUserDto)
│     │  ├─ deleteUser(id: string)
│     │  └─ loadUsers(filter?: FilterCriteria)
│     └─ 簡化 Presentation Layer 的依賴
│
├─ STORES (NgRx Signal Stores)
│  └─ UserStore
│     ├─ State Definition:
│     │  ├─ users: User[]
│     │  ├─ selectedUser: User | null
│     │  ├─ loading: boolean
│     │  ├─ error: string | null
│     │  └─ filters: FilterState
│     │
│     ├─ Computed Signals:
│     │  ├─ filteredUsers = computed(() => {
│     │  │   // 基於 users 和 filters 計算
│     │  │ })
│     │  ├─ totalCount = computed(() => users().length)
│     │  └─ hasError = computed(() => error() !== null)
│     │
│     ├─ Methods (Updaters):
│     │  ├─ setUsers(users: User[])
│     │  ├─ addUser(user: User)
│     │  ├─ updateUser(id: string, changes: Partial<User>)
│     │  ├─ deleteUser(id: string)
│     │  ├─ setLoading(loading: boolean)
│     │  ├─ setError(error: string)
│     │  └─ setFilters(filters: FilterState)
│     │
│     └─ Effects (RxJS Integration):
│        └─ loadUsersEffect
│           ├─ Listen to repository data
│           ├─ Transform to Domain Entities
│           └─ Update Store State
│
└─ COMMANDS/QUERIES (CQRS Pattern)
   ├─ Commands (寫操作)
   │  ├─ CreateUserCommand
   │  ├─ UpdateUserCommand
   │  └─ DeleteUserCommand
   │
   └─ Queries (讀操作)
      ├─ GetUserByIdQuery
      ├─ GetAllUsersQuery
      └─ SearchUsersQuery
```

## 💼 Domain Layer 詳細架構

```
domain/
│
├─ ENTITIES (實體)
│  └─ User
│     ├─ Private Properties:
│     │  ├─ id: string
│     │  ├─ email: Email (Value Object)
│     │  ├─ profile: UserProfile
│     │  ├─ createdAt: Date
│     │  └─ updatedAt: Date
│     │
│     ├─ Business Logic Methods:
│     │  ├─ updateEmail(newEmail: Email): void
│     │  ├─ changePassword(old: string, new: string)
│     │  ├─ activate(): void
│     │  ├─ deactivate(): void
│     │  └─ isActive(): boolean
│     │
│     └─ Domain Events:
│        ├─ UserCreatedEvent
│        ├─ UserUpdatedEvent
│        └─ UserDeactivatedEvent
│
├─ VALUE OBJECTS (值對象)
│  ├─ Email
│  │  ├─ private constructor(value: string)
│  │  ├─ static create(value: string): Result<Email>
│  │  ├─ validate(): boolean
│  │  ├─ equals(other: Email): boolean
│  │  └─ getValue(): string
│  │
│  ├─ Address
│  │  ├─ Immutable Properties
│  │  ├─ Validation Logic
│  │  └─ Equality Comparison
│  │
│  └─ Money
│     ├─ amount: number
│     ├─ currency: Currency
│     └─ Mathematical Operations
│
├─ AGGREGATES (聚合根)
│  └─ Order (Aggregate Root)
│     ├─ Private: OrderItems[]
│     ├─ addItem(product: Product, quantity: number)
│     ├─ removeItem(itemId: string)
│     ├─ calculateTotal(): Money
│     ├─ place(): void
│     ├─ cancel(): void
│     └─ Invariants Protection (一致性邊界)
│
├─ SERVICES (領域服務)
│  └─ UserDomainService
│     ├─ validateUserCreation(user: User): Result
│     ├─ canUserPerformAction(user: User, action: string)
│     └─ Pure Domain Logic (無基礎設施依賴)
│
├─ REPOSITORIES (接口定義)
│  └─ UserRepository (Abstract/Interface)
│     ├─ findById(id: string): Observable<User | null>
│     ├─ findAll(): Observable<User[]>
│     ├─ save(user: User): Promise<void>
│     ├─ delete(id: string): Promise<void>
│     └─ query(spec: Specification<User>): Observable<User[]>
│
├─ EVENTS (領域事件)
│  └─ UserCreatedEvent
│     ├─ userId: string
│     ├─ occurredOn: Date
│     └─ Domain Event Metadata
│
└─ SPECIFICATIONS (規格模式)
   └─ ActiveUserSpecification
      ├─ isSatisfiedBy(user: User): boolean
      ├─ and(other: Specification): Specification
      ├─ or(other: Specification): Specification
      └─ Used for Complex Queries
```

## 🔧 Infrastructure Layer 完整Firebase整合

```
infrastructure/firebase/
│
├─ CONFIG
│  └─ firebase.config.ts
│     └─ export const appConfig: ApplicationConfig = {
│        providers: [
│          provideFirebaseApp(() => initializeApp(environment.firebase)),
│          provideFirestore(() => getFirestore()),
│          provideAuth(() => getAuth()),
│          provideStorage(() => getStorage()),
│          provideFunctions(() => getFunctions()),
│        ]
│     }
│
├─ SERVICES (Firebase核心服務封裝)
│  │
│  ├─ firestore.service.ts
│  │  ├─ constructor(private firestore: Firestore)
│  │  ├─ getCollection<T>(path: string): CollectionReference<T>
│  │  ├─ getDoc<T>(path: string): DocumentReference<T>
│  │  ├─ streamCollection<T>(path: string): Observable<T[]>
│  │  ├─ streamDoc<T>(path: string): Observable<T | null>
│  │  ├─ add<T>(path: string, data: T): Promise<string>
│  │  ├─ update<T>(path: string, data: Partial<T>)
│  │  ├─ delete(path: string): Promise<void>
│  │  ├─ query<T>(
│  │  │   path: string,
│  │  │   ...queryConstraints: QueryConstraint[]
│  │  │ ): Observable<T[]>
│  │  ├─ batch operations
│  │  └─ transaction operations
│  │
│  ├─ auth.service.ts
│  │  ├─ constructor(private auth: Auth)
│  │  ├─ authState$: Observable<User | null>
│  │  ├─ currentUser: Signal<User | null>
│  │  ├─ signIn(email: string, password: string)
│  │  ├─ signUp(email: string, password: string)
│  │  ├─ signInWithGoogle()
│  │  ├─ signInWithFacebook()
│  │  ├─ signOut()
│  │  ├─ resetPassword(email: string)
│  │  ├─ updateProfile(data: ProfileData)
│  │  └─ verifyEmail()
│  │
│  ├─ storage.service.ts
│  │  ├─ constructor(private storage: Storage)
│  │  ├─ uploadFile(path: string, file: File): Observable<number>
│  │  ├─ uploadBase64(path: string, data: string)
│  │  ├─ getDownloadUrl(path: string): Observable<string>
│  │  ├─ deleteFile(path: string): Promise<void>
│  │  ├─ listFiles(path: string): Promise<StorageReference[]>
│  │  └─ getMetadata(path: string)
│  │
│  └─ functions.service.ts
│     ├─ constructor(private functions: Functions)
│     ├─ call<T, R>(name: string, data: T): Observable<R>
│     └─ Example: sendEmail, processOrder, etc.
│
├─ REPOSITORIES (倉儲實現 - DDD Pattern)
│  │
│  ├─ user-firebase.repository.ts
│  │  ├─ implements UserRepository (Domain Interface)
│  │  ├─ constructor(
│  │  │   private firestoreService: FirestoreService,
│  │  │   private converter: UserConverter
│  │  │ )
│  │  │
│  │  ├─ findById(id: string): Observable<User | null> {
│  │  │   return this.firestoreService
│  │  │     .streamDoc(`users/${id}`)
│  │  │     .pipe(map(data => this.converter.fromFirestore(data)))
│  │  │ }
│  │  │
│  │  ├─ findAll(): Observable<User[]> {
│  │  │   return this.firestoreService
│  │  │     .streamCollection('users')
│  │  │     .pipe(map(docs => docs.map(this.converter.fromFirestore)))
│  │  │ }
│  │  │
│  │  ├─ save(user: User): Promise<void> {
│  │  │   const data = this.converter.toFirestore(user);
│  │  │   return this.firestoreService.update(`users/${user.id}`, data);
│  │  │ }
│  │  │
│  │  ├─ delete(id: string): Promise<void> {
│  │  │   return this.firestoreService.delete(`users/${id}`);
│  │  │ }
│  │  │
│  │  └─ query(spec: Specification<User>): Observable<User[]> {
│  │     // Convert Specification to Firestore Query
│  │     const constraints = this.specToQueryConstraints(spec);
│  │     return this.firestoreService.query('users', ...constraints);
│  │  }
│  │
│  ├─ product-firebase.repository.ts
│  └─ order-firebase.repository.ts
│
├─ CONVERTERS (Domain ↔ Firestore 轉換)
│  │
│  └─ user.converter.ts
│     ├─ toFirestore(user: User): DocumentData {
│     │   return {
│     │     id: user.id,
│     │     email: user.email.getValue(),
│     │     profile: {
│     │       firstName: user.profile.firstName,
│     │       lastName: user.profile.lastName,
│     │       avatar: user.profile.avatar
│     │     },
│     │     createdAt: Timestamp.fromDate(user.createdAt),
│     │     updatedAt: Timestamp.fromDate(user.updatedAt)
│     │   };
│     │ }
│     │
│     └─ fromFirestore(data: DocumentData): User {
│        return new User(
│          data['id'],
│          Email.create(data['email']).getValue(),
│          new UserProfile(
│            data['profile'].firstName,
│            data['profile'].lastName,
│            data['profile'].avatar
│          ),
│          data['createdAt'].toDate(),
│          data['updatedAt'].toDate()
│        );
│     }
│
└─ COLLECTIONS (集合名稱常量)
   └─ collection-names.ts
      export const Collections = {
        USERS: 'users',
        PRODUCTS: 'products',
        ORDERS: 'orders',
        CATEGORIES: 'categories',
      } as const;
```

## 🔗 完整依賴注入流程

```
main.ts
  ↓
bootstrapApplication(AppComponent, appConfig)
  ↓
appConfig.providers
  ├─ provideRouter()
  ├─ provideFirebaseApp()         [Infrastructure]
  ├─ provideFirestore()            [Infrastructure]
  ├─ provideAuth()                 [Infrastructure]
  ├─ provideAnimations()           [Material]
  ├─ Repositories                  [Infrastructure]
  │  ├─ { provide: UserRepository,
  │  │    useClass: UserFirebaseRepository }
  │  └─ [Other Repositories...]
  ├─ Domain Services               [Domain]
  ├─ Use Cases                     [Application]
  ├─ Facades                       [Application]
  ├─ Signal Stores                 [Application + Presentation]
  └─ Guards/Interceptors           [Infrastructure]
```

## 🚀 實際使用範例流程

```
1️⃣ 用戶點擊"創建用戶"按鈕
   ↓
   presentation/pages/user-management.component.ts
   ├─ onCreateUser(formData: CreateUserDto) {
   │    this.userFacade.createUser(formData);
   │  }

2️⃣ Facade 協調用例執行
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

3️⃣ Use Case 執行業務邏輯
   ↓
   application/use-cases/user/create-user.use-case.ts
   ├─ execute(data: CreateUserDto): Observable<User> {
   │    // 1. 創建領域對象
   │    const email = Email.create(data.email);
   │    if (email.isFailure) throw new Error(email.error);
   │    
   │    const user = User.create({
   │      email: email.getValue(),
   │      profile: new UserProfile(data.firstName, data.lastName)
   │    });
   │    
   │    // 2. 領域驗證
   │    const validation = this.userDomainService
   │      .validateUserCreation(user);
   │    if (validation.isFailure) throw new Error(validation.error);
   │    
   │    // 3. 持久化
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
   │      .pipe(
   │        map(docs => docs.map(this.userConverter.fromFirestore))
   │      );
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
```

## 🎯 核心設計原則總結

```
✅ DDD 分層架構
   - 清晰的層級邊界
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
   - 一致的 UI/UX
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
   - 清晰的命名約定
   - 文檔與註釋
```

這是一個**企業級**、**高度模組化**、**可擴展**的 Angular 20 現代化架構！🚀