/**
 * Workspace = LogicalContainer (Resources | Permissions | Modules | SharedContext)
 * Maps to @angular/fire/firestore (Document | SubCollection | RuleScope)
 * 
 * CANONICAL OWNERSHIP MODEL:
 * ==========================
 * Workspace can ONLY be owned by:
 * - User (personal workspace)
 * - Organization (organizational workspace)
 * 
 * Team and Partner are membership constructs - they CANNOT own workspaces.
 * Ownership is enforced via discriminated union types for compile-time safety.
 */

/**
 * Discriminated union for workspace ownership
 * Enforces that:
 * - User-owned workspaces may not have organizationId
 * - Organization-owned workspaces MUST have organizationId
 */
export type WorkspaceOwnership = 
  | { 
      ownerType: 'user'; 
      ownerId: string;  // User.id
      organizationId?: never;  // User-owned workspaces are NOT org-scoped
    }
  | { 
      ownerType: 'organization'; 
      ownerId: string;  // Organization.id
      organizationId: string;  // Org-owned workspaces MUST have organizationId
    };

/**
 * Base workspace properties (identity-agnostic)
 */
export interface WorkspaceBase {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  
  // Settings
  settings?: WorkspaceSettings;
  
  // Modules enabled
  modules: {
    overview: boolean;
    documents: boolean;
    tasks: boolean;
    members: boolean;
    permissions: boolean;
    audit: boolean;
    settings: boolean;
    journal: boolean;
  };
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  lastAccessedAt?: Date;
  
  // Status
  status: 'active' | 'archived' | 'suspended';
  
  // Resources
  resourceCount?: {
    documents: number;
    tasks: number;
    members: number;
  };
}

/**
 * Complete Workspace entity with ownership discrimination
 */
export type Workspace = WorkspaceBase & WorkspaceOwnership;

/**
 * Type guards for workspace ownership
 */
export function isUserOwnedWorkspace(workspace: Workspace): workspace is WorkspaceBase & { ownerType: 'user'; ownerId: string; organizationId?: never } {
  return workspace.ownerType === 'user';
}

export function isOrgOwnedWorkspace(workspace: Workspace): workspace is WorkspaceBase & { ownerType: 'organization'; ownerId: string; organizationId: string } {
  return workspace.ownerType === 'organization';
}

export interface WorkspaceSettings {
  visibility: 'private' | 'internal' | 'public';
  allowGuestAccess: boolean;
  requireApprovalForJoin: boolean;
  defaultPermissions: string[];
}

export interface WorkspaceMember {
  userId: string;
  workspaceId: string;
  role: 'owner' | 'admin' | 'member' | 'guest';
  permissions: string[];
  joinedAt: Date;
  invitedBy?: string;
}

export interface WorkspaceContext {
  workspaceId: string;
  eventBusEnabled: boolean;
  sharedSchemaVersion: string;
  integrations?: string[];
}
