/**
 * DDD Types Specification
 * ========================
 * 
 * This file contains a complete set of TypeScript types for a DDD project
 * following strict architectural rules:
 * 
 * 1. Identity Layer: 'user' | 'organization' | 'bot'
 * 2. Membership Layer: 'team' | 'partner'
 * 3. Workspace ownership restricted to Identity Layer only
 * 4. No member lists in Workspace entity
 * 5. Discriminated unions for type safety
 * 6. Framework-agnostic pure TypeScript
 * 
 * DOMAIN LAYER - PURE TYPESCRIPT
 * ===============================
 * NO Angular, RxJS, Firebase, or any framework dependencies.
 */

// ============================================================================
// LAYER 1: IDENTITY TYPES
// ============================================================================
// Identities are accounts that can authenticate and have credentials.
// Only User and Organization can own workspaces.

/**
 * IdentityType - Accounts that can authenticate
 * - user: Personal account (can own workspaces)
 * - organization: Organizational account (can own workspaces)
 * - bot: Service account (cannot own workspaces, has API credentials)
 */
export type IdentityType = 'user' | 'organization' | 'bot';

/**
 * User Identity
 * Personal account that can own workspaces and authenticate
 */
export interface UserIdentity {
  readonly type: 'user';
  readonly id: string;
  
  // Display information
  displayName: string;
  email: string;
  photoURL?: string;
  
  // Personal details
  firstName?: string;
  lastName?: string;
  bio?: string;
  phoneNumber?: string;
  
  // Preferences
  locale?: string;
  timezone?: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
}

/**
 * Organization Identity
 * Organizational account that can own workspaces and authenticate
 * Has members (User IDs only, no nested objects)
 */
export interface OrganizationIdentity {
  readonly type: 'organization';
  readonly id: string;
  
  // Display information
  displayName: string;
  email?: string;
  logoURL?: string;
  
  // Organization details
  description?: string;
  industry?: string;
  size?: 'small' | 'medium' | 'large' | 'enterprise';
  website?: string;
  
  // Member management
  // CRITICAL: Only store User IDs, NOT full User objects
  // Prevents circular dependencies and maintains single source of truth
  memberIds: string[];
  ownerIds: string[]; // Organization owners (User IDs)
  
  // Settings
  settings: {
    allowPublicWorkspaces: boolean;
    requireMFA: boolean;
    maxMembers?: number;
  };
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // User ID who created the organization
  active: boolean;
}

/**
 * Bot Identity
 * Service account for API access
 * CANNOT own workspaces - only access them
 */
export interface BotIdentity {
  readonly type: 'bot';
  readonly id: string;
  
  // Display information
  displayName: string;
  description?: string;
  avatarURL?: string;
  
  // API credentials
  apiKey: string;
  permissions: string[]; // API permission scopes
  
  // Rate limiting
  rateLimitTier: 'free' | 'basic' | 'premium' | 'unlimited';
  requestsThisHour: number;
  
  // Workspace access
  // CRITICAL: Bot can ACCESS workspaces but cannot OWN them
  workspaceIds: string[];
  
  // Ownership
  createdBy: string; // User ID who created the bot
  organizationId?: string; // Optional: organization that owns this bot
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'suspended' | 'revoked';
}

/**
 * Identity - Discriminated union of all identity types
 * TypeScript will enforce type safety based on the 'type' field
 */
export type Identity = UserIdentity | OrganizationIdentity | BotIdentity;

// ============================================================================
// LAYER 2: MEMBERSHIP TYPES
// ============================================================================
// Memberships are relationship constructs that belong to organizations.
// They CANNOT own workspaces, only access them.

/**
 * MembershipType - Relationship constructs belonging to organizations
 * - team: Internal organizational unit (belongs to organization)
 * - partner: External collaborator (collaborates with organization)
 * 
 * CRITICAL: Memberships CANNOT own workspaces
 */
export type MembershipType = 'team' | 'partner';

/**
 * Team Membership
 * Internal organizational unit belonging to an organization
 * Has members and can access workspaces
 * CANNOT own workspaces
 */
export interface TeamMembership {
  readonly type: 'team';
  readonly id: string;
  
  // Team belongs to an organization
  // CRITICAL: organizationId is REQUIRED for all memberships
  organizationId: string;
  
  // Display information
  displayName: string;
  description?: string;
  color?: string;
  iconURL?: string;
  
  // Member management
  // CRITICAL: Only store User IDs, NOT full User objects
  memberIds: string[];
  leadIds: string[]; // Team leads (User IDs)
  
  // Workspace access
  // CRITICAL: Team can ACCESS workspaces but cannot OWN them
  // Workspace ownership is managed via WorkspaceOwnership type
  workspaceIds: string[];
  
  // Permissions per workspace
  workspacePermissions: {
    workspaceId: string;
    canRead: boolean;
    canWrite: boolean;
    canDelete: boolean;
    grantedAt: Date;
    grantedBy: string; // User ID who granted permissions
  }[];
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // User ID who created the team
  active: boolean;
}

/**
 * Partner Membership
 * External organizational unit collaborating with an organization
 * Has members and can access workspaces
 * CANNOT own workspaces
 */
export interface PartnerMembership {
  readonly type: 'partner';
  readonly id: string;
  
  // Partner collaborates with an organization
  // CRITICAL: organizationId is REQUIRED for all memberships
  organizationId: string;
  
  // Display information
  displayName: string;
  companyName: string;
  description?: string;
  logoURL?: string;
  
  // Contact information
  contactPerson?: string;
  email?: string;
  phoneNumber?: string;
  
  // Partnership details
  partnershipType: 'vendor' | 'client' | 'contractor' | 'collaborator';
  contractStartDate?: Date;
  contractEndDate?: Date;
  
  // Member management
  // CRITICAL: Only store User IDs, NOT full User objects
  memberIds: string[];
  
  // Workspace access
  // CRITICAL: Partner can ACCESS workspaces but cannot OWN them
  workspaceIds: string[];
  
  // Access permissions per workspace
  workspaceAccess: {
    workspaceId: string;
    accessLevel: 'read' | 'write' | 'admin';
    canRead: boolean;
    canWrite: boolean;
    canDelete: boolean;
    grantedAt: Date;
    grantedBy: string; // User ID who granted access
    expiresAt?: Date;
  }[];
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // User ID who created the partnership
  active: boolean;
  suspended: boolean;
  suspensionReason?: string;
}

/**
 * Membership - Discriminated union of all membership types
 * TypeScript will enforce type safety based on the 'type' field
 */
export type Membership = TeamMembership | PartnerMembership;

// ============================================================================
// LAYER 3: WORKSPACE OWNERSHIP
// ============================================================================
// Workspaces can ONLY be owned by User or Organization identities.
// Discriminated union enforces compile-time safety.

/**
 * WorkspaceOwnerType - Only identities that can own workspaces
 * CRITICAL: Only 'user' and 'organization' can own workspaces
 * Bot, Team, and Partner CANNOT own workspaces
 */
export type WorkspaceOwnerType = 'user' | 'organization';

/**
 * User-Owned Workspace
 * Workspace owned by a personal user account
 */
export interface UserOwnedWorkspace {
  ownerType: 'user';
  ownerId: string; // User ID
  // NO organizationId for user-owned workspaces
}

/**
 * Organization-Owned Workspace
 * Workspace owned by an organizational account
 */
export interface OrganizationOwnedWorkspace {
  ownerType: 'organization';
  ownerId: string; // Organization ID
  organizationId: string; // Same as ownerId (for convenience)
}

/**
 * WorkspaceOwnership - Discriminated union for type-safe workspace ownership
 * 
 * TypeScript enforces:
 * - Only 'user' or 'organization' can be ownerType
 * - organizationId only exists for organization-owned workspaces
 * - Compile-time error if you try to assign 'bot', 'team', or 'partner' as ownerType
 */
export type WorkspaceOwnership = UserOwnedWorkspace | OrganizationOwnedWorkspace;

/**
 * Module Flags - Which modules are enabled in a workspace
 */
export interface ModuleFlags {
  tasks: boolean;
  documents: boolean;
  calendar: boolean;
  discussions: boolean;
  analytics: boolean;
  integrations: boolean;
}

/**
 * Module Counts - Resource counts per module
 */
export interface ModuleCounts {
  tasks: number;
  documents: number;
  events: number;
  discussions: number;
}

/**
 * Workspace Entity
 * Represents a logical container for organizing work
 * 
 * CRITICAL RULES:
 * 1. Workspace extends WorkspaceOwnership (ownerType + ownerId)
 * 2. NO member lists - members are managed via Organization/Team/Partner
 * 3. Only contains modules and settings, not people
 */
export interface Workspace extends WorkspaceOwnership {
  readonly id: string;
  
  // Basic information
  name: string; // Unique identifier (e.g., 'my-project')
  displayName: string; // User-friendly name (e.g., 'My Project')
  description?: string;
  
  // Visual identity
  iconURL?: string;
  coverImageURL?: string;
  color?: string;
  
  // Modules
  // CRITICAL: Workspace contains MODULES, not MEMBERS
  // Member management is external via Organization/Team/Partner entities
  moduleFlags: ModuleFlags;
  moduleCounts: ModuleCounts;
  
  // Settings
  visibility: 'private' | 'internal' | 'public';
  status: 'active' | 'archived' | 'suspended';
  
  // Preferences
  defaultView?: 'list' | 'board' | 'calendar' | 'timeline';
  timezone?: string;
  locale?: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // User ID who created the workspace
  
  // Archive information (if archived)
  archivedAt?: Date;
  archivedBy?: string;
  archiveReason?: string;
}

// ============================================================================
// TYPE GUARDS
// ============================================================================
// Runtime type checking for discriminated unions

/**
 * Type guard: Check if type is an identity
 */
export function isIdentityType(type: string): type is IdentityType {
  return type === 'user' || type === 'organization' || type === 'bot';
}

/**
 * Type guard: Check if type is a membership
 */
export function isMembershipType(type: string): type is MembershipType {
  return type === 'team' || type === 'partner';
}

/**
 * Type guard: Check if identity can own workspaces
 * Only User and Organization can own workspaces
 */
export function canOwnWorkspace(identity: Identity): identity is UserIdentity | OrganizationIdentity {
  return identity.type === 'user' || identity.type === 'organization';
}

/**
 * Type guard: Check if workspace is user-owned
 */
export function isUserOwnedWorkspace(workspace: Workspace): workspace is Workspace & UserOwnedWorkspace {
  return workspace.ownerType === 'user';
}

/**
 * Type guard: Check if workspace is organization-owned
 */
export function isOrganizationOwnedWorkspace(workspace: Workspace): workspace is Workspace & OrganizationOwnedWorkspace {
  return workspace.ownerType === 'organization';
}

/**
 * Type guard: Check if identity is a user
 */
export function isUserIdentity(identity: Identity): identity is UserIdentity {
  return identity.type === 'user';
}

/**
 * Type guard: Check if identity is an organization
 */
export function isOrganizationIdentity(identity: Identity): identity is OrganizationIdentity {
  return identity.type === 'organization';
}

/**
 * Type guard: Check if identity is a bot
 */
export function isBotIdentity(identity: Identity): identity is BotIdentity {
  return identity.type === 'bot';
}

/**
 * Type guard: Check if membership is a team
 */
export function isTeamMembership(membership: Membership): membership is TeamMembership {
  return membership.type === 'team';
}

/**
 * Type guard: Check if membership is a partner
 */
export function isPartnerMembership(membership: Membership): membership is PartnerMembership {
  return membership.type === 'partner';
}

/**
 * Type guard: Check if identity has members
 * Only Organization has member lists
 */
export function hasMembers(identity: Identity): identity is OrganizationIdentity {
  return identity.type === 'organization';
}

/**
 * Type guard: Check if membership belongs to organization
 * All memberships have organizationId
 */
export function belongsToOrganization(membership: Membership): boolean {
  return 'organizationId' in membership && typeof membership.organizationId === 'string';
}

// ============================================================================
// ACCOUNT TYPE (UI COMPATIBILITY)
// ============================================================================
// AccountType is for UI display and switching only
// NOT for domain logic or workspace ownership

/**
 * AccountType - Union of all account types for UI display
 * 
 * This is for UI purposes only (account switcher, display, etc.)
 * DO NOT use AccountType for domain logic or workspace ownership
 * 
 * For domain logic:
 * - Use IdentityType for identities
 * - Use MembershipType for memberships
 * - Use WorkspaceOwnerType for workspace ownership
 */
export type AccountType = IdentityType | MembershipType;

/**
 * Type guard: Check if account type can own workspaces
 * Only 'user' and 'organization' can own workspaces
 */
export function canAccountTypeOwnWorkspace(accountType: AccountType): accountType is WorkspaceOwnerType {
  return accountType === 'user' || accountType === 'organization';
}

// ============================================================================
// CREATION AND UPDATE TYPES
// ============================================================================

/**
 * CreateUserWorkspaceData - Data needed to create a user-owned workspace
 */
export type CreateUserWorkspaceData = Omit<
  Workspace & UserOwnedWorkspace,
  'id' | 'moduleCounts' | 'createdAt' | 'updatedAt' | 'status' | 'archivedAt' | 'archivedBy' | 'archiveReason'
>;

/**
 * CreateOrganizationWorkspaceData - Data needed to create an organization-owned workspace
 */
export type CreateOrganizationWorkspaceData = Omit<
  Workspace & OrganizationOwnedWorkspace,
  'id' | 'moduleCounts' | 'createdAt' | 'updatedAt' | 'status' | 'archivedAt' | 'archivedBy' | 'archiveReason'
>;

/**
 * CreateWorkspaceData - Discriminated union for workspace creation
 * TypeScript ensures correct fields based on ownerType
 */
export type CreateWorkspaceData = CreateUserWorkspaceData | CreateOrganizationWorkspaceData;

/**
 * UpdateWorkspaceData - Partial update of workspace fields
 * Cannot change ownership after creation
 */
export type UpdateWorkspaceData = Partial<Omit<
  Workspace,
  'id' | 'ownerType' | 'ownerId' | 'organizationId' | 'createdAt' | 'createdBy'
>>;

// ============================================================================
// EXAMPLES AND VALIDATION
// ============================================================================

/**
 * Example: Creating a user-owned workspace
 */
const createUserWorkspaceExample: CreateUserWorkspaceData = {
  ownerType: 'user', // Must be 'user'
  ownerId: 'user-123', // User ID
  // NO organizationId - TypeScript won't allow it
  name: 'my-project',
  displayName: 'My Project',
  description: 'A personal project',
  moduleFlags: {
    tasks: true,
    documents: true,
    calendar: false,
    discussions: false,
    analytics: false,
    integrations: false
  },
  visibility: 'private',
  createdBy: 'user-123'
};

/**
 * Example: Creating an organization-owned workspace
 */
const createOrgWorkspaceExample: CreateOrganizationWorkspaceData = {
  ownerType: 'organization', // Must be 'organization'
  ownerId: 'org-456', // Organization ID
  organizationId: 'org-456', // REQUIRED for org-owned workspaces
  name: 'team-project',
  displayName: 'Team Project',
  description: 'A team project',
  moduleFlags: {
    tasks: true,
    documents: true,
    calendar: true,
    discussions: true,
    analytics: false,
    integrations: false
  },
  visibility: 'internal',
  createdBy: 'user-789'
};

/**
 * COMPILE-TIME ERROR EXAMPLES
 * These will NOT compile due to TypeScript type safety:
 */

// ❌ ERROR: Cannot assign 'bot' to ownerType
// const botWorkspace: CreateWorkspaceData = {
//   ownerType: 'bot', // TypeScript error: Type '"bot"' is not assignable to type 'user' | 'organization'
//   ownerId: 'bot-999',
//   name: 'bot-workspace',
//   displayName: 'Bot Workspace',
//   moduleFlags: { /* ... */ },
//   visibility: 'private',
//   createdBy: 'bot-999'
// };

// ❌ ERROR: Cannot assign 'team' to ownerType
// const teamWorkspace: CreateWorkspaceData = {
//   ownerType: 'team', // TypeScript error: Type '"team"' is not assignable to type 'user' | 'organization'
//   ownerId: 'team-777',
//   name: 'team-workspace',
//   displayName: 'Team Workspace',
//   moduleFlags: { /* ... */ },
//   visibility: 'private',
//   createdBy: 'user-123'
// };

// ❌ ERROR: organizationId not allowed for user-owned workspace
// const invalidUserWorkspace: CreateUserWorkspaceData = {
//   ownerType: 'user',
//   ownerId: 'user-123',
//   organizationId: 'org-456', // TypeScript error: Object literal may only specify known properties
//   name: 'my-project',
//   displayName: 'My Project',
//   moduleFlags: { /* ... */ },
//   visibility: 'private',
//   createdBy: 'user-123'
// };

// ============================================================================
// SUMMARY OF RULES ENFORCED BY TYPE SYSTEM
// ============================================================================

/**
 * 1. Identity Layer Separation
 *    - IdentityType = 'user' | 'organization' | 'bot'
 *    - Only User and Organization can own workspaces
 *    - Bot can access but not own workspaces
 * 
 * 2. Membership Layer Separation
 *    - MembershipType = 'team' | 'partner'
 *    - All memberships MUST have organizationId
 *    - Memberships can access but NOT own workspaces
 * 
 * 3. Workspace Ownership Type Safety
 *    - WorkspaceOwnerType = 'user' | 'organization' (discriminated union)
 *    - Compile-time error if trying to assign bot/team/partner as owner
 *    - organizationId only exists for organization-owned workspaces
 * 
 * 4. No Member Lists in Workspace
 *    - Workspace only contains modules (moduleFlags, moduleCounts)
 *    - Member management is external via Organization/Team/Partner
 *    - Single source of truth for members
 * 
 * 5. Type Guards for Runtime Validation
 *    - isIdentityType(), isMembershipType()
 *    - canOwnWorkspace()
 *    - isUserOwnedWorkspace(), isOrganizationOwnedWorkspace()
 * 
 * 6. Framework-Agnostic
 *    - Pure TypeScript types and interfaces
 *    - No Angular, RxJS, Firebase, or framework dependencies
 *    - Can be used in any TypeScript project
 */
