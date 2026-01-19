/**
 * Bot Firestore Repository
 * 
 * Infrastructure layer implementation for bot persistence in Firestore.
 * Handles CRUD operations for bot service accounts.
 * Implements Promise-based methods for framework-agnostic domain layer.
 */
import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
  Timestamp,
  arrayUnion,
  arrayRemove,
} from '@angular/fire/firestore';
import {
  Bot,
  CreateBotData,
  UpdateBotData,
  BotStatus,
  BotHelpers,
} from '@domain/bot';
import { BotRepository } from '@domain/repositories';

@Injectable({
  providedIn: 'root',
})
export class BotFirestoreService implements BotRepository {
  private firestore = inject(Firestore);
  private botsCollection = collection(this.firestore, 'bots');

  /**
   * Create a new bot
   */
  async createBot(data: CreateBotData): Promise<Bot> {
    const botId = doc(this.botsCollection).id;
    const botRef = doc(this.botsCollection, botId);
    
    const bot: Bot = {
      id: botId,
      ...data,
      credentials: BotHelpers.createInitialCredentials(),
      usageStats: BotHelpers.createInitialUsageStats(),
      workspaceIds: data.workspaceIds || [],
      permissions: data.permissions || [],
      createdAt: new Date(),
      updatedAt: new Date(),
      status: BotStatus.ACTIVE,
    };

    const firestoreData = this.convertToFirestore(bot);

    try {
      await setDoc(botRef, firestoreData);
      return bot;
    } catch (error) {
      console.error('Error creating bot:', error);
      throw new Error('Failed to create bot');
    }
  }

  /**
   * Get bot by ID
   */
  async getBotById(id: string): Promise<Bot | null> {
    const botRef = doc(this.botsCollection, id);
    
    try {
      const docSnap = await getDoc(botRef);
      if (!docSnap.exists()) {
        return null;
      }
      return this.convertFromFirestore(docSnap.data(), id);
    } catch (error) {
      console.error('Error getting bot:', error);
      throw new Error('Failed to get bot');
    }
  }

  /**
   * Get all bots created by a user
   */
  async getBotsByCreator(createdBy: string): Promise<Bot[]> {
    const q = query(this.botsCollection, where('createdBy', '==', createdBy));
    
    try {
      const querySnapshot = await getDocs(q);
      const bots: Bot[] = [];
      querySnapshot.forEach((doc) => {
        bots.push(this.convertFromFirestore(doc.data(), doc.id));
      });
      return bots;
    } catch (error) {
      console.error('Error getting bots by creator:', error);
      throw new Error('Failed to get bots');
    }
  }

  /**
   * Get all bots belonging to an organization
   */
  async getBotsByOrganization(organizationId: string): Promise<Bot[]> {
    const q = query(this.botsCollection, where('organizationId', '==', organizationId));
    
    try {
      const querySnapshot = await getDocs(q);
      const bots: Bot[] = [];
      querySnapshot.forEach((doc) => {
        bots.push(this.convertFromFirestore(doc.data(), doc.id));
      });
      return bots;
    } catch (error) {
      console.error('Error getting bots by organization:', error);
      throw new Error('Failed to get bots');
    }
  }

  /**
   * Get all bots with access to a workspace
   */
  async getBotsByWorkspace(workspaceId: string): Promise<Bot[]> {
    const q = query(this.botsCollection, where('workspaceIds', 'array-contains', workspaceId));
    
    try {
      const querySnapshot = await getDocs(q);
      const bots: Bot[] = [];
      querySnapshot.forEach((doc) => {
        bots.push(this.convertFromFirestore(doc.data(), doc.id));
      });
      return bots;
    } catch (error) {
      console.error('Error getting bots by workspace:', error);
      throw new Error('Failed to get bots');
    }
  }

  /**
   * Update bot data
   */
  async updateBot(id: string, updates: UpdateBotData): Promise<Bot> {
    const botRef = doc(this.botsCollection, id);
    
    const updateData = {
      ...updates,
      updatedAt: serverTimestamp(),
    };

    try {
      await updateDoc(botRef, updateData);
      
      // Fetch and return updated bot
      const updatedBot = await this.getBotById(id);
      if (!updatedBot) {
        throw new Error('Bot not found after update');
      }
      return updatedBot;
    } catch (error) {
      console.error('Error updating bot:', error);
      throw new Error('Failed to update bot');
    }
  }

  /**
   * Delete bot
   */
  async deleteBot(id: string): Promise<void> {
    const botRef = doc(this.botsCollection, id);
    
    try {
      await deleteDoc(botRef);
    } catch (error) {
      console.error('Error deleting bot:', error);
      throw new Error('Failed to delete bot');
    }
  }

  /**
   * Suspend bot (revoke access temporarily)
   */
  async suspendBot(id: string, reason: string): Promise<Bot> {
    return this.updateBot(id, {
      status: BotStatus.SUSPENDED,
      suspensionReason: reason,
    });
  }

  /**
   * Reactivate suspended bot
   */
  async reactivateBot(id: string): Promise<Bot> {
    return this.updateBot(id, {
      status: BotStatus.ACTIVE,
      suspensionReason: undefined,
    });
  }

  /**
   * Revoke bot (permanent removal)
   */
  async revokeBot(id: string, revokedBy: string): Promise<Bot> {
    return this.updateBot(id, {
      status: BotStatus.REVOKED,
      revokedAt: new Date(),
      revokedBy,
    });
  }

  /**
   * Grant workspace access to bot
   */
  async grantWorkspaceAccess(botId: string, workspaceId: string): Promise<Bot> {
    const botRef = doc(this.botsCollection, botId);
    
    try {
      await updateDoc(botRef, {
        workspaceIds: arrayUnion(workspaceId),
        updatedAt: serverTimestamp(),
      });
      
      const updatedBot = await this.getBotById(botId);
      if (!updatedBot) {
        throw new Error('Bot not found after granting access');
      }
      return updatedBot;
    } catch (error) {
      console.error('Error granting workspace access:', error);
      throw new Error('Failed to grant workspace access');
    }
  }

  /**
   * Revoke workspace access from bot
   */
  async revokeWorkspaceAccess(botId: string, workspaceId: string): Promise<Bot> {
    const botRef = doc(this.botsCollection, botId);
    
    try {
      await updateDoc(botRef, {
        workspaceIds: arrayRemove(workspaceId),
        updatedAt: serverTimestamp(),
      });
      
      const updatedBot = await this.getBotById(botId);
      if (!updatedBot) {
        throw new Error('Bot not found after revoking access');
      }
      return updatedBot;
    } catch (error) {
      console.error('Error revoking workspace access:', error);
      throw new Error('Failed to revoke workspace access');
    }
  }

  /**
   * Update bot usage statistics
   */
  async updateUsageStats(
    botId: string,
    stats: { requestsThisHour: number; requestsToday: number; totalRequests: number }
  ): Promise<void> {
    const botRef = doc(this.botsCollection, botId);
    
    try {
      await updateDoc(botRef, {
        'usageStats.requestsThisHour': stats.requestsThisHour,
        'usageStats.requestsToday': stats.requestsToday,
        'usageStats.totalRequests': stats.totalRequests,
        'usageStats.lastRequestAt': serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating usage stats:', error);
      throw new Error('Failed to update usage stats');
    }
  }

  /**
   * Regenerate API credentials
   */
  async regenerateCredentials(botId: string): Promise<Bot> {
    const newCredentials = BotHelpers.createInitialCredentials();
    
    return this.updateBot(botId, {
      credentials: newCredentials,
    });
  }

  /**
   * Convert Bot to Firestore format
   */
  private convertToFirestore(bot: Bot): any {
    return {
      ...bot,
      createdAt: Timestamp.fromDate(bot.createdAt),
      updatedAt: Timestamp.fromDate(bot.updatedAt),
      credentials: {
        ...bot.credentials,
        issuedAt: Timestamp.fromDate(bot.credentials.issuedAt),
        expiresAt: bot.credentials.expiresAt
          ? Timestamp.fromDate(bot.credentials.expiresAt)
          : null,
        lastUsedAt: bot.credentials.lastUsedAt
          ? Timestamp.fromDate(bot.credentials.lastUsedAt)
          : null,
      },
      usageStats: {
        ...bot.usageStats,
        lastRequestAt: bot.usageStats.lastRequestAt
          ? Timestamp.fromDate(bot.usageStats.lastRequestAt)
          : null,
      },
      revokedAt: bot.revokedAt ? Timestamp.fromDate(bot.revokedAt) : null,
    };
  }

  /**
   * Convert Firestore document to Bot
   */
  private convertFromFirestore(data: any, id: string): Bot {
    return {
      id,
      name: data.name,
      displayName: data.displayName,
      description: data.description,
      avatarURL: data.avatarURL,
      createdBy: data.createdBy,
      organizationId: data.organizationId,
      credentials: {
        apiKey: data.credentials.apiKey,
        apiSecret: data.credentials.apiSecret,
        issuedAt: data.credentials.issuedAt?.toDate() || new Date(),
        expiresAt: data.credentials.expiresAt?.toDate(),
        lastUsedAt: data.credentials.lastUsedAt?.toDate(),
      },
      permissions: data.permissions || [],
      workspaceIds: data.workspaceIds || [],
      rateLimitTier: data.rateLimitTier,
      customRateLimit: data.customRateLimit,
      usageStats: {
        totalRequests: data.usageStats?.totalRequests || 0,
        requestsToday: data.usageStats?.requestsToday || 0,
        requestsThisHour: data.usageStats?.requestsThisHour || 0,
        lastRequestAt: data.usageStats?.lastRequestAt?.toDate(),
        errorCount: data.usageStats?.errorCount || 0,
      },
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      status: data.status,
      suspensionReason: data.suspensionReason,
      revokedAt: data.revokedAt?.toDate(),
      revokedBy: data.revokedBy,
    };
  }
}
