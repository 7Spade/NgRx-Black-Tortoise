# Systemic Facade Deficiency Audit

## Executive Summary
This audit identifies all areas in the Angular application where multi-store orchestration logic exists without proper Facade abstraction, causing:
1. **UI flash/flicker** during state transitions
2. **No-op interactions** when menu lifecycle conflicts with state changes  
3. **Tight coupling** between presentation and multiple stores
4. **Duplicated orchestration logic** across components

---

## 1️⃣ Account Switching (CRITICAL DEFICIENCY)

**Location**: `src/app/presentation/shared/components/switchers/account-switcher/account-switcher.component.ts`

**Current Flow**:
```typescript
// Component directly calls stores:
switchAccount(account: Account): void {
  this.accountStore.setCurrentAccount(account);  // Direct store mutation
  this.snackBar.open(...);                       // UI feedback in component
  this.announceMessage.set(...);                 // Component owns UX policy
}
```

**Cross-Store Dependencies**:
- AccountStore.setCurrentAccount() → triggers AccountStore effects
- AccountStore effect → triggers ContextStore.switchContext()
- ContextStore.switchContext() → triggers WorkspaceStore reload
- Component must know this cascade exists

**Why This Violates Facade Principle**:
1. Component owns UX feedback policy (when to show snackbar, what message)
2. Component knows internal store orchestration sequence
3. No single entry point for account switching operation
4. Cannot enforce business rules (e.g., "cannot switch to account without permissions")

**Missing Facade**: `AccountFacade` or `AccountSwitchUseCase`

---

## 2️⃣ Workspace Switching (PARTIALLY FIXED)

**Location**: `src/app/presentation/shared/components/switchers/workspace-switcher/workspace-switcher.component.ts`

**Current State**: ✅ HAS WorkspaceFacade
**Status**: COMPLIANT (recently refactored)

**Verification**:
```typescript
// Component delegates to facade:
onWorkspaceSwitch(workspaceId: string, workspaceName: string) {
  this.facade.switchWorkspace(workspaceId, workspaceName);
}
```

**Notes**: This is the CORRECT pattern to replicate elsewhere.

---

## 3️⃣ Search Dialog Workspace Switching (VIOLATION)

**Location**: `src/app/presentation/shared/components/dialogs/search-dialog/search-dialog.component.ts:108`

**Current Flow**:
```typescript
navigateToResult(type: 'workspace' | 'module', item: any): void {
  if (type === 'workspace') {
    this.contextStore.switchWorkspace(item.id);  // ❌ Direct store mutation
    this.router.navigate(['/workspace', 'overview']);
  }
  this.closeDialog();
}
```

**Why This Violates Facade Principle**:
1. Dialog directly mutates ContextStore (bypasses WorkspaceFacade)
2. No validation (is workspace accessible?)
3. No UX feedback (no snackbar on switch)
4. No access tracking (WorkspaceStore.trackAccess() not called)
5. Inconsistent with workspace-switcher pattern

**Missing Integration**: Should call `WorkspaceFacade.switchWorkspace()`

---

## 4️⃣ Auth → Context Bootstrap (IMPLICIT ORCHESTRATION)

**Location**: `src/app/application/context/stores/context.store.ts` withHooks.onInit

**Current Pattern**:
```typescript
// ContextStore orchestrates its own initialization:
withHooks({
  onInit(store, authStore, orgService, teamService, partnerService) {
    const loadAvailableContexts = rxMethod<void>(
      pipe(
        switchMap(() => {
          const user = authStore.user();
          if (!user) {
            store.clearContext();
            return of(null);
          }
          store.switchContext({ type: 'user', ... });
          return combineLatest([
            orgService.list({}),
            teamService.list({}),
            partnerService.list({})
          ]);
        }),
        tap((result) => {
          store.setAvailableOrganizations(...);
          store.setAvailableTeams(...);
          store.setAvailablePartners(...);
        })
      )
    );
  }
})
```

**Why This Is Problematic**:
1. Store contains orchestration logic (should be in Use Case)
2. Multi-repository coordination in store (violates SRP)
3. Cannot unit test initialization flow without mocking 3 repositories
4. Cannot reuse initialization logic (e.g., "refresh contexts" button)

**Missing Abstraction**: `ContextInitializationUseCase` or `BootstrapFacade`

---

## 5️⃣ Menu / Switcher Orchestration (IMPLICIT COUPLING)

**Observed Issue**: Menu closes unexpectedly during state transitions

**Root Cause Analysis**:
- Account switcher menu depends on `accountStore.currentAccount()`
- Workspace switcher menu depends on `workspaceStore.currentWorkspace()`
- When switching triggers async state updates:
  1. Menu opens (stable DOM)
  2. User clicks item
  3. Store mutation triggers signal update
  4. Signal triggers template re-evaluation
  5. `@if` conditions inside menu change
  6. DOM structure changes while menu is open
  7. Material menu loses anchor → closes prematurely

**Current Mitigation**: Replaced `@if` with `[hidden]` (stable DOM)

**Missing Orchestration**:
- No explicit "menu interaction mode" flag
- No "defer state updates until menu closed" logic
- Menu lifecycle and state updates are implicitly coupled via timing

**Potential Facade Method**: `enterInteractionMode()` / `exitInteractionMode()`

---

## Summary: Facade Deficiency Points

| Area | Facade Exists? | Priority | Impact |
|------|----------------|----------|--------|
| Account Switching | ❌ NO | 🔴 CRITICAL | UI flash, tight coupling |
| Workspace Switching | ✅ YES | ✅ COMPLIANT | Recently fixed |
| Search Dialog (Workspace) | ❌ NO | 🟡 MEDIUM | Inconsistency, missing features |
| Auth → Context Bootstrap | ❌ NO | 🟡 MEDIUM | Store bloat, untestable |
| Menu Lifecycle | ❌ NO | 🟢 LOW | Mitigated with stable DOM |

---

## Recommended Refactoring Plan

### Phase 1: Account Switching (CRITICAL)
1. Create `AccountSwitchUseCase` 
2. Create `AccountFacade` with ViewModel
3. Refactor `account-switcher.component.ts` to delegate

### Phase 2: Search Dialog Consistency
1. Inject `WorkspaceFacade` into `search-dialog.component.ts`
2. Replace direct `contextStore.switchWorkspace()` call

### Phase 3: Context Initialization (OPTIONAL)
1. Extract `ContextInitializationUseCase`
2. Move orchestration logic out of `ContextStore.withHooks`
3. Expose `ContextFacade.bootstrap()` method

---

## Verification Criteria (Post-Refactor)

All of the following must be true:

✅ No UI component directly calls `store.setX()` mutation methods  
✅ No UI component coordinates multiple stores  
✅ No store contains multi-repository orchestration in `withHooks`  
✅ All switching flows have single entry point (Facade method)  
✅ Switching Account/Workspace does NOT cause menu flash  
✅ All Facades follow same naming/structure pattern  

---

**Audit Completed**: 2026-01-18
**Next Action**: Implement Phase 1 (AccountSwitchUseCase + AccountFacade)
