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
    folderDocuments: computed(() => 
      documents().filter(d => d.type === DocumentType.FOLDER)
    ),
    
    fileDocuments: computed(() => 
      documents().filter(d => d.type === DocumentType.FILE)
    ),
    
    linkDocuments: computed(() => 
      documents().filter(d => d.type === DocumentType.LINK)
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
     * Load recent documents
     */
    loadRecentDocuments: rxMethod<{ workspaceId: string; userId: string; limit?: number }>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(({ workspaceId, userId, limit }) => 
          documentRepository.getRecentDocuments(workspaceId, userId, limit)
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
     * Create a new document
     */
    createDocument: rxMethod<Omit<Document, 'id'>>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((documentData) => documentRepository.createDocument(documentData)),
        tapResponse({
          next: () => patchState(store, { loading: false }),
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
        switchMap(({ documentId, data }) => 
          documentRepository.updateDocument(documentId, data).pipe(
            tap(() => {
              // Update local state optimistically
              patchState(store, (state) => ({
                documents: state.documents.map(d => 
                  d.id === documentId ? { ...d, ...data } : d
                )
              }));
            })
          )
        ),
        tapResponse({
          next: () => patchState(store, { loading: false }),
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
    deleteDocument: rxMethod<{ documentId: string; deletedBy: string }>(
      pipe(
        switchMap(({ documentId, deletedBy }) => 
          documentRepository.deleteDocument(documentId, deletedBy).pipe(
            tap(() => {
              // Remove from local state
              patchState(store, (state) => ({
                documents: state.documents.filter(d => d.id !== documentId),
                recentDocuments: state.recentDocuments.filter(d => d.id !== documentId),
                starredDocuments: state.starredDocuments.filter(d => d.id !== documentId)
              }));
            })
          )
        ),
        tapResponse({
          next: () => patchState(store, { loading: false }),
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
    onInit(store, workspaceStore = inject(WorkspaceStore), authStore = inject(AuthStore)) {
      // Auto-load documents when workspace changes
      effect(() => {
        const currentWorkspace = workspaceStore.currentWorkspace();
        const user = authStore.user();
        
        if (currentWorkspace && user?.id) {
          store.loadWorkspaceDocuments(currentWorkspace.id);
          store.loadRecentDocuments({ 
            workspaceId: currentWorkspace.id, 
            userId: user.id,
            limit: 10 
          });
        } else {
          patchState(store, initialState);
        }
      });
    }
  })
);
