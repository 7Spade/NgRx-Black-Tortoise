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
  getDocs
} from '@angular/fire/firestore';
import { firstValueFrom } from 'rxjs';

// Domain
import { Document, DocumentType } from '@domain/document';
import { DocumentRepository } from '@domain/repositories/document.repository.interface';

/**
 * Firestore implementation of DocumentRepository
 * Promise-based implementation for framework-agnostic domain layer
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
  async getWorkspaceDocuments(workspaceId: string): Promise<Document[]> {
    const q = query(
      this.documentsCollection,
      where('workspaceId', '==', workspaceId),
      where('deletedAt', '==', null),
      orderBy('updatedAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => this.mapToDocument({ ...doc.data(), id: doc.id }));
  }

  /**
   * Get documents by type
   */
  async getDocumentsByType(workspaceId: string, type: DocumentType): Promise<Document[]> {
    const q = query(
      this.documentsCollection,
      where('workspaceId', '==', workspaceId),
      where('type', '==', type),
      where('deletedAt', '==', null),
      orderBy('updatedAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => this.mapToDocument({ ...doc.data(), id: doc.id }));
  }

  /**
   * Get documents by parent (folder)
   */
  async getFolderDocuments(workspaceId: string, parentId: string | null): Promise<Document[]> {
    const q = query(
      this.documentsCollection,
      where('workspaceId', '==', workspaceId),
      where('parentId', '==', parentId),
      where('deletedAt', '==', null),
      orderBy('updatedAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => this.mapToDocument({ ...doc.data(), id: doc.id }));
  }

  /**
   * Get a single document
   */
  async getDocument(id: string): Promise<Document | null> {
    const documentDoc = doc(this.firestore, `documents/${id}`);
    const data = await firstValueFrom(docData(documentDoc, { idField: 'id' }));
    return data ? this.mapToDocument(data) : null;
  }

  /**
   * Get recent documents
   */
  async getRecentDocuments(workspaceId: string, userId: string, limit: number = 10): Promise<Document[]> {
    const q = query(
      this.documentsCollection,
      where('workspaceId', '==', workspaceId),
      where('deletedAt', '==', null),
      orderBy('updatedAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.slice(0, limit).map(doc => this.mapToDocument({ ...doc.data(), id: doc.id }));
  }

  /**
   * Get starred documents
   */
  async getStarredDocuments(workspaceId: string, userId: string): Promise<Document[]> {
    const q = query(
      this.documentsCollection,
      where('workspaceId', '==', workspaceId),
      where('starredBy', 'array-contains', userId),
      where('deletedAt', '==', null),
      orderBy('updatedAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => this.mapToDocument({ ...doc.data(), id: doc.id }));
  }

  /**
   * Get a single document by ID
   */
  async getDocumentById(documentId: string): Promise<Document | null> {
    const documentDoc = doc(this.firestore, `documents/${documentId}`);
    const data = await firstValueFrom(docData(documentDoc, { idField: 'id' }));
    return data ? this.mapToDocument(data) : null;
  }

  /**
   * Create a new document
   */
  async createDocument(documentData: Omit<Document, 'id'>): Promise<string> {
    const data = {
      ...documentData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(this.documentsCollection, data);
    return docRef.id;
  }

  /**
   * Update a document
   */
  async updateDocument(documentId: string, data: Partial<Document>): Promise<void> {
    const documentDoc = doc(this.firestore, `documents/${documentId}`);
    const updateData = {
      ...data,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(documentDoc, updateData);
  }

  /**
   * Delete a document (soft delete)
   */
  async deleteDocument(documentId: string, deletedBy: string): Promise<void> {
    const documentDoc = doc(this.firestore, `documents/${documentId}`);
    await updateDoc(documentDoc, { 
      deletedAt: serverTimestamp(),
      deletedBy
    });
  }

  /**
   * Permanently delete a document
   */
  async permanentlyDeleteDocument(documentId: string): Promise<void> {
    const documentDoc = doc(this.firestore, `documents/${documentId}`);
    await deleteDoc(documentDoc);
  }

  /**
   * Move a document to a new parent
   */
  async moveDocument(documentId: string, newParentId: string | null, updatedBy: string): Promise<void> {
    const documentDoc = doc(this.firestore, `documents/${documentId}`);
    await updateDoc(documentDoc, {
      parentId: newParentId,
      updatedBy,
      updatedAt: serverTimestamp()
    });
  }

  /**
   * Share document with users
   */
  async shareDocument(documentId: string, userIds: string[], updatedBy: string): Promise<void> {
    const documentDoc = doc(this.firestore, `documents/${documentId}`);
    await updateDoc(documentDoc, {
      sharedWith: userIds,
      updatedBy,
      updatedAt: serverTimestamp()
    });
  }

  /**
   * Search documents
   */
  async searchDocuments(workspaceId: string, searchQuery: string): Promise<Document[]> {
    const q = query(
      this.documentsCollection,
      where('workspaceId', '==', workspaceId),
      where('deletedAt', '==', null),
      orderBy('name')
    );
    
    const snapshot = await getDocs(q);
    const allDocs = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }) as any);
    return allDocs
      .filter((doc: any) => doc.name?.toLowerCase().includes(searchQuery.toLowerCase()))
      .map((doc: any) => this.mapToDocument(doc));
  }

  /**
   * Get deleted documents
   */
  async getDeletedDocuments(workspaceId: string): Promise<Document[]> {
    const q = query(
      this.documentsCollection,
      where('workspaceId', '==', workspaceId),
      where('deletedAt', '!=', null),
      orderBy('deletedAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => this.mapToDocument({ ...doc.data(), id: doc.id }));
  }

  /**
   * Restore a deleted document
   */
  async restoreDocument(documentId: string): Promise<void> {
    const documentDoc = doc(this.firestore, `documents/${documentId}`);
    await updateDoc(documentDoc, {
      deletedAt: null,
      deletedBy: null
    });
  }

  /**
   * Get document statistics
   */
  async getDocumentStats(workspaceId: string): Promise<any> {
    const docs = await this.getWorkspaceDocuments(workspaceId);
    return {
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
    };
  }

  /**
   * Toggle document star (not in interface but needed for DocumentStore)
   */
  async toggleDocumentStar(documentId: string, userId: string, starred: boolean): Promise<void> {
    // This would require updating the document's starredBy array
    // For now, returning empty promise
    return Promise.resolve();
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
