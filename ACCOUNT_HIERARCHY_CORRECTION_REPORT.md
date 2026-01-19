# Account Hierarchy Correction Report

**Date**: 2026-01-19  
**Branch**: `copilot/add-identity-management-structure`  
**Scope**: Complete project audit for Account/Identity/Workspace hierarchy compliance

---

## Executive Summary

### Core Issue
Current implementation incorrectly treats **Team** and **Partner** as top-level `AccountType` values alongside User, Organization, and Bot. 

### Correct Hierarchy
```
TOP-LEVEL IDENTITIES (can authenticate, have credentials):
├── User (can own workspaces)
├── Organization (can own workspaces, has members)
└── Bot (service account, cannot own workspaces)

SUB-RESOURCES OF ORGANIZATION:
├── Team (internal unit, has memberIds, workspaceIds references)
└── Partner (external unit, has memberIds, workspaceIds references)
```

### Impact Assessment
- **Domain Layer**: Type definitions violate hierarchy by including Team/Partner in AccountType
- **Application Layer**: Facades and use-cases allow Team/Partner as top-level accounts
- **UI Layer**: Account switcher treats all 5 types equally
- **Infrastructure Layer**: No violations (repository implementations are correct)

---

## File-by-File Analysis

### 🔴 CRITICAL VIOLATIONS

#### 1. `src/app/domain/account/entities/account.entity.ts`
**Current Responsibility**: Defines AccountType and all account interfaces  
**Hierarchy Violation**: ❌ **CRITICAL**
```typescript
// LINE 23: INCORRECT - includes team/partner as top-level
export type AccountType = 'user' | 'organization' | 'bot' | 'team' | 'partner';
```

**Issue**: 
- `AccountType` should ONLY include identities: `'user' | 'organization' | 'bot'`
- Team and Partner are NOT identities, they are membership constructs
- TeamAccount and PartnerAccount interfaces contain `organizationId` field, proving they are sub-resources

**Verdict**: ✅ **KEEP** but **REFACTOR**

**Required Changes**:
```typescript
// CORRECTED TYPE
export type IdentityType = 'user' | 'organization' | 'bot';

// NEW: Sub-resource types
export type MembershipType = 'team' | 'partner';

// DEPRECATED: AccountType (used for UI compatibility only)
/** @deprecated Use IdentityType for authentication context */
export type AccountType = IdentityType | MembershipType;

// UPDATE base interface
export interface BaseAccount {
  readonly id: string;
  readonly type: AccountType; // Keep for backward compatibility
  // ... rest unchanged
}

// ADD identity-specific base
export interface BaseIdentity extends BaseAccount {
  readonly type: IdentityType;
}

// User, Organization, Bot extend BaseIdentity
export interface UserAccount extends BaseIdentity {
  type: 'user';
  // ...
}

export interface OrganizationAccount extends BaseIdentity {
  type: 'organization';
  memberIds: string[];
  // ...
}

export interface BotAccount extends BaseIdentity {
  type: 'bot';
  // ...
}

// Team and Partner are NOT identities
export interface TeamAccount extends BaseAccount {
  type: 'team';
  organizationId: string; // ← Proof they belong to Organization
  // ...
}

export interface PartnerAccount extends BaseAccount {
  type: 'partner';
  organizationId: string; // ← Proof they belong to Organization
  // ...
}

// NEW discriminated union for IDENTITIES ONLY
export type Identity = UserAccount | OrganizationAccount | BotAccount;

// Existing Account type remains for UI compatibility
export type Account = Identity | TeamAccount | PartnerAccount;
```

**Naming Consistency**: ✅ Aligns with canonical spec

---

#### 2. `src/app/application/account/facades/account.facade.ts`
**Current Responsibility**: Facade for account switching, provides ViewModels  
**Hierarchy Violation**: ❌ **MODERATE**

**Issues**:
- Lines 71-74: Filters `teamAccounts` and `partnerAccounts` at same level as organizations
- Exposes Team/Partner as switchable accounts instead of organization sub-resources

**Verdict**: ✅ **KEEP** but **REFACTOR**

**Required Changes**:
```typescript
// BEFORE (Lines 65-85)
viewModel = computed(() => {
  const currentAccount = this.accountStore.currentAccount();
  const allAccounts = this.accountStore.accounts();
  
  const personalAccount = allAccounts.find(a => a.type === 'user') ?? null;
  const organizationAccounts = allAccounts.filter(a => a.type === 'organization');
  const teamAccounts = allAccounts.filter(a => a.type === 'team');        // ❌ WRONG
  const partnerAccounts = allAccounts.filter(a => a.type === 'partner');  // ❌ WRONG
  
  return {
    currentAccountId: currentAccount?.id ?? null,
    currentAccount,
    personalAccount,
    organizationAccounts,
    teamAccounts,      // ❌ Exposed as top-level
    partnerAccounts,   // ❌ Exposed as top-level
    isLoading
  };
});

// AFTER (CORRECTED)
viewModel = computed(() => {
  const currentAccount = this.accountStore.currentAccount();
  const allAccounts = this.accountStore.accounts();
  const isLoading = this.accountStore.loading();
  
  // IDENTITIES ONLY (can switch to these)
  const personalAccount = allAccounts.find(a => a.type === 'user') ?? null;
  const organizationAccounts = allAccounts.filter(a => a.type === 'organization');
  const botAccounts = allAccounts.filter(a => a.type === 'bot');
  
  // SUB-RESOURCES (displayed under their parent organization)
  const currentOrgId = currentAccount?.type === 'organization' 
    ? currentAccount.id 
    : (currentAccount as TeamAccount | PartnerAccount)?.organizationId;
    
  const currentOrgTeams = allAccounts.filter(a => 
    a.type === 'team' && (a as TeamAccount).organizationId === currentOrgId
  ) as TeamAccount[];
  
  const currentOrgPartners = allAccounts.filter(a => 
    a.type === 'partner' && (a as PartnerAccount).organizationId === currentOrgId
  ) as PartnerAccount[];
  
  return {
    currentAccountId: currentAccount?.id ?? null,
    currentAccount,
    // TOP-LEVEL IDENTITIES
    personalAccount,
    organizationAccounts,
    botAccounts,
    // SUB-RESOURCES (contextual to current organization)
    currentOrganizationId: currentOrgId ?? null,
    currentOrganizationTeams: currentOrgTeams,
    currentOrganizationPartners: currentOrgPartners,
    isLoading
  };
});
```

**Naming Consistency**: ⚠️ Must change from `teamAccounts`/`partnerAccounts` to `currentOrganizationTeams`/`currentOrganizationPartners`

---

#### 3. `src/app/application/account/use-cases/account-switch.use-case.ts`
**Current Responsibility**: Orchestrates account switching with validation  
**Hierarchy Violation**: ⚠️ **MINOR**

**Issues**:
- Lines 92-99: `getAccountTypeLabel()` treats team/partner as equal to organization
- Should validate that Team/Partner switching requires Organization context

**Verdict**: ✅ **KEEP** but **REFACTOR**

**Required Changes**:
```typescript
// ADD validation before switch
execute(targetAccount: Account): {
  success: boolean;
  message: string;
  announcement: string | null;
} {
  const currentAccount = this.accountStore.currentAccount();
  
  // Existing validation...
  if (currentAccount?.id === targetAccount.id) {
    // ...
  }
  
  // NEW: Validate hierarchy constraints
  if (targetAccount.type === 'team' || targetAccount.type === 'partner') {
    // Team/Partner require organization context
    const organizationId = (targetAccount as TeamAccount | PartnerAccount).organizationId;
    const hasOrgAccess = this.accountStore.accounts().some(
      a => a.type === 'organization' && a.id === organizationId
    );
    
    if (!hasOrgAccess) {
      const message = 'Cannot switch to team/partner without organization access';
      this.snackBar.open(message, 'OK', { duration: 3000 });
      return {
        success: false,
        message,
        announcement: null
      };
    }
  }
  
  // Execute switch...
}

// UPDATE label function
private getAccountTypeLabel(type: string): string {
  switch (type) {
    case 'user':
      return 'Personal Account';
    case 'organization':
      return 'Organization';
    case 'bot':
      return 'Bot';
    case 'team':
      return 'Team (requires organization context)';  // ← Clarify hierarchy
    case 'partner':
      return 'Partner (requires organization context)';  // ← Clarify hierarchy
    default:
      return 'Account';
  }
}
```

**Naming Consistency**: ✅ Aligns with canonical spec

---

#### 4. `src/app/presentation/shared/components/switchers/account-switcher/account-switcher.component.ts`
**Current Responsibility**: UI component for account switching  
**Hierarchy Violation**: ❌ **CRITICAL**

**Issues**:
- Line 16: Local `AccountType` type includes team/partner (should use domain type)
- Lines 139-143: `getAccountTypeIcon()` treats all 5 types equally
- Component does NOT group Team/Partner under their parent Organization

**Verdict**: ✅ **KEEP** but **REFACTOR**

**Required Changes**:
```typescript
// REMOVE local type definition (Line 16)
// type AccountType = 'user' | 'organization' | 'bot' | 'team' | 'partner'; // ❌ DELETE

// Use domain types instead
import { Account, IdentityType, canOwnWorkspace } from '@domain/account';

// UPDATE icon function to reflect hierarchy
getAccountTypeIcon(type: string): string {
  switch (type) {
    case 'user':
      return 'person';
    case 'organization':
      return 'business';
    case 'bot':
      return 'robot';  // Changed from 'person' for clarity
    case 'team':
      return 'groups';  // Sub-resource icon
    case 'partner':
      return 'handshake';  // Sub-resource icon
    default:
      return 'person';
  }
}
```

**Naming Consistency**: ✅ Will align after facade refactor

---

#### 5. `src/app/presentation/shared/components/switchers/account-switcher/account-switcher.component.html`
**Current Responsibility**: UI template for account switcher menu  
**Hierarchy Violation**: ❌ **CRITICAL**

**Issues**:
- Lines 167-209: Teams section rendered at same level as Organizations
- Lines 213-255: Partners section rendered at same level as Organizations
- No hierarchical grouping showing Team/Partner belong to Organizations

**Verdict**: ✅ **KEEP** but **REFACTOR**

**Required Changes**:
```html
<!-- BEFORE: Teams as top-level section (Lines 167-209) -->
<mat-divider></mat-divider>
<div class="menu-section">
  <div class="section-title">Teams</div>
  <!-- Team items... -->
</div>

<!-- AFTER: Teams nested under current organization -->
<mat-divider></mat-divider>

<!-- Organizations Section with nested Teams/Partners -->
<div class="menu-section">
  <div class="section-title">Organizations</div>
  
  @for (org of facade.viewModel().organizationAccounts; track org.id) {
    <!-- Organization item -->
    <button mat-menu-item (click)="switchAccount(org)">
      <!-- ... org UI ... -->
    </button>
    
    <!-- Show org's teams/partners if this is current org -->
    @if (org.id === facade.viewModel().currentOrganizationId) {
      <div class="nested-section">
        <!-- Teams under this org -->
        @if (facade.viewModel().currentOrganizationTeams.length > 0) {
          <div class="nested-header">Teams</div>
          @for (team of facade.viewModel().currentOrganizationTeams; track team.id) {
            <button mat-menu-item class="nested-item" (click)="switchAccount(team)">
              <mat-icon>groups</mat-icon>
              <span>{{ team.displayName }}</span>
            </button>
          }
        }
        
        <!-- Partners under this org -->
        @if (facade.viewModel().currentOrganizationPartners.length > 0) {
          <div class="nested-header">Partners</div>
          @for (partner of facade.viewModel().currentOrganizationPartners; track partner.id) {
            <button mat-menu-item class="nested-item" (click)="switchAccount(partner)">
              <mat-icon>handshake</mat-icon>
              <span>{{ partner.displayName }}</span>
            </button>
          }
        }
      </div>
    }
  }
  
  <div class="empty-state" [hidden]="facade.viewModel().organizationAccounts.length > 0">
    No organizations yet
  </div>
</div>

<!-- DELETE standalone Teams section (Lines 167-209) -->
<!-- DELETE standalone Partners section (Lines 213-255) -->
```

Add corresponding SCSS for nested indentation:
```scss
.nested-section {
  margin-left: 16px;
  border-left: 2px solid var(--mat-sys-outline-variant);
  padding-left: 8px;
}

.nested-header {
  font-size: 12px;
  color: var(--mat-sys-on-surface-variant);
  padding: 8px 16px 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.nested-item {
  padding-left: 24px !important;
  font-size: 14px;
}
```

**Naming Consistency**: ✅ Follows canonical nested structure

---

### ✅ NO VIOLATIONS (Canonical Files)

#### 6. `src/app/application/account/stores/account.store.ts`
**Current Responsibility**: NgRx Signals store for account state  
**Hierarchy Violation**: ✅ **NONE**

**Analysis**: Store correctly manages accounts array without assuming hierarchy. It's a data container.

**Verdict**: ✅ **CANONICAL** - No changes needed

---

#### 7. `src/app/application/workspace/use-cases/workspace-creation.use-case.ts`
**Current Responsibility**: Validates workspace creation constraints  
**Hierarchy Violation**: ✅ **NONE**

**Analysis**: Lines 129-140 correctly enforce that ONLY user/organization can create workspaces:
```typescript
if (currentContext.type === 'team' || currentContext.type === 'partner') {
  throw new Error('Only user and organization accounts can create workspaces');
}
```

**Verdict**: ✅ **CANONICAL** - Enforces correct hierarchy

---

#### 8. Infrastructure Layer Files (All Bot/Team/Partner/Organization Services)
**Hierarchy Violation**: ✅ **NONE**

**Analysis**: Repository implementations correctly handle their specific entity types without making hierarchy assumptions.

**Verdict**: ✅ **CANONICAL** - No changes needed

---

## Summary Table

| File | Current State | Verdict | Action | Priority |
|------|---------------|---------|--------|----------|
| `domain/account/entities/account.entity.ts` | Violates hierarchy in type definition | **KEEP + REFACTOR** | Add `IdentityType`, deprecate `AccountType` | 🔴 CRITICAL |
| `application/account/facades/account.facade.ts` | Exposes team/partner as top-level | **KEEP + REFACTOR** | Nest team/partner under org in ViewModel | 🔴 CRITICAL |
| `application/account/use-cases/account-switch.use-case.ts` | Missing hierarchy validation | **KEEP + REFACTOR** | Add org context validation for team/partner switch | ⚠️ MODERATE |
| `presentation/switchers/account-switcher.component.ts` | Local type definition violates hierarchy | **KEEP + REFACTOR** | Remove local type, use domain types | 🔴 CRITICAL |
| `presentation/switchers/account-switcher.component.html` | UI treats all 5 types equally | **KEEP + REFACTOR** | Nest team/partner under current org visually | 🔴 CRITICAL |
| `application/account/stores/account.store.ts` | No violations | **CANONICAL** | None | ✅ |
| `application/workspace/use-cases/workspace-creation.use-case.ts` | Correctly enforces hierarchy | **CANONICAL** | None | ✅ |
| All Infrastructure services | No hierarchy assumptions | **CANONICAL** | None | ✅ |

---

## Invariants Preserved

✅ **Single Source of Truth**: Domain layer remains authoritative for type definitions  
✅ **Unidirectional State Flow**: Presentation → Application → Domain  
✅ **UI Isolation from Domain**: Facade patterns maintained  
✅ **Deterministic Interaction Ownership**: Account switching still owned by AccountSwitchUseCase  
✅ **Testability**: All changes preserve injectable dependencies

---

## Implementation Steps

### Step 1: Domain Layer (Foundation)
1. Update `src/app/domain/account/entities/account.entity.ts`
   - Add `IdentityType = 'user' | 'organization' | 'bot'`
   - Add `MembershipType = 'team' | 'partner'`
   - Deprecate `AccountType` with JSDoc
   - Create `Identity` discriminated union
   - Add type guards: `isIdentity()`, `isMembership()`

### Step 2: Application Layer (Business Logic)
2. Update `src/app/application/account/facades/account.facade.ts`
   - Refactor `viewModel()` computed to group team/partner under org
   - Add `currentOrganizationId`, `currentOrganizationTeams`, `currentOrganizationPartners`
   - Remove top-level `teamAccounts`, `partnerAccounts`

3. Update `src/app/application/account/use-cases/account-switch.use-case.ts`
   - Add validation: Team/Partner switch requires org context
   - Update `getAccountTypeLabel()` to clarify hierarchy
   - Add error handling for missing org context

### Step 3: Presentation Layer (UI)
4. Update `src/app/presentation/shared/components/switchers/account-switcher/account-switcher.component.ts`
   - Remove local `AccountType` definition (line 16)
   - Import `IdentityType` from domain
   - Update `getAccountTypeIcon()` for bot icon clarity

5. Update `src/app/presentation/shared/components/switchers/account-switcher/account-switcher.component.html`
   - Delete standalone Teams section (lines 167-209)
   - Delete standalone Partners section (lines 213-255)
   - Nest team/partner rendering under current organization
   - Add visual hierarchy (indentation, borders)

6. Update `src/app/presentation/shared/components/switchers/account-switcher/account-switcher.component.scss`
   - Add `.nested-section`, `.nested-header`, `.nested-item` styles

### Step 4: Validation
7. Test account switching flows:
   - ✅ User → Organization (allowed)
   - ✅ Organization → User (allowed)
   - ✅ Organization → Team (allowed if team.organizationId matches)
   - ❌ User → Team (blocked, no org context)
   - ❌ Team → Partner (blocked if different orgs)

8. Visual verification:
   - Teams/Partners appear nested under their parent organization
   - Clear visual hierarchy in switcher menu
   - Correct icons for all account types

---

## Architecture Compliance Checklist

- [x] **Zero framework dependencies in domain**: Domain types remain pure TypeScript
- [x] **Member management externalized**: No changes to workspace structure
- [x] **Type-safe ownership**: Discriminated unions enforced at compile-time
- [x] **No data duplication**: Single source of truth in AccountStore
- [x] **Reactive by default**: Facades expose computed ViewModels
- [x] **Facade orchestration**: UI never bypasses facades/use-cases
- [x] **Naming consistency**: Matches canonical UI spec terminology
- [x] **Function signatures**: Reflect corrected hierarchy constraints

---

## Memory Update Required

**New Rules to Persist**:
1. ✅ Top-level accounts: `User | Organization | Bot` (IdentityType)
2. ✅ Sub-accounts: `Team | Partner` under Organization (MembershipType)
3. ✅ Facades and use-cases must enforce hierarchy; UI cannot bypass
4. ✅ Naming and function signatures must match canonical hierarchy
5. ✅ Team/Partner displayed nested under parent Organization in UI
6. ✅ Account switching to Team/Partner requires Organization context validation
7. ✅ `AccountType` deprecated in favor of `IdentityType` + `MembershipType`
8. ✅ UI switcher shows hierarchical structure, not flat list

---

## References
- Domain model: `src/app/domain/account/entities/account.entity.ts`
- Canonical UI spec: `docs/ui/switcher-ui-spec/`
- Architecture invariants: PR description for `copilot/add-identity-management-structure`

---

**End of Report**
