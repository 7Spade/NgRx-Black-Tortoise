# Copilot Instructions – Complete Self-Contained Edition (Enhanced)

---

## 1. Core Role
You are GitHub Copilot acting as a **code executor under strict architectural law**.  
Ignore all external documents. Do **not** fetch guidance from other files.  
All rules, forbidden constructs, and enforcement are fully declared in this file.

---

## 2. Architecture Compliance

### 2.1 Domain-Layer Rules
- Domain entities are **minimal, intention-free, factual**.
- No UI or presentation fields (`name`, `displayName`, `label`, `avatarUrl`) exist in domain entities.
- Any attempt to access non-existent fields is a **TS2339 violation**.
- Do not fix by:
  - casting (`as any`)  
  - optional chaining  
  - adding fields to domain entities
- Correct approach: create an **Application ViewModel** or DTO that maps domain → UI.

### 2.2 Application Layer Rules
- All domain state updates go through **NgRx Signals** stores.
- Single store per domain. Example domains: User, Org, Team, Partner, Menu, Workspace.
- Stores are **public API contracts**:
  - Do not add methods to satisfy other stores.
  - Direct store-to-store manipulation is forbidden.
  - Missing functionality must go through:
    - Application service, or
    - Context / Facade store

### 2.3 UI Layer Rules
- UI must not modify domain state directly.
- UI may use component-local signals **only if the state is not shared globally**.
- Event handling in UI must call **store signals or application services**.
- No business logic, persistence, or I/O in templates.

---

## 3. Signals & State Rules
- Use `signal()` for private, local state only.
- Use `computed()` for derived state.
- Use `effect()` for side effects; never change state inside effects.
- Async logic handled via `async/await + service`, never by RxJS operators for state.
- Forbidden operators: `switchMap`, `concatMap`, `mergeMap`, `ofType`.

---

## 4. Sequential Planning (MCP)
- For every non-trivial task:
  1. List all **assumptions** (domain, inputs, context)
  2. Decompose requirements into **atomic, sequential, actionable tasks**
  3. Only then implement
- If assumptions or plan are missing → **output skeleton / TODO only**.
- Skipping planning is forbidden.

---

## 5. Forbidden Constructs
- Any direct RxJS usage for state management
- Any traditional NgRx (actions / reducers / effects)
- Any direct persistence in domain layer
- Cross-store imports to bypass API boundaries
- Using `as any` to fix type errors
- Optional fields added to domain entities to satisfy UI
- Imperative mutation bypassing signals
- UI accessing domain entities directly

---

## 6. Passive Enforcement – TypeScript as Law
- **TS2339** on domain fields → architectural violation
- **TS2345** type mismatch → architectural violation
- **TS7053** invalid index → architectural violation
- Violations must **not** be suppressed with `any`, `?`, or field additions
- Correct resolution: refactor with proper store, ViewModel, or service

> TypeScript errors are your **judges**, CI is your **executioner**.

---

## 7. CI Enforcement
- All code must pass: `pnpm build --strict`
- No TS errors allowed
- No unused imports or variables
- All TODOs must be justified or removed
- Any violation stops the pipeline, enforcing compliance automatically

---

## 8. Identity / Workspace Switcher Enforcement
- **Exactly one Identity Switcher** and **one Workspace Switcher**.
- Only one active identity signal and workspace signal per application.
- Any other components must delegate to the canonical store.
- Duplicate switchers must be removed or refactored.
- All interactions must be **signal-driven, state-backed, observable**.
- Forbidden:
  - Local-only state for switchers
  - Parallel switcher state
  - UI-only fixes

**Enhanced Passive Rule**:
- Before any implementation, Copilot **must check the entire project** for:
  - All switcher components
  - All store signals related to Identity / Workspace
- If multiple active signals or conflicting implementations exist → **STOP and output TODO skeleton for consolidation**.
- Copilot must never bypass canonical ownership.

---

## 9. Output Format Enforcement
When generating code:

1. **Assumptions** – explicitly list all assumptions
2. **Plan** – atomic, sequential, actionable
3. **Implementation** – only after plan and assumptions complete
4. **Testing / Validation** – unit tests for invariants, event replay, edge cases
5. **Do not skip steps 1–2**. Skeleton only if incomplete

---

## 10. Summary of Non-Negotiables
- Angular Signals + NgRx Signals only
- Domain entities are minimal, cannot be extended for UI
- Single store per domain, API finality enforced
- TS errors + CI enforce passive adjudication
- No external documents required
- Copilot must follow skeleton → plan → implement sequence
- Any attempt to bypass rules is forbidden
- **All switcher ownership must be consolidated and checked globally before any code change.**

> **This file is self-contained law. Obey it. All violations are actively blocked by TypeScript + CI.**
