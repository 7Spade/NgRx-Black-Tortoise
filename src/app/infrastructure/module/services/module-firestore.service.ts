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
import { Module, ModuleType, DEFAULT_MODULES } from '@domain/module';
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
   * Get a single module
   */
  getModule(id: string): Observable<Module | null> {
    const moduleDoc = doc(this.firestore, `modules/${id}`);
    return docData(moduleDoc, { idField: 'id' }).pipe(
      map(doc => doc ? this.mapToModule(doc) : null)
    );
  }

  /**
   * Create a new module
   */
  createModule(moduleData: Omit<Module, 'id'>): Observable<string> {
    return from(addDoc(this.modulesCollection, moduleData)).pipe(
      map(docRef => docRef.id)
    );
  }

  /**
   * Update a module
   */
  updateModule(moduleId: string, data: Partial<Module>): Observable<void> {
    const moduleDoc = doc(this.firestore, `modules/${moduleId}`);
    return from(updateDoc(moduleDoc, data));
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
      return updateDoc(moduleDoc, { order });
    });

    return from(Promise.all(updates).then(() => undefined));
  }

  /**
   * Toggle module enabled state
   */
  toggleModuleEnabled(moduleId: string, enabled: boolean): Observable<void> {
    const moduleDoc = doc(this.firestore, `modules/${moduleId}`);
    return from(updateDoc(moduleDoc, { enabled }));
  }

  /**
   * Initialize default modules for a workspace
   */
  initializeDefaultModules(workspaceId: string): Observable<Module[]> {
    const modules = DEFAULT_MODULES.map((metadata, index) => {
      const moduleData: Omit<Module, 'id'> = {
        workspaceId,
        type: metadata.type,
        name: metadata.defaultName,
        description: metadata.description,
        icon: metadata.defaultIcon,
        route: `/workspace/${workspaceId}/${metadata.type}`,
        order: metadata.defaultOrder,
        enabled: metadata.defaultEnabled,
        visible: true
      };
      return moduleData;
    });

    const createPromises = modules.map(module => 
      addDoc(this.modulesCollection, module).then(docRef => ({
        ...module,
        id: docRef.id
      }))
    );

    return from(Promise.all(createPromises));
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
      description: doc.description,
      icon: doc.icon,
      route: doc.route,
      order: doc.order ?? 0,
      enabled: doc.enabled ?? true,
      visible: doc.visible ?? true,
      requiredPermission: doc.requiredPermission,
      badge: doc.badge
    };
  }
}
