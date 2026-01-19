import { Component, inject, signal, DestroyRef, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BreakpointObserver } from '@angular/cdk/layout';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AccountFacade } from '@application/account/facades/account.facade';
import { BREAKPOINTS } from '@shared/constants/breakpoints.constant';
import { Account, IdentityType, MembershipType } from '@domain/account';

/**
 * Account Switcher Component
 * 
 * ARCHITECTURAL ROLE: PASSIVE RENDERER + EVENT EMITTER ONLY
 * ===========================================================
 * 
 * This component is a pure presentation layer component with ZERO business logic.
 * 
 * RESPONSIBILITIES:
 * =================
 * 1. Bind to AccountFacade.viewModel() signal
 * 2. Render account switcher UI
 * 3. Emit user events (clicks) to AccountFacade
 * 4. Manage local UI state (menu open/close, responsive breakpoints)
 * 
 * FORBIDDEN PATTERNS:
 * ===================
 * ❌ Direct AccountStore / ContextStore / AuthStore imports
 * ❌ Business logic (validation, orchestration, UX feedback)
 * ❌ Cross-store coordination
 * ❌ Multiple signal reads in template
 * 
 * ALLOWED PATTERNS:
 * =================
 * ✅ Inject ONLY AccountFacade
 * ✅ Bind to facade.viewModel() in template
 * ✅ Call facade.switchAccount(account) on user click
 * ✅ Manage local UI state (breakpoints, menu state)
 * 
 * Features:
 * - Responsive design (desktop/tablet/mobile)
 * - Accessibility (ARIA attributes, keyboard navigation)
 * - Material Design 3 styling
 * - Zone-less reactive state management
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
  // SINGLE FACADE INJECTION (Application Layer)
  protected facade = inject(AccountFacade);
  
  // Local UI services (NOT stores)
  private breakpointObserver = inject(BreakpointObserver);
  private destroyRef = inject(DestroyRef);
  
  // Local UI state ONLY (not business state)
  protected isMobile = signal(false);
  protected isTablet = signal(false);
  protected isMenuOpen = signal(false);
  protected announceMessage = signal('');
  
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
  getAccountTypeIcon(type: IdentityType | MembershipType): string {
    switch (type) {
      case 'user':
        return 'person';
      case 'organization':
        return 'business';
      case 'bot':
        return 'smart_toy';
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
  getBadgeColor(type: IdentityType | MembershipType): string {
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
   * 
   * DELEGATION RULE:
   * ================
   * This method contains ZERO business logic.
   * All validation, orchestration, and UX feedback delegated to AccountFacade → AccountSwitchUseCase.
   * 
   * UI RESPONSIBILITY:
   * ==================
   * 1. Call facade.switchAccount(account)
   * 2. Read result for screen reader announcement
   */
  switchAccount(account: Account): void {
    const result = this.facade.switchAccount(account);
    
    // Screen reader announcement (local UI concern)
    if (result.announcement) {
      this.announceMessage.set(result.announcement);
      setTimeout(() => this.announceMessage.set(''), 1000);
    }
  }
  
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
