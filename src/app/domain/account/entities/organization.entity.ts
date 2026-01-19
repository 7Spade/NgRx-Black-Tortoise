/**
 * Organization Entity
 * 
 * DOMAIN LAYER - PURE TYPESCRIPT
 * ===============================
 * NO Angular, RxJS, or Firebase dependencies allowed.
 * 
 * Organization represents a company or organizational entity.
 * Organizations can:
 * - Own workspaces
 * - Have members (Users)
 * - Create teams
 * - Collaborate with partners
 */

/**
 * Organization member role
 */
export enum OrganizationRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member',
  GUEST = 'guest'
}

/**
 * Organization member reference
 * Stores only the member ID and role, not the full User object
 */
export interface OrganizationMember {
  userId: string;
  role: OrganizationRole;
  joinedAt: Date;
  invitedBy?: string;
}

/**
 * Organization settings
 */
export interface OrganizationSettings {
  // Workspace settings
  allowPublicWorkspaces: boolean;
  defaultWorkspaceVisibility: 'private' | 'internal' | 'public';
  
  // Security settings
  requireMFA: boolean;
  allowedEmailDomains?: string[];
  
  // Collaboration settings
  allowExternalPartners: boolean;
  maxTeamCount?: number;
  maxPartnerCount?: number;
  
  // Billing settings
  planType: 'free' | 'team' | 'business' | 'enterprise';
  maxMembers?: number;
  maxWorkspaces?: number;
}

/**
 * Organization Entity
 * This is the primary organizational identity type
 */
export interface Organization {
  readonly id: string;
  
  // Basic information
  name: string;
  displayName: string;
  description?: string;
  
  // Contact information
  email?: string;
  website?: string;
  logoURL?: string;
  
  // Organization details
  industry?: string;
  size?: 'small' | 'medium' | 'large' | 'enterprise';
  location?: {
    country?: string;
    city?: string;
    address?: string;
  };
  
  // Member management
  // IMPORTANT: Only store member IDs and roles, not full User objects
  // Consistent with Team and Partner entity patterns
  members: OrganizationMember[];
  
  // Teams (internal organizational units)
  teamIds: string[]; // References to Team entities
  
  // Partners (external collaborators)
  partnerIds: string[]; // References to Partner entities
  
  // Workspace references
  workspaceIds: string[]; // Workspaces owned by this organization
  
  // Settings
  settings: OrganizationSettings;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // User ID who created the organization
  
  // Status
  active: boolean;
  suspended: boolean;
  suspensionReason?: string;
}

/**
 * Organization Identity
 * Minimal organization representation for account switcher UI
 * Extends Organization with type discriminator
 */
export interface OrganizationIdentity extends Organization {
  readonly type: 'organization';
}

/**
 * Organization creation data
 * Used when creating a new organization
 */
export type CreateOrganizationData = Omit<
  Organization,
  'id' | 'members' | 'teamIds' | 'partnerIds' | 'workspaceIds' | 'createdAt' | 'updatedAt' | 'suspended'
> & {
  members?: OrganizationMember[];
};

/**
 * Organization update data
 * Partial update of organization fields
 */
export type UpdateOrganizationData = Partial<Omit<
  Organization,
  'id' | 'createdAt' | 'createdBy'
>>;

/**
 * Helper functions for organization member management
 */
export const OrganizationHelpers = {
  /**
   * Check if a user is a member of the organization
   */
  isMember(org: Organization, userId: string): boolean {
    return org.members.some(m => m.userId === userId);
  },
  
  /**
   * Get user's role in the organization
   */
  getMemberRole(org: Organization, userId: string): OrganizationRole | null {
    const member = org.members.find(m => m.userId === userId);
    return member?.role ?? null;
  },
  
  /**
   * Check if user is an owner
   */
  isOwner(org: Organization, userId: string): boolean {
    const member = org.members.find(m => m.userId === userId);
    return member?.role === OrganizationRole.OWNER;
  },
  
  /**
   * Check if user is an admin or owner
   */
  isAdminOrOwner(org: Organization, userId: string): boolean {
    const member = org.members.find(m => m.userId === userId);
    return member?.role === OrganizationRole.OWNER || member?.role === OrganizationRole.ADMIN;
  },
  
  /**
   * Get member count
   */
  getMemberCount(org: Organization): number {
    return org.members.length;
  },
  
  /**
   * Check if organization can add more members
   */
  canAddMembers(org: Organization): boolean {
    if (!org.settings.maxMembers) return true;
    return org.members.length < org.settings.maxMembers;
  },
  
  /**
   * Check if organization can create more teams
   */
  canCreateTeam(org: Organization): boolean {
    if (!org.settings.maxTeamCount) return true;
    return org.teamIds.length < org.settings.maxTeamCount;
  },
  
  /**
   * Check if organization can add more partners
   */
  canAddPartner(org: Organization): boolean {
    if (!org.settings.allowExternalPartners) return false;
    if (!org.settings.maxPartnerCount) return true;
    return org.partnerIds.length < org.settings.maxPartnerCount;
  }
};
