/**
 * 文件類型枚舉
 */
export enum DocumentType {
  FOLDER = 'folder',
  FILE = 'file',
  LINK = 'link'
}

/**
 * 文件圖標映射
 */
export const DOCUMENT_ICON_MAP: Record<string, string> = {
  // Folders
  folder: 'folder',
  
  // Documents
  'text/plain': 'description',
  'application/pdf': 'picture_as_pdf',
  'application/msword': 'description',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'description',
  
  // Spreadsheets
  'application/vnd.ms-excel': 'table_chart',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'table_chart',
  
  // Presentations
  'application/vnd.ms-powerpoint': 'slideshow',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'slideshow',
  
  // Images
  'image/jpeg': 'image',
  'image/png': 'image',
  'image/gif': 'image',
  'image/svg+xml': 'image',
  
  // Videos
  'video/mp4': 'videocam',
  'video/avi': 'videocam',
  'video/quicktime': 'videocam',
  
  // Archives
  'application/zip': 'folder_zip',
  'application/x-rar-compressed': 'folder_zip',
  'application/x-7z-compressed': 'folder_zip',
  
  // Code
  'text/html': 'code',
  'text/css': 'code',
  'text/javascript': 'code',
  'application/json': 'code',
  
  // Default
  default: 'insert_drive_file'
};

/**
 * 文件實體
 * 代表工作區中的文件或資料夾
 */
export interface Document {
  readonly id: string;
  workspaceId: string;
  
  // 基本資訊
  name: string;
  type: DocumentType;
  mimeType?: string;
  size?: number;
  
  // 組織結構
  parentId: string | null;
  path: string;
  level: number;
  
  // 擁有者與權限
  ownerId: string;
  sharedWith?: string[];
  permissions?: string;
  
  // 文件內容 (for files)
  url?: string;
  storageRef?: string;
  thumbnailUrl?: string;
  
  // Link類型 (for links)
  linkUrl?: string;
  linkTitle?: string;
  
  // 版本控制
  version?: number;
  versionHistory?: {
    version: number;
    createdAt: Date;
    createdBy: string;
    comment?: string;
  }[];
  
  // 元數據
  tags?: string[];
  description?: string;
  
  // 時間戳
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  deletedAt?: Date;
  deletedBy?: string;
}

/**
 * 文件統計資訊
 */
export interface DocumentStats {
  totalFiles: number;
  totalFolders: number;
  totalSize: number;
  filesByType: Record<string, number>;
  recentDocuments: Document[];
}
