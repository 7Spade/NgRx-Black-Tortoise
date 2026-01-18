import { inject, Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  docData,
  collectionData,
  query,
  where,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
  DocumentReference
} from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

// Domain
import { Module, ModuleType } from '@domain/module';
import { ModuleRepository } from '@domain/repositories/module.repository.interface';

/**
 * Firestore implementation of ModuleRepository
 * Manages workspace modules persistence
 */
@Injectable({
  providedIn: 'root'
})
export class ModuleFirestoreService implements ModuleRepository {
  private firestore = inject(Firestore);
  private modulesCollection = collection(this.firestore, 'modules');

  /**
   * Get all modules for a workspace
   */
  getWorkspaceModules(workspaceId: string): Observable<Module[]> {
    const q = query(
      this.modulesCollection,
      where('workspaceId', '==', workspaceId),
      orderBy('order', 'asc')
    );
    
    return collectionData(q, { idField: 'id' }).pipe(
      map(docs => docs.map(doc => this.mapToModule(doc)))
    );
  }

  /**
   * Get enabled modules for a workspace
   */
  getEnabledModules(workspaceId: string): Observable<Module[]> {
    const q = query(
      this.modulesCollection,
      where('workspaceId', '==', workspaceId),
      where('enabled', '==', true),
      orderBy('order', 'asc')
    );
    
    return collectionData(q, { idField: 'id' }).pipe(
      map(docs => docs.map(doc => this.mapToModule(doc)))
    );
  }

  /**
   * Get a single module by ID
   */
  getModuleById(moduleId: string): Observable<Module | null> {
    const moduleDoc = doc(this.firestore, `modules/${moduleId}`);
    return docData(moduleDoc, { idField: 'id' }).pipe(
      map(doc => doc ? this.mapToModule(doc) : null)
    );
  }

  /**
   * Create a new module
   */
  createModule(moduleData: Omit<Module, 'id' | 'createdAt' | 'updatedAt'>): Observable<Module> {
    const data = {
      ...moduleData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    return from(addDoc(this.modulesCollection, data)).pipe(
      map(docRef => ({
        ...moduleData,
        id: docRef.id,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    );
  }

  /**
   * Update a module
   */
  updateModule(moduleId: string, data: Partial<Module>): Observable<void> {
    const moduleDoc = doc(this.firestore, `modules/${moduleId}`);
    const updateData = {
      ...data,
      updatedAt: serverTimestamp()
    };
    
    return from(updateDoc(moduleDoc, updateData));
  }

  /**
   * Delete a module
   */
  deleteModule(moduleId: string): Observable<void> {
    const moduleDoc = doc(this.firestore, `modules/${moduleId}`);
    return from(deleteDoc(moduleDoc));
  }

  /**
   * Update module order
   */
  updateModuleOrder(workspaceId: string, orders: Array<{ id: string; order: number }>): Observable<void> {
    const updates = orders.map(({ id, order }) => {
      const moduleDoc = doc(this.firestore, `modules/${id}`);
      return updateDoc(moduleDoc, { 
        order,
        updatedAt: serverTimestamp()
      });
    });

    return from(Promise.all(updates).then(() => undefined));
  }

  /**
   * Toggle module enabled state
   */
  toggleModuleEnabled(moduleId: string, enabled: boolean): Observable<void> {
    const moduleDoc = doc(this.firestore, `modules/${moduleId}`);
    return from(updateDoc(moduleDoc, { 
      enabled,
      updatedAt: serverTimestamp()
    }));
  }

  /**
   * Map Firestore document to Module entity
   */
  private mapToModule(doc: any): Module {
    return {
      id: doc.id,
      workspaceId: doc.workspaceId,
      type: doc.type as ModuleType,
      name: doc.name,
      icon: doc.icon,
      route: doc.route,
      enabled: doc.enabled ?? true,
      order: doc.order ?? 0,
      badge: doc.badge ?? null,
      metadata: doc.metadata ?? {},
      createdAt: doc.createdAt instanceof Timestamp 
        ? doc.createdAt.toDate() 
        : new Date(doc.createdAt),
      updatedAt: doc.updatedAt instanceof Timestamp 
        ? doc.updatedAt.toDate() 
        : new Date(doc.updatedAt)
    };
  }
}
