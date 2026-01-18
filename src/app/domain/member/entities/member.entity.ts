/**
 * 成員角色枚舉
 */
export enum MemberRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member',
  GUEST = 'guest'
}

/**
 * 成員狀態枚舉
 */
export enum MemberStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  SUSPENDED = 'suspended'
}

/**
 * 成員實體
 * 代表工作區中的一位成員
 */
export interface Member {
  readonly id: string;
  workspaceId: string;
  accountId: string;
  
  // 基本資訊 (來自 Account entity)
  email: string;
  displayName: string;
  photoURL?: string;
  
  // 角色與權限
  role: MemberRole;
  customPermissions?: string[];
  
  // 狀態
  status: MemberStatus;
  
  // 時間戳
  joinedAt: Date;
  lastActiveAt?: Date;
  invitedBy?: string;
  
  // 其他
  bio?: string;
  title?: string;
  department?: string;
}

/**
 * 成員邀請實體
 */
export interface MemberInvitation {
  readonly id: string;
  workspaceId: string;
  email: string;
  role: MemberRole;
  
  // 邀請狀態
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  token: string;
  expiresAt: Date;
  
  // 時間戳
  createdAt: Date;
  createdBy: string;
  acceptedAt?: Date;
  rejectedAt?: Date;
}
