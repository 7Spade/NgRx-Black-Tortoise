---
description: 'GPT-5.2-Codex MCP Unified Specification: DDD × Angular 20+ × NgRx Signals × Firebase × Pure Reactive (zone-less)'
model: GPT-5.2-Codex
name: 'Angular 20++ Pure Reactive Agent V5.2'
mcp-servers:
  context7:
    type: http
    url: "https://mcp.context7.com/mcp"
    headers: {"CONTEXT7_API_KEY": "${{ secrets.COPILOT_MCP_CONTEXT7 }}"}
    tools: ["get-library-docs", "resolve-library-id"]
handoffs:
  - label: Context7 Documentation Lookup
    agent: agent
    prompt: "查詢 Angular 20+、NgRx Signals、Firebase 官方文檔，必須完成"
    send: true
  - label: Sequential Thinking
    agent: agent
    prompt: "使用順序思維分析問題，逐步拆解需求，標明步驟與優先順序"
    send: true
  - label: Software Planning
    agent: agent
    prompt: "將需求拆解為原子任務（DDD 分層、響應式設計、EventBus），生成 TODO 清單"
    send: true
  - label: Architecture Validation
    agent: agent
    prompt: "驗證代碼是否符合規範,檢查反模式，標明問題與優先修正順序"
    send: true
---

## 🚨 CRITICAL RULE - READ FIRST

**BEFORE answering ANY question about a library, framework, or package, you MUST:**

1. **STOP** - Do NOT answer from memory or training data
2. **IDENTIFY** - Extract the library/framework name from the user's question
3. **CALL** `mcp_context7_resolve-library-id` with the library name
4. **SELECT** - Choose the best matching library ID from results
5. **CALL** `mcp_context7_get-library-docs` with that library ID
6. **ANSWER** - Use ONLY information from the retrieved documentation

**If you skip steps 3-5, you are providing outdated/hallucinated information.**

**ADDITIONALLY: You MUST ALWAYS inform users about available upgrades.**
- Check their package.json version
- Compare with latest available version
- Inform them even if Context7 doesn't list versions
- Use web search to find latest version if needed
# Angular 20+ Pure Reactive Agent Rules
Configuration for AI behavior when developing Angular 20+ applications with DDD architecture, NgRx Signals, and Firebase integration using pure reactive patterns (zone-less).

---

## CRITICAL: Before ANY code implementation

- YOU MUST IMMEDIATELY execute the following workflow in exact order:
  1. Use `get-library-docs` tool from Context7 MCP to query official documentation:
     - `library`: "Angular" or "NgRx Signals" or "Firebase"
     - `query`: specific feature or API being implemented
  2. Use Sequential Thinking handoff to analyze requirements:
     - List all errors and anti-patterns in current code
     - Break down requirements into atomic tasks
     - Mark priority levels (P0/P1/P2) for each task
  3. Use Software Planning handoff to generate TODO checklist:
     - Map tasks to DDD layers (Domain → Infrastructure → Application → Interface)
     - Define reactive data flow (Observable → rxMethod → Signal → effect)
     - Plan EventBus events for cross-store communication
  4. Use Architecture Validation handoff to verify compliance:
     - Check for framework dependencies in Domain layer
     - Verify no direct Firebase injection in components
     - Confirm all async operations use `rxMethod()` + `tapResponse()`
     - Validate template syntax uses `@if` / `@for` / `@switch` only
- > NOTE: Skipping this workflow or changing the order is considered a CRITICAL ERROR.

## CRITICAL: After ANY file modification

- YOU MUST IMMEDIATELY verify architecture compliance:
  - Domain layer files: MUST NOT import Angular, RxJS, or Firebase
  - Application layer files: MUST use `signalStore()` with `rxMethod()`
  - Infrastructure layer files: MUST return `Observable`, NEVER `subscribe()`
  - Interface layer files: MUST NOT inject Firebase services directly
  - Template files: MUST use `@if` / `@for` / `@switch`, NEVER `*ngIf` / `*ngFor` / `*ngSwitch`
- If ANY violations are found:
  - Stop all other operations immediately
  - Use Architecture Validation handoff to identify all violations
  - Propose and apply fixes in priority order
  - Re-verify compliance before continuing
- > NOTE: Proceeding with violations is a CRITICAL ERROR.

---

## 核心原則 (Core Principles)

### Domain-Driven Design (DDD) 分層

**Domain Layer (純 TypeScript)**:
- Location: `src/app/domain/`
- MUST be framework-agnostic - NO Angular, RxJS, or Firebase dependencies
- Contains:
  - `models/`: Business entities and value objects
  - `policies/`: Business rules and validation logic
  - `types/`: TypeScript types and interfaces
- EXAMPLE:
  - File: `src/app/domain/models/user.model.ts`
  - Content: Pure TypeScript classes/interfaces only
  - Forbidden: `import { Injectable } from '@angular/core'`

**Infrastructure Layer (Firebase/API 封裝)**:
- Location: `src/app/infrastructure/`
- MUST encapsulate external services (Firebase, REST APIs)
- MUST return `Observable<T>`, NEVER use `.subscribe()`
- MUST NOT expose Firebase types to upper layers
- EXAMPLE:
  - Repository returns: `Observable<User[]>`
  - NOT: `Promise<DocumentSnapshot>` or direct Firestore queries

**Application Layer (NgRx Signals Store)**:
- Location: `src/app/application/`
- MUST use `signalStore()` with:
  - `withState()` for initial state
  - `withComputed()` for derived state
  - `withMethods()` for synchronous operations
  - `rxMethod()` for asynchronous operations with `tapResponse()`
- State updates MUST use `patchState()`, NEVER direct mutation
- Cross-store communication MUST use EventBus, NEVER direct store injection

**Interface Layer (純展示組件)**:
- Location: `src/app/presentation/`
- Components MUST be presentation-only:
  - Inject Store services, NOT Firebase services
  - Use `computed()` for derived UI state
  - Use `effect()` for side effects (logging, analytics, DOM manipulation)
  - NO business logic - delegate to Application layer
- Templates MUST use new control flow syntax:
  - `@if (condition)` instead of `*ngIf="condition"`
  - `@for (item of items; track item.id)` instead of `*ngFor="let item of items"`
  - `@switch (value)` with `@case` instead of `*ngSwitch`
  - `@defer (on viewport)` for lazy loading

### Pure Reactive Architecture

**Observable Flow**:
```typescript
// Infrastructure returns Observable
userRepository.getUser(id): Observable<User>
  ↓
// Application uses rxMethod
loadUser = rxMethod<string>(pipe(
  switchMap(id => this.userRepo.getUser(id).pipe(
    tapResponse({
      next: user => patchState(store, { user, loading: false }),
      error: error => patchState(store, { error, loading: false })
    })
  ))
))
  ↓
// Interface uses Signal
user = store.user // Signal<User | null>
  ↓
// Template binds to Signal
@if (user(); as u) { <div>{{ u.name }}</div> }
```

**EventBus Pattern**:
```typescript
// Avoid: Store A directly injects Store B (circular dependency)
// ❌ constructor(private storeB: StoreBService) { }

// Correct: Use EventBus for cross-store communication
// ✅ Application layer
eventBus.emit({ type: 'USER_LOGGED_IN', payload: user });

// ✅ Other stores subscribe
constructor() {
  effect(() => {
    this.eventBus.on('USER_LOGGED_IN')
      .pipe(takeUntilDestroyed())
      .subscribe(event => this.handleUserLogin(event.payload));
  });
}
```

---

## 禁止操作 (Forbidden Operations)

### NEVER use these packages or patterns:
- `@ngrx/store` - Use `@ngrx/signals` instead
- `@ngrx/effects` - Use `rxMethod()` instead
- `@ngrx/entity` - Use `@ngrx/signals/entities` instead
- Direct Firebase injection in components - Use Application layer stores
- Manual `.subscribe()` calls - Use `rxMethod()` + `tapResponse()`
- Direct store-to-store dependencies - Use EventBus
- Structural directives (`*ngIf`, `*ngFor`, `*ngSwitch`) - Use `@if`, `@for`, `@switch`
- `zone.js` dependencies - Application must be zone-less
- Framework dependencies in Domain layer - Keep pure TypeScript

### If you encounter forbidden code:
- IMMEDIATELY flag it in Architecture Validation
- Propose refactoring to compliant pattern
- Show before/after code comparison
- Verify fix resolves the violation

---

## 必須操作 (Required Operations)

### When creating a new feature:

1. **Domain Layer First**:
   - Define models in `domain/models/`
   - Define business rules in `domain/policies/`
   - NO framework imports allowed

2. **Infrastructure Layer**:
   - Create repository in `infrastructure/repositories/`
   - Return `Observable<T>` from all async methods
   - Use Firebase SDK internally, expose clean interfaces

3. **Application Layer**:
   - Create store with `signalStore()`:
     ```typescript
     export const UserStore = signalStore(
       { providedIn: 'root' },
       withState<UserState>(initialState),
       withComputed(({ users }) => ({
         activeUsers: computed(() => users().filter(u => u.active))
       })),
       withMethods((store, userRepo = inject(UserRepository)) => ({
         loadUsers: rxMethod<void>(pipe(
           switchMap(() => userRepo.getUsers().pipe(
             tapResponse({
               next: users => patchState(store, { users }),
               error: console.error
             })
           ))
         ))
       }))
     );
     ```

4. **Interface Layer**:
   - Inject store in component
   - Use `computed()` for derived values
   - Use `effect()` for side effects
   - Template uses `@if` / `@for` / `@switch` only

### When updating state:
- ALWAYS use `patchState(store, { ... })`
- NEVER mutate state directly: `store.users.push(user)` ❌
- NEVER reassign state: `store.users = [...]` ❌

### When handling async operations:
- ALWAYS use `rxMethod()` with `tapResponse()`
- NEVER use `.subscribe()` directly
- NEVER use `async/await` in Application layer

---

## 開發工作流程 (Development Workflow)

```
┌─────────────────────────────────────────────────────────────────┐
│ Step 1: Context7 Documentation Lookup                          │
│  → Query official docs for Angular 20+, NgRx Signals, Firebase │
│  → Tool: get-library-docs                                      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Step 2: Sequential Thinking Analysis                           │
│  → List current errors and anti-patterns                       │
│  → Break down requirements into atomic tasks                   │
│  → Assign priority levels (P0/P1/P2)                           │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Step 3: Software Planning                                      │
│  → Generate DDD layer mapping                                  │
│  → Create reactive data flow diagram                           │
│  → Define EventBus events                                      │
│  → Output: TODO checklist                                      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Step 4-7: Implementation (Layer by Layer)                      │
│  → Step 4: Domain Layer (Models, Policies, Types)             │
│  → Step 5: Infrastructure Layer (Repositories)                │
│  → Step 6: Application Layer (Stores with signalStore)        │
│  → Step 7: Interface Layer (Components, Templates)            │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Step 8: Architecture Validation                                │
│  → Verify no framework deps in Domain                         │
│  → Verify no Firebase in Interface                            │
│  → Verify all templates use @if/@for/@switch                  │
│  → Check for anti-patterns                                    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Step 9: Testing                                                │
│  → Test store methods and computed signals                    │
│  → Test component rendering with new control flow             │
│  → Verify reactive data flow                                  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Step 10: Completion Checklist                                 │
│  → All items from Step 3 TODO must be ✓                       │
│  → Architecture Validation must pass                          │
│  → No CRITICAL or P0 issues remaining                         │
└─────────────────────────────────────────────────────────────────┘
```

### Workflow execution rules:
- MUST execute steps in order - no skipping
- MUST complete each step before proceeding
- MUST return to Step 8 if violations found
- MUST NOT mark complete until Step 10 checklist passes

---

## 專案結構 (Project Structure)

### Recommended DDD + Reactive structure:

```
src/app/
├── domain/                          # 🎯 Pure TypeScript - NO framework deps
│   ├── models/                      # Business entities
│   │   ├── user.model.ts
│   │   └── product.model.ts
│   ├── policies/                    # Business rules
│   │   ├── user-validation.policy.ts
│   │   └── pricing.policy.ts
│   └── types/                       # TypeScript types
│       ├── user.types.ts
│       └── product.types.ts
│
├── infrastructure/                  # 🔌 External services (Firebase, APIs)
│   ├── repositories/                # Data access - returns Observable
│   │   ├── user.repository.ts       # Firebase Firestore operations
│   │   └── product.repository.ts
│   └── services/                    # External APIs
│       └── analytics.service.ts
│
├── application/                     # 🏪 NgRx Signals Stores
│   ├── stores/                      # State management
│   │   ├── user.store.ts           # signalStore() + rxMethod()
│   │   └── product.store.ts
│   └── event-bus/                   # Cross-store communication
│       └── app-event-bus.service.ts
│
├── presentation/                     # 🎨 UI Components (zone-less)
│   ├── pages/                       # Smart components (route targets)
│   │   ├── user-list/
│   │   │   ├── user-list.component.ts
│   │   │   ├── user-list.component.html  # @if/@for only
│   │   │   └── user-list.component.scss
│   │   └── product-detail/
│   ├── components/                  # Dumb components (reusable)
│   │   ├── user-card/
│   │   └── product-grid/
│   └── layouts/                     # Layout components
│       └── main-layout/
│
├── shared/                          # 🛠️ Shared utilities
│   ├── components/                  # Common UI components
│   ├── pipes/                       # Custom pipes
│   ├── directives/                  # Custom directives
│   └── utils/                       # Helper functions
│
├── assets/                          # 📦 Static files
│
├── dataconnect-generated/           # 🔥 Firebase Data Connect (auto-generated)
│   ├── angular/
│   ├── esm/
│   └── .guides/
│
└── environments/                    # ⚙️ Environment configs
    ├── environment.ts
    └── environment.prod.ts
```

### File naming conventions:
- Models: `*.model.ts`
- Policies: `*.policy.ts`
- Repositories: `*.repository.ts`
- Stores: `*.store.ts`
- Components: `*.component.ts`
- Services: `*.service.ts`

---

## 範例實作 (Implementation Examples)

### ✅ CORRECT: Complete feature implementation

**Domain Layer** (`domain/models/user.model.ts`):
```typescript
// ✅ Pure TypeScript - NO framework imports
export interface User {
  id: string;
  email: string;
  displayName: string;
  active: boolean;
  createdAt: Date;
}

export class UserEntity implements User {
  constructor(
    public id: string,
    public email: string,
    public displayName: string,
    public active: boolean,
    public createdAt: Date
  ) {}

  // Business logic method
  isEligibleForPromotion(): boolean {
    const daysSinceCreation = (Date.now() - this.createdAt.getTime()) / (1000 * 60 * 60 * 24);
    return this.active && daysSinceCreation > 30;
  }
}
```

**Infrastructure Layer** (`infrastructure/repositories/user.repository.ts`):
```typescript
import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '@domain/models/user.model';

@Injectable({ providedIn: 'root' })
export class UserRepository {
  private firestore = inject(Firestore);

  // ✅ Returns Observable, NOT Promise or subscribe
  getUsers(): Observable<User[]> {
    const usersCollection = collection(this.firestore, 'users');
    return collectionData(usersCollection, { idField: 'id' }).pipe(
      map(docs => docs.map(doc => ({
        id: doc['id'],
        email: doc['email'],
        displayName: doc['displayName'],
        active: doc['active'],
        createdAt: doc['createdAt']?.toDate()
      })))
    );
  }
}
```

**Application Layer** (`application/stores/user.store.ts`):
```typescript
import { computed, inject } from '@angular/core';
import { signalStore, withState, withComputed, withMethods } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { pipe, switchMap } from 'rxjs';
import { UserRepository } from '@infrastructure/repositories/user.repository';
import { User } from '@domain/models/user.model';

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null
};

export const UserStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ users }) => ({
    // ✅ Computed signals for derived state
    activeUsers: computed(() => users().filter(u => u.active)),
    userCount: computed(() => users().length)
  })),
  withMethods((store, userRepo = inject(UserRepository)) => ({
    // ✅ rxMethod for async operations
    loadUsers: rxMethod<void>(pipe(
      switchMap(() => {
        patchState(store, { loading: true });
        return userRepo.getUsers().pipe(
          tapResponse({
            next: users => patchState(store, { users, loading: false, error: null }),
            error: (error: Error) => patchState(store, { error: error.message, loading: false })
          })
        );
      })
    ))
  }))
);
```

**Interface Layer** (`presentation/pages/user-list/user-list.component.ts`):
```typescript
import { Component, inject, effect } from '@angular/core';
import { UserStore } from '@application/stores/user.store';

@Component({
  selector: 'app-user-list',
  standalone: true,
  templateUrl: './user-list.component.html'
})
export class UserListComponent {
  // ✅ Inject store, NOT Firebase
  userStore = inject(UserStore);

  constructor() {
    // ✅ Use effect for side effects
    effect(() => {
      console.log('Active users count:', this.userStore.activeUsers().length);
    });

    // Load users on init
    this.userStore.loadUsers();
  }
}
```

**Template** (`presentation/pages/user-list/user-list.component.html`):
```html
<!-- ✅ New control flow syntax -->
@if (userStore.loading()) {
  <div class="spinner">Loading...</div>
}

@if (userStore.error(); as error) {
  <div class="error">{{ error }}</div>
}

<div class="user-list">
  @for (user of userStore.activeUsers(); track user.id) {
    <div class="user-card">
      <h3>{{ user.displayName }}</h3>
      <p>{{ user.email }}</p>
    </div>
  } @empty {
    <p>No active users found.</p>
  }
</div>

<p>Total users: {{ userStore.userCount() }}</p>
```

### ❌ INCORRECT: Anti-patterns to avoid

```typescript
// ❌ Domain layer with framework dependency
import { Injectable } from '@angular/core';
export class User { } // WRONG - Domain should have NO Angular imports

// ❌ Repository using .subscribe()
getUsers() {
  this.firestore.collection('users').valueChanges().subscribe(users => {
    // WRONG - should return Observable
  });
}

// ❌ Component injecting Firebase directly
constructor(private firestore: Firestore) { } // WRONG - use Store

// ❌ Template using old structural directives
<div *ngIf="loading">Loading...</div> <!-- WRONG - use @if -->

// ❌ Manual state mutation
this.store.users.push(newUser); // WRONG - use patchState()

// ❌ Direct store-to-store dependency
constructor(private otherStore: OtherStore) { } // WRONG - use EventBus
```

---

## 開發檢查清單 (Development Checklist)

Before marking any feature as complete, verify ALL items:

### Architecture Compliance
- [ ] Domain layer contains ONLY pure TypeScript (no Angular/RxJS/Firebase imports)
- [ ] Infrastructure layer returns `Observable<T>` from all async methods
- [ ] Application layer uses `signalStore()` with `withState` / `withComputed` / `withMethods`
- [ ] All async operations use `rxMethod()` + `tapResponse()`
- [ ] Interface layer components inject Stores, NOT Firebase services
- [ ] Cross-store communication uses EventBus, NOT direct injection

### Template Syntax
- [ ] All templates use `@if` instead of `*ngIf`
- [ ] All templates use `@for (item of items; track item.id)` instead of `*ngFor`
- [ ] All templates use `@switch` / `@case` instead of `*ngSwitch`
- [ ] Lazy loading uses `@defer (on viewport)` where appropriate
- [ ] NO structural directives (`*ngIf`, `*ngFor`, `*ngSwitch`) remain

### State Management
- [ ] All state updates use `patchState(store, { ... })`
- [ ] NO direct state mutations (`store.users.push()`, `store.users[0] = ...`)
- [ ] Computed signals used for all derived state
- [ ] Effects used for side effects (logging, analytics, DOM)

### Reactive Patterns
- [ ] NO manual `.subscribe()` calls in Application layer
- [ ] NO `async/await` in Application layer (use `rxMethod` instead)
- [ ] All Observables properly composed with operators
- [ ] `takeUntilDestroyed()` used for component subscriptions

### Package Dependencies
- [ ] `@ngrx/signals` installed and used
- [ ] NO `@ngrx/store` in package.json
- [ ] NO `@ngrx/effects` in package.json
- [ ] `@ngrx/operators` installed for `tapResponse`

### Code Quality
- [ ] TypeScript strict mode enabled
- [ ] ESLint passes with no errors
- [ ] Prettier formatting applied
- [ ] All models have proper TypeScript types
- [ ] Architecture Validation handoff completed and passed

---

## General

- Repeat Architecture Validation after ANY code modification
- "Propose fixes" means both suggest and automatically apply the fixes
- Do NOT wait for user to remind you to validate architecture
- Do NOT proceed with new features if CRITICAL violations exist
- EventBus pattern is MANDATORY for cross-store communication
- Template syntax violations are CRITICAL - they must be fixed immediately
- When in doubt, consult Context7 MCP for official documentation
- Always use Sequential Thinking to break down complex requirements
- Software Planning TODO checklist is REQUIRED before implementation
- Zone-less architecture is non-negotiable - verify provideExperimentalZonelessChangeDetection()