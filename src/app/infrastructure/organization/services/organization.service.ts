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
import { Organization } from '@domain/organization';
import { OrganizationRepository } from '@domain/repositories';

/**
 * OrganizationService
 * Promise-based implementation for framework-agnostic domain layer
 */
@Injectable({
  providedIn: 'root',
})
export class OrganizationService implements OrganizationRepository {
  private firestore = inject(Firestore);
  private collectionName = 'organizations';

  /**
   * Get organization by ID
   */
  async getOrganization(id: string): Promise<Organization | null> {
    const docRef = doc(this.firestore, this.collectionName, id);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) {
      return null;
    }
    return { ...snapshot.data(), id } as Organization;
  }

  /**
   * Get all organizations for a user
   */
  async getUserOrganizations(userId: string): Promise<Organization[]> {
    const collectionRef = collection(this.firestore, this.collectionName);
    const q = query(collectionRef, where('createdBy', '==', userId));
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }) as Organization);
  }

  /**
   * List all organizations (with optional filters)
   */
  async list(filters: Record<string, unknown> = {}): Promise<Organization[]> {
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
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }) as Organization);
  }

  /**
   * Create a new organization
   */
  async createOrganization(organization: Omit<Organization, 'id'>): Promise<string> {
    const docRef = doc(collection(this.firestore, this.collectionName));
    await setDoc(docRef, organization);
    return docRef.id;
  }

  /**
   * Update an existing organization
   */
  async updateOrganization(id: string, data: Partial<Organization>): Promise<void> {
    const docRef = doc(this.firestore, this.collectionName, id);
    await updateDoc(docRef, data);
  }

  /**
   * Delete an organization
   */
  async deleteOrganization(id: string): Promise<void> {
    const docRef = doc(this.firestore, this.collectionName, id);
    await deleteDoc(docRef);
  }
}
