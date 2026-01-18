/**
 * TeamRepository contract for team data access.
 * 
 * Domain layer repository interface - framework-agnostic.
 * Returns Promises to avoid RxJS/framework dependencies in domain layer.
 */
import { Team } from '../team';

export interface TeamRepository {
  /**
   * Get team by ID
   */
  getTeam(id: string): Promise<Team | null>;
  
  /**
   * Get all teams for an organization
   */
  getOrganizationTeams(organizationId: string): Promise<Team[]>;
  
  /**
   * List teams with optional filters
   */
  list(filters?: Record<string, unknown>): Promise<Team[]>;
  
  /**
   * Create a new team
   */
  createTeam(team: Omit<Team, 'id'>): Promise<string>;
  
  /**
   * Update an existing team
   */
  updateTeam(id: string, data: Partial<Team>): Promise<void>;
  
  /**
   * Delete a team
   */
  deleteTeam(id: string): Promise<void>;
}
