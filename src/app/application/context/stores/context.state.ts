import { ContextState } from '@domain/context';

export const initialContextState: ContextState = {
  current: null,
  available: {
    organizations: [],
    teams: [],
    partners: [],
  },
  history: [],
  currentWorkspaceId: null,
};
