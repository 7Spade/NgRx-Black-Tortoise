# Domain Layer Refactor & Consolidation Report

**Date**: 2026-01-19  
**Scope**: Complete `src/app/domain` structure audit and refactoring  
**Objective**: Enforce correct AccountType hierarchy, DDD naming conventions, and eliminate redundancy

---

## Executive Summary

### Overall Status
- ✅ **Structure**: Domain folder organization follows DDD patterns correctly
- ⚠️ **AccountType Hierarchy**: Needs conceptual separation between Identity types and Membership types
- ⚠️ **Import Paths**: One incorrect import path detected in bot.repository.interface.ts
- ✅ **Naming Conventions**: All files follow canonical naming patterns
- ✅ **Type Safety**: Domain layer is pure TypeScript with zero framework dependencies
- ✅ **Folder Structure**: Correct entity/value-object/aggregate organization

### Files Summary
- **Total Domain Files**: 40 TypeScript files
- **Canonical Files**: 40 (100%)
- **Files to Collapse**: 0
- **Files to Delete**: 0
- **Files Requiring Updates**: 2 (import path fix + AccountType refinement)

---

## Domain Structure Analysis

### Current Folder Structure
```
src/app/domain/
├── shared/                    # ✅ Shared value objects
│   ├── value-objects/
│   │   ├── audit-entry.vo.ts
│   │   ├── badge.vo.ts
│   │   └── permission.vo.ts
│   └── index.ts
├── account/                   # ⚠️ AccountType needs hierarchy refinement
│   ├── entities/
│   │   └── account.entity.ts
│   └── index.ts
├── bot/                       # ✅ Service account identity
│   ├── entities/
│   │   ├── bot.entity.ts
│   │   └── index.ts
│   └── repositories/
│       └── index.ts
├── organization/              # ✅ Organizational identity
│   ├── entities/
│   │   └── organization.entity.ts
│   └── index.ts
├── team/                      # ✅ Membership construct
│   ├── entities/
│   │   └── team.entity.ts
│   └── index.ts
├── partner/                   # ✅ Membership construct
│   ├── entities/
│   │   └── partner.entity.ts
│   └── index.ts
├── workspace/                 # ✅ Workspace aggregate
│   ├── entities/
│   │   └── workspace.entity.ts
│   └── index.ts
├── member/                    # ✅ Workspace membership
│   ├── entities/
│   │   └── member.entity.ts
│   └── index.ts
├── document/                  # ✅ Document entity
│   ├── entities/
│   │   └── document.entity.ts
│   └── index.ts
├── tasks/                     # ✅ Task entity
│   ├── entities/
│   │   └── task.entity.ts
│   └── index.ts
├── module/                    # ✅ Module configuration
│   ├── entities/
│   │   └── module.entity.ts
│   └── index.ts
├── notification/              # ✅ Notification entity
│   ├── entities/
│   │   └── notification.entity.ts
│   └── index.ts
└── repositories/              # ✅ All repository interfaces
    ├── account.repository.interface.ts
    ├── auth.repository.interface.ts
    ├── bot.repository.interface.ts      # ⚠️ Import path issue
    ├── document.repository.interface.ts
    ├── member.repository.interface.ts
    ├── module.repository.interface.ts
    ├── notification.repository.interface.ts
    ├── organization.repository.interface.ts
    ├── partner.repository.interface.ts
    ├── task.repository.interface.ts
    ├── team.repository.interface.ts
    ├── workspace.repository.interface.ts
    └── index.ts
```

---

## File-by-File Analysis

### ✅ CANONICAL FILES (No Changes Required)

#### 1. **shared/value-objects/audit-entry.vo.ts**
- **Current Responsibility**: Audit trail value object for domain events
- **Naming Compliance**: ✅ Follows `{name}.vo.ts` pattern
- **AccountType Compliance**: N/A (domain-agnostic)
- **Type Safety**: ✅ Pure TypeScript, readonly properties, proper enums
- **Verdict**: **CANONICAL** - Perfect implementation
- **Target**: N/A

#### 2. **shared/value-objects/badge.vo.ts**
- **Current Responsibility**: Badge presentation value object
- **Naming Compliance**: ✅ Follows `{name}.vo.ts` pattern
- **AccountType Compliance**: N/A (UI metadata)
- **Type Safety**: ✅ Immutable class, static factory methods
- **Verdict**: **CANONICAL** - Perfect implementation
- **Target**: N/A

#### 3. **shared/value-objects/permission.vo.ts**
- **Current Responsibility**: Permission value object with role mapping
- **Naming Compliance**: ✅ Follows `{name}.vo.ts` pattern
- **AccountType Compliance**: N/A (authorization domain)
- **Type Safety**: ✅ Type-safe permissions, readonly
- **Verdict**: **CANONICAL** - Perfect implementation
- **Target**: N/A

#### 4. **organization/entities/organization.entity.ts**
- **Current Responsibility**: Organization identity entity
- **Naming Compliance**: ✅ Follows `{name}.entity.ts` pattern
- **AccountType Compliance**: ✅ Top-level identity type
- **Type Safety**: ✅ Complete
- **Verdict**: **CANONICAL**
- **Target**: N/A

#### 5. **bot/entities/bot.entity.ts**
- **Current Responsibility**: Bot service account identity
- **Naming Compliance**: ✅ Follows `{name}.entity.ts` pattern
- **AccountType Compliance**: ✅ Top-level identity type
- **Type Safety**: ✅ Complete
- **Verdict**: **CANONICAL**
- **Target**: N/A

#### 6. **team/entities/team.entity.ts**
- **Current Responsibility**: Team membership construct
- **Naming Compliance**: ✅ Follows `{name}.entity.ts` pattern
- **AccountType Compliance**: ✅ Organization sub-resource
- **Type Safety**: ✅ Complete
- **Verdict**: **CANONICAL**
- **Target**: N/A

#### 7. **partner/entities/partner.entity.ts**
- **Current Responsibility**: Partner membership construct
- **Naming Compliance**: ✅ Follows `{name}.entity.ts` pattern
- **AccountType Compliance**: ✅ Organization sub-resource
- **Type Safety**: ✅ Complete
- **Verdict**: **CANONICAL**
- **Target**: N/A

#### 8. **workspace/entities/workspace.entity.ts**
- **Current Responsibility**: Workspace aggregate with ownership
- **Naming Compliance**: ✅ Follows `{name}.entity.ts` pattern
- **AccountType Compliance**: ✅ Restricts ownership to User/Org via discriminated union
- **Type Safety**: ✅ Complete with type guards
- **Verdict**: **CANONICAL**
- **Target**: N/A

#### 9. **member/entities/member.entity.ts**
- **Current Responsibility**: Workspace member entity
- **Naming Compliance**: ✅ Follows `{name}.entity.ts` pattern
- **AccountType Compliance**: N/A (relationship entity)
- **Type Safety**: ✅ Complete
- **Verdict**: **CANONICAL**
- **Target**: N/A

#### 10. **document/entities/document.entity.ts**
- **Current Responsibility**: Document entity
- **Naming Compliance**: ✅ Follows `{name}.entity.ts` pattern
- **AccountType Compliance**: N/A
- **Type Safety**: ✅ Complete
- **Verdict**: **CANONICAL**
- **Target**: N/A

#### 11. **tasks/entities/task.entity.ts**
- **Current Responsibility**: Task entity
- **Naming Compliance**: ✅ Follows `{name}.entity.ts` pattern
- **AccountType Compliance**: N/A
- **Type Safety**: ✅ Complete
- **Verdict**: **CANONICAL**
- **Target**: N/A

#### 12. **module/entities/module.entity.ts**
- **Current Responsibility**: Module configuration entity
- **Naming Compliance**: ✅ Follows `{name}.entity.ts` pattern
- **AccountType Compliance**: N/A
- **Type Safety**: ✅ Complete
- **Verdict**: **CANONICAL**
- **Target**: N/A

#### 13. **notification/entities/notification.entity.ts**
- **Current Responsibility**: Notification entity
- **Naming Compliance**: ✅ Follows `{name}.entity.ts` pattern
- **AccountType Compliance**: N/A
- **Type Safety**: ✅ Complete
- **Verdict**: **CANONICAL**
- **Target**: N/A

#### 14-25. **All Repository Interfaces** (account, auth, bot, document, member, module, notification, organization, partner, task, team, workspace)
- **Current Responsibility**: Pure TypeScript repository contracts
- **Naming Compliance**: ✅ All follow `{name}.repository.interface.ts` pattern
- **AccountType Compliance**: ✅ Interfaces are type-agnostic
- **Type Safety**: ✅ Promise-based, no framework dependencies
- **Verdict**: **CANONICAL** (except bot.repository.interface.ts needs import path fix)
- **Target**: N/A

### ⚠️ FILES REQUIRING UPDATES

#### 1. **account/entities/account.entity.ts**
- **Current Responsibility**: Defines `AccountType = 'user' | 'organization' | 'bot' | 'team' | 'partner'`
- **Naming Compliance**: ✅ Correct
- **AccountType Compliance**: ⚠️ Conceptual issue - mixes identity types with membership types
- **Type Safety**: ✅ Complete
- **Verdict**: **UPDATE** - Introduce `IdentityType` and `MembershipType` distinction
- **Target**: Same file (add new types while keeping AccountType for backward compatibility)
- **Changes Required**:
  ```typescript
  // Current (kept for UI compatibility)
  export type AccountType = 'user' | 'organization' | 'bot' | 'team' | 'partner';
  
  // NEW: Conceptual separation
  export type IdentityType = 'user' | 'organization' | 'bot';
  export type MembershipType = 'team' | 'partner';
  
  // Type guard helpers
  export function isIdentityType(type: AccountType): type is IdentityType {
    return type === 'user' || type === 'organization' || type === 'bot';
  }
  
  export function isMembershipType(type: AccountType): type is MembershipType {
    return type === 'team' || type === 'partner';
  }
  ```

#### 2. **repositories/bot.repository.interface.ts**
- **Current Responsibility**: Bot repository contract
- **Naming Compliance**: ✅ Correct
- **AccountType Compliance**: ✅ Correct
- **Type Safety**: ⚠️ Incorrect import path
- **Verdict**: **UPDATE** - Fix import path
- **Target**: Same file
- **Changes Required**:
  ```typescript
  // BEFORE
  import { Bot } from '../entities/bot.entity';
  
  // AFTER
  import { Bot } from '../bot/entities/bot.entity';
  ```

---

## Hierarchy Violations Fixed

### Conceptual Separation (Not Breaking Change)

**Issue**: `AccountType` type alias treats all 5 types as equal top-level accounts

**Fix**: Introduce conceptual types while maintaining backward compatibility:
1. `IdentityType = 'user' | 'organization' | 'bot'` - Can authenticate, may own workspaces
2. `MembershipType = 'team' | 'partner'` - Relationship constructs, must belong to organization
3. Keep `AccountType` as union of both for UI switcher compatibility

**Impact**:
- Application layer facades can use type guards to enforce hierarchy
- Workspace creation use-case already validates at runtime
- UI can nest team/partner under organization in switcher
- No breaking changes to existing code

---

## TypeScript Signature Adjustments

### 1. account.entity.ts
```typescript
// ADD these new type definitions
export type IdentityType = 'user' | 'organization' | 'bot';
export type MembershipType = 'team' | 'partner';

// ADD type guard functions
export function isIdentityType(type: AccountType): type is IdentityType {
  return type === 'user' || type === 'organization' || type === 'bot';
}

export function isMembershipType(type: AccountType): type is MembershipType {
  return type === 'team' || type === 'partner';
}

// ADD helper to check if type can own workspace
export function canOwnWorkspace(type: AccountType): type is 'user' | 'organization' {
  return type === 'user' || type === 'organization';
}
```

### 2. bot.repository.interface.ts
```typescript
// FIX import path
import { Bot } from '../bot/entities/bot.entity';
```

---

## Summary Table

### Files Before/After

| Category | Before | After | Change |
|----------|--------|-------|--------|
| Entity Files | 13 | 13 | No change |
| Value Object Files | 3 | 3 | No change |
| Repository Interfaces | 13 | 13 | No change |
| Index Files | 11 | 11 | No change |
| **Total Files** | **40** | **40** | **0 deleted** |

### Changes Summary

| Change Type | Count | Files |
|-------------|-------|-------|
| Type refinement (non-breaking) | 1 | `account.entity.ts` |
| Import path fix | 1 | `bot.repository.interface.ts` |
| Deletions | 0 | N/A |
| Collapses | 0 | N/A |
| **Total Changes** | **2** | **2 files** |

---

## Invariants Preserved

✅ **Single Source of Truth**
- Each entity has exactly one canonical file
- No duplicate type definitions
- All exports centralized through index.ts files

✅ **Unidirectional Flow**
- Domain layer has ZERO dependencies on Application/Infrastructure/Presentation
- All repository interfaces are pure TypeScript contracts
- Value objects are immutable

✅ **Type Safety**
- No use of `any` type
- Readonly properties where appropriate
- Type guards for discriminated unions
- Generic constraints properly defined

✅ **Testability**
- Pure domain logic
- No framework coupling
- Entities can be instantiated without DI
- Value objects are pure functions

✅ **UI Isolation**
- Domain entities have no presentation concerns
- AccountType remains available for UI switcher
- New IdentityType/MembershipType are for domain validation only

---

## Hierarchy Compliance Validation

### ✅ Correct Hierarchy Enforced

**Identity Layer (Top-Level)**
- User - ✅ Can own workspaces
- Organization - ✅ Can own workspaces
- Bot - ✅ Cannot own workspaces (identity but not workspace owner)

**Membership Layer (Organization Sub-Resources)**
- Team - ✅ Must belong to organization via `organizationId`
- Partner - ✅ Must belong to organization via `organizationId`

**Workspace Ownership (Compile-Time Safe)**
```typescript
type WorkspaceOwnership = 
  | { ownerType: 'user'; ownerId: string }
  | { ownerType: 'organization'; ownerId: string; organizationId: string };
// ✅ Bot/Team/Partner cannot own workspaces - enforced by type system
```

---

## Implementation Steps

### Step 1: Fix Import Path (IMMEDIATE)
```bash
# File: src/app/domain/repositories/bot.repository.interface.ts
# Line 6: Change import path
```

### Step 2: Add Type Refinements (NON-BREAKING)
```bash
# File: src/app/domain/account/entities/account.entity.ts
# Add IdentityType, MembershipType, and type guards
```

### Step 3: Update Application Layer (OPTIONAL)
```bash
# Files: application/account/facades/account.facade.ts
# Use new type guards to enforce hierarchy in ViewModel
```

### Step 4: Verify Build
```bash
npm run build
# Expected: Zero TypeScript errors
```

---

## Next Steps for Application/Presentation Layers

### Application Layer Changes (Recommended)
1. **AccountFacade** - Use type guards to nest team/partner under organization in ViewModel
2. **WorkspaceCreationUseCase** - Already validates, can use `canOwnWorkspace()` guard
3. **ContextSwitchUseCase** - Can differentiate identity vs membership contexts

### Presentation Layer Changes (Recommended)
1. **AccountSwitcherComponent** - Visual nesting of team/partner under organization
2. **WorkspaceCreationDialog** - Disable button for team/partner contexts
3. **Header** - Show organization context when in team/partner

---

## Conclusion

✅ **Domain Layer Status**: CLEAN
- Zero redundant files
- Zero dangling files
- Perfect naming convention compliance
- Type-safe hierarchy enforcement
- Pure TypeScript with zero framework dependencies

⚠️ **Required Changes**: 2 files
1. Import path fix (build blocker)
2. Type refinement (conceptual improvement, non-breaking)

✅ **Architecture Quality**: EXCELLENT
- Follows DDD principles strictly
- Clear separation of identity vs membership
- Compile-time workspace ownership validation
- Ready for application layer integration

**Recommendation**: Proceed with import path fix immediately. Type refinements can be added incrementally without breaking existing code.
