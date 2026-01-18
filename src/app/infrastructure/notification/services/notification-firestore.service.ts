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
  serverTimestamp,
  Timestamp
} from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

// Domain
import { Notification, NotificationType, NotificationPriority } from '@domain/notification';
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
  getNotificationById(notificationId: string): Observable<Notification | null> {
    const notificationDoc = doc(this.firestore, `notifications/${notificationId}`);
    return docData(notificationDoc, { idField: 'id' }).pipe(
      map(doc => doc ? this.mapToNotification(doc) : null)
    );
  }

  /**
   * Create a new notification
   */
  createNotification(notificationData: Omit<Notification, 'id' | 'createdAt' | 'readAt'>): Observable<Notification> {
    const data = {
      ...notificationData,
      read: false,
      readAt: null,
      createdAt: serverTimestamp()
    };

    return from(addDoc(this.notificationsCollection, data)).pipe(
      map(docRef => ({
        ...notificationData,
        id: docRef.id,
        read: false,
        readAt: null,
        createdAt: new Date()
      }))
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
      map(notifications => {
        const updates = notifications.map(notification => {
          const notificationDoc = doc(this.firestore, `notifications/${notification.id}`);
          return updateDoc(notificationDoc, { 
            read: true,
            readAt: serverTimestamp()
          });
        });
        
        return Promise.all(updates).then(() => undefined);
      }),
      map(() => undefined)
    );
  }

  /**
   * Delete a notification
   */
  deleteNotification(notificationId: string): Observable<void> {
    const notificationDoc = doc(this.firestore, `notifications/${notificationId}`);
    return from(deleteDoc(notificationDoc));
  }

  /**
   * Delete all read notifications for a user
   */
  deleteReadNotifications(userId: string): Observable<void> {
    const q = query(
      this.notificationsCollection,
      where('userId', '==', userId),
      where('read', '==', true)
    );
    
    return from(
      collectionData(q, { idField: 'id' }).pipe(
        map(docs => {
          const deletes = docs.map(doc => {
            const notificationDoc = this.firestore.doc(`notifications/${doc['id']}`);
            return deleteDoc(notificationDoc);
          });
          
          return Promise.all(deletes).then(() => undefined);
        })
      )
    ).pipe(
      map(() => undefined)
    );
  }

  /**
   * Map Firestore document to Notification entity
   */
  private mapToNotification(doc: any): Notification {
    return {
      id: doc.id,
      userId: doc.userId,
      workspaceId: doc.workspaceId ?? null,
      type: doc.type as NotificationType,
      priority: doc.priority as NotificationPriority,
      title: doc.title,
      message: doc.message,
      actionUrl: doc.actionUrl ?? null,
      metadata: doc.metadata ?? {},
      read: doc.read ?? false,
      readAt: doc.readAt instanceof Timestamp 
        ? doc.readAt.toDate() 
        : doc.readAt ? new Date(doc.readAt) : null,
      createdAt: doc.createdAt instanceof Timestamp 
        ? doc.createdAt.toDate() 
        : new Date(doc.createdAt)
    };
  }
}
