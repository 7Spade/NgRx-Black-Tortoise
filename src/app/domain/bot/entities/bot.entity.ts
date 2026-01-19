/**
 * Bot Entity
 * 
 * DOMAIN LAYER - PURE TYPESCRIPT
 * ===============================
 * NO Angular, RxJS, or Firebase dependencies allowed.
 * 
 * Bot represents a service account identity.
 * Bots:
 * - Are automated service accounts
 * - CANNOT own workspaces (only User and Organization can own)
 * - Have API access credentials
 * - Have defined permissions and rate limits
 */

/**
 * Bot permission scope
 */
export enum BotPermission {
  READ_WORKSPACE = 'read:workspace',
  WRITE_WORKSPACE = 'write:workspace',
  DELETE_WORKSPACE = 'delete:workspace',
  READ_TASK = 'read:task',
  WRITE_TASK = 'write:task',
  DELETE_TASK = 'delete:task',
  READ_DOCUMENT = 'read:document',
  WRITE_DOCUMENT = 'write:document',
  DELETE_DOCUMENT = 'delete:document',
  MANAGE_INTEGRATIONS = 'manage:integrations',
  EXECUTE_WORKFLOW = 'execute:workflow'
}

/**
 * Bot rate limit tier
 */
export enum BotRateLimitTier {
  FREE = 'free',           // 100 requests/hour
  BASIC = 'basic',         // 1,000 requests/hour
  PREMIUM = 'premium',     // 10,000 requests/hour
  UNLIMITED = 'unlimited'  // No rate limits
}

/**
 * Bot status
 */
export enum BotStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  REVOKED = 'revoked'
}

/**
 * Bot API credentials
 */
export interface BotCredentials {
  apiKey: string;
  apiSecret?: string;
  issuedAt: Date;
  expiresAt?: Date;
  lastUsedAt?: Date;
}

/**
 * Bot usage statistics
 */
export interface BotUsageStats {
  totalRequests: number;
  requestsToday: number;
  requestsThisHour: number;
  lastRequestAt?: Date;
  errorCount: number;
}

/**
 * Bot Entity
 * Represents a service account for automated operations
 */
export interface Bot {
  readonly id: string;
  
  // Basic information
  name: string;
  displayName: string;
  description?: string;
  
  // Visual identity
  avatarURL?: string;
  
  // Ownership
  // IMPORTANT: Bot is created by a user or organization
  createdBy: string; // User ID who created the bot
  organizationId?: string; // Optional: organization that owns this bot
  
  // Credentials
  credentials: BotCredentials;
  
  // Permissions
  // IMPORTANT: Bots have scoped permissions, not full access
  permissions: BotPermission[];
  
  // Workspace access
  // IMPORTANT: Bots can ACCESS workspaces but cannot OWN them
  workspaceIds: string[]; // Workspaces this bot has access to
  
  // Rate limiting
  rateLimitTier: BotRateLimitTier;
  customRateLimit?: {
    requestsPerHour: number;
    requestsPerDay: number;
  };
  
  // Usage tracking
  usageStats: BotUsageStats;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  
  // Status
  status: BotStatus;
  suspensionReason?: string;
  revokedAt?: Date;
  revokedBy?: string;
}

/**
 * Bot creation data
 * Used when creating a new bot
 */
export type CreateBotData = Omit<
  Bot,
  'id' | 'credentials' | 'usageStats' | 'workspaceIds' | 'createdAt' | 'updatedAt' | 'status' | 'suspensionReason' | 'revokedAt' | 'revokedBy'
> & {
  permissions?: BotPermission[];
  workspaceIds?: string[];
};

/**
 * Bot update data
 * Partial update of bot fields
 */
export type UpdateBotData = Partial<Omit<
  Bot,
  'id' | 'credentials' | 'createdAt' | 'createdBy'
>>;

/**
 * Helper functions for bot management
 */
export const BotHelpers = {
  /**
   * Check if bot has a specific permission
   */
  hasPermission(bot: Bot, permission: BotPermission): boolean {
    return bot.permissions.includes(permission);
  },
  
  /**
   * Check if bot has any read permission
   */
  hasReadAccess(bot: Bot): boolean {
    return bot.permissions.some(p => 
      p === BotPermission.READ_WORKSPACE ||
      p === BotPermission.READ_TASK ||
      p === BotPermission.READ_DOCUMENT
    );
  },
  
  /**
   * Check if bot has any write permission
   */
  hasWriteAccess(bot: Bot): boolean {
    return bot.permissions.some(p => 
      p === BotPermission.WRITE_WORKSPACE ||
      p === BotPermission.WRITE_TASK ||
      p === BotPermission.WRITE_DOCUMENT
    );
  },
  
  /**
   * Check if bot has any delete permission
   */
  hasDeleteAccess(bot: Bot): boolean {
    return bot.permissions.some(p => 
      p === BotPermission.DELETE_WORKSPACE ||
      p === BotPermission.DELETE_TASK ||
      p === BotPermission.DELETE_DOCUMENT
    );
  },
  
  /**
   * Check if bot has access to a workspace
   */
  hasWorkspaceAccess(bot: Bot, workspaceId: string): boolean {
    return bot.workspaceIds.includes(workspaceId);
  },
  
  /**
   * Check if bot is active
   */
  isActive(bot: Bot): boolean {
    return bot.status === BotStatus.ACTIVE;
  },
  
  /**
   * Check if bot is suspended
   */
  isSuspended(bot: Bot): boolean {
    return bot.status === BotStatus.SUSPENDED;
  },
  
  /**
   * Check if bot is revoked
   */
  isRevoked(bot: Bot): boolean {
    return bot.status === BotStatus.REVOKED;
  },
  
  /**
   * Check if API key is expired
   */
  isCredentialsExpired(bot: Bot): boolean {
    if (!bot.credentials.expiresAt) return false;
    return bot.credentials.expiresAt < new Date();
  },
  
  /**
   * Check if bot can make requests (not rate limited)
   */
  canMakeRequest(bot: Bot): boolean {
    if (!BotHelpers.isActive(bot)) return false;
    if (BotHelpers.isCredentialsExpired(bot)) return false;
    
    if (bot.rateLimitTier === BotRateLimitTier.UNLIMITED) return true;
    
    // Check custom rate limit
    if (bot.customRateLimit) {
      return bot.usageStats.requestsThisHour < bot.customRateLimit.requestsPerHour;
    }
    
    // Check tier-based rate limit
    const tierLimits = {
      [BotRateLimitTier.FREE]: 100,
      [BotRateLimitTier.BASIC]: 1000,
      [BotRateLimitTier.PREMIUM]: 10000,
      [BotRateLimitTier.UNLIMITED]: Infinity
    };
    
    return bot.usageStats.requestsThisHour < tierLimits[bot.rateLimitTier];
  },
  
  /**
   * Get remaining requests for current hour
   */
  getRemainingRequests(bot: Bot): number {
    if (bot.rateLimitTier === BotRateLimitTier.UNLIMITED) return Infinity;
    
    if (bot.customRateLimit) {
      return bot.customRateLimit.requestsPerHour - bot.usageStats.requestsThisHour;
    }
    
    const tierLimits = {
      [BotRateLimitTier.FREE]: 100,
      [BotRateLimitTier.BASIC]: 1000,
      [BotRateLimitTier.PREMIUM]: 10000,
      [BotRateLimitTier.UNLIMITED]: Infinity
    };
    
    return tierLimits[bot.rateLimitTier] - bot.usageStats.requestsThisHour;
  },
  
  /**
   * Generate new API key (placeholder - actual implementation in infrastructure)
   */
  generateApiKey(): string {
    // This is a placeholder - actual implementation should be in infrastructure
    return 'bot_' + Math.random().toString(36).substring(2, 15);
  },
  
  /**
   * Create initial credentials
   */
  createInitialCredentials(): BotCredentials {
    return {
      apiKey: BotHelpers.generateApiKey(),
      issuedAt: new Date()
    };
  },
  
  /**
   * Create initial usage stats
   */
  createInitialUsageStats(): BotUsageStats {
    return {
      totalRequests: 0,
      requestsToday: 0,
      requestsThisHour: 0,
      errorCount: 0
    };
  }
};
