/**
 * DocumentRepository contract for document data access.
 * 
 * Domain layer repository interface - framework-agnostic.
 * Returns Promises to avoid RxJS/framework dependencies in domain layer.
 */
import { Document, DocumentStats, DocumentType } from '../document/entities/document.entity';

export interface DocumentRepository {
  /**
   * 獲取工作區的所有文件
   */
  getWorkspaceDocuments(workspaceId: string): Promise<Document[]>;
  
  /**
   * 獲取特定文件夾下的文件
   */
  getFolderDocuments(workspaceId: string, parentId: string | null): Promise<Document[]>;
  
  /**
   * 獲取單個文件
   */
  getDocument(id: string): Promise<Document | null>;
  
  /**
   * 創建文件或文件夾
   */
  createDocument(document: Omit<Document, 'id'>): Promise<string>;
  
  /**
   * 更新文件
   */
  updateDocument(id: string, data: Partial<Document>): Promise<void>;
  
  /**
   * 刪除文件 (軟刪除)
   */
  deleteDocument(id: string, deletedBy: string): Promise<void>;
  
  /**
   * 永久刪除文件
   */
  permanentlyDeleteDocument(id: string): Promise<void>;
  
  /**
   * 移動文件
   */
  moveDocument(id: string, newParentId: string | null, updatedBy: string): Promise<void>;
  
  /**
   * 分享文件
   */
  shareDocument(id: string, userIds: string[], updatedBy: string): Promise<void>;
  
  /**
   * 搜尋文件
   */
  searchDocuments(workspaceId: string, query: string): Promise<Document[]>;
  
  /**
   * 獲取最近文件
   */
  getRecentDocuments(workspaceId: string, userId: string, limit?: number): Promise<Document[]>;
  
  /**
   * 獲取已刪除文件
   */
  getDeletedDocuments(workspaceId: string): Promise<Document[]>;
  
  /**
   * 恢復已刪除文件
   */
  restoreDocument(id: string): Promise<void>;
  
  /**
   * 獲取文件統計
   */
  getDocumentStats(workspaceId: string): Promise<DocumentStats>;
}
