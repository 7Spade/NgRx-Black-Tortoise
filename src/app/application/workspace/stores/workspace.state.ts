import { Workspace } from '@domain/workspace';

export interface WorkspaceState {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  recentWorkspaces: string[]; // Workspace IDs for recent access tracking
  favoriteWorkspaces: string[]; // Workspace IDs for favorites
  loading: boolean;
  error: string | null;
}

export const initialWorkspaceState: WorkspaceState = {
  workspaces: [],
  currentWorkspace: null,
  recentWorkspaces: [],
  favoriteWorkspaces: [],
  loading: false,
  error: null,
};
