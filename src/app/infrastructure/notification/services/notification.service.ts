import { Injectable, inject } from '@angular/core';
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
  QueryConstraint,
  serverTimestamp,
  setDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
  writeBatch,
} from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { NotificationRepository } from '@domain/repositories/notification.repository.interface';
import { Notification, NotificationType, NotificationPriority } from '@domain/notification';

interface NotificationFirestoreData {
  id: string;
  userId: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
  createdAt: Timestamp | Date;
  readAt?: Timestamp | Date;
}

@Injectable({ providedIn: 'root' })
export class NotificationFirestoreService implements NotificationRepository {
  private firestore = inject(Firestore);
  private notificationsCollection = collection(this.firestore, 'notifications');

  getNotificationById(id: string): Observable<Notification | null> {
    const notificationDoc = doc(this.notificationsCollection, id);
    return docData(notificationDoc, { idField: 'id' }).pipe(
      map((data) => (data ? this.convertFirestoreDoc(data as NotificationFirestoreData) : null))
    );
  }

  getNotificationsByUser(userId: string, limitCount?: number): Observable<Notification[]> {
    const constraints: QueryConstraint[] = [
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
    ];

    if (limitCount) {
      constraints.push(limit(limitCount));
    }

    const q = query(this.notificationsCollection, ...constraints);

    return collectionData(q, { idField: 'id' }).pipe(
      map((docs) => docs.map((doc) => this.convertFirestoreDoc(doc as NotificationFirestoreData)))
    );
  }

  getUnreadNotifications(userId: string): Observable<Notification[]> {
    const constraints: QueryConstraint[] = [
      where('userId', '==', userId),
      where('read', '==', false),
      orderBy('createdAt', 'desc'),
    ];

    const q = query(this.notificationsCollection, ...constraints);

    return collectionData(q, { idField: 'id' }).pipe(
      map((docs) => docs.map((doc) => this.convertFirestoreDoc(doc as NotificationFirestoreData)))
    );
  }

  getNotificationsByType(userId: string, type: NotificationType): Observable<Notification[]> {
    const constraints: QueryConstraint[] = [
      where('userId', '==', userId),
      where('type', '==', type),
      orderBy('createdAt', 'desc'),
    ];

    const q = query(this.notificationsCollection, ...constraints);

    return collectionData(q, { idField: 'id' }).pipe(
      map((docs) => docs.map((doc) => this.convertFirestoreDoc(doc as NotificationFirestoreData)))
    );
  }

  createNotification(
    notification: Omit<Notification, 'id' | 'createdAt' | 'read' | 'readAt'>
  ): Observable<Notification> {
    const newDocRef = doc(this.notificationsCollection);
    const notificationData: Partial<NotificationFirestoreData> = {
      id: newDocRef.id,
      userId: notification.userId,
      type: notification.type,
      priority: notification.priority,
      title: notification.title,
      message: notification.message,
      read: false,
      createdAt: serverTimestamp(),
    };

    if (notification.actionUrl) notificationData.actionUrl = notification.actionUrl;
    if (notification.metadata) notificationData.metadata = notification.metadata;

    return from(setDoc(newDocRef, notificationData)).pipe(
      map(() => ({
        ...notification,
        id: newDocRef.id,
        read: false,
        createdAt: new Date(),
      }))
    );
  }

  markAsRead(id: string): Observable<void> {
    const notificationDoc = doc(this.notificationsCollection, id);
    const updateData: Partial<NotificationFirestoreData> = {
      read: true,
      readAt: serverTimestamp(),
    };

    return from(updateDoc(notificationDoc, updateData));
  }

  markAllAsRead(userId: string): Observable<void> {
    // Get all unread notifications
    const constraints: QueryConstraint[] = [
      where('userId', '==', userId),
      where('read', '==', false),
    ];
    const q = query(this.notificationsCollection, ...constraints);

    return from(
      collectionData(q, { idField: 'id' }).pipe(
        map(async (docs) => {
          const batch = writeBatch(this.firestore);
          const updateData: Partial<NotificationFirestoreData> = {
            read: true,
            readAt: serverTimestamp(),
          };

          docs.forEach((docData) => {
            const notificationDoc = doc(this.notificationsCollection, docData['id'] as string);
            batch.update(notificationDoc, updateData);
          });

          await batch.commit();
        })
      )
    ).pipe(map(() => undefined));
  }

  deleteNotification(id: string): Observable<void> {
    const notificationDoc = doc(this.notificationsCollection, id);
    return from(deleteDoc(notificationDoc));
  }

  deleteAllRead(userId: string): Observable<void> {
    // Get all read notifications
    const constraints: QueryConstraint[] = [
      where('userId', '==', userId),
      where('read', '==', true),
    ];
    const q = query(this.notificationsCollection, ...constraints);

    return from(
      collectionData(q, { idField: 'id' }).pipe(
        map(async (docs) => {
          const batch = writeBatch(this.firestore);

          docs.forEach((docData) => {
            const notificationDoc = doc(this.notificationsCollection, docData['id'] as string);
            batch.delete(notificationDoc);
          });

          await batch.commit();
        })
      )
    ).pipe(map(() => undefined));
  }

  private convertFirestoreDoc(data: NotificationFirestoreData): Notification {
    const notification: Notification = {
      id: data.id,
      userId: data.userId,
      type: data.type,
      priority: data.priority,
      title: data.title,
      message: data.message,
      read: data.read,
      createdAt:
        data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
    };

    if (data.actionUrl) notification.actionUrl = data.actionUrl;
    if (data.metadata) notification.metadata = data.metadata;
    if (data.readAt) {
      notification.readAt =
        data.readAt instanceof Timestamp ? data.readAt.toDate() : new Date(data.readAt);
    }

    return notification;
  }
}
