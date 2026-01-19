/**
 * Account Entity
 * 
 * DOMAIN LAYER - PURE TYPESCRIPT
 * ===============================
 * NO Angular, RxJS, or Firebase dependencies allowed.
 * 
 * Account represents the base identity in the system.
 * It serves as a discriminated union for all identity types.
 * 
 * Identity Types:
 * - User: Personal user account (can own workspaces)
 * - Organization: Organizational account (can own workspaces)
 * - Bot: Service account (cannot own workspaces)
 * - Team: Internal organizational unit (cannot own workspaces, has members)
 * - Partner: External organizational unit (cannot own workspaces, has members)
 */

/**
 * Account type discriminator
 * Used for UI display and account switching
 */
export type AccountType = 'user' | 'organization' | 'bot' | 'team' | 'partner';

/**
 * Identity types - accounts that can authenticate
 * User and Organization can own workspaces
 * Bot is an identity but cannot own workspaces
 */
export type IdentityType = 'user' | 'organization' | 'bot';

/**
 * Membership types - relationship constructs that belong to organizations
 * Cannot own workspaces, must have organizationId
 */
export type MembershipType = 'team' | 'partner';

/**
 * Base Account interface
 * All account types extend this base structure
 */
export interface BaseAccount {
  readonly id: string;
  readonly type: AccountType;
  
  // Display information
  displayName: string;
  email?: string;
  photoURL?: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  
  // Status
  active: boolean;
}

/**
 * User Account (Personal Identity)
 * Can own workspaces
 */
export interface UserAccount extends BaseAccount {
  type: 'user';
  
  // User-specific fields
  firstName?: string;
  lastName?: string;
  bio?: string;
  phoneNumber?: string;
  
  // Preferences
  locale?: string;
  timezone?: string;
}

/**
 * Organization Account (Organizational Identity)
 * Can own workspaces
 * Has members (referenced by ID)
 */
export interface OrganizationAccount extends BaseAccount {
  type: 'organization';
  
  // Organization-specific fields
  description?: string;
  industry?: string;
  size?: 'small' | 'medium' | 'large' | 'enterprise';
  website?: string;
  
  // Member management (IDs only, no nested objects)
  memberIds: string[];
  ownerIds: string[]; // Organization owners (User IDs)
  
  // Settings
  settings?: {
    allowPublicWorkspaces?: boolean;
    requireMFA?: boolean;
  };
}

/**
 * Bot Account (Service Identity)
 * Cannot own workspaces
 */
export interface BotAccount extends BaseAccount {
  type: 'bot';
  
  // Bot-specific fields
  apiKey?: string;
  permissions: string[];
  createdBy: string; // User ID who created the bot
  
  // Rate limiting
  rateLimitTier?: 'free' | 'basic' | 'premium';
}

/**
 * Team Account (Internal Organizational Unit)
 * Cannot own workspaces - Teams belong to Organizations
 * Has members (referenced by ID)
 */
export interface TeamAccount extends BaseAccount {
  type: 'team';
  
  // Team belongs to an organization
  organizationId: string;
  
  // Team-specific fields
  description?: string;
  color?: string;
  
  // Member management (IDs only, no nested objects)
  memberIds: string[];
  leadIds: string[]; // Team leads (User IDs)
  
  // Workspace access (referenced by ID)
  workspaceIds: string[]; // Workspaces this team has access to
}

/**
 * Partner Account (External Organizational Unit)
 * Cannot own workspaces - Partners collaborate with Organizations
 * Has members (referenced by ID)
 */
export interface PartnerAccount extends BaseAccount {
  type: 'partner';
  
  // Partner collaborates with an organization
  organizationId: string;
  
  // Partner-specific fields
  companyName: string;
  contactPerson?: string;
  partnershipType?: 'vendor' | 'client' | 'contractor' | 'collaborator';
  contractStartDate?: Date;
  contractEndDate?: Date;
  
  // Member management (IDs only, no nested objects)
  memberIds: string[];
  
  // Workspace access (referenced by ID)
  workspaceIds: string[]; // Workspaces this partner has access to
  
  // Access level
  accessLevel?: 'read' | 'write' | 'admin';
}

/**
 * Account discriminated union
 * TypeScript will enforce type safety based on the 'type' field
 */
export type Account = 
  | UserAccount 
  | OrganizationAccount 
  | BotAccount 
  | TeamAccount 
  | PartnerAccount;

/**
 * Type guards for runtime type checking
 */
export function isUserAccount(account: Account): account is UserAccount {
  return account.type === 'user';
}

export function isOrganizationAccount(account: Account): account is OrganizationAccount {
  return account.type === 'organization';
}

export function isBotAccount(account: Account): account is BotAccount {
  return account.type === 'bot';
}

export function isTeamAccount(account: Account): account is TeamAccount {
  return account.type === 'team';
}

export function isPartnerAccount(account: Account): account is PartnerAccount {
  return account.type === 'partner';
}

/**
 * Type guard for identity types
 * Identities can authenticate and have credentials
 */
export function isIdentityType(type: AccountType): type is IdentityType {
  return type === 'user' || type === 'organization' || type === 'bot';
}

/**
 * Type guard for membership types
 * Memberships are relationship constructs belonging to organizations
 */
export function isMembershipType(type: AccountType): type is MembershipType {
  return type === 'team' || type === 'partner';
}

/**
 * Type guard for accounts that can own workspaces
 * Only User and Organization accounts can own workspaces
 */
export function canOwnWorkspace(account: Account): account is UserAccount | OrganizationAccount {
  return account.type === 'user' || account.type === 'organization';
}

/**
 * Type guard for accounts that have members
 * Organization, Team, and Partner accounts have member lists
 */
export function hasMemberList(account: Account): account is OrganizationAccount | TeamAccount | PartnerAccount {
  return account.type === 'organization' || account.type === 'team' || account.type === 'partner';
}

/**
 * Type guard for accounts that belong to an organization
 * Team and Partner accounts belong to organizations
 */
export function belongsToOrganization(account: Account): account is TeamAccount | PartnerAccount {
  return account.type === 'team' || account.type === 'partner';
}
