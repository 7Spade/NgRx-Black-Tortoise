/**
 * Bot Repository Interface - Domain Layer
 * Pure TypeScript interface with NO framework dependencies
 */

import { Bot } from '@domain/account';

/**
 * Bot Repository - Promise-based data access interface
 */
export interface BotRepository {
  /**
   * Get bot by ID
   */
  getBotById(botId: string): Promise<Bot | null>;

  /**
   * Get all bots
   */
  getAllBots(): Promise<Bot[]>;

  /**
   * Get bots by owner ID (user or organization)
   */
  getBotsByOwnerId(ownerId: string): Promise<Bot[]>;

  /**
   * Get bots created by specific user (creator)
   */
  findByCreatorId(creatorId: string): Promise<Bot[]>;

  /**
   * Get bots with access to workspace
   */
  getBotsByWorkspaceId(workspaceId: string): Promise<Bot[]>;

  /**
   * Create new bot
   */
  createBot(bot: Omit<Bot, 'id' | 'createdAt' | 'updatedAt'>): Promise<Bot>;

  /**
   * Update bot
   */
  updateBot(botId: string, updates: Partial<Bot>): Promise<Bot>;

  /**
   * Delete bot
   */
  deleteBot(botId: string): Promise<void>;

  /**
   * Revoke bot API key
   */
  revokeApiKey(botId: string): Promise<void>;

  /**
   * Reset bot rate limits
   */
  resetRateLimits(botId: string): Promise<void>;
}
