/**
 * PartnerRepository contract for partner data access.
 */
import { Observable } from 'rxjs';
import { Partner } from '../partner';

export interface PartnerRepository {
  getPartner(id: string): Observable<Partner | null>;
  getOrganizationPartners(organizationId: string): Observable<Partner[]>;
  list(filters?: Record<string, unknown>): Observable<Partner[]>;
  createPartner(partner: Omit<Partner, 'id'>): Observable<string>;
  updatePartner(id: string, data: Partial<Partner>): Observable<void>;
  deletePartner(id: string): Observable<void>;
}
