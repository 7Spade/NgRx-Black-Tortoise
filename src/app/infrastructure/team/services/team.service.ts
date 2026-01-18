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
import { Team } from '@domain/team';
import { TeamRepository } from '@domain/repositories';

/**
 * TeamService
 * Promise-based implementation for framework-agnostic domain layer
 */
@Injectable({
  providedIn: 'root',
})
export class TeamService implements TeamRepository {
  private firestore = inject(Firestore);
  private collectionName = 'teams';

  /**
   * Get team by ID
   */
  async getTeam(id: string): Promise<Team | null> {
    const docRef = doc(this.firestore, this.collectionName, id);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) {
      return null;
    }
    return { ...snapshot.data(), id } as Team;
  }

  /**
   * Get all teams for an organization
   */
  async getOrganizationTeams(organizationId: string): Promise<Team[]> {
    const collectionRef = collection(this.firestore, this.collectionName);
    const q = query(collectionRef, where('organizationId', '==', organizationId));
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }) as Team);
  }

  /**
   * List all teams (with optional filters)
   */
  async list(filters: Record<string, unknown> = {}): Promise<Team[]> {
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
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }) as Team);
  }

  /**
   * Create a new team
   */
  async createTeam(team: Omit<Team, 'id'>): Promise<string> {
    const docRef = doc(collection(this.firestore, this.collectionName));
    await setDoc(docRef, team);
    return docRef.id;
  }

  /**
   * Update an existing team
   */
  async updateTeam(id: string, data: Partial<Team>): Promise<void> {
    const docRef = doc(this.firestore, this.collectionName, id);
    await updateDoc(docRef, data);
  }

  /**
   * Delete a team
   */
  async deleteTeam(id: string): Promise<void> {
    const docRef = doc(this.firestore, this.collectionName, id);
    await deleteDoc(docRef);
  }
}
