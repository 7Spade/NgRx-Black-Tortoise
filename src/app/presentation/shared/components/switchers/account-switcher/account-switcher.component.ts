import { Component, computed, inject, signal, DestroyRef, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BreakpointObserver } from '@angular/cdk/layout';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AuthStore } from '@application/auth/stores/auth.store';
import { AccountStore } from '@application/account/stores/account.store';
import { ContextStore } from '@application/context/stores/context.store';
import { BREAKPOINTS } from '@shared/constants/breakpoints.constant';
import { Account } from '@domain/account';

type AccountType = 'user' | 'organization' | 'bot' | 'team' | 'partner';

/**
 * Account Switcher Component
 * 
 * Displays a dropdown menu for switching between different account types:
 * - User accounts
 * - Organization accounts
 * - Team accounts
 * - Partner accounts
 * 
 * Features:
 * - Responsive design (desktop/tablet/mobile)
 * - Accessibility (ARIA attributes, keyboard navigation)
 * - Material Design 3 styling
 * - Zone-less reactive state management
 * - Real-time state propagation to ContextStore, WorkspaceStore, and ModuleStore
 * 
 * Integrates with AuthStore and ContextStore for state management.
 */
@Component({
  selector: 'app-account-switcher',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './account-switcher.component.html',
  styleUrl: './account-switcher.component.scss'
})
export class AccountSwitcherComponent implements OnInit {
  // Stores
  protected authStore = inject(AuthStore);
  protected accountStore = inject(AccountStore);
  protected contextStore = inject(ContextStore);
  private breakpointObserver = inject(BreakpointObserver);
  private destroyRef = inject(DestroyRef);
  private snackBar = inject(MatSnackBar);
  
  // Responsive states
  protected isMobile = signal(false);
  protected isTablet = signal(false);
  
  // Menu state
  protected isMenuOpen = signal(false);
  
  // Screen reader announcement
  protected announceMessage = signal('');
  
  // ✅ SINGLE VIEWMODEL RULE: One computed ViewModel for entire component
  // This prevents signal-induced DOM rebuilds and menu flashing
  protected viewModel = computed(() => {
    const currentAccount = this.accountStore.currentAccount();
    const user = this.authStore.user();
    const isLoading = this.authStore.isLoading();
    const personalAccount = this.accountStore.personalAccount();
    const organizationAccounts = this.accountStore.organizationAccounts();
    const teamAccounts = this.accountStore.teamAccounts();
    const partnerAccounts = this.accountStore.partnerAccounts();
    
    // Derive display name
    const displayName = currentAccount?.displayName || currentAccount?.email || 
                       user?.displayName || user?.email || 'Not logged in';
    
    // Derive avatar URL
    const avatarUrl = currentAccount?.photoURL || null;
    
    // Derive current account type
    const currentAccountType: AccountType = currentAccount?.type as AccountType || 'user';
    
    // Derive current account ID for active state checks
    const currentAccountId = currentAccount?.id || null;
    
    return {
      displayName,
      avatarUrl,
      currentAccountType,
      currentAccountId,
      isLoading,
      personalAccount,
      organizationAccounts,
      teamAccounts,
      partnerAccounts,
    };
  });
  
  ngOnInit(): void {
    // Detect mobile devices
    this.breakpointObserver
      .observe([BREAKPOINTS.mobile])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => {
        this.isMobile.set(result.matches);
      });
    
    // Detect tablets
    this.breakpointObserver
      .observe([BREAKPOINTS.tablet])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => {
        this.isTablet.set(result.matches);
      });
  }
  
  /**
   * Keyboard navigation handler
   */
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (!this.isMenuOpen()) return;
    
    switch (event.key) {
      case 'Escape':
        // Close menu
        this.isMenuOpen.set(false);
        event.preventDefault();
        break;
    }
  }
  
  /**
   * Menu opened event handler
   */
  onMenuOpened(): void {
    this.isMenuOpen.set(true);
  }
  
  /**
   * Menu closed event handler
   */
  onMenuClosed(): void {
    this.isMenuOpen.set(false);
  }
  
  /**
   * Get icon for account type
   */
  getAccountTypeIcon(type: AccountType): string {
    switch (type) {
      case 'user':
        return 'person';
      case 'organization':
        return 'business';
      case 'team':
        return 'groups';
      case 'partner':
        return 'handshake';
      default:
        return 'person';
    }
  }
  
  /**
   * Get badge color for account type
   */
  getBadgeColor(type: AccountType): string {
    switch (type) {
      case 'organization':
        return 'primary';
      case 'team':
        return 'accent';
      case 'partner':
        return 'warn';
      default:
        return '';
    }
  }
  
  /**
   * Handle account switching with visual feedback
   * 
   * This method:
   * 1. Updates AccountStore.currentAccount signal
   * 2. Triggers ContextStore.switchContext() for organization/team/partner scoping
   * 3. Reloads workspace list based on new context
   * 4. Provides visual feedback via MatSnackBar
   */
  switchAccount(account: Account): void {
    const previousAccount = this.accountStore.currentAccount();
    
    // Don't switch if selecting the same account
    if (previousAccount?.id === account.id) {
      this.snackBar.open('Already using this account', 'OK', { duration: 2000 });
      return;
    }
    
    // Update current account in AccountStore
    // This will automatically propagate to ContextStore and trigger workspace reload
    this.accountStore.setCurrentAccount(account);
    
    // Visual feedback
    const accountName = account.displayName || account.email || account.id;
    const accountTypeLabel = this.getAccountTypeLabel(account.type as AccountType);
    this.snackBar.open(
      `Switched to ${accountTypeLabel}: ${accountName}`,
      'OK',
      { duration: 3000 }
    );
    
    // Announce to screen readers
    this.announceMessage.set(`Switched to ${accountTypeLabel} account ${accountName}`);
    setTimeout(() => this.announceMessage.set(''), 1000);
  }
  
  /**
   * Get human-readable label for account type
   */
  private getAccountTypeLabel(type: AccountType): string {
    switch (type) {
      case 'user':
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
