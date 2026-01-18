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
  Timestamp
} from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

// Domain
import { Document, DocumentType } from '@domain/document';
import { DocumentRepository } from '@domain/repositories/document.repository.interface';

/**
 * Firestore implementation of DocumentRepository
 * Manages workspace documents persistence
 */
@Injectable({
  providedIn: 'root'
})
export class DocumentFirestoreService implements DocumentRepository {
  private firestore = inject(Firestore);
  private documentsCollection = collection(this.firestore, 'documents');

  /**
   * Get all documents for a workspace
   */
  getWorkspaceDocuments(workspaceId: string): Observable<Document[]> {
    const q = query(
      this.documentsCollection,
      where('workspaceId', '==', workspaceId),
      where('deletedAt', '==', null),
      orderBy('updatedAt', 'desc')
    );
    
    return collectionData(q, { idField: 'id' }).pipe(
      map(docs => docs.map(doc => this.mapToDocument(doc)))
    );
  }

  /**
   * Get documents by type
   */
  getDocumentsByType(workspaceId: string, type: DocumentType): Observable<Document[]> {
    const q = query(
      this.documentsCollection,
      where('workspaceId', '==', workspaceId),
      where('type', '==', type),
      where('deletedAt', '==', null),
      orderBy('updatedAt', 'desc')
    );
    
    return collectionData(q, { idField: 'id' }).pipe(
      map(docs => docs.map(doc => this.mapToDocument(doc)))
    );
  }

  /**
   * Get documents by parent (folder)
   */
  getDocumentsByParent(workspaceId: string, parentId: string | null): Observable<Document[]> {
    const q = query(
      this.documentsCollection,
      where('workspaceId', '==', workspaceId),
      where('parentId', '==', parentId),
      where('deletedAt', '==', null),
      orderBy('updatedAt', 'desc')
    );
    
    return collectionData(q, { idField: 'id' }).pipe(
      map(docs => docs.map(doc => this.mapToDocument(doc)))
    );
  }

  /**
   * Get recent documents
   */
  getRecentDocuments(workspaceId: string, limit: number = 10): Observable<Document[]> {
    const q = query(
      this.documentsCollection,
      where('workspaceId', '==', workspaceId),
      where('deletedAt', '==', null),
      orderBy('updatedAt', 'desc')
    );
    
    return collectionData(q, { idField: 'id' }).pipe(
      map(docs => docs.slice(0, limit).map(doc => this.mapToDocument(doc)))
    );
  }

  /**
   * Get starred documents
   */
  getStarredDocuments(workspaceId: string, userId: string): Observable<Document[]> {
    const q = query(
      this.documentsCollection,
      where('workspaceId', '==', workspaceId),
      where('starredBy', 'array-contains', userId),
      where('deletedAt', '==', null),
      orderBy('updatedAt', 'desc')
    );
    
    return collectionData(q, { idField: 'id' }).pipe(
      map(docs => docs.map(doc => this.mapToDocument(doc)))
    );
  }

  /**
   * Get a single document by ID
   */
  getDocumentById(documentId: string): Observable<Document | null> {
    const documentDoc = doc(this.firestore, `documents/${documentId}`);
    return docData(documentDoc, { idField: 'id' }).pipe(
      map(doc => doc ? this.mapToDocument(doc) : null)
    );
  }

  /**
   * Create a new document
   */
  createDocument(documentData: Omit<Document, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>): Observable<Document> {
    const data = {
      ...documentData,
      starredBy: [],
      deletedAt: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    return from(addDoc(this.documentsCollection, data)).pipe(
      map(docRef => ({
        ...documentData,
        id: docRef.id,
        starredBy: [],
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    );
  }

  /**
   * Update a document
   */
  updateDocument(documentId: string, data: Partial<Document>): Observable<void> {
    const documentDoc = doc(this.firestore, `documents/${documentId}`);
    const updateData = {
      ...data,
      updatedAt: serverTimestamp()
    };
    
    return from(updateDoc(documentDoc, updateData));
  }

  /**
   * Delete a document (soft delete)
   */
  deleteDocument(documentId: string): Observable<void> {
    const documentDoc = doc(this.firestore, `documents/${documentId}`);
    return from(updateDoc(documentDoc, { 
      deletedAt: serverTimestamp()
    }));
  }

  /**
   * Permanently delete a document
   */
  permanentlyDeleteDocument(documentId: string): Observable<void> {
    const documentDoc = doc(this.firestore, `documents/${documentId}`);
    return from(deleteDoc(documentDoc));
  }

  /**
   * Toggle document star
   */
  toggleDocumentStar(documentId: string, userId: string, starred: boolean): Observable<void> {
    const documentDoc = doc(this.firestore, `documents/${documentId}`);
    
    return from(
      docData(documentDoc).pipe(
        map(doc => {
          const starredBy = (doc?.['starredBy'] as string[]) || [];
          const newStarredBy = starred
            ? [...starredBy, userId]
            : starredBy.filter(id => id !== userId);
          
          return updateDoc(documentDoc, { 
            starredBy: newStarredBy,
            updatedAt: serverTimestamp()
          });
        })
      )
    ).pipe(
      map(() => undefined)
    );
  }

  /**
   * Map Firestore document to Document entity
   */
  private mapToDocument(doc: any): Document {
    return {
      id: doc.id,
      workspaceId: doc.workspaceId,
      type: doc.type as DocumentType,
      name: doc.name,
      content: doc.content ?? '',
      parentId: doc.parentId ?? null,
      ownerId: doc.ownerId,
      lastEditedBy: doc.lastEditedBy,
      starredBy: doc.starredBy ?? [],
      metadata: doc.metadata ?? {},
      createdAt: doc.createdAt instanceof Timestamp 
        ? doc.createdAt.toDate() 
        : new Date(doc.createdAt),
      updatedAt: doc.updatedAt instanceof Timestamp 
        ? doc.updatedAt.toDate() 
        : new Date(doc.updatedAt),
      deletedAt: doc.deletedAt instanceof Timestamp 
        ? doc.deletedAt.toDate() 
        : doc.deletedAt ? new Date(doc.deletedAt) : null
    };
  }
}
