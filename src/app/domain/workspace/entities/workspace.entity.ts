/**
 * Workspace Entity
 * 
 * DOMAIN LAYER - PURE TYPESCRIPT
 * ===============================
 * NO Angular, RxJS, or Firebase dependencies allowed.
 * 
 * Workspace represents a logical container for organizing work.
 * Workspaces:
 * - Can ONLY be owned by User or Organization (NOT Team/Partner/Bot)
 * - Use discriminated union for type-safe ownership
 * - Do NOT store member lists (managed via Organization/Team/Partner)
 * - Contain modules as functional units
 */

/**
 * Workspace ownership type
 * CRITICAL: Only 'user' and 'organization' are valid owner types
 */
export type WorkspaceOwnerType = 'user' | 'organization';

/**
 * Workspace visibility level
 */
export enum WorkspaceVisibility {
  PRIVATE = 'private',      // Only owner and explicitly granted members
  INTERNAL = 'internal',    // All organization members (if org-owned)
  PUBLIC = 'public'         // Anyone with the link
}

/**
 * Workspace status
 */
export enum WorkspaceStatus {
  ACTIVE = 'active',
  ARCHIVED = 'archived',
  SUSPENDED = 'suspended'
}

/**
 * User-owned workspace
 * Owner is a personal user account
 */
export interface UserOwnedWorkspace {
  ownerType: 'user';
  ownerId: string; // User ID
  // No organizationId for user-owned workspaces
}

/**
 * Organization-owned workspace
 * Owner is an organizational account
 */
export interface OrgOwnedWorkspace {
  ownerType: 'organization';
  ownerId: string;        // Organization ID
  organizationId: string; // Same as ownerId (for convenience)
}

/**
 * Workspace ownership discriminated union
 * TypeScript enforces correct field access based on ownerType
 */
export type WorkspaceOwnership = UserOwnedWorkspace | OrgOwnedWorkspace;

/**
 * Module flags - which modules are enabled in this workspace
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
 * Module resource counts
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
 */
export interface Workspace extends WorkspaceOwnership {
  readonly id: string;
  
  // Basic information
  name: string;
  displayName: string;
  description?: string;
  
  // Visual identity
  iconURL?: string;
  coverImageURL?: string;
  color?: string;
  
  // Modules
  // IMPORTANT: Workspace contains modules, not members
  moduleFlags: ModuleFlags;
  moduleCounts: ModuleCounts;
  
  // Settings
  visibility: WorkspaceVisibility;
  status: WorkspaceStatus;
  
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

/**
 * Workspace creation data for User-owned workspace
 */
export type CreateUserWorkspaceData = Omit<
  Workspace & UserOwnedWorkspace,
  'id' | 'moduleCounts' | 'createdAt' | 'updatedAt' | 'status' | 'archivedAt' | 'archivedBy' | 'archiveReason'
> & {
  status?: WorkspaceStatus;
};

/**
 * Workspace creation data for Organization-owned workspace
 */
export type CreateOrgWorkspaceData = Omit<
  Workspace & OrgOwnedWorkspace,
  'id' | 'moduleCounts' | 'createdAt' | 'updatedAt' | 'status' | 'archivedAt' | 'archivedBy' | 'archiveReason'
> & {
  status?: WorkspaceStatus;
};

/**
 * Workspace creation data (discriminated union)
 */
export type CreateWorkspaceData = CreateUserWorkspaceData | CreateOrgWorkspaceData;

/**
 * Workspace update data
 * Partial update of workspace fields
 */
export type UpdateWorkspaceData = Partial<Omit<
  Workspace,
  'id' | 'ownerType' | 'ownerId' | 'organizationId' | 'createdAt' | 'createdBy'
>>;

/**
 * Type guards for workspace ownership
 */
export function isUserOwnedWorkspace(workspace: Workspace): workspace is Workspace & UserOwnedWorkspace {
  return workspace.ownerType === 'user';
}

export function isOrgOwnedWorkspace(workspace: Workspace): workspace is Workspace & OrgOwnedWorkspace {
  return workspace.ownerType === 'organization';
}

/**
 * Helper functions for workspace management
 */
export const WorkspaceHelpers = {
  /**
   * Check if workspace is owned by a specific user
   */
  isOwnedByUser(workspace: Workspace, userId: string): boolean {
    return isUserOwnedWorkspace(workspace) && workspace.ownerId === userId;
  },
  
  /**
   * Check if workspace is owned by a specific organization
   */
  isOwnedByOrganization(workspace: Workspace, organizationId: string): boolean {
    return isOrgOwnedWorkspace(workspace) && workspace.ownerId === organizationId;
  },
  
  /**
   * Get organization ID if workspace is org-owned, null otherwise
   */
  getOrganizationId(workspace: Workspace): string | null {
    return isOrgOwnedWorkspace(workspace) ? workspace.organizationId : null;
  },
  
  /**
   * Check if workspace is active
   */
  isActive(workspace: Workspace): boolean {
    return workspace.status === WorkspaceStatus.ACTIVE;
  },
  
  /**
   * Check if workspace is archived
   */
  isArchived(workspace: Workspace): boolean {
    return workspace.status === WorkspaceStatus.ARCHIVED;
  },
  
  /**
   * Check if workspace is suspended
   */
  isSuspended(workspace: Workspace): boolean {
    return workspace.status === WorkspaceStatus.SUSPENDED;
  },
  
  /**
   * Check if workspace is publicly accessible
   */
  isPublic(workspace: Workspace): boolean {
    return workspace.visibility === WorkspaceVisibility.PUBLIC;
  },
  
  /**
   * Check if module is enabled
   */
  isModuleEnabled(workspace: Workspace, module: keyof ModuleFlags): boolean {
    return workspace.moduleFlags[module];
  },
  
  /**
   * Get count of enabled modules
   */
  getEnabledModuleCount(workspace: Workspace): number {
    return Object.values(workspace.moduleFlags).filter(Boolean).length;
  },
  
  /**
   * Get total resource count across all modules
   */
  getTotalResourceCount(workspace: Workspace): number {
    return Object.values(workspace.moduleCounts).reduce((sum, count) => sum + count, 0);
  },
  
  /**
   * Create default module flags (all enabled)
   */
  getDefaultModuleFlags(): ModuleFlags {
    return {
      tasks: true,
      documents: true,
      calendar: true,
      discussions: true,
      analytics: true,
      integrations: false
    };
  },
  
  /**
   * Create initial module counts (all zero)
   */
  getInitialModuleCounts(): ModuleCounts {
    return {
      tasks: 0,
      documents: 0,
      events: 0,
      discussions: 0
    };
  },
  
  /**
   * Validate workspace name
   */
  isValidName(name: string): boolean {
    // Name must be 1-100 characters, alphanumeric + hyphens/underscores
    const nameRegex = /^[a-zA-Z0-9_-]{1,100}$/;
    return nameRegex.test(name);
  },
  
  /**
   * Validate display name
   */
  isValidDisplayName(displayName: string): boolean {
    // Display name must be 1-200 characters
    return displayName.length >= 1 && displayName.length <= 200;
  }
};
