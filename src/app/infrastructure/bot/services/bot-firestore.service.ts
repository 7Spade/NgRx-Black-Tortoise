/**
 * Bot Firestore Service - Infrastructure Layer
 * Implements BotRepository with Firebase integration
 */

import { inject, Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  CollectionReference,
  DocumentReference,
  Timestamp,
} from '@angular/fire/firestore';
import { BotRepository } from '@domain/repositories';
import { Bot, BotStatus } from '@domain/bot/entities/bot.entity';

@Injectable({ providedIn: 'root' })
export class BotFirestoreService implements BotRepository {
  private firestore = inject(Firestore);
  private readonly COLLECTION_NAME = 'bots';

  private get botsCollection(): CollectionReference {
    return collection(this.firestore, this.COLLECTION_NAME);
  }

  async getBotById(botId: string): Promise<Bot | null> {
    const docRef = doc(this.firestore, this.COLLECTION_NAME, botId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? this.convertFromFirestore(docSnap.data(), docSnap.id) : null;
  }

  async getAllBots(): Promise<Bot[]> {
    const querySnapshot = await getDocs(this.botsCollection);
    return querySnapshot.docs.map(doc => this.convertFromFirestore(doc.data(), doc.id));
  }

  async getBotsByOwnerId(ownerId: string): Promise<Bot[]> {
    const q = query(this.botsCollection, where('ownerId', '==', ownerId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => this.convertFromFirestore(doc.data(), doc.id));
  }

  async getBotsByWorkspaceId(workspaceId: string): Promise<Bot[]> {
    const q = query(this.botsCollection, where('workspaceAccess', 'array-contains', workspaceId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => this.convertFromFirestore(doc.data(), doc.id));
  }

  async createBot(bot: Omit<Bot, 'id' | 'createdAt' | 'updatedAt'>): Promise<Bot> {
    const now = new Date();
    const botData = {
      ...bot,
      createdAt: Timestamp.fromDate(now),
      updatedAt: Timestamp.fromDate(now),
    };
    const docRef = await addDoc(this.botsCollection, botData);
    return {
      ...bot,
      id: docRef.id,
      createdAt: now,
      updatedAt: now,
    };
  }

  async updateBot(botId: string, updates: Partial<Bot>): Promise<Bot> {
    const docRef = doc(this.firestore, this.COLLECTION_NAME, botId);
    const updateData = {
      ...updates,
      updatedAt: Timestamp.fromDate(new Date()),
    };
    await updateDoc(docRef, updateData);
    const updated = await this.getBotById(botId);
    if (!updated) throw new Error('Bot not found after update');
    return updated;
  }

  async deleteBot(botId: string): Promise<void> {
    const docRef = doc(this.firestore, this.COLLECTION_NAME, botId);
    await deleteDoc(docRef);
  }

  async revokeApiKey(botId: string): Promise<void> {
    await this.updateBot(botId, {
      apiKey: '',
      status: BotStatus.INACTIVE,
    });
  }

  async resetRateLimits(botId: string): Promise<void> {
    await this.updateBot(botId, {
      rateLimit: {
        requestsPerMinute: 60,
        requestsPerHour: 3600,
        requestsPerDay: 86400,
        currentUsage: {
          minute: 0,
          hour: 0,
          day: 0,
          lastReset: new Date(),
        },
      },
    });
  }

  private convertFromFirestore(data: any, id: string): Bot {
    return {
      id,
      name: data.name,
      description: data.description,
      ownerId: data.ownerId,
      ownerType: data.ownerType,
      apiKey: data.apiKey,
      permissions: data.permissions,
      workspaceAccess: data.workspaceAccess || [],
      rateLimit: {
        ...data.rateLimit,
        currentUsage: {
          ...data.rateLimit.currentUsage,
          lastReset: data.rateLimit.currentUsage.lastReset?.toDate?.() || new Date(),
        },
      },
      status: data.status,
      createdAt: data.createdAt?.toDate?.() || new Date(),
      updatedAt: data.updatedAt?.toDate?.() || new Date(),
    };
  }
}
