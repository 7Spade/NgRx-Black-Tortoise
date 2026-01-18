import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthStore } from '@application/auth/stores/auth.store';
import { ContextStore } from '@application/context/stores/context.store';

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
export class AccountSwitcherComponent {
  // Stores
  protected authStore = inject(AuthStore);
  protected contextStore = inject(ContextStore);
  
  // Menu state
  protected isMenuOpen = signal(false);
  
  // Computed values
  protected displayName = computed(() => {
    const user = this.authStore.user();
    if (!user) return 'Not logged in';
    
    return user.displayName || user.email || 'User';
  });
  
  protected avatarUrl = computed(() => {
    // AuthUser doesn't have photoURL, return null for now
    return null;
  });
  
  protected currentAccountType = computed((): AccountType => {
    const contextType = this.contextStore.currentContextType();
    if (contextType) {
      return contextType as AccountType;
    }
    return 'user';
  });
  
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
  switchAccount(accountId: string): void {
    // TODO: Implement account switching logic
    console.log('Switching to account:', accountId);
  }
}
