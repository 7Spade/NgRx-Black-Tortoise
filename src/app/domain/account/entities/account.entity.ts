/**
 * Account Type Definitions
 * 
 * DOMAIN LAYER - PURE TYPESCRIPT
 * ===============================
 * NO Angular, RxJS, or Firebase dependencies allowed.
 * 
 * This file contains ONLY type aliases and type guards.
 * Actual entity definitions are in their respective entity files:
 * - Organization: domain/organization/entities/organization.entity.ts
 * - Bot: domain/bot/entities/bot.entity.ts
 * - Team: domain/team/entities/team.entity.ts
 * - Partner: domain/partner/entities/partner.entity.ts
 * 
 * Identity Layer (can authenticate):
 * - 'user' | 'organization' | 'bot'
 * 
 * Membership Layer (relationship constructs):
 * - 'team' | 'partner'
 * 
 * Workspace Ownership:
 * - Only 'user' | 'organization' can own workspaces
 */

/**
 * Account Type - Union of all account types for UI switching
 * 
 * This is used ONLY for UI display and account switcher.
 * For domain logic, use IdentityType or MembershipType instead.
 */
export type AccountType = 'user' | 'organization' | 'bot' | 'team' | 'partner';

/**
 * Identity Type - Accounts that can authenticate
 * 
 * Identities have credentials and can authenticate:
 * - 'user': Personal user account (CAN own workspaces)
 * - 'organization': Organizational account (CAN own workspaces)
 * - 'bot': Service account (CANNOT own workspaces)
 */
export type IdentityType = 'user' | 'organization' | 'bot';

/**
 * Membership Type - Relationship constructs
 * 
 * Memberships belong to organizations and CANNOT authenticate:
 * - 'team': Internal organizational unit (CANNOT own workspaces)
 * - 'partner': External organizational unit (CANNOT own workspaces)
 */
export type MembershipType = 'team' | 'partner';

/**
 * Workspace Owner Type - Types that can own workspaces
 * 
 * Only User and Organization can own workspaces.
 * Bot, Team, and Partner CANNOT own workspaces.
 */
export type WorkspaceOwnerType = 'user' | 'organization';

/**
 * Type guard: Check if type is an identity
 * 
 * Returns true for: 'user', 'organization', 'bot'
 * Returns false for: 'team', 'partner'
 */
export function isIdentityType(type: AccountType): type is IdentityType {
  return type === 'user' || type === 'organization' || type === 'bot';
}

/**
 * Type guard: Check if type is a membership
 * 
 * Returns true for: 'team', 'partner'
 * Returns false for: 'user', 'organization', 'bot'
 */
export function isMembershipType(type: AccountType): type is MembershipType {
  return type === 'team' || type === 'partner';
}

/**
 * Type guard: Check if type can own workspaces
 * 
 * Returns true for: 'user', 'organization'
 * Returns false for: 'bot', 'team', 'partner'
 */
export function canOwnWorkspace(type: AccountType): type is WorkspaceOwnerType {
  return type === 'user' || type === 'organization';
}
