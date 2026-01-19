/**
 * PartnerRepository contract for partner data access.
 * 
 * Domain layer repository interface - framework-agnostic.
 * Returns Promises to avoid RxJS/framework dependencies in domain layer.
 */
import { Partner } from '../partner';

export interface PartnerRepository {
  /**
   * Get partner by ID
   */
  getPartner(id: string): Promise<Partner | null>;
  
  /**
   * Alias for getPartner (standard DDD naming)
   */
  findById(id: string): Promise<Partner | null>;
  
  /**
   * Get all partners for an organization
   */
  getOrganizationPartners(organizationId: string): Promise<Partner[]>;
  
  /**
   * Get all partners a user is a member of
   */
  findByMemberId(userId: string): Promise<Partner[]>;
  
  /**
   * List partners with optional filters
   */
  list(filters?: Record<string, unknown>): Promise<Partner[]>;
  
  /**
   * Create a new partner
   */
  createPartner(partner: Omit<Partner, 'id'>): Promise<string>;
  
  /**
   * Update an existing partner
   */
  updatePartner(id: string, data: Partial<Partner>): Promise<void>;
  
  /**
   * Delete a partner
   */
  deletePartner(id: string): Promise<void>;
}
