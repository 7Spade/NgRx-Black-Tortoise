import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  docData,
  collectionData,
  query,
  where,
  orderBy,
  QueryConstraint,
  serverTimestamp,
  setDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { DocumentRepository } from '@domain/repositories/document.repository.interface';
import { Document, DocumentType } from '@domain/document';

interface DocumentFirestoreData {
  id: string;
  name: string;
  type: DocumentType;
  workspaceId: string;
  parentId?: string;
  ownerId: string;
  path: string;
  size?: number;
  mimeType?: string;
  url?: string;
  metadata?: Record<string, unknown>;
  createdAt: Timestamp | Date;
  updatedAt?: Timestamp | Date;
  lastAccessedAt?: Timestamp | Date;
}

@Injectable({ providedIn: 'root' })
export class DocumentFirestoreService implements DocumentRepository {
  private firestore = inject(Firestore);
  private documentsCollection = collection(this.firestore, 'documents');

  getDocumentById(id: string): Observable<Document | null> {
    const documentDoc = doc(this.documentsCollection, id);
    return docData(documentDoc, { idField: 'id' }).pipe(
      map((data) => (data ? this.convertFirestoreDoc(data as DocumentFirestoreData) : null))
    );
  }

  getDocumentsByWorkspace(workspaceId: string): Observable<Document[]> {
    const constraints: QueryConstraint[] = [
      where('workspaceId', '==', workspaceId),
      orderBy('createdAt', 'desc'),
    ];
    const q = query(this.documentsCollection, ...constraints);

    return collectionData(q, { idField: 'id' }).pipe(
      map((docs) => docs.map((doc) => this.convertFirestoreDoc(doc as DocumentFirestoreData)))
    );
  }

  getDocumentsByParent(parentId: string): Observable<Document[]> {
    const constraints: QueryConstraint[] = [
      where('parentId', '==', parentId),
      orderBy('name', 'asc'),
    ];
    const q = query(this.documentsCollection, ...constraints);

    return collectionData(q, { idField: 'id' }).pipe(
      map((docs) => docs.map((doc) => this.convertFirestoreDoc(doc as DocumentFirestoreData)))
    );
  }

  getDocumentsByType(workspaceId: string, type: DocumentType): Observable<Document[]> {
    const constraints: QueryConstraint[] = [
      where('workspaceId', '==', workspaceId),
      where('type', '==', type),
      orderBy('createdAt', 'desc'),
    ];
    const q = query(this.documentsCollection, ...constraints);

    return collectionData(q, { idField: 'id' }).pipe(
      map((docs) => docs.map((doc) => this.convertFirestoreDoc(doc as DocumentFirestoreData)))
    );
  }

  createDocument(document: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>): Observable<Document> {
    const newDocRef = doc(this.documentsCollection);
    const documentData: Partial<DocumentFirestoreData> = {
      id: newDocRef.id,
      name: document.name,
      type: document.type,
      workspaceId: document.workspaceId,
      ownerId: document.ownerId,
      path: document.path,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    if (document.parentId) documentData.parentId = document.parentId;
    if (document.size !== undefined) documentData.size = document.size;
    if (document.mimeType) documentData.mimeType = document.mimeType;
    if (document.url) documentData.url = document.url;
    if (document.metadata) documentData.metadata = document.metadata;
    if (document.lastAccessedAt)
      documentData.lastAccessedAt = Timestamp.fromDate(document.lastAccessedAt);

    return from(setDoc(newDocRef, documentData)).pipe(
      map(() => ({
        ...document,
        id: newDocRef.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
    );
  }

  updateDocument(id: string, updates: Partial<Document>): Observable<void> {
    const documentDoc = doc(this.documentsCollection, id);
    const updateData: Partial<DocumentFirestoreData> = {
      updatedAt: serverTimestamp(),
    };

    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.parentId !== undefined) updateData.parentId = updates.parentId;
    if (updates.path !== undefined) updateData.path = updates.path;
    if (updates.size !== undefined) updateData.size = updates.size;
    if (updates.url !== undefined) updateData.url = updates.url;
    if (updates.metadata !== undefined) updateData.metadata = updates.metadata;
    if (updates.lastAccessedAt !== undefined)
      updateData.lastAccessedAt = Timestamp.fromDate(updates.lastAccessedAt);

    return from(updateDoc(documentDoc, updateData));
  }

  deleteDocument(id: string): Observable<void> {
    const documentDoc = doc(this.documentsCollection, id);
    return from(deleteDoc(documentDoc));
  }

  moveDocument(id: string, newParentId: string | null, newPath: string): Observable<void> {
    const documentDoc = doc(this.documentsCollection, id);
    const updateData: Partial<DocumentFirestoreData> = {
      path: newPath,
      updatedAt: serverTimestamp(),
    };

    if (newParentId !== null) {
      updateData.parentId = newParentId;
    }

    return from(updateDoc(documentDoc, updateData));
  }

  updateLastAccessed(id: string): Observable<void> {
    const documentDoc = doc(this.documentsCollection, id);
    const updateData: Partial<DocumentFirestoreData> = {
      lastAccessedAt: serverTimestamp(),
    };

    return from(updateDoc(documentDoc, updateData));
  }

  private convertFirestoreDoc(data: DocumentFirestoreData): Document {
    const document: Document = {
      id: data.id,
      name: data.name,
      type: data.type,
      workspaceId: data.workspaceId,
      ownerId: data.ownerId,
      path: data.path,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
    };

    if (data.parentId) document.parentId = data.parentId;
    if (data.size !== undefined) document.size = data.size;
    if (data.mimeType) document.mimeType = data.mimeType;
    if (data.url) document.url = data.url;
    if (data.metadata) document.metadata = data.metadata;
    if (data.updatedAt) {
      document.updatedAt =
        data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(data.updatedAt);
    }
    if (data.lastAccessedAt) {
      document.lastAccessedAt =
        data.lastAccessedAt instanceof Timestamp
          ? data.lastAccessedAt.toDate()
          : new Date(data.lastAccessedAt);
    }

    return document;
  }
}
