/**
 * IDENTITY LAYER (Account / Auth boundary)
 * ==========================================
 * - User
 * - Organization
 * - Bot
 * 
 * ⚠️ EXPLICIT EXCLUSION:
 * - No Team
 * - No Partner
 * 
 * Rule of thumb:
 * If it can authenticate → Identity.
 * If it only groups users → Membership.
 * Team/Partner never authenticate.
 */

// Identity entities ONLY
export * from './user.entity';
export * from './organization.entity';
export * from './bot.entity';

/**
 * Identity Type Union
 * ONLY types that can authenticate
 */
export type IdentityType = 'user' | 'organization' | 'bot';

/**
 * Workspace Owner Type Union
 * ONLY User and Organization can own workspaces
 */
export type WorkspaceOwnerType = 'user' | 'organization';

/**
 * 🚫 Forbidden patterns (DO NOT GENERATE):
 * 
 * type IdentityType = 'user' | 'organization' | 'bot' | 'team' | 'partner'; ❌
 * 
 * 🚫 Team/Partner must NEVER:
 * - be used as ownerType
 * - appear in auth claims
 * - be stored in Workspace.owner*
 * - be part of IdentityType union
 */
