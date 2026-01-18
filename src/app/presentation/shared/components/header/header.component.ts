import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { AuthStore } from '@application/auth/stores/auth.store';
import { ContextStore } from '@application/context/stores/context.store';
import { MenuService } from '@application/services/menu.service';
import { AvatarService } from '@shared/services/avatar.service';
import { MenuItem } from '@shared/models/menu.model';
import { AccountSwitcherComponent } from '../switchers/account-switcher/account-switcher.component';
import { WorkspaceSwitcherComponent } from '../switchers/workspace-switcher/workspace-switcher.component';

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
    AccountSwitcherComponent,
    WorkspaceSwitcherComponent
  ],
  template: `
    <mat-toolbar class="header">
      <div class="header-content">
        <div class="logo">
          <span class="logo-icon" aria-hidden="true">🔥</span>
          <span class="logo-text">NgRx Black Tortoise</span>
        </div>

        <div class="switchers">
          <app-workspace-switcher />
          <app-account-switcher />
        </div>

        <span class="spacer"></span>

        <button
          mat-button
          class="user-button"
          [matMenuTriggerFor]="userMenu"
          aria-label="Open user menu"
        >
          <img
            [src]="getAvatarUrl()"
            [alt]="authStore.user()?.email || 'User avatar'"
            class="avatar-img"
          />
          <span class="user-email-short">{{ getShortEmail() }}</span>
          <span class="dropdown-icon" aria-hidden="true">▼</span>
        </button>
      </div>
    </mat-toolbar>

    <mat-menu #userMenu="matMenu" class="dropdown-menu">
      <div class="menu-header">
        <img
          [src]="getAvatarUrl()"
          [alt]="authStore.user()?.email || 'User avatar'"
          class="menu-avatar-img"
        />
        <div class="menu-user-info">
          <div class="menu-email">{{ authStore.user()?.email }}</div>
          <div class="menu-status">{{ contextStore.currentContextName() || 'Authenticated' }}</div>
        </div>
      </div>

      @for (section of dynamicMenu().sections; track section.id) {
        @if (section.visible !== false) {
          <div class="menu-section">
            @if (section.title) {
              <div class="menu-section-title" aria-hidden="true">{{ section.title }}</div>
            }
            @for (item of section.items; track item.id) {
              @if (item.visible !== false) {
                @if (item.type === 'divider') {
                  <mat-divider class="menu-divider"></mat-divider>
                } @else if (item.type === 'header') {
                  <div class="menu-header-item" aria-hidden="true">{{ item.label }}</div>
                } @else {
                  <button
                    mat-menu-item
                    class="menu-item"
                    [class.disabled]="item.disabled"
                    [disabled]="item.disabled"
                    (click)="handleMenuItem(item)"
                  >
                    @if (item.icon) {
                      <span class="menu-icon" aria-hidden="true">{{ item.icon }}</span>
                    }
                    <span class="menu-label">{{ item.label }}</span>
                    @if (item.badge) {
                      <span class="menu-badge">{{ item.badge }}</span>
                    }
                  </button>
                }
              }
            }
          </div>
        }
      }
    </mat-menu>
  `,
  styles: [`
    .header {
      position: sticky;
      top: 0;
      z-index: 1000;
      background-color: var(--mat-sys-surface);
      color: var(--mat-sys-on-surface);
      box-shadow: var(--mat-sys-level1);
    }

    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .switchers {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-left: 16px;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 8px;
      font: var(--mat-sys-title-large);
    }

    .logo-icon {
      font-size: 24px;
    }

    .avatar-img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
      background: #f5f5f5;
    }

    .user-button {
      display: flex;
      align-items: center;
      gap: 8px;
      text-transform: none;
    }

    .user-email-short {
      font-size: 14px;
      color: inherit;
      max-width: 150px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .dropdown-icon {
      font-size: 10px;
      color: var(--mat-sys-on-surface-variant);
    }

    .dropdown-menu {
      min-width: 280px;
    }

    .menu-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .menu-avatar-img {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      object-fit: cover;
      background: rgba(255, 255, 255, 0.3);
      flex-shrink: 0;
    }

    .menu-user-info {
      flex: 1;
    }

    .menu-email {
      font-weight: 600;
      margin-bottom: 4px;
      word-break: break-word;
    }

    .menu-status {
      font-size: 12px;
      opacity: 0.9;
    }

    .menu-divider {
      margin: 8px 0;
    }

    .menu-icon {
      font-size: 18px;
      flex-shrink: 0;
    }

    .menu-label {
      flex: 1;
    }

    .menu-badge {
      background: var(--mat-sys-primary);
      color: var(--mat-sys-on-primary);
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }

    .menu-section {
      padding: 4px 0;
    }

    .menu-section-title {
      padding: 8px 16px 4px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      color: var(--mat-sys-on-surface-variant);
      letter-spacing: 0.5px;
    }

    .menu-header-item {
      padding: 8px 16px;
      font-size: 13px;
      font-weight: 600;
      color: var(--mat-sys-on-surface-variant);
    }

    .menu-item.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .menu-item.disabled:hover {
      background-color: transparent;
    }

    .context-badge {
      font-size: 11px;
      padding: 2px 8px;
      border-radius: 12px;
      background: #667eea;
      color: white;
      font-weight: 600;
      text-transform: uppercase;
    }

    @media (max-width: 768px) {
      .user-email-short {
        display: none;
      }
      
      .switchers {
        display: none;
      }
    }
  `],
})
export class HeaderComponent {
  protected authStore = inject(AuthStore);
  protected contextStore = inject(ContextStore);
  private router = inject(Router);
  private avatarService = inject(AvatarService);
  private menuService = inject(MenuService);
  protected dynamicMenu = this.menuService.menu;

  getAvatarUrl(): string {
    const email = this.authStore.user()?.email || '';
    return this.avatarService.getAvatarUrl(email, 80);
  }

  getShortEmail(): string {
    const email = this.authStore.user()?.email || '';
    const maxLength = 20;
    return email.length > maxLength ? email.substring(0, maxLength) + '...' : email;
  }

  handleMenuItem(item: MenuItem): void {
    if (item.disabled) return;

    if (item.route) {
      this.router.navigate([item.route]);
    } else if (item.action) {
      const result = item.action();
      if (item.id === 'logout') {
        Promise.resolve(result).finally(() => this.router.navigate(['/login']));
      }
    }
  }
}
