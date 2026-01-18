/**
 * TeamRepository contract for team data access.
 */
import { Observable } from 'rxjs';
import { Team } from '../team';

export interface TeamRepository {
  getTeam(id: string): Observable<Team | null>;
  getOrganizationTeams(organizationId: string): Observable<Team[]>;
  list(filters?: Record<string, unknown>): Observable<Team[]>;
  createTeam(team: Omit<Team, 'id'>): Observable<string>;
  updateTeam(id: string, data: Partial<Team>): Observable<void>;
  deleteTeam(id: string): Observable<void>;
}
