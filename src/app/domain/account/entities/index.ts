/**
 * Account Identity Layer Exports
 * 
 * Identity types: User, Organization, Bot
 * These are the ONLY types that can own workspaces
 */

// User entity
export * from './user.entity';

// Organization entity
export * from './organization.entity';

// Bot entity
export * from './bot.entity';

/**
 * Account Type Union
 * Used for UI account switcher and context display
 */
export type AccountType = 'user' | 'organization' | 'bot' | 'team' | 'partner';

/**
 * Workspace Owner Type Union
 * ONLY User and Organization can own workspaces
 */
export type WorkspaceOwnerType = 'user' | 'organization';
