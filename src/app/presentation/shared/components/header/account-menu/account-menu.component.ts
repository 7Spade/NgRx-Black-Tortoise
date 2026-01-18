import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { AccountStore } from '@application/account/stores/account.store';
import { AuthStore } from '@application/auth/stores/auth.store';
import { AccountSwitcherComponent } from '../../switchers/account-switcher/account-switcher.component';

/**
 * Account Menu Component
 *
 * Displays user account menu with:
 * - User avatar and display name
 * - Account switcher integration
 * - Profile and settings links
 * - Sign out functionality
 * - ARIA labels for accessibility
 *
 * @example
 * <app-account-menu />
 */
@Component({
  selector: 'app-account-menu',
  standalone: true,
  imports: [
    CommonModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatListModule,
    AccountSwitcherComponent
  ],
  templateUrl: './account-menu.component.html',
  styleUrl: './account-menu.component.scss'
})
export class AccountMenuComponent {
  private authStore = inject(AuthStore);
  private accountStore = inject(AccountStore);

  // Current user
  user = this.authStore.user;
  currentAccount = this.accountStore.currentAccount;

  // User display name (fallback to email)
  displayName = computed(() => {
    const account = this.currentAccount();
    if (!account) return this.user()?.email || 'User';
    return account.displayName || account.email;
  });

  // User avatar URL
  avatarUrl = computed(() => {
    const account = this.currentAccount();
    return account?.photoURL || null;
  });

  // User initials for avatar fallback
  initials = computed(() => {
    const name = this.displayName();
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  });

  /**
   * Navigate to user profile
   */
  goToProfile(): void {
    // TODO: Implement navigation
    console.log('Navigate to profile');
  }

  /**
   * Navigate to settings
   */
  goToSettings(): void {
    // TODO: Implement navigation
    console.log('Navigate to settings');
  }

  /**
   * Sign out the current user
   */
  signOut(): void {
    this.authStore.logout();
  }
}
