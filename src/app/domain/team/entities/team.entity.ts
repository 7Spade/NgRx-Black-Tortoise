/**
 * Team Entity
 * 
 * DOMAIN LAYER - PURE TYPESCRIPT
 * ===============================
 * NO Angular, RxJS, or Firebase dependencies allowed.
 * 
 * Team represents an internal organizational unit.
 * Teams:
 * - Belong to an organization
 * - Have members (Users from the organization)
 * - Can access workspaces
 * - CANNOT own workspaces (only User and Organization can own)
 */

/**
 * Team member role
 */
export enum TeamRole {
  LEAD = 'lead',
  MEMBER = 'member'
}

/**
 * Team member reference
 * Stores only the member ID and role, not the full User object
 */
export interface TeamMember {
  userId: string;
  role: TeamRole;
  joinedAt: Date;
  addedBy?: string;
}

/**
 * Team permissions for workspace access
 */
export interface TeamPermissions {
  workspaceId: string;
  canRead: boolean;
  canWrite: boolean;
  canDelete: boolean;
  canManageMembers: boolean;
  grantedAt: Date;
  grantedBy: string;
}

/**
 * Team Entity
 * Represents an internal organizational unit
 */
export interface Team {
  readonly id: string;
  
  // Team belongs to an organization
  organizationId: string;
  
  // Basic information
  name: string;
  displayName: string;
  description?: string;
  
  // Visual identity
  color?: string;
  iconURL?: string;
  
  // Member management
  // IMPORTANT: Only store member IDs, not full User objects
  members: TeamMember[];
  
  // Workspace access
  // IMPORTANT: Teams can ACCESS workspaces but cannot OWN them
  permissions: TeamPermissions[];
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // User ID who created the team
  
  // Status
  active: boolean;
}

/**
 * ⚠️ MEMBERSHIP LAYER (Relationship only, NON-identity)
 * =====================================================
 * Team is a membership grouping construct.
 * Team is NOT an identity type.
 * Team CANNOT authenticate.
 * Team CANNOT own workspaces.
 * 
 * Rule: If it only groups users → Membership.
 */

/**
 * Team creation data
 * Used when creating a new team
 */
export type CreateTeamData = Omit<
  Team,
  'id' | 'members' | 'permissions' | 'createdAt' | 'updatedAt'
> & {
  members?: TeamMember[];
  permissions?: TeamPermissions[];
};

/**
 * Team update data
 * Partial update of team fields
 */
export type UpdateTeamData = Partial<Omit<
  Team,
  'id' | 'organizationId' | 'createdAt' | 'createdBy'
>>;

/**
 * Helper functions for team member management
 */
export const TeamHelpers = {
  /**
   * Check if a user is a member of the team
   */
  isMember(team: Team, userId: string): boolean {
    return team.members.some(m => m.userId === userId);
  },
  
  /**
   * Check if a user is a lead of the team
   */
  isLead(team: Team, userId: string): boolean {
    return team.members.some(
      m => m.userId === userId && m.role === TeamRole.LEAD
    );
  },
  
  /**
   * Get user's role in the team
   */
  getMemberRole(team: Team, userId: string): TeamRole | null {
    const member = team.members.find(m => m.userId === userId);
    return member?.role ?? null;
  },
  
  /**
   * Check if team has access to a workspace
   */
  hasWorkspaceAccess(team: Team, workspaceId: string): boolean {
    return team.permissions.some(p => p.workspaceId === workspaceId);
  },
  
  /**
   * Get team's permissions for a workspace
   */
  getWorkspacePermissions(team: Team, workspaceId: string): TeamPermissions | null {
    return team.permissions.find(p => p.workspaceId === workspaceId) ?? null;
  },
  
  /**
   * Check if team can write to a workspace
   */
  canWriteToWorkspace(team: Team, workspaceId: string): boolean {
    const perms = TeamHelpers.getWorkspacePermissions(team, workspaceId);
    return perms?.canWrite ?? false;
  },
  
  /**
   * Check if team can manage members of a workspace
   */
  canManageWorkspaceMembers(team: Team, workspaceId: string): boolean {
    const perms = TeamHelpers.getWorkspacePermissions(team, workspaceId);
    return perms?.canManageMembers ?? false;
  },
  
  /**
   * Get all workspace IDs the team has access to
   */
  getAccessibleWorkspaceIds(team: Team): string[] {
    return team.permissions.map(p => p.workspaceId);
  },
  
  /**
   * Get count of team members
   */
  getMemberCount(team: Team): number {
    return team.members.length;
  },
  
  /**
   * Get count of team leads
   */
  getLeadCount(team: Team): number {
    return team.members.filter(m => m.role === TeamRole.LEAD).length;
  }
};
