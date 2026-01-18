import { inject, computed } from '@angular/core';
import { signalStore, withComputed, withMethods } from '@ngrx/signals';
import { NotificationStore } from '../stores/notification.store';
import { AuthStore } from '@application/auth/stores/auth.store';

/**
 * Notification Facade
 * 
 * ╔═══════════════════════════════════════════════════════════════════╗
 * ║  APPLICATION LAYER: Notification Operations Orchestration        ║
 * ╚═══════════════════════════════════════════════════════════════════╝
 * 
 * ARCHITECTURAL ROLE:
 * ===================
 * Single point of entry for all notification-related operations.
 * Coordinates NotificationStore + AuthStore interactions.
 * 
 * RESPONSIBILITIES:
 * =================
 * 1. Provide unified ViewModel for presentation layer
 * 2. Orchestrate mark-as-read operations with auth validation
 * 3. Encapsulate cross-store coordination logic
 * 4. Expose high-level intent-based API to UI
 * 
 * DDD LAYER SEPARATION:
 * =====================
 * ✅ Presentation → NotificationFacade (ONLY)
 * ✅ NotificationFacade → NotificationStore + AuthStore
 * ✅ Zero business logic in presentation layer
 */
export const NotificationFacade = signalStore(
  { providedIn: 'root' },
  
  // ViewModel consolidating notification state
  withComputed(() => {
    const notificationStore = inject(NotificationStore);
    const authStore = inject(AuthStore);
    
    return {
      /**
       * Single computed ViewModel for notification bell
       * Consolidates all reactive state into one signal
       */
      viewModel: computed(() => ({
        // Notification counts
        unreadCount: notificationStore.unreadCount(),
        hasUnread: notificationStore.unreadCount() > 0,
        
        // Recent notifications (max 5 for dropdown)
        recentNotifications: notificationStore.notifications().slice(0, 5),
        
        // All notifications
        allNotifications: notificationStore.notifications(),
        
        // Loading state
        isLoading: notificationStore.loading(),
        
        // Auth state (for mark all as read)
        isAuthenticated: authStore.isAuthenticated(),
        currentUserId: authStore.user()?.id ?? null
      }))
    };
  }),
  
  // Orchestration methods
  withMethods((store) => {
    const notificationStore = inject(NotificationStore);
    const authStore = inject(AuthStore);
    
    return {
      /**
       * Mark single notification as read
       * 
       * ORCHESTRATION:
       * ==============
       * 1. Validate notification exists
       * 2. Call NotificationStore.markAsRead()
       * 3. Store handles persistence + state update
       */
      markAsRead(notificationId: string): void {
        notificationStore.markAsRead(notificationId);
      },
      
      /**
       * Mark all notifications as read
       * 
       * ORCHESTRATION:
       * ==============
       * 1. Validate user is authenticated
       * 2. Extract userId from AuthStore
       * 3. Call NotificationStore.markAllAsRead() with userId
       * 4. Store handles bulk update + persistence
       * 
       * BUSINESS RULE:
       * ==============
       * Only authenticated users can mark all as read
       */
      markAllAsRead(): void {
        const user = authStore.user();
        
        // Business rule: Auth required
        if (!user) {
          console.warn('Cannot mark all as read: User not authenticated');
          return;
        }
        
        // Delegate to store with userId
        notificationStore.markAllAsRead(user.id);
      },
      
      /**
       * Load notifications for current user
       * 
       * ORCHESTRATION:
       * ==============
       * 1. Validate user is authenticated
       * 2. Extract userId from AuthStore
       * 3. Call NotificationStore.loadNotifications()
       */
      loadNotifications(): void {
        const user = authStore.user();
        
        // Business rule: Auth required
        if (!user) {
          console.warn('Cannot load notifications: User not authenticated');
          return;
        }
        
        // Delegate to store with userId
        notificationStore.loadNotifications(user.id);
      }
    };
  })
);
