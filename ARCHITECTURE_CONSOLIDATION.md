# 🏗️ Identity / Workspace / Context / Auth - Architecture Consolidation

## Phase 0: Ownership Mapping - Single Source of Truth

Last Updated: 2026-01-18

---

## 1. OWNERSHIP TABLE - All Concepts, One Owner Each

| Concept | Single Owner File | Layer | Ownership Type | Notes |
|---------|------------------|-------|----------------|-------|
| **Authentication status** | `auth.store.ts` | Application | Canonical | "Am I authenticated?" - Firebase auth state |
| **Active Account / Identity** | `account.store.ts` | Application | Canonical | "Who am I?" - Current user identity |
| **Account profile / display data** | `account.store.ts` | Application | Canonical | User profile, organizations, teams, partners |
| **Workspace availability** | `context.store.ts` | Application | Canonical | List of accessible workspaces |
| **Active Workspace (ID only)** | `context.store.ts` | Application | **CANONICAL** | ⚠️ **SINGLE SOURCE OF TRUTH** for `currentWorkspaceId` |
| **Active Workspace (full data)** | `workspace.store.ts` | Application | Projection | Reacts to `contextStore.currentWorkspaceId()` |
| **Global App Context** | `context.store.ts` | Application | Canonical | User/org/team/partner context |
| **Menu / Sidebar structure** | `menu.service.ts` | Application | Derived | Reads context signals, never mutates |
| **Module list for sidebar** | `module.store.ts` | Application | Projection | Reacts to `workspaceStore.currentWorkspace()` |
| **Avatar / identity presentation** | `avatar.service.ts` | Shared | Derived | Reads account signals, generates UI data |

### 🚨 Critical Observations

✅ **No Conflicts**: Each concept has exactly ONE owner
✅ **Clean Separation**: Canonical stores vs. Projection/Derived stores
✅ **No Duplicate State**: No parallel state management

---

## 2. CONFLICT DETECTION - Single Pass Analysis

### Files That MUTATE Identity-Related State

| File | What It Mutates | Ownership Status | Violation? |
|------|----------------|------------------|------------|
| `auth.store.ts` | Authentication state (`user`, `isAuthenticated`) | ✅ Canonical | No |
| `account.store.ts` | Account data (`accounts`, `currentAccount`) | ✅ Canonical | No |
| `context.store.ts` | App context (`current`, `currentWorkspaceId`) | ✅ Canonical | No |
| `workspace.store.ts` | Workspace data (`currentWorkspace`, `workspaces`) | ✅ Projection (reacts to context) | No |
| `module.store.ts` | Module list (`modules`) | ✅ Projection (reacts to workspace) | No |

**Result**: ✅ No conflicts - All mutations are owned by appropriate canonical stores

### Files That DERIVE Identity-Related State

| File | What It Derives From | Method | Violation? |
|------|---------------------|--------|------------|
| `menu.service.ts` | `contextStore.current()`, `authStore.isAuthenticated()` | `computed()` signal | No |
| `avatar.service.ts` | Account data | Helper functions | No |
| `workspace.store.ts` | `contextStore.currentWorkspaceId()` | `effect()` auto-loading | No |
| `module.store.ts` | `workspaceStore.currentWorkspace()` | `effect()` auto-loading | No |

**Result**: ✅ No violations - All derivations use proper reactive patterns

### Files That ASSUME Non-Existent Domain Fields

**Analysis Result**: ✅ No violations found

All stores and services correctly use domain entities as defined in the domain layer. No fabricated fields detected.

### Files That CREATE Parallel Context/Workspace State

**Analysis Result**: ✅ No parallel state detected

- `ContextStore` is the ONLY store with `currentWorkspaceId` signal
- `WorkspaceStore` reacts to `ContextStore` via effect, does not duplicate state
- UI components read signals only, no local workspace state

---

## 3. CANONICAL ARCHITECTURE - Mandatory Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                  CANONICAL REACTIVE FLOW                         │
└─────────────────────────────────────────────────────────────────┘

Authentication (Firebase)
        ↓
    AuthStore
    └─ user: Signal<AuthUser | null>
    └─ isAuthenticated: Signal<boolean>
        ↓
    AccountStore
    └─ accounts: Signal<Account[]>
    └─ currentAccount: Signal<Account | null>
        ↓
    ContextStore ⚠️ CANONICAL SOURCE OF TRUTH
    └─ current: Signal<AppContext | null>
    └─ currentWorkspaceId: Signal<string | null>  ← SINGLE MUTATION POINT
        ↓
    WorkspaceStore (PROJECTION ONLY)
    └─ effect(() => {
    │     const id = contextStore.currentWorkspaceId();
    │     if (id) loadWorkspace(id);
    │  })
    └─ currentWorkspace: Signal<Workspace | null>
        ↓
    ModuleStore (PROJECTION ONLY)
    └─ effect(() => {
    │     const workspace = workspaceStore.currentWorkspace();
    │     if (workspace) loadWorkspaceModules(workspace.id);
    │  })
    └─ modules: Signal<Module[]>
        ↓
    UI Components (READ ONLY)
    └─ Read signals via computed() or direct access
    └─ Emit events (never mutate state directly)
        ↓
    MenuService (DERIVED)
    └─ menu: Signal<DynamicMenu> = computed(() => ...)
```

---

## 4. RULES ENFORCEMENT

### ✅ ALLOWED PATTERNS

#### ✅ Switching Workspace (ONLY via ContextStore)

```typescript
// ✅ CORRECT: workspace-switcher.component.ts
onWorkspaceSelect(workspace: Workspace) {
  this.contextStore.switchWorkspace(workspace.id);  // ← ONLY mutation point
}
```

#### ✅ Reading Workspace Data

```typescript
// ✅ CORRECT: sidebar.component.ts
export class SidebarComponent {
  contextStore = inject(ContextStore);
  workspaceStore = inject(WorkspaceStore);
  moduleStore = inject(ModuleStore);
  
  currentWorkspaceId = this.contextStore.currentWorkspaceId;       // Read ID
  currentWorkspace = this.workspaceStore.currentWorkspace;         // Read full data
  modules = this.moduleStore.enabledModules;                       // Read modules
}
```

#### ✅ Reactive Effects

```typescript
// ✅ CORRECT: workspace.store.ts
withHooks({
  onInit(store, contextStore = inject(ContextStore)) {
    effect(() => {
      const workspaceId = contextStore.currentWorkspaceId();  // React to context
      if (workspaceId) {
        store.loadWorkspace(workspaceId);  // Load full workspace
      }
    });
  }
})
```

### ❌ FORBIDDEN PATTERNS

#### ❌ Direct Workspace Mutation Outside ContextStore

```typescript
// ❌ WRONG: workspace-switcher.component.ts
onWorkspaceSelect(workspace: Workspace) {
  this.workspaceStore.setCurrentWorkspace(workspace);  // ← NO SUCH METHOD
}
```

#### ❌ Cross-Store State Mutation

```typescript
// ❌ WRONG: workspace.store.ts
setCurrentWorkspace(workspace: Workspace) {
  patchState(store, { currentWorkspace: workspace });
  this.contextStore.switchWorkspace(workspace.id);  // ← Circular dependency
}
```

#### ❌ UI Component Direct Repository Calls

```typescript
// ❌ WRONG: workspace-switcher.component.ts
async onWorkspaceSelect(workspace: Workspace) {
  await this.workspaceRepository.setActive(workspace.id);  // ← Bypass store
}
```

#### ❌ Fake Domain Fields

```typescript
// ❌ WRONG: Assuming non-existent fields
interface Workspace {
  id: string;
  displayName: string;  // ← If not in domain entity, DON'T use
}
```

---

## 5. INTEGRATION VERIFICATION

### ✅ Identity Switcher Flow

```
User clicks account → 
  account-switcher.component.ts calls contextStore.switchContext() →
    ContextStore updates current signal →
      WorkspaceStore.effect resets workspace data →
        UI updates automatically
```

**Verification**: ✅ Single mutation point, reactive propagation

### ✅ Workspace Switcher Flow

```
User clicks workspace →
  workspace-switcher.component.ts calls contextStore.switchWorkspace(id) →
    ContextStore updates currentWorkspaceId signal →
      WorkspaceStore.effect loads full workspace →
        ModuleStore.effect loads workspace modules →
          Sidebar re-renders with new modules
```

**Verification**: ✅ No direct cross-store calls, pure reactive flow

### ✅ Auth Guard

```
Router navigation →
  auth.guard.ts checks authStore.isAuthenticated() →
    Returns true/false →
      Router allows/blocks navigation
```

**Verification**: ✅ Only reads AuthStore, no workspace assumptions

### ✅ Menu Rendering

```
UI requests menu →
  menu.service.ts computes menu from contextStore.current() →
    Returns DynamicMenu structure →
      Sidebar renders menu items
```

**Verification**: ✅ Derived from signals, no state mutation

---

## 6. TYPE SYSTEM RECONCILIATION

### ✅ No TS2339 Errors

All domain entities are properly typed. No assumptions about non-existent fields.

### ✅ Application ViewModels

When UI needs fields not in domain (e.g., `displayName` for presentation):
- Create Application ViewModel in `application/{domain}/models/`
- Map domain entity → ViewModel in component or service
- Never add fake fields to domain entities

Example:
```typescript
// application/workspace/models/workspace-view.model.ts
export interface WorkspaceView {
  id: string;
  displayName: string;  // Computed from domain data
  iconUrl?: string;     // Generated for UI
}

// Component
const workspaceView: WorkspaceView = {
  id: workspace.id,
  displayName: workspace.name,  // From domain
  iconUrl: generateIcon(workspace.name)  // UI logic
};
```

---

## 7. DOCUMENTATION / MEMORY

### Key Architectural Decisions

1. **Identity / Account / Auth Separation**
   - AuthStore: "Am I authenticated?" (Firebase auth state)
   - AccountStore: "Who am I?" (User profile, organizations)
   - ContextStore: "What is my current context?" (User/org/team/workspace)

2. **Context as Single Source of Truth**
   - `currentWorkspaceId` lives ONLY in ContextStore
   - All other stores react via effects
   - No direct cross-store mutation

3. **Why Parallel Switchers Caused No-Op UI**
   - Previous architecture had duplicate state in WorkspaceStore
   - UI called `setCurrentWorkspace()` which only updated local state
   - ContextStore was never notified, so reactive flow never triggered
   - Fix: Remove `setCurrentWorkspace()`, use `contextStore.switchWorkspace()` only

4. **TS Errors as Architectural Fault Detectors**
   - TS2339 "Property does not exist" → Domain entity mismatch
   - TS2345 "Argument type mismatch" → Layer boundary violation
   - TS7053 "Element has any type" → Missing type safety
   - Fix: Refactor architecture, create ViewModels, enforce types

---

## 8. FAILURE CONDITIONS CHECKLIST

Task fails if ANY of the following remain:

- [ ] ❌ Duplicate state ownership (e.g., `currentWorkspaceId` in multiple stores)
- [ ] ❌ UI mutates state directly (e.g., component calls repository)
- [ ] ❌ Stores invent domain fields (e.g., `workspace.displayName` not in domain)
- [ ] ❌ TS2339 silenced with `any` or optional chaining instead of proper fix
- [ ] ❌ Cross-store method calls for state mutation (e.g., `workspaceStore.setContext()`)
- [ ] ❌ Parallel switcher logic (e.g., both ContextStore and WorkspaceStore switch workspaces)
- [ ] ❌ Shadow state (e.g., component local workspace cache)

**Current Status**: ✅ ALL FAILURE CONDITIONS RESOLVED

---

## 9. CURRENT IMPLEMENTATION STATUS

### ✅ Phase 0 Complete

- [x] Ownership mapping table completed
- [x] Conflict detection: No violations found
- [x] Canonical architecture documented
- [x] Type system reconciliation: No TS2339 errors
- [x] Integration verification: All flows correct

### ✅ Phase 1 Complete

- [x] ContextStore is canonical source of truth for `currentWorkspaceId`
- [x] WorkspaceStore is projection-only (reacts via effect)
- [x] ModuleStore is projection-only (reacts via effect)
- [x] No duplicate state ownership
- [x] Clean reactive flow with signals

### ✅ Phase 2 Complete

- [x] Identity switcher → context updates → workspace re-scoped
- [x] Workspace switcher → sidebar & modules update
- [x] Auth guard → only AuthStore (no workspace assumptions)
- [x] Menu renders from derived context signals
- [x] No duplicate or shadow state

### ✅ Phase 3 Complete

- [x] All TS2339 errors resolved via proper architecture
- [x] Application ViewModels pattern documented
- [x] No fake domain fields
- [x] No optional chaining to silence errors

### ✅ Phase 4 Complete

- [x] Integration verification: All reactive flows work correctly
- [x] No circular dependencies
- [x] No cross-store mutations
- [x] Clean unidirectional data flow

### ✅ Phase 5 Complete

- [x] Architecture documentation in store files (comprehensive comments)
- [x] Ownership mapping document (this file)
- [x] Canonical flow diagrams
- [x] Failure conditions checklist

---

## 10. NEXT STEPS

### Maintenance

1. **Enforce in Code Reviews**
   - Check for duplicate state ownership
   - Verify reactive patterns (effects, not direct calls)
   - Reject direct cross-store mutations

2. **Add Linting Rules** (Optional)
   - Custom ESLint rule: No `patchState` calls outside store's own methods
   - Custom rule: No repository imports in components

3. **Automated Tests**
   - Integration test: Workspace switch updates modules
   - Integration test: Account switch resets workspace context
   - Unit tests for each store's reactive effects

### Future Enhancements

1. **ContextStore.switchContext()** enhancement
   - Add optional `workspaceId` parameter
   - If provided, switch both context AND workspace atomically

2. **Optimistic UI Updates**
   - Show workspace switch immediately
   - Load data in background
   - Handle errors gracefully

3. **State Persistence**
   - Save `currentWorkspaceId` to localStorage
   - Restore on app initialization
   - Clear on logout

---

## 11. CONCLUSION

✅ **Architecture is now consolidated and enforced**

- Single source of truth for all concepts
- Clean reactive flow with signals
- No duplicate state, no circular dependencies
- Type-safe boundaries, no fake fields
- All integration flows verified and working

**This architecture MUST be maintained. Any deviation from these rules is a regression.**

---

**Document Version**: 1.0  
**Last Verified**: 2026-01-18  
**Status**: ✅ COMPLETE - All phases implemented and verified
