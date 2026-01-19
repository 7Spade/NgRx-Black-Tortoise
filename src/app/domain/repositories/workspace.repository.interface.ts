/**
 * WorkspaceRepository contract for workspace data access.
 * 
 * Domain layer repository interface - framework-agnostic.
 * Returns Promises to avoid RxJS/framework dependencies in domain layer.
 */
import { Workspace } from '../workspace';

export interface WorkspaceRepository {
  /**
   * Get workspace by ID
   */
  getWorkspace(id: string): Promise<Workspace | null>;
  
  /**
   * Get all organization-owned workspaces
   * Returns workspaces where ownerType === 'organization'
   */
  getOrganizationWorkspaces(organizationId: string): Promise<Workspace[]>;
  
  /**
   * Get all user-owned personal workspaces
   * Returns workspaces where ownerType === 'user'
   */
  getUserWorkspaces(userId: string): Promise<Workspace[]>;
  
  /**
   * Create a new workspace
   */
  createWorkspace(workspace: Omit<Workspace, 'id'>): Promise<string>;
  
  /**
   * Update an existing workspace
   */
  updateWorkspace(id: string, data: Partial<Workspace>): Promise<void>;
  
  /**
   * Delete a workspace
   */
  deleteWorkspace(id: string): Promise<void>;
}
