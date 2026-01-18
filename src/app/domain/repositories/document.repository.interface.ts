/**
 * DocumentRepository contract for document data access.
 */
import { Observable } from 'rxjs';
import { Document, DocumentStats, DocumentType } from '../document/entities/document.entity';

export interface DocumentRepository {
  /**
   * 獲取工作區的所有文件
   */
  getWorkspaceDocuments(workspaceId: string): Observable<Document[]>;
  
  /**
   * 獲取特定文件夾下的文件
   */
  getFolderDocuments(workspaceId: string, parentId: string | null): Observable<Document[]>;
  
  /**
   * 獲取單個文件
   */
  getDocument(id: string): Observable<Document | null>;
  
  /**
   * 創建文件或文件夾
   */
  createDocument(document: Omit<Document, 'id'>): Observable<string>;
  
  /**
   * 更新文件
   */
  updateDocument(id: string, data: Partial<Document>): Observable<void>;
  
  /**
   * 刪除文件 (軟刪除)
   */
  deleteDocument(id: string, deletedBy: string): Observable<void>;
  
  /**
   * 永久刪除文件
   */
  permanentlyDeleteDocument(id: string): Observable<void>;
  
  /**
   * 移動文件
   */
  moveDocument(id: string, newParentId: string | null, updatedBy: string): Observable<void>;
  
  /**
   * 分享文件
   */
  shareDocument(id: string, userIds: string[], updatedBy: string): Observable<void>;
  
  /**
   * 搜尋文件
   */
  searchDocuments(workspaceId: string, query: string): Observable<Document[]>;
  
  /**
   * 獲取最近文件
   */
  getRecentDocuments(workspaceId: string, userId: string, limit?: number): Observable<Document[]>;
  
  /**
   * 獲取已刪除文件
   */
  getDeletedDocuments(workspaceId: string): Observable<Document[]>;
  
  /**
   * 恢復已刪除文件
   */
  restoreDocument(id: string): Observable<void>;
  
  /**
   * 獲取文件統計
   */
  getDocumentStats(workspaceId: string): Observable<DocumentStats>;
}
