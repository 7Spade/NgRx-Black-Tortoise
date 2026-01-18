import { inject, Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  docData,
  collectionData,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  serverTimestamp,
  Timestamp
} from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

// Domain
import { 
  Notification, 
  NotificationType, 
  NotificationPriority,
  NotificationStats,
  NotificationSettings 
} from '@domain/notification';
import { NotificationRepository } from '@domain/repositories/notification.repository.interface';

/**
 * Firestore implementation of NotificationRepository
 * Manages user notifications persistence
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationFirestoreService implements NotificationRepository {
  private firestore = inject(Firestore);
  private notificationsCollection = collection(this.firestore, 'notifications');

  /**
   * Get all notifications for a user
   */
  getUserNotifications(userId: string): Observable<Notification[]> {
    const q = query(
      this.notificationsCollection,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    
    return collectionData(q, { idField: 'id' }).pipe(
      map(docs => docs.map(doc => this.mapToNotification(doc)))
    );
  }

  /**
   * Get unread notifications for a user
   */
  getUnreadNotifications(userId: string): Observable<Notification[]> {
    const q = query(
      this.notificationsCollection,
      where('userId', '==', userId),
      where('read', '==', false),
      orderBy('createdAt', 'desc')
    );
    
    return collectionData(q, { idField: 'id' }).pipe(
      map(docs => docs.map(doc => this.mapToNotification(doc)))
    );
  }

  /**
   * Get notifications by type
   */
  getNotificationsByType(userId: string, type: NotificationType): Observable<Notification[]> {
    const q = query(
      this.notificationsCollection,
      where('userId', '==', userId),
      where('type', '==', type),
      orderBy('createdAt', 'desc'),
      limit(20)
    );
    
    return collectionData(q, { idField: 'id' }).pipe(
      map(docs => docs.map(doc => this.mapToNotification(doc)))
    );
  }

  /**
   * Get notifications by priority
   */
  getNotificationsByPriority(userId: string, priority: NotificationPriority): Observable<Notification[]> {
    const q = query(
      this.notificationsCollection,
      where('userId', '==', userId),
      where('priority', '==', priority),
      where('read', '==', false),
      orderBy('createdAt', 'desc')
    );
    
    return collectionData(q, { idField: 'id' }).pipe(
      map(docs => docs.map(doc => this.mapToNotification(doc)))
    );
  }

  /**
   * Get a single notification by ID
   */
  getNotification(notificationId: string): Observable<Notification | null> {
    const notificationDoc = doc(this.firestore, `notifications/${notificationId}`);
    return docData(notificationDoc, { idField: 'id' }).pipe(
      map(doc => doc ? this.mapToNotification(doc) : null)
    );
  }

  /**
   * Create a new notification
   */
  createNotification(notificationData: Omit<Notification, 'id'>): Observable<string> {
    return from(addDoc(this.notificationsCollection, notificationData)).pipe(
      map(docRef => docRef.id)
    );
  }

  /**
   * Create notifications in bulk
   */
  createNotifications(notifications: Omit<Notification, 'id'>[]): Observable<string[]> {
    const creates = notifications.map(notification => 
      addDoc(this.notificationsCollection, notification)
    );
    
    return from(Promise.all(creates)).pipe(
      map(refs => refs.map(ref => ref.id))
    );
  }

  /**
   * Mark notification as read
   */
  markAsRead(notificationId: string): Observable<void> {
    const notificationDoc = doc(this.firestore, `notifications/${notificationId}`);
    return from(updateDoc(notificationDoc, { 
      read: true,
      readAt: serverTimestamp()
    }));
  }

  /**
   * Mark all notifications as read for a user
   */
  markAllAsRead(userId: string): Observable<void> {
    return this.getUnreadNotifications(userId).pipe(
      switchMap(notifications => {
        const updates = notifications.map(notification => {
          const notificationDoc = doc(this.firestore, `notifications/${notification.id}`);
          return updateDoc(notificationDoc, { 
            read: true,
            readAt: serverTimestamp()
          });
        });
        
        return from(Promise.all(updates));
      }),
      map(() => undefined)
    );
  }

  /**
   * Mark notification as archived
   */
  markAsArchived(notificationId: string): Observable<void> {
    const notificationDoc = doc(this.firestore, `notifications/${notificationId}`);
    return from(updateDoc(notificationDoc, { 
      archived: true,
      archivedAt: serverTimestamp()
    }));
  }

  /**
   * Delete a notification
   */
  deleteNotification(notificationId: string): Observable<void> {
    const notificationDoc = doc(this.firestore, `notifications/${notificationId}`);
    return from(deleteDoc(notificationDoc));
  }

  /**
   * Delete multiple notifications
   */
  deleteNotifications(ids: string[]): Observable<void> {
    const deletes = ids.map(id => {
      const notificationDoc = doc(this.firestore, `notifications/${id}`);
      return deleteDoc(notificationDoc);
    });
    
    return from(Promise.all(deletes)).pipe(
      map(() => undefined)
    );
  }

  /**
   * Clean up expired notifications
   */
  cleanupExpiredNotifications(): Observable<void> {
    const now = new Date();
    const q = query(
      this.notificationsCollection,
      where('expiresAt', '<=', now)
    );
    
    return from(
      collectionData(q, { idField: 'id' })
    ).pipe(
      switchMap(docs => {
        const deletes = docs.map(notification => {
          const notificationDocRef = doc(this.firestore, `notifications/${notification['id']}`);
          return deleteDoc(notificationDocRef);
        });
        return Promise.all(deletes);
      }),
      map(() => undefined)
    );
  }

  /**
   * Get notification statistics
   */
  getNotificationStats(userId: string): Observable<NotificationStats> {
    return this.getUserNotifications(userId).pipe(
      map(notifications => ({
        total: notifications.length,
        unread: notifications.filter(n => !n.read).length,
        byType: notifications.reduce((acc, n) => {
          acc[n.type] = (acc[n.type] || 0) + 1;
          return acc;
        }, {} as Record<NotificationType, number>),
        byPriority: notifications.reduce((acc, n) => {
          acc[n.priority] = (acc[n.priority] || 0) + 1;
          return acc;
        }, {} as Record<NotificationPriority, number>)
      }))
    );
  }

  /**
   * Get notification settings for a user
   */
  getNotificationSettings(userId: string): Observable<NotificationSettings | null> {
    const settingsDoc = doc(this.firestore, `notification-settings/${userId}`);
    return docData(settingsDoc, { idField: 'id' }).pipe(
      map(doc => doc ? doc as NotificationSettings : null)
    );
  }

  /**
   * Update notification settings
   */
  updateNotificationSettings(userId: string, settings: Partial<NotificationSettings>): Observable<void> {
    const settingsDoc = doc(this.firestore, `notification-settings/${userId}`);
    return from(updateDoc(settingsDoc, settings));
  }

  /**
   * Create default notification settings
   */
  createDefaultNotificationSettings(userId: string): Observable<NotificationSettings> {
    const defaultSettings: NotificationSettings = {
      accountId: userId,
      emailNotifications: true,
      pushNotifications: true,
      inAppNotifications: true,
      preferences: Object.values(NotificationType).reduce((acc, type) => {
        acc[type] = {
          enabled: true,
          email: true,
          push: true,
          inApp: true
        };
        return acc;
      }, {} as NotificationSettings['preferences']),
      doNotDisturb: false,
      doNotDisturbStart: '22:00',
      doNotDisturbEnd: '08:00',
      dailyDigest: false,
      weeklyDigest: false
    };

    const settingsDoc = doc(this.firestore, `notification-settings/${userId}`);
    return from(setDoc(settingsDoc, defaultSettings)).pipe(
      map(() => defaultSettings)
    );
  }

  /**
   * Map Firestore document to Notification entity
   */
  private mapToNotification(doc: any): Notification {
    return {
      id: doc.id,
      recipientId: doc.recipientId,
      workspaceId: doc.workspaceId,
      resourceType: doc.resourceType,
      resourceId: doc.resourceId,
      type: doc.type as NotificationType,
      priority: doc.priority as NotificationPriority,
      title: doc.title,
      message: doc.message,
      icon: doc.icon,
      avatarUrl: doc.avatarUrl,
      actionLabel: doc.actionLabel,
      actionUrl: doc.actionUrl,
      read: doc.read ?? false,
      readAt: doc.readAt instanceof Timestamp 
        ? doc.readAt.toDate() 
        : doc.readAt ? new Date(doc.readAt) : undefined,
      archived: doc.archived ?? false,
      archivedAt: doc.archivedAt instanceof Timestamp 
        ? doc.archivedAt.toDate() 
        : doc.archivedAt ? new Date(doc.archivedAt) : undefined,
      createdAt: doc.createdAt instanceof Timestamp 
        ? doc.createdAt.toDate() 
        : new Date(doc.createdAt),
      expiresAt: doc.expiresAt instanceof Timestamp 
        ? doc.expiresAt.toDate() 
        : doc.expiresAt ? new Date(doc.expiresAt) : undefined,
      senderId: doc.senderId,
      senderName: doc.senderName,
      metadata: doc.metadata
    };
  }
}
