# 01 - 領域模型與實體定義

## 🎯 目標

建立專案的核心領域模型,包括實體、值對象和領域介面。

## 📁 文件結構

```
src/app/domain/
├── entities/
│   ├── workspace.entity.ts
│   ├── module.entity.ts
│   ├── account.entity.ts
│   ├── member.entity.ts
│   ├── document.entity.ts
│   ├── task.entity.ts
│   └── notification.entity.ts
│
├── value-objects/
│   ├── workspace-id.vo.ts
│   ├── module-type.vo.ts
│   ├── permission.vo.ts
│   ├── badge.vo.ts
│   └── audit-entry.vo.ts
│
├── repositories/
│   ├── workspace.repository.ts
│   ├── module.repository.ts
│   ├── member.repository.ts
│   └── notification.repository.ts
│
└── services/
    ├── permission.service.ts
    └── audit.service.ts
```

## 📝 實體定義

### 1. Workspace Entity

**檔案**: `src/app/domain/workspace.entity.ts`

```typescript
/**
 * 工作區實體
 * 代表一個協作空間,包含多個模組和成員
 */
export interface Workspace {
  readonly id: string;
  name: string;
  description?: string;
  iconUrl?: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  
  // 成員相關
  memberIds: string[];
  memberCount: number;
  
  // 配置
  settings: WorkspaceSettings;
  
  // 統計資訊
  stats: WorkspaceStats;
}

export interface WorkspaceSettings {
  isPublic: boolean;
  allowInvites: boolean;
  defaultPermission: 'viewer' | 'editor' | 'admin';
  modules: ModuleConfig[];
}

export interface ModuleConfig {
  type: ModuleType;
  enabled: boolean;
  order: number;
  customName?: string;
  customIcon?: string;
}

export interface WorkspaceStats {
  totalDocuments: number;
  activeTasks: number;
  storageUsed: number; // in bytes
  lastActivityAt: Date;
}

/**
 * 工作區建立 DTO
 */
export interface CreateWorkspaceDto {
  name: string;
  description?: string;
  iconUrl?: string;
  isPublic?: boolean;
}
```

### 2. Module Entity

**檔案**: `src/app/domain/module.entity.ts`

```typescript
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
  requiredPermission: Permission;
  
  // 徽章
  badge?: Badge;
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
```

### 3. Account Entity

**檔案**: `src/app/domain/account.entity.ts`

```typescript
/**
 * 帳戶實體
 * 代表一個使用者身份
 */
export interface Account {
  readonly id: string;
  email: string;
  displayName: string;
  photoUrl?: string;
  
  // 身份資訊
  emailVerified: boolean;
  phoneNumber?: string;
  
  // 時間戳記
  createdAt: Date;
  lastLoginAt: Date;
  
  // 用戶偏好
  preferences: AccountPreferences;
  
  // 工作區
  workspaceIds: string[];
  currentWorkspaceId?: string;
}

export interface AccountPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  sidebarExpanded: boolean;
  defaultView: 'list' | 'grid' | 'kanban';
  notificationsEnabled: boolean;
}
```

### 4. Member Entity

**檔案**: `src/app/domain/member.entity.ts`

```typescript
/**
 * 成員角色枚舉
 */
export enum MemberRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  EDITOR = 'editor',
  VIEWER = 'viewer',
  GUEST = 'guest'
}

/**
 * 成員狀態枚舉
 */
export enum MemberStatus {
  ACTIVE = 'active',
  INVITED = 'invited',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended'
}

/**
 * 成員實體
 * 代表工作區中的一個成員
 */
export interface Member {
  readonly id: string;
  workspaceId: string;
  accountId: string;
  
  // 身份資訊
  email: string;
  displayName: string;
  photoUrl?: string;
  
  // 角色與權限
  role: MemberRole;
  customPermissions?: Permission[];
  
  // 狀態
  status: MemberStatus;
  invitedAt?: Date;
  joinedAt?: Date;
  lastActiveAt?: Date;
  
  // 邀請資訊
  invitedBy?: string;
  invitationToken?: string;
}

/**
 * 邀請成員 DTO
 */
export interface InviteMemberDto {
  email: string;
  role: MemberRole;
  message?: string;
}
```

### 5. Document Entity

**檔案**: `src/app/domain/document.entity.ts`

```typescript
/**
 * 文件類型枚舉
 */
export enum DocumentType {
  FOLDER = 'folder',
  FILE = 'file'
}

/**
 * 文件實體
 * 代表工作區中的一個文件或資料夾
 */
export interface Document {
  readonly id: string;
  workspaceId: string;
  
  // 基本資訊
  name: string;
  type: DocumentType;
  mimeType?: string;
  size?: number; // bytes
  
  // 階層結構
  parentId?: string;
  path: string;
  
  // 儲存位置
  storageUrl?: string;
  thumbnailUrl?: string;
  
  // 擁有者與權限
  ownerId: string;
  sharedWith: DocumentShare[];
  
  // 元數據
  tags: string[];
  starred: boolean;
  
  // 時間戳記
  createdAt: Date;
  updatedAt: Date;
  lastAccessedAt?: Date;
  
  // 統計
  viewCount: number;
  downloadCount: number;
}

export interface DocumentShare {
  memberId: string;
  permission: 'view' | 'edit';
  sharedAt: Date;
}

/**
 * 文件篩選器
 */
export interface DocumentFilter {
  type?: DocumentType;
  ownerId?: string;
  parentId?: string;
  tags?: string[];
  starred?: boolean;
  searchQuery?: string;
}
```

### 6. Task Entity

**檔案**: `src/app/domain/task.entity.ts`

```typescript
/**
 * 任務狀態枚舉
 */
export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  REVIEW = 'review',
  DONE = 'done',
  CANCELLED = 'cancelled'
}

/**
 * 任務優先級枚舉
 */
export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

/**
 * 任務實體
 */
export interface Task {
  readonly id: string;
  workspaceId: string;
  
  // 基本資訊
  title: string;
  description?: string;
  
  // 狀態與優先級
  status: TaskStatus;
  priority: TaskPriority;
  
  // 分配
  assigneeIds: string[];
  reporterId: string;
  
  // 時間
  dueDate?: Date;
  startDate?: Date;
  completedAt?: Date;
  
  // 關聯
  parentTaskId?: string;
  documentIds: string[];
  tags: string[];
  
  // 進度
  progress: number; // 0-100
  checklistItems: ChecklistItem[];
  
  // 時間戳記
  createdAt: Date;
  updatedAt: Date;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  completedAt?: Date;
  completedBy?: string;
}

/**
 * 任務篩選器
 */
export interface TaskFilter {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  assigneeIds?: string[];
  tags?: string[];
  dueDateFrom?: Date;
  dueDateTo?: Date;
  searchQuery?: string;
}
```

### 7. Notification Entity

**檔案**: `src/app/domain/notification.entity.ts`

```typescript
/**
 * 通知類型枚舉
 */
export enum NotificationType {
  MENTION = 'mention',
  TASK_ASSIGNED = 'task_assigned',
  COMMENT = 'comment',
  DOCUMENT_SHARED = 'document_shared',
  MEMBER_INVITED = 'member_invited',
  SYSTEM = 'system'
}

/**
 * 通知實體
 */
export interface Notification {
  readonly id: string;
  recipientId: string;
  workspaceId: string;
  
  // 內容
  type: NotificationType;
  title: string;
  message: string;
  icon?: string;
  
  // 關聯
  relatedEntityType?: 'task' | 'document' | 'member';
  relatedEntityId?: string;
  actionUrl?: string;
  
  // 發送者
  senderId?: string;
  senderName?: string;
  
  // 狀態
  read: boolean;
  readAt?: Date;
  
  // 時間戳記
  createdAt: Date;
}

/**
 * 通知偏好設定
 */
export interface NotificationPreferences {
  mentions: boolean;
  taskAssignments: boolean;
  comments: boolean;
  documentShares: boolean;
  memberActivity: boolean;
  systemNotifications: boolean;
  emailNotifications: boolean;
}
```

## 📦 值對象定義

### 1. Permission Value Object

**檔案**: `src/app/domain/value-objects/permission.vo.ts`

```typescript
/**
 * 權限值對象
 */
export enum Permission {
  // 工作區權限
  WORKSPACE_VIEW = 'workspace.view',
  WORKSPACE_EDIT = 'workspace.edit',
  WORKSPACE_DELETE = 'workspace.delete',
  WORKSPACE_MANAGE_MEMBERS = 'workspace.manage_members',
  
  // 文件權限
  DOCUMENT_VIEW = 'document.view',
  DOCUMENT_CREATE = 'document.create',
  DOCUMENT_EDIT = 'document.edit',
  DOCUMENT_DELETE = 'document.delete',
  DOCUMENT_SHARE = 'document.share',
  
  // 任務權限
  TASK_VIEW = 'task.view',
  TASK_CREATE = 'task.create',
  TASK_EDIT = 'task.edit',
  TASK_DELETE = 'task.delete',
  TASK_ASSIGN = 'task.assign',
  
  // 成員權限
  MEMBER_VIEW = 'member.view',
  MEMBER_INVITE = 'member.invite',
  MEMBER_REMOVE = 'member.remove',
  MEMBER_EDIT_ROLE = 'member.edit_role',
  
  // 設定權限
  SETTINGS_VIEW = 'settings.view',
  SETTINGS_EDIT = 'settings.edit',
  
  // 稽核權限
  AUDIT_VIEW = 'audit.view'
}

/**
 * 角色權限映射
 */
export const ROLE_PERMISSIONS: Record<MemberRole, Permission[]> = {
  [MemberRole.OWNER]: [
    // 擁有所有權限
    ...Object.values(Permission)
  ],
  [MemberRole.ADMIN]: [
    Permission.WORKSPACE_VIEW,
    Permission.WORKSPACE_EDIT,
    Permission.WORKSPACE_MANAGE_MEMBERS,
    Permission.DOCUMENT_VIEW,
    Permission.DOCUMENT_CREATE,
    Permission.DOCUMENT_EDIT,
    Permission.DOCUMENT_DELETE,
    Permission.DOCUMENT_SHARE,
    Permission.TASK_VIEW,
    Permission.TASK_CREATE,
    Permission.TASK_EDIT,
    Permission.TASK_DELETE,
    Permission.TASK_ASSIGN,
    Permission.MEMBER_VIEW,
    Permission.MEMBER_INVITE,
    Permission.SETTINGS_VIEW,
    Permission.SETTINGS_EDIT,
    Permission.AUDIT_VIEW
  ],
  [MemberRole.EDITOR]: [
    Permission.WORKSPACE_VIEW,
    Permission.DOCUMENT_VIEW,
    Permission.DOCUMENT_CREATE,
    Permission.DOCUMENT_EDIT,
    Permission.DOCUMENT_SHARE,
    Permission.TASK_VIEW,
    Permission.TASK_CREATE,
    Permission.TASK_EDIT,
    Permission.TASK_ASSIGN,
    Permission.MEMBER_VIEW,
    Permission.SETTINGS_VIEW
  ],
  [MemberRole.VIEWER]: [
    Permission.WORKSPACE_VIEW,
    Permission.DOCUMENT_VIEW,
    Permission.TASK_VIEW,
    Permission.MEMBER_VIEW,
    Permission.SETTINGS_VIEW
  ],
  [MemberRole.GUEST]: [
    Permission.WORKSPACE_VIEW,
    Permission.DOCUMENT_VIEW,
    Permission.TASK_VIEW
  ]
};
```

### 2. Badge Value Object

**檔案**: `src/app/domain/value-objects/badge.vo.ts`

```typescript
/**
 * 徽章類型枚舉
 */
export enum BadgeType {
  COUNT = 'count',
  DOT = 'dot',
  NONE = 'none'
}

/**
 * 徽章值對象
 */
export interface Badge {
  type: BadgeType;
  count?: number;
  color: 'primary' | 'accent' | 'warn' | 'success' | 'info';
  tooltip?: string;
}

/**
 * 建立計數徽章
 */
export function createCountBadge(
  count: number,
  color: Badge['color'] = 'warn'
): Badge | undefined {
  if (count <= 0) {
    return undefined;
  }
  
  return {
    type: BadgeType.COUNT,
    count,
    color
  };
}

/**
 * 建立點徽章
 */
export function createDotBadge(
  color: Badge['color'] = 'warn',
  tooltip?: string
): Badge {
  return {
    type: BadgeType.DOT,
    color,
    tooltip
  };
}
```

### 3. Audit Entry Value Object

**檔案**: `src/app/domain/value-objects/audit-entry.vo.ts`

```typescript
/**
 * 稽核事件類型
 */
export enum AuditEventType {
  CREATED = 'created',
  UPDATED = 'updated',
  DELETED = 'deleted',
  SHARED = 'shared',
  ACCESSED = 'accessed',
  PERMISSION_CHANGED = 'permission_changed'
}

/**
 * 稽核記錄值對象
 */
export interface AuditEntry {
  readonly id: string;
  workspaceId: string;
  
  // 事件資訊
  eventType: AuditEventType;
  entityType: string;
  entityId: string;
  entityName: string;
  
  // 執行者
  actorId: string;
  actorName: string;
  actorEmail: string;
  
  // 變更詳情
  changes?: Record<string, { old: any; new: any }>;
  metadata?: Record<string, any>;
  
  // 技術資訊
  ipAddress?: string;
  userAgent?: string;
  
  // 時間戳記
  timestamp: Date;
}
```

## 🔗 Repository 介面定義

### 1. Workspace Repository

**檔案**: `src/app/domain/repositories/workspace.repository.ts`

```typescript
import { Observable } from 'rxjs';
import { Workspace, CreateWorkspaceDto } from '../entities/workspace.entity';

/**
 * 工作區倉儲介面
 */
export abstract class WorkspaceRepository {
  abstract findById(id: string): Observable<Workspace | null>;
  abstract findByAccountId(accountId: string): Observable<Workspace[]>;
  abstract create(dto: CreateWorkspaceDto, ownerId: string): Observable<Workspace>;
  abstract update(id: string, updates: Partial<Workspace>): Observable<void>;
  abstract delete(id: string): Observable<void>;
  abstract exists(id: string): Observable<boolean>;
}
```

### 2. Module Repository

**檔案**: `src/app/domain/repositories/module.repository.ts`

```typescript
import { Observable } from 'rxjs';
import { Module, ModuleType } from '../entities/module.entity';

/**
 * 模組倉儲介面
 */
export abstract class ModuleRepository {
  abstract findByWorkspaceId(workspaceId: string): Observable<Module[]>;
  abstract findByType(workspaceId: string, type: ModuleType): Observable<Module | null>;
  abstract updateOrder(workspaceId: string, moduleOrders: { id: string; order: number }[]): Observable<void>;
  abstract updateVisibility(moduleId: string, visible: boolean): Observable<void>;
}
```

## ✅ 實施步驟

### Step 1: 建立領域實體

```bash
# 建立目錄結構
mkdir -p src/app/domain
mkdir -p src/app/domain/value-objects
mkdir -p src/app/domain/repositories
mkdir -p src/app/domain/services

# 建立實體檔案
# 依序建立上述所有實體檔案
```

### Step 2: 建立值對象

```bash
# 建立值對象檔案
# 依序建立上述所有值對象檔案
```

### Step 3: 建立倉儲介面

```bash
# 建立倉儲介面檔案
# 依序建立上述所有倉儲介面檔案
```

### Step 4: 建立索引檔案

**檔案**: `src/app/domain/index.ts`

```typescript
// Entities
export * from './entities/workspace.entity';
export * from './entities/module.entity';
export * from './entities/account.entity';
export * from './entities/member.entity';
export * from './entities/document.entity';
export * from './entities/task.entity';
export * from './entities/notification.entity';

// Value Objects
export * from './value-objects/permission.vo';
export * from './value-objects/badge.vo';
export * from './value-objects/audit-entry.vo';

// Repositories
export * from './repositories/workspace.repository';
export * from './repositories/module.repository';
export * from './repositories/member.repository';
export * from './repositories/notification.repository';
```

## 🧪 測試檢查清單

- [ ] 所有實體檔案建立完成
- [ ] 所有值對象檔案建立完成
- [ ] 所有倉儲介面檔案建立完成
- [ ] TypeScript 編譯無錯誤
- [ ] ESLint 檢查通過
- [ ] 匯出索引檔案建立完成

## 📝 注意事項

1. **不可變性**: 使用 `readonly` 標記 ID 欄位,防止意外修改
2. **類型安全**: 使用 TypeScript 的 strict 模式確保類型安全
3. **介面優先**: 定義介面而非類別,保持領域層的純淨
4. **值對象**: 使用值對象封裝領域概念,提高可讀性
5. **倉儲模式**: 使用抽象類別定義倉儲介面,實現在基礎設施層

---

**完成此步驟後,請繼續 `02-STATE-MANAGEMENT.md`**
