import { computed, inject, Injectable } from '@angular/core';
import { AccountStore } from '../stores/account.store';
import { AccountSwitchUseCase } from '../use-cases/account-switch.use-case';
import { Account } from '@domain/account';
import { AuthStore } from '@application/auth/stores/auth.store';

/**
 * Account Facade
 * 
 * Single point of entry for ALL account-related operations from UI layer.
 * 
 * ARCHITECTURAL RESPONSIBILITY:
 * =============================
 * This Facade serves as the ONLY interface between Presentation and Application layers for accounts.
 * 
 * RESPONSIBILITIES:
 * =================
 * 1. Expose single ViewModel computed signal consolidating all account state
 * 2. Delegate operations to Use Cases (AccountSwitchUseCase)
 * 3. Provide derived data (filtered accounts by type)
 * 4. Encapsulate all store reads behind ViewModel abstraction
 * 5. Provide user menu ViewModel with derived display data
 * 
 * DEPENDENCY FLOW:
 * ================
 * AccountSwitcher Component → AccountFacade (THIS) → AccountSwitchUseCase → AccountStore
 * AccountMenu Component → AccountFacade (THIS) → AuthStore + AccountStore
 * 
 * FORBIDDEN PATTERNS:
 * ===================
 * ❌ UI components calling AccountStore directly
 * ❌ UI components calling AuthStore directly
 * ❌ UI components calling AccountSwitchUseCase directly
 * ❌ Facade owning business logic (delegation only)
 * 
 * ALLOWED PATTERNS:
 * =================
 * ✅ UI components inject ONLY AccountFacade
 * ✅ UI binds to facade.viewModel() signal
 * ✅ UI binds to facade.userMenuViewModel() signal
 * ✅ UI calls facade.switchAccount(account)
 * ✅ UI calls facade.logout()
 * ✅ Facade delegates to Use Cases for orchestration
 */
@Injectable({ providedIn: 'root' })
export class AccountFacade {
  private accountStore = inject(AccountStore);
  private accountSwitchUseCase = inject(AccountSwitchUseCase);
  private authStore = inject(AuthStore);

  /**
   * Single ViewModel consolidating ALL account state for UI consumption
   * 
   * ARCHITECTURAL RULE:
   * ===================
   * UI components MUST bind to this ViewModel ONLY.
   * No direct accountStore signal reads in templates.
   * 
   * DERIVED DATA:
   * =============
   * - Filters accounts by type (personal, organization, team)
   * - Computes loading state
   * - Exposes current account ID for active state checks
   */
  viewModel = computed(() => {
    const currentAccount = this.accountStore.currentAccount();
    const allAccounts = this.accountStore.accounts();
    const isLoading = this.accountStore.loading();

    // Derive filtered accounts
    const personalAccount = allAccounts.find(a => a.type === 'user') ?? null;
    const organizationAccounts = allAccounts.filter(a => a.type === 'organization');
    const teamAccounts = allAccounts.filter(a => a.type === 'team');
    const partnerAccounts = allAccounts.filter(a => a.type === 'partner');

    return {
      currentAccountId: currentAccount?.id ?? null,
      currentAccount,
      personalAccount,
      organizationAccounts,
      teamAccounts,
      partnerAccounts,
      isLoading
    };
  });

  /**
   * User Menu ViewModel
   * 
   * ARCHITECTURAL RULE:
   * ===================
   * Account menu components MUST bind to this ViewModel ONLY.
   * No direct AuthStore/AccountStore signal reads in templates.
   * 
   * DERIVED DATA:
   * =============
   * - User display name (with email fallback)
   * - Avatar URL
   * - User initials for avatar fallback
   * - Current account reference
   */
  userMenuViewModel = computed(() => {
    const user = this.authStore.user();
    const currentAccount = this.accountStore.currentAccount();

    // Helper to get email from account types that have it
    const getAccountEmail = (account: Account | null): string | undefined => {
      if (!account) return undefined;
      if (account.type === 'user') return account.email;
      if (account.type === 'organization') return account.contactEmail;
      return undefined;
    };

    // Helper to get photo URL from account types that have it
    const getAccountPhotoURL = (account: Account | null): string | null => {
      if (!account) return null;
      if (account.type === 'user') return account.photoURL || null;
      if (account.type === 'organization') return account.logoURL || null;
      if (account.type === 'bot') return account.avatarURL || null;
      if (account.type === 'team') return account.iconURL || null;
      if (account.type === 'partner') return account.logoURL || null;
      return null;
    };

    // Derive display name
    const displayName = currentAccount?.displayName 
      || getAccountEmail(currentAccount)
      || user?.email 
      || 'User';

    // Derive avatar URL
    const avatarUrl = getAccountPhotoURL(currentAccount);

    // Derive initials
    const initials = displayName
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || '??';

    return {
      user,
      currentAccount,
      displayName,
      avatarUrl,
      initials
    };
  });

  /**
   * Switch to a different account
   * 
   * DELEGATION RULE:
   * ================
   * This method does NOT contain business logic.
   * All validation, orchestration, and UX feedback delegated to AccountSwitchUseCase.
   * 
   * @param account - Target account to switch to
   * @returns Structured result from Use Case
   */
  switchAccount(account: Account): {
    success: boolean;
    message: string;
    announcement: string | null;
  } {
    return this.accountSwitchUseCase.execute(account);
  }

  /**
   * Logout current user
   * 
   * DELEGATION RULE:
   * ================
   * Delegates to AuthStore for logout.
   * In future, this should coordinate with ContextStore/WorkspaceStore clearing.
   * 
   * TODO: Create SessionFacade to coordinate full logout (Auth + Context + Workspace)
   */
  async logout(): Promise<void> {
    await this.authStore.logout();
  }
}
