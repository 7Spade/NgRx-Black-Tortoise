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
  DocumentReference,
  getDocs
} from '@angular/fire/firestore';
import { firstValueFrom } from 'rxjs';

// Domain
import { Module, ModuleType, DEFAULT_MODULES } from '@domain/module';
import { ModuleRepository } from '@domain/repositories/module.repository.interface';

/**
 * Firestore implementation of ModuleRepository
 * Promise-based implementation for framework-agnostic domain layer
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
  async getWorkspaceModules(workspaceId: string): Promise<Module[]> {
    const q = query(
      this.modulesCollection,
      where('workspaceId', '==', workspaceId),
      orderBy('order', 'asc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => this.mapToModule({ ...doc.data(), id: doc.id }));
  }

  /**
   * Get enabled modules for a workspace
   */
  async getEnabledModules(workspaceId: string): Promise<Module[]> {
    const q = query(
      this.modulesCollection,
      where('workspaceId', '==', workspaceId),
      where('enabled', '==', true),
      orderBy('order', 'asc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => this.mapToModule({ ...doc.data(), id: doc.id }));
  }

  /**
   * Get a single module by ID
   */
  async getModuleById(moduleId: string): Promise<Module | null> {
    const moduleDoc = doc(this.firestore, `modules/${moduleId}`);
    const data = await firstValueFrom(docData(moduleDoc, { idField: 'id' }));
    return data ? this.mapToModule(data) : null;
  }

  /**
   * Get a single module
   */
  async getModule(id: string): Promise<Module | null> {
    const moduleDoc = doc(this.firestore, `modules/${id}`);
    const data = await firstValueFrom(docData(moduleDoc, { idField: 'id' }));
    return data ? this.mapToModule(data) : null;
  }

  /**
   * Create a new module
   */
  async createModule(moduleData: Omit<Module, 'id'>): Promise<string> {
    const docRef = await addDoc(this.modulesCollection, moduleData);
    return docRef.id;
  }

  /**
   * Update a module
   */
  async updateModule(moduleId: string, data: Partial<Module>): Promise<void> {
    const moduleDoc = doc(this.firestore, `modules/${moduleId}`);
    await updateDoc(moduleDoc, data);
  }

  /**
   * Delete a module
   */
  async deleteModule(moduleId: string): Promise<void> {
    const moduleDoc = doc(this.firestore, `modules/${moduleId}`);
    await deleteDoc(moduleDoc);
  }

  /**
   * Update module order
   */
  async updateModuleOrder(workspaceId: string, orders: Array<{ id: string; order: number }>): Promise<void> {
    const updates = orders.map(({ id, order }) => {
      const moduleDoc = doc(this.firestore, `modules/${id}`);
      return updateDoc(moduleDoc, { order });
    });

    await Promise.all(updates);
  }

  /**
   * Toggle module enabled state
   */
  async toggleModuleEnabled(moduleId: string, enabled: boolean): Promise<void> {
    const moduleDoc = doc(this.firestore, `modules/${moduleId}`);
    await updateDoc(moduleDoc, { enabled });
  }

  /**
   * Initialize default modules for a workspace
   */
  async initializeDefaultModules(workspaceId: string): Promise<Module[]> {
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

    return await Promise.all(createPromises);
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
