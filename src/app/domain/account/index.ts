/**
 * Account domain exports.
 * 
 * IDENTITY LAYER
 * ==============
 * Account identities (User, Organization, Bot) can authenticate and have credentials.
 * Only User and Organization can own workspaces.
 * 
 * ENTITIES LIVE HERE: src/app/domain/account/entities/
 * - user.entity.ts
 * - organization.entity.ts  
 * - bot.entity.ts
 * 
 * TYPE DEFINITIONS: src/app/domain/shared/types/ddd-types-reference.ts
 * Contains comprehensive type definitions and type guards.
 */

// Export concrete entity implementations
export * from './entities';

// Re-export canonical type definitions from shared/types/ddd-types-reference.ts
// for backward compatibility and centralized type management
export type {
  // Core Account Union
  Account,
  
  // Identity Layer Types
  IdentityType,
  MembershipType,
  WorkspaceOwnerType,
  
  // Identity Interfaces
  UserIdentity,
  OrganizationIdentity,
  BotIdentity,
  
  // Identity Union
  Identity,
  
  // Workspace Ownership
  WorkspaceOwnership,
  UserOwnedWorkspace,
  OrganizationOwnedWorkspace,
  Workspace
} from '../shared/types/ddd-types-reference';

export {
  // Type Guards
  canOwnWorkspace,
  isIdentityType,
  isMembershipType,
  isUserIdentity,
  isOrganizationIdentity,
  isBotIdentity,
  isUserOwnedWorkspace,
  isOrganizationOwnedWorkspace,
  
  // Validation Helpers
  ValidationHelpers
} from '../shared/types/ddd-types-reference';
