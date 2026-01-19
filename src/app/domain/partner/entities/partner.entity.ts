/**
 * Partner Entity
 * 
 * DOMAIN LAYER - PURE TYPESCRIPT
 * ===============================
 * NO Angular, RxJS, or Firebase dependencies allowed.
 * 
 * Partner represents an external organizational unit.
 * Partners:
 * - Collaborate with an organization
 * - Have members (Users external to the organization)
 * - Can access workspaces
 * - CANNOT own workspaces (only User and Organization can own)
 */

/**
 * Partner access level
 */
export enum PartnerAccessLevel {
  READ = 'read',
  WRITE = 'write',
  ADMIN = 'admin'
}

/**
 * Partner membership type
 */
export enum PartnershipType {
  VENDOR = 'vendor',
  CLIENT = 'client',
  CONTRACTOR = 'contractor',
  COLLABORATOR = 'collaborator'
}

/**
 * Partner member reference
 * Stores only the member ID, not the full User object
 */
export interface PartnerMember {
  userId: string;
  role: 'contact' | 'member';
  joinedAt: Date;
  addedBy?: string;
}

/**
 * Partner workspace access permissions
 */
export interface PartnerAccess {
  workspaceId: string;
  accessLevel: PartnerAccessLevel;
  canRead: boolean;
  canWrite: boolean;
  canDelete: boolean;
  grantedAt: Date;
  grantedBy: string;
  expiresAt?: Date;
}

/**
 * Partner contract information
 */
export interface PartnerContract {
  startDate: Date;
  endDate?: Date;
  renewalDate?: Date;
  autoRenew: boolean;
  terms?: string;
}

/**
 * Partner Entity
 * Represents an external organizational unit collaborating with an organization
 */
export interface Partner {
  readonly id: string;
  
  // Partner collaborates with an organization
  organizationId: string;
  
  // Basic information
  name: string;
  displayName: string;
  description?: string;
  
  // Partner company details
  companyName: string;
  contactPerson?: string;
  email?: string;
  phoneNumber?: string;
  
  // Visual identity
  logoURL?: string;
  
  // Partnership details
  partnershipType: PartnershipType;
  contract?: PartnerContract;
  
  // Member management
  // IMPORTANT: Only store member IDs, not full User objects
  members: PartnerMember[];
  
  // Workspace access
  // IMPORTANT: Partners can ACCESS workspaces but cannot OWN them
  access: PartnerAccess[];
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // User ID who created the partnership
  
  // Status
  active: boolean;
  suspended: boolean;
  suspensionReason?: string;
}

/**
 * Partner creation data
 * Used when creating a new partner relationship
 */
export type CreatePartnerData = Omit<
  Partner,
  'id' | 'members' | 'access' | 'createdAt' | 'updatedAt' | 'suspended'
> & {
  members?: PartnerMember[];
  access?: PartnerAccess[];
};

/**
 * Partner update data
 * Partial update of partner fields
 */
export type UpdatePartnerData = Partial<Omit<
  Partner,
  'id' | 'organizationId' | 'createdAt' | 'createdBy'
>>;

/**
 * Helper functions for partner management
 */
export const PartnerHelpers = {
  /**
   * Check if a user is a member of the partner organization
   */
  isMember(partner: Partner, userId: string): boolean {
    return partner.members.some(m => m.userId === userId);
  },
  
  /**
   * Check if a user is the contact person
   */
  isContact(partner: Partner, userId: string): boolean {
    return partner.members.some(
      m => m.userId === userId && m.role === 'contact'
    );
  },
  
  /**
   * Get user's role in the partner organization
   */
  getMemberRole(partner: Partner, userId: string): 'contact' | 'member' | null {
    const member = partner.members.find(m => m.userId === userId);
    return member?.role ?? null;
  },
  
  /**
   * Check if partner has access to a workspace
   */
  hasWorkspaceAccess(partner: Partner, workspaceId: string): boolean {
    const access = partner.access.find(a => a.workspaceId === workspaceId);
    if (!access) return false;
    
    // Check if access has expired
    if (access.expiresAt && access.expiresAt < new Date()) {
      return false;
    }
    
    return true;
  },
  
  /**
   * Get partner's access permissions for a workspace
   */
  getWorkspaceAccess(partner: Partner, workspaceId: string): PartnerAccess | null {
    const access = partner.access.find(a => a.workspaceId === workspaceId);
    
    // Check if access exists and hasn't expired
    if (access && (!access.expiresAt || access.expiresAt >= new Date())) {
      return access;
    }
    
    return null;
  },
  
  /**
   * Check if partner can write to a workspace
   */
  canWriteToWorkspace(partner: Partner, workspaceId: string): boolean {
    const access = PartnerHelpers.getWorkspaceAccess(partner, workspaceId);
    return access?.canWrite ?? false;
  },
  
  /**
   * Check if partner can delete from a workspace
   */
  canDeleteFromWorkspace(partner: Partner, workspaceId: string): boolean {
    const access = PartnerHelpers.getWorkspaceAccess(partner, workspaceId);
    return access?.canDelete ?? false;
  },
  
  /**
   * Get all workspace IDs the partner has access to
   */
  getAccessibleWorkspaceIds(partner: Partner): string[] {
    const now = new Date();
    return partner.access
      .filter(a => !a.expiresAt || a.expiresAt >= now)
      .map(a => a.workspaceId);
  },
  
  /**
   * Check if contract is active
   */
  hasActiveContract(partner: Partner): boolean {
    if (!partner.contract) return false;
    
    const now = new Date();
    const isStarted = partner.contract.startDate <= now;
    const isNotExpired = !partner.contract.endDate || partner.contract.endDate >= now;
    
    return isStarted && isNotExpired;
  },
  
  /**
   * Check if contract is expiring soon (within 30 days)
   */
  isContractExpiringSoon(partner: Partner): boolean {
    if (!partner.contract?.endDate) return false;
    
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    return partner.contract.endDate >= now && partner.contract.endDate <= thirtyDaysFromNow;
  },
  
  /**
   * Get member count
   */
  getMemberCount(partner: Partner): number {
    return partner.members.length;
  },
  
  /**
   * Get count of workspaces with access
   */
  getWorkspaceAccessCount(partner: Partner): number {
    return PartnerHelpers.getAccessibleWorkspaceIds(partner).length;
  }
};
