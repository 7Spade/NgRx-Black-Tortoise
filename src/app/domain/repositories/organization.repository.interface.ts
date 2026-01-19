/**
 * OrganizationRepository contract for organization data access.
 * 
 * Domain layer repository interface - framework-agnostic.
 * Returns Promises to avoid RxJS/framework dependencies in domain layer.
 */
import { Organization } from '../organization';

export interface OrganizationRepository {
  /**
   * Get organization by ID
   */
  getOrganization(id: string): Promise<Organization | null>;
  
  /**
   * Get all organizations for a user
   */
  getUserOrganizations(userId: string): Promise<Organization[]>;
  
  /**
   * List organizations with optional filters
   */
  list(filters?: Record<string, unknown>): Promise<Organization[]>;
  
  /**
   * Create a new organization
   */
  createOrganization(organization: Omit<Organization, 'id'>): Promise<string>;
  
  /**
   * Update an existing organization
   */
  updateOrganization(id: string, data: Partial<Organization>): Promise<void>;
  
  /**
   * Delete an organization
   */
  deleteOrganization(id: string): Promise<void>;
}
