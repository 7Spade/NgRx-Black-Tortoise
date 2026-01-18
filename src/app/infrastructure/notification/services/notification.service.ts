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
  recipientId: string;
  workspaceId?: string;
  resourceType?: string;
  resourceId?: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  icon?: string;
  avatarUrl?: string;
  actionLabel?: string;
  actionUrl?: string;
  read: boolean;
  readAt?: Timestamp | Date | null;
  archived: boolean;
  archivedAt?: Timestamp | Date | null;
  createdAt: Timestamp | Date | null;
  expiresAt?: Timestamp | Date | null;
  senderId?: string;
  senderName?: string;
  metadata?: Record<string, unknown>;
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
      where('recipientId', '==', userId),
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
      where('recipientId', '==', userId),
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
      where('recipientId', '==', userId),
      where('type', '==', type),
      orderBy('createdAt', 'desc'),
    ];

    const q = query(this.notificationsCollection, ...constraints);

    return collectionData(q, { idField: 'id' }).pipe(
      map((docs) => docs.map((doc) => this.convertFirestoreDoc(doc as NotificationFirestoreData)))
    );
  }

  createNotification(
    notification: Omit<Notification, 'id' | 'createdAt' | 'read' | 'readAt' | 'archived' | 'archivedAt'>
  ): Observable<Notification> {
    const newDocRef = doc(this.notificationsCollection);
    const notificationData: any = {
      id: newDocRef.id,
      recipientId: notification.recipientId,
      type: notification.type,
      priority: notification.priority,
      title: notification.title,
      message: notification.message,
      read: false,
      archived: false,
      createdAt: serverTimestamp() as any,
    };

    // Optional fields
    if (notification.workspaceId) notificationData.workspaceId = notification.workspaceId;
    if (notification.resourceType) notificationData.resourceType = notification.resourceType;
    if (notification.resourceId) notificationData.resourceId = notification.resourceId;
    if (notification.icon) notificationData.icon = notification.icon;
    if (notification.avatarUrl) notificationData.avatarUrl = notification.avatarUrl;
    if (notification.actionLabel) notificationData.actionLabel = notification.actionLabel;
    if (notification.actionUrl) notificationData.actionUrl = notification.actionUrl;
    if (notification.expiresAt) notificationData.expiresAt = notification.expiresAt;
    if (notification.senderId) notificationData.senderId = notification.senderId;
    if (notification.senderName) notificationData.senderName = notification.senderName;
    if (notification.metadata) notificationData.metadata = notification.metadata;

    return from(setDoc(newDocRef, notificationData)).pipe(
      map(() => ({
        ...notification,
        id: newDocRef.id,
        read: false,
        archived: false,
        createdAt: new Date(),
      }))
    );
  }

  markAsRead(id: string): Observable<void> {
    const notificationDoc = doc(this.notificationsCollection, id);
    const updateData: any = {
      read: true,
      readAt: serverTimestamp() as any,
    };

    return from(updateDoc(notificationDoc, updateData));
  }

  markAllAsRead(userId: string): Observable<void> {
    // Get all unread notifications
    const constraints: QueryConstraint[] = [
      where('recipientId', '==', userId),
      where('read', '==', false),
    ];
    const q = query(this.notificationsCollection, ...constraints);

    return from(
      collectionData(q, { idField: 'id' }).pipe(
        map(async (docs) => {
          const batch = writeBatch(this.firestore);
          const updateData: any = {
            read: true,
            readAt: serverTimestamp() as any,
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
      recipientId: data.recipientId,
      type: data.type,
      priority: data.priority,
      title: data.title,
      message: data.message,
      read: data.read,
      archived: data.archived,
      createdAt:
        data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt!),
    };

    // Optional fields
    if (data.workspaceId) notification.workspaceId = data.workspaceId;
    if (data.resourceType) notification.resourceType = data.resourceType;
    if (data.resourceId) notification.resourceId = data.resourceId;
    if (data.icon) notification.icon = data.icon;
    if (data.avatarUrl) notification.avatarUrl = data.avatarUrl;
    if (data.actionLabel) notification.actionLabel = data.actionLabel;
    if (data.actionUrl) notification.actionUrl = data.actionUrl;
    if (data.senderId) notification.senderId = data.senderId;
    if (data.senderName) notification.senderName = data.senderName;
    if (data.metadata) notification.metadata = data.metadata;
    
    if (data.readAt) {
      notification.readAt =
        data.readAt instanceof Timestamp ? data.readAt.toDate() : new Date(data.readAt);
    }
    if (data.archivedAt) {
      notification.archivedAt =
        data.archivedAt instanceof Timestamp ? data.archivedAt.toDate() : new Date(data.archivedAt);
    }
    if (data.expiresAt) {
      notification.expiresAt =
        data.expiresAt instanceof Timestamp ? data.expiresAt.toDate() : new Date(data.expiresAt);
    }

    return notification;
  }
}
