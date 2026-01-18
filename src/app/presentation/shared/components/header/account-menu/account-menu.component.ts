import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { AccountFacade } from '@application/account/facades/account.facade';
import { AccountSwitcherComponent } from '../../switchers/account-switcher/account-switcher.component';

/**
 * Account Menu Component
 *
 * ARCHITECTURAL COMPLIANCE:
 * =========================
 * This component is a PASSIVE RENDERER following strict DDD layer separation:
 * - Injects ONLY AccountFacade (single point of entry)
 * - Binds template to facade.userMenuViewModel() signal
 * - Event handlers delegate to facade methods
 * - ZERO business logic in component
 * - ZERO direct store access (AuthStore, AccountStore)
 *
 * Displays user account menu with:
 * - User avatar and display name
 * - Account switcher integration
 * - Profile and settings links
 * - Sign out functionality
 * - ARIA labels for accessibility
 *
 * DEPENDENCY FLOW:
 * ================
 * AccountMenu Component (THIS) → AccountFacade → AuthStore + AccountStore
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
  /**
   * ONLY facade injection allowed
   * 
   * ARCHITECTURAL RULE:
   * ===================
   * This component MUST inject ONLY AccountFacade.
   * Direct store injections (AuthStore, AccountStore) are FORBIDDEN.
   */
  protected facade = inject(AccountFacade);

  /**
   * Navigate to user profile
   */
  goToProfile(): void {
    // TODO: Implement navigation via Router
    console.log('Navigate to profile');
  }

  /**
   * Navigate to settings
   */
  goToSettings(): void {
    // TODO: Implement navigation via Router
    console.log('Navigate to settings');
  }

  /**
   * Sign out the current user
   * 
   * DELEGATION RULE:
   * ================
   * Delegates to AccountFacade.logout() for coordinated logout.
   */
  signOut(): void {
    this.facade.logout();
  }
}
