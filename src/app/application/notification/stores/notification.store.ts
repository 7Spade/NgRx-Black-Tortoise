/**
 * Notification Store
 * 
 * Manages user notifications using NgRx Signals.
 * Handles notification display, read status, and real-time updates.
 * 
 * Reactive Auto-loading:
 * - Loads notifications when user authenticates
 * - Tracks unread count
 * - Supports filtering by workspace
 */

import { signalStore, withState, withComputed, withMethods, withHooks, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { computed, effect, inject } from '@angular/core';
import { pipe, switchMap, tap, from } from 'rxjs';
import { tapResponse } from '@ngrx/operators';

// Domain
import { Notification, NotificationType } from '@domain/notification';
import { NotificationRepository } from '@domain/repositories/notification.repository.interface';

// Application
import { NOTIFICATION_REPOSITORY } from '@application/tokens';
import { AuthStore } from '@application/auth/stores/auth.store';

/**
 * Notification State Interface
 */
export interface NotificationState {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
}

/**
 * Initial Notification State
 */
const initialState: NotificationState = {
  notifications: [],
  loading: false,
  error: null
};

/**
 * Notification Store
 * 
 * Provides reactive notification management with auto-loading when user authenticates.
 */
export const NotificationStore = signalStore(
  { providedIn: 'root' },
  
  withState(initialState),
  
  withComputed(({ notifications }) => ({
    /**
     * Get unread notifications only
     */
    unreadNotifications: computed(() => 
      notifications().filter(n => !n.read)
    ),
    
    /**
     * Get unread count
     */
    unreadCount: computed(() => 
      notifications().filter(n => !n.read).length
    ),
    
    /**
     * Get notifications filtered by specific type
     */
    notificationsByType: computed(() => {
      const notifs = notifications();
      return (type: NotificationType) => notifs.filter(n => n.type === type);
    }),
    
    /**
     * Get notifications for specific workspace
     */
    notificationsByWorkspace: computed(() => {
      const notifs = notifications();
      return (workspaceId: string) => notifs.filter(n => n.workspaceId === workspaceId);
    })
  })),
  
  withMethods((store, notificationRepository = inject(NOTIFICATION_REPOSITORY)) => ({
    /**
     * Load user notifications
     */
    loadNotifications: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((userId) => notificationRepository.getUserNotifications(userId)),
        tapResponse({
          next: (notifications) => patchState(store, { notifications, loading: false }),
          error: (error: Error) => patchState(store, { 
            error: error.message, 
            loading: false 
          })
        })
      )
    ),
    
    /**
     * Mark notification as read
     */
    markAsRead: rxMethod<string>(
      pipe(
        switchMap((notificationId) => 
          from(notificationRepository.markAsRead(notificationId)).pipe(
            tap(() => {
              // Update local state optimistically
              patchState(store, (state) => ({
                notifications: state.notifications.map(n => 
                  n.id === notificationId ? { ...n, read: true, readAt: new Date() } : n
                )
              }));
            })
          )
        ),
        tapResponse({
          next: () => {},
          error: (error: Error) => patchState(store, { error: error.message })
        })
      )
    ),
    
    /**
     * Mark all as read
     */
    markAllAsRead: rxMethod<string>(
      pipe(
        switchMap((userId) => 
          from(notificationRepository.markAllAsRead(userId)).pipe(
            tap(() => {
              // Update local state
              patchState(store, (state) => ({
                notifications: state.notifications.map(n => ({ 
                  ...n, 
                  read: true, 
                  readAt: new Date() 
                }))
              }));
            })
          )
        ),
        tapResponse({
          next: () => {},
          error: (error: Error) => patchState(store, { error: error.message })
        })
      )
    ),
    
    /**
     * Delete notification
     */
    deleteNotification: rxMethod<string>(
      pipe(
        switchMap((notificationId) => 
          from(notificationRepository.deleteNotification(notificationId)).pipe(
            tap(() => {
              // Remove from local state
              patchState(store, (state) => ({
                notifications: state.notifications.filter(n => n.id !== notificationId)
              }));
            })
          )
        ),
        tapResponse({
          next: () => {},
          error: (error: Error) => patchState(store, { error: error.message })
        })
      )
    )
  })),
  
  withHooks({
    onInit(store, authStore = inject(AuthStore)) {
      // Auto-load notifications when user authenticates
      effect(() => {
        const user = authStore.user();
        
        if (user) {
          store.loadNotifications(user.id);
        } else {
          patchState(store, initialState);
        }
      });
    }
  })
);
