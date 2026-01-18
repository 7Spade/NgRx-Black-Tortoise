/**
 * OrganizationRepository contract for organization data access.
 */
import { Observable } from 'rxjs';
import { Organization } from '../organization';

export interface OrganizationRepository {
  getOrganization(id: string): Observable<Organization | null>;
  getUserOrganizations(userId: string): Observable<Organization[]>;
  list(filters?: Record<string, unknown>): Observable<Organization[]>;
  createOrganization(organization: Omit<Organization, 'id'>): Observable<string>;
  updateOrganization(id: string, data: Partial<Organization>): Observable<void>;
  deleteOrganization(id: string): Observable<void>;
}
