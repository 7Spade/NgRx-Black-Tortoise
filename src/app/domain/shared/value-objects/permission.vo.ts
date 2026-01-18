import { MemberRole } from '../member/entities/member.entity';

/**
 * 權限類型
 */
export type PermissionType =
  // 工作區
  | 'workspace.view'
  | 'workspace.edit'
  | 'workspace.delete'
  | 'workspace.admin'
  
  // 成員管理
  | 'members.view'
  | 'members.invite'
  | 'members.remove'
  | 'members.manage_roles'
  
  // 文件管理
  | 'documents.view'
  | 'documents.create'
  | 'documents.edit'
  | 'documents.delete'
  | 'documents.share'
  
  // 任務管理
  | 'tasks.view'
  | 'tasks.create'
  | 'tasks.edit'
  | 'tasks.delete'
  | 'tasks.assign'
  
  // 設定管理
  | 'settings.view'
  | 'settings.edit'
  
  // 權限管理
  | 'permissions.view'
  | 'permissions.edit'
  
  // 稽核日誌
  | 'audit.view'
  | 'audit.export';

/**
 * 權限值物件
 */
export class Permission {
  private constructor(private readonly value: PermissionType) {}

  static create(value: PermissionType): Permission {
    return new Permission(value);
  }

  getValue(): PermissionType {
    return this.value;
  }

  equals(other: Permission): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}

/**
 * 角色權限映射
 * 定義每個角色預設擁有的權限集合
 */
export const ROLE_PERMISSIONS: Record<MemberRole, PermissionType[]> = {
  [MemberRole.OWNER]: [
    // 所有權限
    'workspace.view',
    'workspace.edit',
    'workspace.delete',
    'workspace.admin',
    'members.view',
    'members.invite',
    'members.remove',
    'members.manage_roles',
    'documents.view',
    'documents.create',
    'documents.edit',
    'documents.delete',
    'documents.share',
    'tasks.view',
    'tasks.create',
    'tasks.edit',
    'tasks.delete',
    'tasks.assign',
    'settings.view',
    'settings.edit',
    'permissions.view',
    'permissions.edit',
    'audit.view',
    'audit.export'
  ],
  
  [MemberRole.ADMIN]: [
    // 大部分權限，但不能刪除工作區
    'workspace.view',
    'workspace.edit',
    'workspace.admin',
    'members.view',
    'members.invite',
    'members.remove',
    'members.manage_roles',
    'documents.view',
    'documents.create',
    'documents.edit',
    'documents.delete',
    'documents.share',
    'tasks.view',
    'tasks.create',
    'tasks.edit',
    'tasks.delete',
    'tasks.assign',
    'settings.view',
    'settings.edit',
    'permissions.view',
    'permissions.edit',
    'audit.view',
    'audit.export'
  ],
  
  [MemberRole.MEMBER]: [
    // 基本權限
    'workspace.view',
    'members.view',
    'documents.view',
    'documents.create',
    'documents.edit',
    'documents.share',
    'tasks.view',
    'tasks.create',
    'tasks.edit',
    'tasks.assign',
    'settings.view'
  ],
  
  [MemberRole.GUEST]: [
    // 只讀權限
    'workspace.view',
    'members.view',
    'documents.view',
    'tasks.view',
    'settings.view'
  ]
};

/**
 * 權限檢查輔助函數
 */
export function hasPermission(
  role: MemberRole,
  permission: PermissionType,
  customPermissions?: string[]
): boolean {
  // 檢查角色預設權限
  const rolePermissions = ROLE_PERMISSIONS[role];
  if (rolePermissions.includes(permission)) {
    return true;
  }
  
  // 檢查自訂權限
  if (customPermissions && customPermissions.includes(permission)) {
    return true;
  }
  
  return false;
}

/**
 * 獲取角色所有權限
 */
export function getRolePermissions(
  role: MemberRole,
  customPermissions?: string[]
): PermissionType[] {
  const rolePermissions = [...ROLE_PERMISSIONS[role]];
  
  if (customPermissions) {
    customPermissions.forEach(permission => {
      if (!rolePermissions.includes(permission as PermissionType)) {
        rolePermissions.push(permission as PermissionType);
      }
    });
  }
  
  return rolePermissions;
}
