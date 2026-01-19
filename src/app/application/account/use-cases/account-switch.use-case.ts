import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AccountStore } from '../stores/account.store';
import { Account } from '@domain/account';

/**
 * Account Switch Use Case
 * 
 * Centralized orchestration for account switching operations.
 * 
 * ARCHITECTURAL RESPONSIBILITY:
 * =============================
 * This Use Case owns ALL business logic for account switching:
 * - Validates switching rules (e.g., not switching to same account)
 * - Coordinates AccountStore mutation
 * - Provides UX feedback (snackbar, screen reader announcements)
 * - Returns structured result for UI consumption
 * 
 * DEPENDENCY FLOW:
 * ================
 * AccountSwitcher Component → AccountFacade → AccountSwitchUseCase → AccountStore
 * 
 * FORBIDDEN PATTERNS:
 * ===================
 * ❌ UI components calling this Use Case directly
 * ❌ UI components calling AccountStore.setCurrentAccount() directly
 * ❌ UI components owning UX feedback logic
 * 
 * ALLOWED PATTERNS:
 * =================
 * ✅ AccountFacade delegates to this Use Case
 * ✅ Use Case coordinates store mutations + UX feedback
 * ✅ UI reads result and updates local state (e.g., screen reader announcements)
 */
@Injectable({ providedIn: 'root' })
export class AccountSwitchUseCase {
  private accountStore = inject(AccountStore);
  private snackBar = inject(MatSnackBar);

  /**
   * Switch to a different account with validation and UX feedback
   * 
   * @param targetAccount - The account to switch to
   * @returns Structured result containing success status and announcement message
   */
  execute(targetAccount: Account): {
    success: boolean;
    message: string;
    announcement: string | null;
  } {
    const currentAccount = this.accountStore.currentAccount();

    // Business Rule: Prevent switching to the same account
    if (currentAccount?.id === targetAccount.id) {
      const message = 'Already using this account';
      this.snackBar.open(message, 'OK', { duration: 2000 });
      
      return {
        success: false,
        message,
        announcement: null
      };
    }

    // Execute account switch mutation
    this.accountStore.setCurrentAccount(targetAccount);

    // Helper to get email from account types that have it
    const getAccountEmail = (account: Account): string | undefined => {
      if (account.type === 'user') return account.email;
      if (account.type === 'organization') return account.contactEmail;
      return undefined;
    };

    // Derive display labels
    const accountName = targetAccount.displayName || getAccountEmail(targetAccount) || targetAccount.id;
    const accountTypeLabel = this.getAccountTypeLabel(targetAccount.type);

    // UX Feedback: Visual notification
    const message = `Switched to ${accountTypeLabel}: ${accountName}`;
    this.snackBar.open(message, 'OK', { duration: 3000 });

    // UX Feedback: Screen reader announcement
    const announcement = `Switched to ${accountTypeLabel} account ${accountName}`;

    return {
      success: true,
      message,
      announcement
    };
  }

  /**
   * Get human-readable label for account type
   * 
   * @private
   */
  private getAccountTypeLabel(type: string): string {
    switch (type) {
      case 'personal':
        return 'Personal Account';
      case 'organization':
        return 'Organization';
      case 'team':
        return 'Team';
      case 'partner':
        return 'Partner';
      default:
        return 'Account';
    }
  }
}
