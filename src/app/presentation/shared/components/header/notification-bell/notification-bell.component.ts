import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { NotificationStore } from '@application/notification/stores/notification.store';

/**
 * Notification Bell Component
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
  private notificationStore = inject(NotificationStore);

  // Notification counts
  unreadCount = this.notificationStore.unreadCount;
  hasUnread = computed(() => this.unreadCount() > 0);

  // Recent notifications (max 5 for dropdown)
  recentNotifications = computed(() =>
    this.notificationStore.notifications().slice(0, 5)
  );

  /**
   * Mark notification as read
   */
  markAsRead(notificationId: string): void {
    this.notificationStore.markAsRead(notificationId);
  }

  /**
   * Mark all notifications as read
   */
  markAllAsRead(): void {
    this.notificationStore.markAllAsRead();
  }

  /**
   * Navigate to all notifications view
   */
  viewAllNotifications(): void {
    // TODO: Implement navigation
    console.log('Navigate to all notifications');
  }
}
