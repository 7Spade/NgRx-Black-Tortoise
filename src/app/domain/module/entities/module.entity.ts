/**
 * 模組類型枚舉
 */
export enum ModuleType {
  OVERVIEW = 'overview',
  DOCUMENTS = 'documents',
  TASKS = 'tasks',
  MEMBERS = 'members',
  PERMISSIONS = 'permissions',
  AUDIT = 'audit',
  SETTINGS = 'settings',
  JOURNAL = 'journal'
}

/**
 * 模組實體
 * 代表工作區中的一個功能模組
 */
export interface Module {
  readonly id: string;
  workspaceId: string;
  type: ModuleType;
  name: string;
  description: string;
  icon: string;
  route: string;
  
  // 顯示設定
  order: number;
  enabled: boolean;
  visible: boolean;
  
  // 權限
  requiredPermission?: string;
  
  // 徽章
  badge?: {
    type: 'count' | 'dot' | 'none';
    count?: number;
    color: 'primary' | 'accent' | 'warn' | 'success' | 'info';
    tooltip?: string;
  };
}

/**
 * 模組元數據 (靜態定義)
 */
export interface ModuleMetadata {
  type: ModuleType;
  defaultName: string;
  defaultIcon: string;
  description: string;
  defaultOrder: number;
  defaultEnabled: boolean;
}

/**
 * 預設模組配置
 */
export const DEFAULT_MODULES: ModuleMetadata[] = [
  {
    type: ModuleType.OVERVIEW,
    defaultName: 'Overview',
    defaultIcon: 'dashboard',
    description: '工作區總覽儀表板',
    defaultOrder: 0,
    defaultEnabled: true
  },
  {
    type: ModuleType.DOCUMENTS,
    defaultName: 'Documents',
    defaultIcon: 'folder',
    description: '文件與資料夾管理',
    defaultOrder: 1,
    defaultEnabled: true
  },
  {
    type: ModuleType.TASKS,
    defaultName: 'Tasks',
    defaultIcon: 'check_circle',
    description: '任務與待辦事項',
    defaultOrder: 2,
    defaultEnabled: true
  },
  {
    type: ModuleType.MEMBERS,
    defaultName: 'Members',
    defaultIcon: 'group',
    description: '成員與團隊管理',
    defaultOrder: 3,
    defaultEnabled: true
  },
  {
    type: ModuleType.PERMISSIONS,
    defaultName: 'Permissions',
    defaultIcon: 'lock',
    description: '權限與角色設定',
    defaultOrder: 4,
    defaultEnabled: true
  },
  {
    type: ModuleType.AUDIT,
    defaultName: 'Audit',
    defaultIcon: 'description',
    description: '稽核日誌與合規',
    defaultOrder: 5,
    defaultEnabled: true
  },
  {
    type: ModuleType.SETTINGS,
    defaultName: 'Settings',
    defaultIcon: 'settings',
    description: '工作區設定',
    defaultOrder: 6,
    defaultEnabled: true
  },
  {
    type: ModuleType.JOURNAL,
    defaultName: 'Journal',
    defaultIcon: 'event_note',
    description: '活動時間軸',
    defaultOrder: 7,
    defaultEnabled: true
  }
];
