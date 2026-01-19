/**
 * DDD Types Reference
 * 
 * DOMAIN LAYER - PURE TYPESCRIPT
 * ===============================
 * This file provides a comprehensive reference for all DDD-compliant types
 * following strict Identity vs Membership layer separation.
 * 
 * NO Angular, RxJS, or Firebase dependencies allowed.
 * Framework-agnostic, fully typed TypeScript only.
 * 
 * ARCHITECTURAL RULES:
 * ====================
 * 1. Identity Layer: 'user', 'organization', 'bot' - CAN authenticate, have credentials
 * 2. Membership Layer: 'team', 'partner' - Relationship constructs, CANNOT authenticate
 * 3. Workspace Ownership: ONLY 'user' or 'organization' can own workspaces
 * 4. No member lists in Workspace - membership managed externally via Organization/Team/Partner
 * 5. Discriminated unions enforce compile-time type safety
 * 6. Type guards provide runtime validation
 */

// ============================================================================
// IDENTITY LAYER - Authentication-capable accounts
// ============================================================================

/**
 * Identity Type
 * 
 * Identities are accounts that can authenticate and have credentials.
 * They represent the top-level account hierarchy.
 * 
 * - 'user': Personal user account (CAN own workspaces)
 * - 'organization': Organizational account (CAN own workspaces)
 * - 'bot': Service account (CANNOT own workspaces, but is an identity)
 */
export type IdentityType = 'user' | 'organization' | 'bot';

/**
 * User Identity
 * 
 * Represents a personal user account.
 * - Can authenticate with email/password or OAuth providers
 * - Can own workspaces independently
 * - Can be a member of organizations, teams, and partner relationships
 */
export interface UserIdentity {
  readonly id: string;
  readonly type: 'user'; // Literal type for discriminated union
  
  // Authentication
  email: string;
  emailVerified: boolean;
  
  // Profile information
  displayName: string;
  firstName?: string;
  lastName?: string;
  photoURL?: string;
  bio?: string;
  
  // Contact
  phoneNumber?: string;
  
  // Preferences
  locale?: string;
  timezone?: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  
  // Status
  active: boolean;
}

/**
 * Organization Identity
 * 
 * Represents an organizational account.
 * - Can authenticate as a service
 * - Can own workspaces
 * - Has members (User IDs only, NOT nested User objects)
 * - Can create teams (internal units) and partners (external collaborators)
 */
export interface OrganizationIdentity {
  readonly id: string;
  readonly type: 'organization'; // Literal type for discriminated union
  
  // Basic information
  name: string; // Unique identifier (lowercase, no spaces)
  displayName: string; // User-friendly name
  description?: string;
  
  // Contact
  email?: string;
  website?: string;
  logoURL?: string;
  
  // Organization details
  industry?: string;
  size?: 'small' | 'medium' | 'large' | 'enterprise';
  
  // Member management
  // IMPORTANT: Store ONLY member IDs, never full User objects
  memberIds: string[]; // Array of User IDs who are members
  ownerIds: string[]; // Array of User IDs who are owners
  
  // Sub-resource references
  teamIds: string[]; // References to Team entities (membership layer)
  partnerIds: string[]; // References to Partner entities (membership layer)
  
  // Workspace ownership
  workspaceIds: string[]; // Workspaces owned by this organization
  
  // Settings
  settings: {
    allowPublicWorkspaces: boolean;
    requireMFA: boolean;
    allowExternalPartners: boolean;
    maxMembers?: number;
    maxWorkspaces?: number;
  };
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // User ID who created the organization
  
  // Status
  active: boolean;
  suspended: boolean;
}

/**
 * Bot Identity
 * 
 * Represents a service account for automated operations.
 * - Can authenticate via API key
 * - Has scoped permissions
 * - CANNOT own workspaces (this is the key distinction from User/Org)
 * - Can access workspaces with specific permissions
 * - Has rate limiting
 */
export interface BotIdentity {
  readonly id: string;
  readonly type: 'bot'; // Literal type for discriminated union
  
  // Basic information
  name: string;
  displayName: string;
  description?: string;
  avatarURL?: string;
  
  // Ownership
  // Bot is CREATED BY a user or organization, but doesn't OWN workspaces
  createdBy: string; // User ID
  organizationId?: string; // Optional: organization that owns this bot
  
  // Credentials
  apiKey: string;
  apiSecret?: string;
  credentialsIssuedAt: Date;
  credentialsExpiresAt?: Date;
  
  // Permissions
  // Scoped permissions defining what the bot can do
  permissions: Array<
    | 'read:workspace'
    | 'write:workspace'
    | 'read:task'
    | 'write:task'
    | 'read:document'
    | 'write:document'
    | 'execute:workflow'
    | 'manage:integrations'
  >;
  
  // Workspace access
  // IMPORTANT: Bot can ACCESS workspaces but cannot OWN them
  workspaceIds: string[]; // Workspaces this bot has access to
  
  // Rate limiting
  rateLimitTier: 'free' | 'basic' | 'premium' | 'unlimited';
  requestsThisHour: number;
  requestsToday: number;
  totalRequests: number;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  lastUsedAt?: Date;
  
  // Status
  status: 'active' | 'suspended' | 'revoked';
}

/**
 * Identity Union
 * 
 * Discriminated union of all identity types.
 * TypeScript will enforce type safety based on the 'type' field.
 */
export type Identity = UserIdentity | OrganizationIdentity | BotIdentity;

// ============================================================================
// MEMBERSHIP LAYER - Relationship constructs
// ============================================================================

/**
 * Membership Type
 * 
 * Memberships are relationship constructs that belong to organizations.
 * They CANNOT authenticate independently and CANNOT own workspaces.
 * 
 * - 'team': Internal organizational unit with members
 * - 'partner': External collaborator with members
 */
export type MembershipType = 'team' | 'partner';

/**
 * Team Membership
 * 
 * Represents an internal organizational unit.
 * - MUST belong to an organization (organizationId is required)
 * - Has members (User IDs who are part of the team)
 * - Can access workspaces (but cannot own them)
 * - CANNOT authenticate independently
 */
export interface TeamMembership {
  readonly id: string;
  readonly type: 'team'; // Literal type for discriminated union
  
  // Team MUST belong to an organization
  organizationId: string; // REQUIRED - team is sub-resource of organization
  
  // Basic information
  name: string;
  displayName: string;
  description?: string;
  
  // Visual identity
  color?: string;
  iconURL?: string;
  
  // Member management
  // IMPORTANT: Store ONLY member IDs, never full User objects
  memberIds: string[]; // Array of User IDs who are team members
  leadIds: string[]; // Array of User IDs who are team leads
  
  // Workspace access
  // IMPORTANT: Teams can ACCESS workspaces but cannot OWN them
  workspaceAccessIds: string[]; // Workspaces this team has access to
  
  // Permissions per workspace
  workspacePermissions: Array<{
    workspaceId: string;
    canRead: boolean;
    canWrite: boolean;
    canDelete: boolean;
    canManageMembers: boolean;
    grantedAt: Date;
    grantedBy: string; // User ID
  }>;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // User ID who created the team
  
  // Status
  active: boolean;
}

/**
 * Partner Membership
 * 
 * Represents an external collaborator relationship.
 * - MUST belong to an organization (organizationId is required)
 * - Has members (User IDs representing external collaborators)
 * - Can access workspaces (but cannot own them)
 * - CANNOT authenticate independently
 * - May have contract/partnership terms
 */
export interface PartnerMembership {
  readonly id: string;
  readonly type: 'partner'; // Literal type for discriminated union
  
  // Partner MUST collaborate with an organization
  organizationId: string; // REQUIRED - partner is sub-resource of organization
  
  // Basic information
  name: string;
  displayName: string;
  description?: string;
  
  // Partner company details
  companyName: string;
  contactPerson?: string;
  email?: string;
  logoURL?: string;
  
  // Partnership details
  partnershipType: 'vendor' | 'client' | 'contractor' | 'collaborator';
  
  // Contract (optional)
  contract?: {
    startDate: Date;
    endDate?: Date;
    autoRenew: boolean;
    terms?: string;
  };
  
  // Member management
  // IMPORTANT: Store ONLY member IDs, never full User objects
  memberIds: string[]; // Array of User IDs representing partner members
  
  // Workspace access
  // IMPORTANT: Partners can ACCESS workspaces but cannot OWN them
  workspaceAccessIds: string[]; // Workspaces this partner has access to
  
  // Permissions per workspace
  workspaceAccess: Array<{
    workspaceId: string;
    accessLevel: 'read' | 'write' | 'admin';
    canRead: boolean;
    canWrite: boolean;
    canDelete: boolean;
    grantedAt: Date;
    grantedBy: string; // User ID
    expiresAt?: Date; // Access can expire
  }>;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // User ID who created the partnership
  
  // Status
  active: boolean;
  suspended: boolean;
}

/**
 * Membership Union
 * 
 * Discriminated union of all membership types.
 * TypeScript will enforce type safety based on the 'type' field.
 */
export type Membership = TeamMembership | PartnerMembership;

// ============================================================================
// ACCOUNT TYPE - UI compatibility layer
// ============================================================================

/**
 * Account Type
 * 
 * Combined type for UI account switching and display purposes.
 * This is a union of IdentityType and MembershipType.
 * 
 * USE THIS FOR:
 * - Account switcher UI (showing all 5 account types)
 * - Display logic that needs to handle all account types
 * 
 * DO NOT USE THIS FOR:
 * - Workspace ownership (use WorkspaceOwnerType instead)
 * - Authentication logic (use IdentityType instead)
 */
export type AccountType = IdentityType | MembershipType;
// Expands to: 'user' | 'organization' | 'bot' | 'team' | 'partner'

/**
 * Account Union
 * 
 * Combined union of all identity and membership types.
 * Used for UI components that display all account types.
 */
export type Account = Identity | Membership;

// ============================================================================
// WORKSPACE OWNERSHIP - Type-safe ownership model
// ============================================================================

/**
 * Workspace Owner Type
 * 
 * CRITICAL: Only 'user' and 'organization' can own workspaces.
 * Bot, Team, and Partner CANNOT own workspaces.
 * 
 * This is enforced at the type level via discriminated unions.
 */
export type WorkspaceOwnerType = 'user' | 'organization';

/**
 * User-Owned Workspace Ownership
 * 
 * Workspace owned by a personal user account.
 * - ownerType is 'user' (literal)
 * - ownerId points to a User ID
 * - NO organizationId (user-owned workspaces are independent)
 */
export interface UserOwnedWorkspace {
  ownerType: 'user'; // Literal type for discriminated union
  ownerId: string; // User ID
  // Note: No organizationId for user-owned workspaces
}

/**
 * Organization-Owned Workspace Ownership
 * 
 * Workspace owned by an organizational account.
 * - ownerType is 'organization' (literal)
 * - ownerId points to an Organization ID
 * - organizationId is the same as ownerId (for convenience)
 */
export interface OrganizationOwnedWorkspace {
  ownerType: 'organization'; // Literal type for discriminated union
  ownerId: string; // Organization ID
  organizationId: string; // Same as ownerId, for convenience
}

/**
 * Workspace Ownership
 * 
 * Discriminated union enforcing type-safe workspace ownership.
 * 
 * TypeScript will ensure:
 * - If ownerType is 'user', only ownerId is present (no organizationId)
 * - If ownerType is 'organization', both ownerId and organizationId are present
 * - It is IMPOSSIBLE to set ownerType to 'bot', 'team', or 'partner'
 * 
 * This provides compile-time safety preventing bot/team/partner workspace ownership.
 */
export type WorkspaceOwnership = UserOwnedWorkspace | OrganizationOwnedWorkspace;

/**
 * Workspace Entity
 * 
 * Represents a logical container for organizing work.
 * - Can ONLY be owned by User or Organization (enforced by WorkspaceOwnership type)
 * - Does NOT store member lists (members managed via Organization/Team/Partner)
 * - Contains modules as functional units
 */
export interface Workspace extends WorkspaceOwnership {
  readonly id: string;
  
  // Basic information
  name: string; // Unique identifier (lowercase, no spaces)
  displayName: string; // User-friendly name
  description?: string;
  
  // Visual identity
  iconURL?: string;
  coverImageURL?: string;
  color?: string;
  
  // Modules
  // IMPORTANT: Workspace contains MODULES, NOT members
  moduleFlags: {
    tasks: boolean;
    documents: boolean;
    calendar: boolean;
    discussions: boolean;
    analytics: boolean;
    integrations: boolean;
  };
  
  moduleCounts: {
    tasks: number;
    documents: number;
    events: number;
    discussions: number;
  };
  
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
// TYPE GUARDS - Runtime type validation
// ============================================================================

/**
 * Type guard: Check if account type is an identity
 * 
 * Identities can authenticate and have credentials.
 * Returns true for: 'user', 'organization', 'bot'
 * Returns false for: 'team', 'partner'
 */
export function isIdentityType(type: AccountType): type is IdentityType {
  return type === 'user' || type === 'organization' || type === 'bot';
}

/**
 * Type guard: Check if account type is a membership
 * 
 * Memberships are relationship constructs belonging to organizations.
 * Returns true for: 'team', 'partner'
 * Returns false for: 'user', 'organization', 'bot'
 */
export function isMembershipType(type: AccountType): type is MembershipType {
  return type === 'team' || type === 'partner';
}

/**
 * Type guard: Check if account type can own workspaces
 * 
 * Only User and Organization can own workspaces.
 * Returns true for: 'user', 'organization'
 * Returns false for: 'bot', 'team', 'partner'
 */
export function canOwnWorkspace(type: AccountType): type is WorkspaceOwnerType {
  return type === 'user' || type === 'organization';
}

/**
 * Type guard: Check if account is a user identity
 */
export function isUserIdentity(account: Account): account is UserIdentity {
  return account.type === 'user';
}

/**
 * Type guard: Check if account is an organization identity
 */
export function isOrganizationIdentity(account: Account): account is OrganizationIdentity {
  return account.type === 'organization';
}

/**
 * Type guard: Check if account is a bot identity
 */
export function isBotIdentity(account: Account): account is BotIdentity {
  return account.type === 'bot';
}

/**
 * Type guard: Check if account is a team membership
 */
export function isTeamMembership(account: Account): account is TeamMembership {
  return account.type === 'team';
}

/**
 * Type guard: Check if account is a partner membership
 */
export function isPartnerMembership(account: Account): account is PartnerMembership {
  return account.type === 'partner';
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
 * Type guard: Check if account has members
 * 
 * Organization, Team, and Partner have member lists.
 * User and Bot do not.
 */
export function hasMemberList(account: Account): account is OrganizationIdentity | TeamMembership | PartnerMembership {
  return account.type === 'organization' || account.type === 'team' || account.type === 'partner';
}

/**
 * Type guard: Check if account belongs to an organization
 * 
 * Team and Partner are sub-resources of organizations.
 * User, Organization, and Bot are top-level identities.
 */
export function belongsToOrganization(account: Account): account is TeamMembership | PartnerMembership {
  return account.type === 'team' || account.type === 'partner';
}

// ============================================================================
// VALIDATION HELPERS - Business rule enforcement
// ============================================================================

/**
 * Validation Helpers
 * 
 * Enforce business rules at runtime.
 */
export const ValidationHelpers = {
  /**
   * Validate workspace creation request
   * 
   * Ensures only User or Organization accounts can create workspaces.
   * Throws error if Bot, Team, or Partner attempts workspace creation.
   */
  validateWorkspaceCreation(accountType: AccountType): void {
    if (!canOwnWorkspace(accountType)) {
      throw new Error(
        `Workspace creation denied: Only 'user' and 'organization' accounts can create workspaces. ` +
        `Account type '${accountType}' is not allowed to own workspaces.`
      );
    }
  },
  
  /**
   * Validate workspace ownership
   * 
   * Ensures workspace ownerType is valid ('user' or 'organization').
   */
  validateWorkspaceOwnership(ownerType: string): ownerType is WorkspaceOwnerType {
    return ownerType === 'user' || ownerType === 'organization';
  },
  
  /**
   * Validate team/partner organization association
   * 
   * Ensures team and partner memberships have a valid organizationId.
   */
  validateMembershipOrganization(membership: Membership): void {
    if (!membership.organizationId) {
      throw new Error(
        `${membership.type} membership must have an organizationId. ` +
        `Memberships are sub-resources of organizations.`
      );
    }
  },
  
  /**
   * Validate account hierarchy
   * 
   * Ensures account type is valid and follows hierarchy rules.
   */
  validateAccountHierarchy(account: Account): void {
    // Validate that memberships belong to organizations
    if (belongsToOrganization(account)) {
      ValidationHelpers.validateMembershipOrganization(account);
    }
    
    // Validate that bot cannot own workspaces (this is type-safe, but good for runtime checks)
    if (account.type === 'bot') {
      // Bots should not have workspaceIds as owners, only as accessors
      // This is enforced by the WorkspaceOwnership type, but we can add runtime checks
    }
  }
};

// ============================================================================
// USAGE EXAMPLES - Demonstrating type safety
// ============================================================================

/**
 * Example: Creating a user-owned workspace (compile-time safe)
 */
export function createUserWorkspaceExample(userId: string): Workspace {
  const workspace: Workspace = {
    id: 'workspace-1',
    ownerType: 'user', // TypeScript ensures this is 'user' | 'organization'
    ownerId: userId,
    // organizationId is not allowed for user-owned workspaces
    name: 'my-workspace',
    displayName: 'My Workspace',
    moduleFlags: {
      tasks: true,
      documents: true,
      calendar: false,
      discussions: false,
      analytics: false,
      integrations: false
    },
    moduleCounts: {
      tasks: 0,
      documents: 0,
      events: 0,
      discussions: 0
    },
    visibility: 'private',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: userId
  };
  
  return workspace;
}

/**
 * Example: Creating an organization-owned workspace (compile-time safe)
 */
export function createOrgWorkspaceExample(orgId: string, createdBy: string): Workspace {
  const workspace: Workspace = {
    id: 'workspace-2',
    ownerType: 'organization', // TypeScript ensures this is 'user' | 'organization'
    ownerId: orgId,
    organizationId: orgId, // Required for org-owned workspaces
    name: 'org-workspace',
    displayName: 'Organization Workspace',
    moduleFlags: {
      tasks: true,
      documents: true,
      calendar: true,
      discussions: true,
      analytics: true,
      integrations: true
    },
    moduleCounts: {
      tasks: 0,
      documents: 0,
      events: 0,
      discussions: 0
    },
    visibility: 'internal',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy
  };
  
  return workspace;
}

/**
 * Example: Attempting to create a bot-owned workspace (compile-time error)
 * 
 * This will NOT compile because WorkspaceOwnership does not allow 'bot' as ownerType.
 * 
 * Uncomment to see the TypeScript error:
 * 
 * const invalidWorkspace: Workspace = {
 *   ownerType: 'bot', // ❌ TypeScript error: Type '"bot"' is not assignable to type '"user" | "organization"'
 *   ownerId: 'bot-1',
 *   // ... rest of workspace fields
 * };
 */

/**
 * Example: Runtime validation for workspace creation
 */
export function validateWorkspaceCreationExample(accountType: AccountType): boolean {
  try {
    ValidationHelpers.validateWorkspaceCreation(accountType);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

/**
 * Example: Type guard usage
 */
export function demonstrateTypeGuards(account: Account): void {
  // Check if account is an identity
  if (isIdentityType(account.type)) {
    console.log(`${account.type} is an identity type`);
    
    // Further narrow down
    if (isUserIdentity(account)) {
      console.log(`User email: ${account.email}`);
    } else if (isOrganizationIdentity(account)) {
      console.log(`Organization has ${account.memberIds.length} members`);
    } else if (isBotIdentity(account)) {
      console.log(`Bot has ${account.permissions.length} permissions`);
    }
  }
  
  // Check if account is a membership
  if (isMembershipType(account.type)) {
    console.log(`${account.type} is a membership type`);
    
    // Further narrow down
    if (isTeamMembership(account)) {
      console.log(`Team belongs to org: ${account.organizationId}`);
    } else if (isPartnerMembership(account)) {
      console.log(`Partner company: ${account.companyName}`);
    }
  }
  
  // Check workspace ownership capability
  if (canOwnWorkspace(account.type)) {
    console.log(`${account.type} can own workspaces`);
  } else {
    console.log(`${account.type} CANNOT own workspaces`);
  }
}

// ============================================================================
// EXPORT SUMMARY
// ============================================================================

/**
 * This module exports:
 * 
 * TYPES:
 * - IdentityType: 'user' | 'organization' | 'bot'
 * - MembershipType: 'team' | 'partner'
 * - AccountType: IdentityType | MembershipType
 * - WorkspaceOwnerType: 'user' | 'organization'
 * 
 * INTERFACES:
 * - UserIdentity
 * - OrganizationIdentity
 * - BotIdentity
 * - TeamMembership
 * - PartnerMembership
 * - UserOwnedWorkspace
 * - OrganizationOwnedWorkspace
 * - Workspace
 * 
 * UNIONS:
 * - Identity: UserIdentity | OrganizationIdentity | BotIdentity
 * - Membership: TeamMembership | PartnerMembership
 * - Account: Identity | Membership
 * - WorkspaceOwnership: UserOwnedWorkspace | OrganizationOwnedWorkspace
 * 
 * TYPE GUARDS:
 * - isIdentityType()
 * - isMembershipType()
 * - canOwnWorkspace()
 * - isUserIdentity()
 * - isOrganizationIdentity()
 * - isBotIdentity()
 * - isTeamMembership()
 * - isPartnerMembership()
 * - isUserOwnedWorkspace()
 * - isOrganizationOwnedWorkspace()
 * - hasMemberList()
 * - belongsToOrganization()
 * 
 * HELPERS:
 * - ValidationHelpers
 * 
 * EXAMPLES:
 * - createUserWorkspaceExample()
 * - createOrgWorkspaceExample()
 * - validateWorkspaceCreationExample()
 * - demonstrateTypeGuards()
 */
