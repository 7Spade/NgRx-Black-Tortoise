import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from '@angular/fire/firestore';
import { Workspace } from '@domain/workspace';
import { WorkspaceRepository } from '@domain/repositories';

/**
 * WorkspaceService - Infrastructure implementation of WorkspaceRepository
 * 
 * Implements Promise-based methods for framework-agnostic domain layer.
 * Handles CRUD operations for workspace documents in Firestore.
 */
@Injectable({
  providedIn: 'root',
})
export class WorkspaceService implements WorkspaceRepository {
  private firestore = inject(Firestore);
  private collectionName = 'workspaces';

  /**
   * Get workspace by ID
   */
  async getWorkspace(id: string): Promise<Workspace | null> {
    const docRef = doc(this.firestore, this.collectionName, id);
    const snapshot = await getDoc(docRef);
    
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() } as Workspace;
    }
    return null;
  }

  /**
   * Get all workspaces for an organization
   */
  async getOrganizationWorkspaces(organizationId: string): Promise<Workspace[]> {
    const collectionRef = collection(this.firestore, this.collectionName);
    const q = query(collectionRef, where('organizationId', '==', organizationId));
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Workspace)
    );
  }

  /**
   * Create a new workspace
   */
  async createWorkspace(workspace: Omit<Workspace, 'id'>): Promise<string> {
    const docRef = doc(collection(this.firestore, this.collectionName));
    await setDoc(docRef, workspace);
    return docRef.id;
  }

  /**
   * Update an existing workspace
   */
  async updateWorkspace(id: string, data: Partial<Workspace>): Promise<void> {
    const docRef = doc(this.firestore, this.collectionName, id);
    await updateDoc(docRef, data);
  }

  /**
   * Delete a workspace
   */
  async deleteWorkspace(id: string): Promise<void> {
    const docRef = doc(this.firestore, this.collectionName, id);
    await deleteDoc(docRef);
  }
}
