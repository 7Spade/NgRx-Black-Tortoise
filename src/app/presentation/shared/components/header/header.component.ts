import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { AuthStore } from '@application/auth/stores/auth.store';
import { WorkspaceSwitcherComponent } from '../switchers/workspace-switcher/workspace-switcher.component';
import { GlobalSearchComponent } from './global-search/global-search.component';
import { NotificationBellComponent } from './notification-bell/notification-bell.component';
import { AccountSwitcherComponent } from '../switchers/account-switcher/account-switcher.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
    MatIconModule,
    WorkspaceSwitcherComponent,
    GlobalSearchComponent,
    NotificationBellComponent,
    AccountSwitcherComponent
  ],
  template: `
    <mat-toolbar class="header">
      <div class="header-content">
        <!-- Left: Logo + Workspace Switcher -->
        <div class="header-left">
          <div class="logo">
            <span class="logo-icon" aria-hidden="true">🔥</span>
            <span class="logo-text">NgRx Black Tortoise</span>
          </div>
          <app-workspace-switcher />
        </div>

        <!-- Center: Global Search -->
        <div class="header-center">
          <app-global-search />
        </div>

        <!-- Right: Notifications + Settings + Account -->
        <div class="header-right">
          <app-notification-bell />
          <button
            mat-icon-button
            class="settings-button"
            aria-label="Settings"
            (click)="goToSettings()"
          >
            <mat-icon>settings</mat-icon>
          </button>
          <app-account-switcher />
        </div>
      </div>
    </mat-toolbar>
  `,
  styles: [`
    .header {
      position: sticky;
      top: 0;
      z-index: 1000;
      background-color: var(--mat-sys-surface);
      color: var(--mat-sys-on-surface);
      box-shadow: var(--mat-sys-level1);
      padding: 0 16px;
    }

    .header-content {
      max-width: 1400px;
      margin: 0 auto;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-shrink: 0;
    }

    .header-center {
      flex: 1;
      display: flex;
      justify-content: center;
      max-width: 600px;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 8px;
      font: var(--mat-sys-title-large);
      cursor: pointer;
    }

    .logo-icon {
      font-size: 28px;
    }

    .settings-button {
      color: var(--mat-sys-on-surface-variant);

      &:hover {
        color: var(--mat-sys-on-surface);
      }
    }

    /* Responsive */
    @media (max-width: 768px) {
      .header-content {
        gap: 12px;
      }

      .logo-text {
        display: none;
      }

      .header-center {
        display: none;
      }
    }

    @media (max-width: 480px) {
      .logo-icon {
        font-size: 24px;
      }

      .header-right {
        gap: 4px;
      }
    }
  `],
})
export class HeaderComponent {
  protected authStore = inject(AuthStore);
  private router = inject(Router);

  /**
   * Navigate to settings page
   */
  goToSettings(): void {
    // TODO: Implement navigation
    console.log('Navigate to settings');
  }
}
