import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  docData,
  collectionData,
  query,
  where,
  QueryConstraint,
  serverTimestamp,
  setDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { ModuleRepository } from '@domain/repositories/module.repository.interface';
import { Module, ModuleType, DEFAULT_MODULES } from '@domain/module';

interface ModuleFirestoreData {
  id: string;
  name: string;
  type: ModuleType;
  icon: string;
  workspaceId: string;
  order: number;
  enabled: boolean;
  config?: Record<string, unknown>;
  createdAt: Timestamp | Date;
  updatedAt?: Timestamp | Date;
}

@Injectable({ providedIn: 'root' })
export class ModuleFirestoreService implements ModuleRepository {
  private firestore = inject(Firestore);
  private modulesCollection = collection(this.firestore, 'modules');

  getModuleById(id: string): Observable<Module | null> {
    const moduleDoc = doc(this.modulesCollection, id);
    return docData(moduleDoc, { idField: 'id' }).pipe(
      map((data) => (data ? this.convertFirestoreDoc(data as ModuleFirestoreData) : null))
    );
  }

  getModulesByWorkspace(workspaceId: string): Observable<Module[]> {
    const constraints: QueryConstraint[] = [where('workspaceId', '==', workspaceId)];
    const q = query(this.modulesCollection, ...constraints);

    return collectionData(q, { idField: 'id' }).pipe(
      map((docs) => docs.map((doc) => this.convertFirestoreDoc(doc as ModuleFirestoreData)))
    );
  }

  createModule(module: Omit<Module, 'id' | 'createdAt' | 'updatedAt'>): Observable<Module> {
    const newDocRef = doc(this.modulesCollection);
    const moduleData: Partial<ModuleFirestoreData> = {
      id: newDocRef.id,
      name: module.name,
      type: module.type,
      icon: module.icon,
      workspaceId: module.workspaceId,
      order: module.order,
      enabled: module.enabled,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    if (module.config) {
      moduleData.config = module.config;
    }

    return from(setDoc(newDocRef, moduleData)).pipe(
      map(() => ({
        ...module,
        id: newDocRef.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
    );
  }

  updateModule(id: string, updates: Partial<Module>): Observable<void> {
    const moduleDoc = doc(this.modulesCollection, id);
    const updateData: Partial<ModuleFirestoreData> = {
      updatedAt: serverTimestamp(),
    };

    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.icon !== undefined) updateData.icon = updates.icon;
    if (updates.order !== undefined) updateData.order = updates.order;
    if (updates.enabled !== undefined) updateData.enabled = updates.enabled;
    if (updates.config !== undefined) updateData.config = updates.config;

    return from(updateDoc(moduleDoc, updateData));
  }

  deleteModule(id: string): Observable<void> {
    const moduleDoc = doc(this.modulesCollection, id);
    return from(deleteDoc(moduleDoc));
  }

  initializeDefaultModules(workspaceId: string): Observable<Module[]> {
    const createPromises = DEFAULT_MODULES.map((module, index) => {
      const newDocRef = doc(this.modulesCollection);
      const moduleData: Partial<ModuleFirestoreData> = {
        id: newDocRef.id,
        name: module.name,
        type: module.type,
        icon: module.icon,
        workspaceId,
        order: index,
        enabled: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      if (module.config) {
        moduleData.config = module.config;
      }

      return setDoc(newDocRef, moduleData).then(() => ({
        ...module,
        id: newDocRef.id,
        workspaceId,
        order: index,
        enabled: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
    });

    return from(Promise.all(createPromises));
  }

  private convertFirestoreDoc(data: ModuleFirestoreData): Module {
    return {
      id: data.id,
      name: data.name,
      type: data.type,
      icon: data.icon,
      workspaceId: data.workspaceId,
      order: data.order,
      enabled: data.enabled,
      config: data.config,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
      updatedAt: data.updatedAt
        ? data.updatedAt instanceof Timestamp
          ? data.updatedAt.toDate()
          : new Date(data.updatedAt)
        : undefined,
    };
  }
}
