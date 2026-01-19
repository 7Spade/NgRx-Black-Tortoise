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
  Timestamp,
  getDocs
} from '@angular/fire/firestore';
import { firstValueFrom } from 'rxjs';

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
 * Promise-based implementation for framework-agnostic domain layer
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
  async getUserNotifications(userId: string): Promise<Notification[]> {
    const q = query(
      this.notificationsCollection,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => this.mapToNotification({ ...doc.data(), id: doc.id }));
  }

  /**
   * Get unread notifications for a user
   */
  async getUnreadNotifications(userId: string): Promise<Notification[]> {
    const q = query(
      this.notificationsCollection,
      where('userId', '==', userId),
      where('read', '==', false),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => this.mapToNotification({ ...doc.data(), id: doc.id }));
  }

  /**
   * Get notifications by type
   */
  async getNotificationsByType(userId: string, type: NotificationType): Promise<Notification[]> {
    const q = query(
      this.notificationsCollection,
      where('userId', '==', userId),
      where('type', '==', type),
      orderBy('createdAt', 'desc'),
      limit(20)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => this.mapToNotification({ ...doc.data(), id: doc.id }));
  }

  /**
   * Get notifications by priority
   */
  async getNotificationsByPriority(userId: string, priority: NotificationPriority): Promise<Notification[]> {
    const q = query(
      this.notificationsCollection,
      where('userId', '==', userId),
      where('priority', '==', priority),
      where('read', '==', false),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => this.mapToNotification({ ...doc.data(), id: doc.id }));
  }

  /**
   * Get a single notification by ID
   */
  async getNotification(notificationId: string): Promise<Notification | null> {
    const notificationDoc = doc(this.firestore, `notifications/${notificationId}`);
    const data = await firstValueFrom(docData(notificationDoc, { idField: 'id' }));
    return data ? this.mapToNotification(data) : null;
  }

  /**
   * Create a new notification
   */
  async createNotification(notificationData: Omit<Notification, 'id'>): Promise<string> {
    const docRef = await addDoc(this.notificationsCollection, notificationData);
    return docRef.id;
  }

  /**
   * Create notifications in bulk
   */
  async createNotifications(notifications: Omit<Notification, 'id'>[]): Promise<string[]> {
    const creates = notifications.map(notification => 
      addDoc(this.notificationsCollection, notification)
    );
    
    const refs = await Promise.all(creates);
    return refs.map(ref => ref.id);
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<void> {
    const notificationDoc = doc(this.firestore, `notifications/${notificationId}`);
    await updateDoc(notificationDoc, { 
      read: true,
      readAt: serverTimestamp()
    });
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string): Promise<void> {
    const notifications = await this.getUnreadNotifications(userId);
    const updates = notifications.map(notification => {
      const notificationDoc = doc(this.firestore, `notifications/${notification.id}`);
      return updateDoc(notificationDoc, { 
        read: true,
        readAt: serverTimestamp()
      });
    });
    
    await Promise.all(updates);
  }

  /**
   * Mark notification as archived
   */
  async markAsArchived(notificationId: string): Promise<void> {
    const notificationDoc = doc(this.firestore, `notifications/${notificationId}`);
    await updateDoc(notificationDoc, { 
      archived: true,
      archivedAt: serverTimestamp()
    });
  }

  /**
   * Delete a notification
   */
  async deleteNotification(notificationId: string): Promise<void> {
    const notificationDoc = doc(this.firestore, `notifications/${notificationId}`);
    await deleteDoc(notificationDoc);
  }

  /**
   * Delete multiple notifications
   */
  async deleteNotifications(ids: string[]): Promise<void> {
    const deletes = ids.map(id => {
      const notificationDoc = doc(this.firestore, `notifications/${id}`);
      return deleteDoc(notificationDoc);
    });
    
    await Promise.all(deletes);
  }

  /**
   * Clean up expired notifications
   */
  async cleanupExpiredNotifications(): Promise<void> {
    const now = new Date();
    const q = query(
      this.notificationsCollection,
      where('expiresAt', '<=', now)
    );
    
    const snapshot = await getDocs(q);
    const deletes = snapshot.docs.map(notificationDoc => {
      return deleteDoc(notificationDoc.ref);
    });
    await Promise.all(deletes);
  }

  /**
   * Get notification statistics
   */
  async getNotificationStats(userId: string): Promise<NotificationStats> {
    const notifications = await this.getUserNotifications(userId);
    return {
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
    };
  }

  /**
   * Get notification settings for a user
   */
  async getNotificationSettings(userId: string): Promise<NotificationSettings | null> {
    const settingsDoc = doc(this.firestore, `notification-settings/${userId}`);
    const data = await firstValueFrom(docData(settingsDoc, { idField: 'id' }));
    return data ? data as NotificationSettings : null;
  }

  /**
   * Update notification settings
   */
  async updateNotificationSettings(userId: string, settings: Partial<NotificationSettings>): Promise<void> {
    const settingsDoc = doc(this.firestore, `notification-settings/${userId}`);
    await updateDoc(settingsDoc, settings);
  }

  /**
   * Create default notification settings
   */
  async createDefaultNotificationSettings(userId: string): Promise<NotificationSettings> {
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
    await setDoc(settingsDoc, defaultSettings);
    return defaultSettings;
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
