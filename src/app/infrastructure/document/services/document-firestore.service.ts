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
  getFolderDocuments(workspaceId: string, parentId: string | null): Observable<Document[]> {
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
   * Get a single document
   */
  getDocument(id: string): Observable<Document | null> {
    const documentDoc = doc(this.firestore, `documents/${id}`);
    return docData(documentDoc, { idField: 'id' }).pipe(
      map(data => data ? this.mapToDocument(data) : null)
    );
  }

  /**
   * Get recent documents
   */
  getRecentDocuments(workspaceId: string, userId: string, limit: number = 10): Observable<Document[]> {
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
  createDocument(documentData: Omit<Document, 'id'>): Observable<string> {
    const data = {
      ...documentData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    return from(addDoc(this.documentsCollection, data)).pipe(
      map(docRef => docRef.id)
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
  deleteDocument(documentId: string, deletedBy: string): Observable<void> {
    const documentDoc = doc(this.firestore, `documents/${documentId}`);
    return from(updateDoc(documentDoc, { 
      deletedAt: serverTimestamp(),
      deletedBy
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
   * Move a document to a new parent
   */
  moveDocument(documentId: string, newParentId: string | null, updatedBy: string): Observable<void> {
    const documentDoc = doc(this.firestore, `documents/${documentId}`);
    return from(updateDoc(documentDoc, {
      parentId: newParentId,
      updatedBy,
      updatedAt: serverTimestamp()
    }));
  }

  /**
   * Share document with users
   */
  shareDocument(documentId: string, userIds: string[], updatedBy: string): Observable<void> {
    const documentDoc = doc(this.firestore, `documents/${documentId}`);
    return from(updateDoc(documentDoc, {
      sharedWith: userIds,
      updatedBy,
      updatedAt: serverTimestamp()
    }));
  }

  /**
   * Search documents
   */
  searchDocuments(workspaceId: string, searchQuery: string): Observable<Document[]> {
    const q = query(
      this.documentsCollection,
      where('workspaceId', '==', workspaceId),
      where('deletedAt', '==', null),
      orderBy('name')
    );
    
    return collectionData(q, { idField: 'id' }).pipe(
      map(docs => docs
        .filter(doc => doc['name']?.toLowerCase().includes(searchQuery.toLowerCase()))
        .map(doc => this.mapToDocument(doc))
      )
    );
  }

  /**
   * Get deleted documents
   */
  getDeletedDocuments(workspaceId: string): Observable<Document[]> {
    const q = query(
      this.documentsCollection,
      where('workspaceId', '==', workspaceId),
      where('deletedAt', '!=', null),
      orderBy('deletedAt', 'desc')
    );
    
    return collectionData(q, { idField: 'id' }).pipe(
      map(docs => docs.map(doc => this.mapToDocument(doc)))
    );
  }

  /**
   * Restore a deleted document
   */
  restoreDocument(documentId: string): Observable<void> {
    const documentDoc = doc(this.firestore, `documents/${documentId}`);
    return from(updateDoc(documentDoc, {
      deletedAt: null,
      deletedBy: null
    }));
  }

  /**
   * Get document statistics
   */
  getDocumentStats(workspaceId: string): Observable<any> {
    // This is a placeholder - in a real implementation, you'd aggregate data
    return this.getWorkspaceDocuments(workspaceId).pipe(
      map(docs => ({
        totalFiles: docs.filter(d => d.type === DocumentType.FILE).length,
        totalFolders: docs.filter(d => d.type === DocumentType.FOLDER).length,
        totalSize: docs.reduce((sum, d) => sum + (d.size || 0), 0),
        filesByType: docs.reduce((acc, d) => {
          if (d.type === DocumentType.FILE && d.mimeType) {
            acc[d.mimeType] = (acc[d.mimeType] || 0) + 1;
          }
          return acc;
        }, {} as Record<string, number>),
        recentDocuments: docs.slice(0, 5)
      }))
    );
  }

  /**
   * Toggle document star (not in interface but needed for DocumentStore)
   */
  toggleDocumentStar(documentId: string, userId: string, starred: boolean): Observable<void> {
    // This would require updating the document's starredBy array
    // For now, returning empty observable
    return from(Promise.resolve());
  }

  /**
   * Map Firestore document data to domain Document entity
   */
  private mapToDocument(data: any): Document {
    return {
      id: data.id,
      name: data.name,
      type: data.type,
      workspaceId: data.workspaceId,
      parentId: data.parentId || null,
      path: data.path || '/',
      createdBy: data.createdBy,
      updatedBy: data.updatedBy,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
      updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(data.updatedAt),
      ...(data.mimeType && { mimeType: data.mimeType }),
      ...(data.size !== undefined && { size: data.size }),
      ...(data.downloadUrl && { downloadUrl: data.downloadUrl }),
      ...(data.thumbnailUrl && { thumbnailUrl: data.thumbnailUrl }),
      ...(data.tags && { tags: data.tags }),
      ...(data.description && { description: data.description }),
      ...(data.version !== undefined && { version: data.version }),
      ...(data.sharedWith && { sharedWith: data.sharedWith }),
      ...(data.deletedAt && { deletedAt: data.deletedAt instanceof Timestamp ? data.deletedAt.toDate() : new Date(data.deletedAt) }),
      ...(data.deletedBy && { deletedBy: data.deletedBy })
    };
  }
}
