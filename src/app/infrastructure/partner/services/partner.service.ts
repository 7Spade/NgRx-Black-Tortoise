import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  QueryConstraint,
  getDocs,
  getDoc
} from '@angular/fire/firestore';
import { Partner } from '@domain/partner';
import { PartnerRepository } from '@domain/repositories';

/**
 * PartnerService
 * Promise-based implementation for framework-agnostic domain layer
 */
@Injectable({
  providedIn: 'root',
})
export class PartnerService implements PartnerRepository {
  private firestore = inject(Firestore);
  private collectionName = 'partners';

  /**
   * Get partner by ID
   */
  async getPartner(id: string): Promise<Partner | null> {
    const docRef = doc(this.firestore, this.collectionName, id);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) {
      return null;
    }
    return { ...snapshot.data(), id } as Partner;
  }

  /**
   * Get all partners for an organization
   */
  async getOrganizationPartners(organizationId: string): Promise<Partner[]> {
    const collectionRef = collection(this.firestore, this.collectionName);
    const q = query(collectionRef, where('organizationId', '==', organizationId));
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }) as Partner);
  }

  /**
   * List all partners (with optional filters)
   */
  async list(filters: Record<string, unknown> = {}): Promise<Partner[]> {
    const collectionRef = collection(this.firestore, this.collectionName);
    
    // Build query constraints from filters
    const constraints: QueryConstraint[] = [];
    Object.entries(filters).forEach(([field, value]) => {
      if (value !== undefined && value !== null) {
        constraints.push(where(field, '==', value));
      }
    });
    
    const q = constraints.length > 0 ? query(collectionRef, ...constraints) : collectionRef;
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }) as Partner);
  }

  /**
   * Create a new partner
   */
  async createPartner(partner: Omit<Partner, 'id'>): Promise<string> {
    const docRef = doc(collection(this.firestore, this.collectionName));
    await setDoc(docRef, partner);
    return docRef.id;
  }

  /**
   * Update an existing partner
   */
  async updatePartner(id: string, data: Partial<Partner>): Promise<void> {
    const docRef = doc(this.firestore, this.collectionName, id);
    await updateDoc(docRef, data);
  }

  /**
   * Delete a partner
   */
  async deletePartner(id: string): Promise<void> {
    const docRef = doc(this.firestore, this.collectionName, id);
    await deleteDoc(docRef);
  }
}
