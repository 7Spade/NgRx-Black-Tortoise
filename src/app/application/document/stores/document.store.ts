/**
 * Document Store
 * 
 * Manages workspace documents state using NgRx Signals.
 * Handles document lifecycle, starring, and organization.
 * 
 * Reactive Auto-loading:
 * - Loads documents when workspace changes
 * - Tracks recent and starred documents
 * - Supports document types and folders
 */

import { signalStore, withState, withComputed, withMethods, withHooks, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { computed, effect, inject } from '@angular/core';
import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';

// Domain
import { Document, DocumentType } from '@domain/document';
import { DocumentRepository } from '@domain/repositories/document.repository.interface';

// Application
import { DOCUMENT_REPOSITORY } from '@application/tokens';
import { WorkspaceStore } from '@application/workspace/stores/workspace.store';
import { AuthStore } from '@application/auth/stores/auth.store';

/**
 * Document State Interface
 */
export interface DocumentState {
  documents: Document[];
  recentDocuments: Document[];
  starredDocuments: Document[];
  loading: boolean;
  error: string | null;
}

/**
 * Initial Document State
 */
const initialState: DocumentState = {
  documents: [],
  recentDocuments: [],
  starredDocuments: [],
  loading: false,
  error: null
};

/**
 * Document Store
 * 
 * Provides reactive document management with auto-loading when workspace changes.
 */
export const DocumentStore = signalStore(
  { providedIn: 'root' },
  
  withState(initialState),
  
  withComputed(({ documents, recentDocuments, starredDocuments }) => ({
    /**
     * Get documents by type
     */
    noteDocuments: computed(() => 
      documents().filter(d => d.type === 'note')
    ),
    
    spreadsheetDocuments: computed(() => 
      documents().filter(d => d.type === 'spreadsheet')
    ),
    
    presentationDocuments: computed(() => 
      documents().filter(d => d.type === 'presentation')
    ),
    
    folderDocuments: computed(() => 
      documents().filter(d => d.type === 'folder')
    ),
    
    /**
     * Get document count
     */
    documentCount: computed(() => documents().length),
    
    recentDocumentCount: computed(() => recentDocuments().length),
    
    starredDocumentCount: computed(() => starredDocuments().length),
    
    /**
     * Check if documents are loaded
     */
    hasDocuments: computed(() => documents().length > 0),
    
    hasRecentDocuments: computed(() => recentDocuments().length > 0),
    
    hasStarredDocuments: computed(() => starredDocuments().length > 0)
  })),
  
  withMethods((store, documentRepository = inject(DOCUMENT_REPOSITORY), authStore = inject(AuthStore)) => ({
    /**
     * Load all documents for a workspace
     */
    loadWorkspaceDocuments: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((workspaceId) => documentRepository.getWorkspaceDocuments(workspaceId)),
        tapResponse({
          next: (documents) => patchState(store, { documents, loading: false }),
          error: (error: Error) => patchState(store, { 
            error: error.message, 
            loading: false 
          })
        })
      )
    ),
    
    /**
     * Load documents by type
     */
    loadDocumentsByType: rxMethod<{ workspaceId: string; type: DocumentType }>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(({ workspaceId, type }) => 
          documentRepository.getDocumentsByType(workspaceId, type)
        ),
        tapResponse({
          next: (documents) => patchState(store, { documents, loading: false }),
          error: (error: Error) => patchState(store, { 
            error: error.message, 
            loading: false 
          })
        })
      )
    ),
    
    /**
     * Load recent documents
     */
    loadRecentDocuments: rxMethod<{ workspaceId: string; limit?: number }>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(({ workspaceId, limit = 10 }) => 
          documentRepository.getRecentDocuments(workspaceId, limit)
        ),
        tapResponse({
          next: (documents) => patchState(store, { 
            recentDocuments: documents, 
            loading: false 
          }),
          error: (error: Error) => patchState(store, { 
            error: error.message, 
            loading: false 
          })
        })
      )
    ),
    
    /**
     * Load starred documents for current user
     */
    loadStarredDocuments: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((workspaceId) => {
          const user = authStore.user();
          if (!user) {
            throw new Error('User not authenticated');
          }
          return documentRepository.getStarredDocuments(workspaceId, user.uid);
        }),
        tapResponse({
          next: (documents) => patchState(store, { 
            starredDocuments: documents, 
            loading: false 
          }),
          error: (error: Error) => patchState(store, { 
            error: error.message, 
            loading: false 
          })
        })
      )
    ),
    
    /**
     * Create a new document
     */
    createDocument: rxMethod<Omit<Document, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((documentData) => documentRepository.createDocument(documentData)),
        tapResponse({
          next: (document) => patchState(store, (state) => ({
            documents: [...state.documents, document],
            loading: false
          })),
          error: (error: Error) => patchState(store, { 
            error: error.message, 
            loading: false 
          })
        })
      )
    ),
    
    /**
     * Update a document
     */
    updateDocument: rxMethod<{ documentId: string; data: Partial<Document> }>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(({ documentId, data }) => 
          documentRepository.updateDocument(documentId, data)
        ),
        tapResponse({
          next: () => {
            // Update local state optimistically
            patchState(store, (state) => ({
              documents: state.documents.map(d => 
                d.id === documentId ? { ...d, ...data } : d
              ),
              loading: false
            }));
          },
          error: (error: Error) => patchState(store, { 
            error: error.message, 
            loading: false 
          })
        })
      )
    ),
    
    /**
     * Delete a document (soft delete)
     */
    deleteDocument: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((documentId) => documentRepository.deleteDocument(documentId)),
        tapResponse({
          next: () => {
            // Remove from local state
            patchState(store, (state) => ({
              documents: state.documents.filter(d => d.id !== documentId),
              recentDocuments: state.recentDocuments.filter(d => d.id !== documentId),
              starredDocuments: state.starredDocuments.filter(d => d.id !== documentId),
              loading: false
            }));
          },
          error: (error: Error) => patchState(store, { 
            error: error.message, 
            loading: false 
          })
        })
      )
    ),
    
    /**
     * Toggle document star
     */
    toggleDocumentStar: rxMethod<{ documentId: string; starred: boolean }>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(({ documentId, starred }) => {
          const user = authStore.user();
          if (!user) {
            throw new Error('User not authenticated');
          }
          return documentRepository.toggleDocumentStar(documentId, user.uid, starred);
        }),
        tapResponse({
          next: () => {
            // Update local state
            const user = authStore.user();
            if (user) {
              patchState(store, (state) => ({
                documents: state.documents.map(d => {
                  if (d.id === documentId) {
                    const starredBy = starred
                      ? [...d.starredBy, user.uid]
                      : d.starredBy.filter(id => id !== user.uid);
                    return { ...d, starredBy };
                  }
                  return d;
                }),
                loading: false
              }));
            }
          },
          error: (error: Error) => patchState(store, { 
            error: error.message, 
            loading: false 
          })
        })
      )
    ),
    
    /**
     * Clear all documents
     */
    clearDocuments() {
      patchState(store, initialState);
    }
  })),
  
  withHooks({
    onInit(store, workspaceStore = inject(WorkspaceStore)) {
      // Auto-load documents when workspace changes
      effect(() => {
        const currentWorkspace = workspaceStore.currentWorkspace();
        
        if (currentWorkspace) {
          store.loadWorkspaceDocuments(currentWorkspace.id);
          store.loadRecentDocuments({ workspaceId: currentWorkspace.id, limit: 10 });
          store.loadStarredDocuments(currentWorkspace.id);
        } else {
          patchState(store, initialState);
        }
      });
    }
  })
);
