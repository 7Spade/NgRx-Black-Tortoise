import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { NotificationFacade } from '@application/notification/facades/notification.facade';

/**
 * Notification Bell Component
 * 
 * ╔═══════════════════════════════════════════════════════════════════╗
 * ║  PRESENTATION LAYER: Notification Bell UI (PASSIVE RENDERER)     ║
 * ╚═══════════════════════════════════════════════════════════════════╝
 * 
 * ARCHITECTURAL COMPLIANCE:
 * =========================
 * ✅ Uses NotificationFacade for ALL operations (no direct store access)
 * ✅ Binds to single facade.viewModel() signal
 * ✅ Delegates orchestration to Application layer
 * ✅ Zero business logic - pure passive renderer + event emitter
 * 
 * Displays notification icon with:
 * - Badge showing unread count
 * - Dropdown menu with recent notifications
 * - Mark as read functionality
 * - View all notifications link
 * - ARIA labels for accessibility
 *
 * @example
 * <app-notification-bell />
 */
@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatMenuModule,
    MatListModule,
    MatDividerModule
  ],
  templateUrl: './notification-bell.component.html',
  styleUrl: './notification-bell.component.scss'
})
export class NotificationBellComponent {
  // FACADE INJECTION (ONLY)
  protected facade = inject(NotificationFacade);

  /**
   * Mark notification as read
   * 
   * DELEGATION:
   * ===========
   * Delegates to NotificationFacade.markAsRead()
   * No validation or orchestration in UI
   */
  markAsRead(notificationId: string): void {
    this.facade.markAsRead(notificationId);
  }

  /**
   * Mark all notifications as read
   * 
   * DELEGATION:
   * ===========
   * Delegates to NotificationFacade.markAllAsRead()
   * Facade handles auth validation + userId extraction
   */
  markAllAsRead(): void {
    this.facade.markAllAsRead();
  }

  /**
   * Navigate to all notifications view
   */
  viewAllNotifications(): void {
    // TODO: Implement navigation
    console.log('Navigate to all notifications');
  }
}
