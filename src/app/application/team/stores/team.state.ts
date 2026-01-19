import { Team } from '@domain/team';

export interface TeamState {
  teams: Team[];
  selectedTeam: Team | null;
  loading: boolean;
  error: string | null;
}

export const initialTeamState: TeamState = {
  teams: [],
  selectedTeam: null,
  loading: false,
  error: null,
};
