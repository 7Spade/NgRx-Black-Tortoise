/**
 * WorkspaceRepository contract for workspace data access.
 */
import { Observable } from 'rxjs';
import { Workspace } from '../workspace';

export interface WorkspaceRepository {
  getWorkspace(id: string): Observable<Workspace | null>;
  getOrganizationWorkspaces(organizationId: string): Observable<Workspace[]>;
  createWorkspace(workspace: Omit<Workspace, 'id'>): Observable<string>;
  updateWorkspace(id: string, data: Partial<Workspace>): Observable<void>;
  deleteWorkspace(id: string): Observable<void>;
}
