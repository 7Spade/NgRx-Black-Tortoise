import { Component, computed, inject, signal, DestroyRef, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BreakpointObserver } from '@angular/cdk/layout';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AuthStore } from '@application/auth/stores/auth.store';
import { AccountStore } from '@application/account/stores/account.store';
import { ContextStore } from '@application/context/stores/context.store';
import { BREAKPOINTS } from '@shared/constants/breakpoints';
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
    MatProgressSpinnerModule
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
  
  // Responsive states
  protected isMobile = signal(false);
  protected isTablet = signal(false);
  
  // Menu state
  protected isMenuOpen = signal(false);
  
  // Screen reader announcement
  protected announceMessage = signal('');
  
  // Computed values - use AccountStore for account data
  protected displayName = computed(() => {
    const currentAccount = this.accountStore.currentAccount();
    if (!currentAccount) {
      const user = this.authStore.user();
      return user?.displayName || user?.email || 'Not logged in';
    }
    
    return currentAccount.displayName || currentAccount.email || 'User';
  });
  
  protected avatarUrl = computed(() => {
    const currentAccount = this.accountStore.currentAccount();
    return currentAccount?.photoURL || null;
  });
  
  protected currentAccountType = computed((): AccountType => {
    const currentAccount = this.accountStore.currentAccount();
    if (currentAccount) {
      return currentAccount.type as AccountType;
    }
    return 'user';
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
   * Handle account switching
   */
  switchAccount(account: Account): void {
    // Update current account in AccountStore
    this.accountStore.setCurrentAccount(account);
    
    // Announce to screen readers
    const accountName = account.displayName || account.email || account.id;
    this.announceMessage.set(`Switched to account ${accountName}`);
    setTimeout(() => this.announceMessage.set(''), 1000);
  }
}
