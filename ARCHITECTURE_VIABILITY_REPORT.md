# Architecture Viability Report

**Date:** 2026-01-19  
**Context:** Post-architecture freeze evaluation  
**Enforced Rules:**
- One interaction = one Presentation Facade
- Shared must not own behavior
- Application layer must not duplicate orchestration
- Partial refactors are forbidden

---

## Evaluation Criteria

Each file is evaluated against:
1. **Unique Responsibility** - Does it have a single, clear purpose?
2. **Correct Layer** - Is it in the right architectural layer?
3. **No Duplication** - Does it avoid duplicating existing abstractions?
4. **Architecture Alignment** - Does it comply with DDD and facade patterns?

---

## File Verdicts

### 1. `src/app/presentation/shared/components/switchers/account-switcher/account-switcher.component.ts`

**Verdict:** KEEP

**Reason:** This is the CANONICAL facade for Account Identity switching interaction. It owns the MatMenu, trigger button, menu state, and delegates all business logic to AccountFacade. It is the only valid owner of this interaction per "One interaction → One facade → One overlay owner" rule. No duplication exists.

---

### 2. `src/app/presentation/shared/components/switchers/account-switcher/account-switcher.component.html`

**Verdict:** KEEP

**Reason:** Template file for the canonical Account Switcher facade. Contains MatMenu structure and account sections. Required for component rendering.

---

### 3. `src/app/presentation/shared/components/switchers/account-switcher/account-switcher.component.scss`

**Verdict:** KEEP

**Reason:** Styles for the canonical Account Switcher facade. Required for Material Design 3 theming and component presentation.

---

### 4. `src/app/presentation/shared/components/sidebar/module-item/module-item.component.ts`

**Verdict:** KEEP

**Reason:** Pure presentational component for rendering a single module item in sidebar. Has clear, unique responsibility: display module icon, name, badge, and emit click events. No business logic, no state ownership. This is a reusable UI building block, not a facade.

---

### 5. `src/app/application/context/facades/context.facade.ts`

**Verdict:** KEEP

**Reason:** Provides unified API for UI components to interact with context switching operations. Consolidates ViewModel for UI consumption and delegates to ContextSwitchUseCase and WorkspaceSwitchUseCase. This is the correct Application Layer pattern preventing UI from directly importing stores.

---

### 6. `src/app/application/context/stores/context.state.ts`

**Verdict:** KEEP

**Reason:** Defines the state shape for ContextStore. Separation of state definition from store implementation is a valid pattern for maintainability and clarity. No duplication.

---

### 7. `src/app/application/context/stores/context.store.ts`

**Verdict:** KEEP

**Reason:** CANONICAL SOURCE OF TRUTH for active workspace ID and application context (user/org/team/partner). Owns `currentWorkspaceId` signal and `switchWorkspace()` method. This is the single mutation point preventing state inconsistency. WorkspaceStore reacts to this store via effects, maintaining proper reactive flow.

---

### 8. `src/app/application/context/use-cases/context-switch.use-case.ts`

**Verdict:** KEEP

**Reason:** Single responsibility orchestrator for ALL context switching operations (organization, team, partner, user). Centralizes validation, state mutation, navigation, and UX feedback. Prevents UI components from implementing these concerns directly. Eliminates the anti-pattern of MenuService directly calling ContextStore or inline action callbacks in menu configuration.

---

### 9. `src/app/application/services/menu.service.ts`

**Verdict:** MERGE

**Reason:** MenuService contains duplicate orchestration responsibilities that should be delegated to ContextSwitchUseCase. Lines 108-175 show direct `contextStore.switchContext()` calls with inline action callbacks, violating the rule that context switching MUST go through ContextSwitchUseCase for centralized orchestration.

**Target:** Refactor to return MenuItem configuration WITHOUT action callbacks. UI components should execute context switches via ContextFacade, which delegates to ContextSwitchUseCase. MenuService should become a pure configuration provider.

**Required Changes:**
1. Remove all `action: () => this.contextStore.switchContext(...)` callbacks
2. Add `contextId` and `contextType` metadata to MenuItem objects
3. Document that UI must call `contextFacade.switchTo(contextType, contextId)` on menu item click

---

## Summary

| Verdict | Count | Files |
|---------|-------|-------|
| KEEP    | 8     | account-switcher (3 files), module-item, context.facade, context.state, context.store, context-switch.use-case |
| MERGE   | 1     | menu.service.ts → refactor to remove inline action callbacks |
| DELETE  | 0     | - |

---

## Architecture Compliance Status

✅ **Account Switcher:** Single facade, no fragmentation  
✅ **Context Switching:** Centralized through ContextSwitchUseCase  
❌ **MenuService:** Contains inline action callbacks bypassing ContextSwitchUseCase  

---

## Next Steps

1. **MenuService Refactor:**
   - Remove inline `action: () => contextStore.switchContext()` callbacks
   - Add `contextId` and `contextType` fields to MenuItem
   - Update UI components (header, sidebar) to call `contextFacade.switchTo()` on menu item clicks
   - Document the pattern in Copilot Memory

2. **Memory Update:**
   - Store rule: "MenuService provides configuration, NOT orchestration"
   - Store anti-pattern: "Inline action callbacks in MenuItem violate use case pattern"

---

## Compliance Verification

This report adheres to the directive:
- ✅ No code modifications made
- ✅ No refactoring performed
- ✅ No new files created (except this report)
- ✅ No bugs fixed
- ✅ Judgment only, no action

**Conclusion:** MenuService requires refactoring to remove inline orchestration and comply with the ContextSwitchUseCase pattern. All other files are architecturally sound and serve unique, necessary purposes.
