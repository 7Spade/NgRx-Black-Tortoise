/**
 * MemberRepository contract for member data access.
 * 
 * Domain layer repository interface - framework-agnostic.
 * Returns Promises to avoid RxJS/framework dependencies in domain layer.
 */
import { Member, MemberInvitation, MemberRole, MemberStatus } from '../member/entities/member.entity';

export interface MemberRepository {
  /**
   * 獲取工作區的所有成員
   */
  getWorkspaceMembers(workspaceId: string): Promise<Member[]>;
  
  /**
   * 獲取單個成員
   */
  getMember(id: string): Promise<Member | null>;
  
  /**
   * 通過帳號 ID 獲取成員
   */
  getMemberByAccountId(workspaceId: string, accountId: string): Promise<Member | null>;
  
  /**
   * 添加成員
   */
  addMember(member: Omit<Member, 'id'>): Promise<string>;
  
  /**
   * 更新成員
   */
  updateMember(id: string, data: Partial<Member>): Promise<void>;
  
  /**
   * 移除成員
   */
  removeMember(id: string): Promise<void>;
  
  /**
   * 更新成員角色
   */
  updateMemberRole(id: string, role: MemberRole): Promise<void>;
  
  /**
   * 更新成員狀態
   */
  updateMemberStatus(id: string, status: MemberStatus): Promise<void>;
  
  /**
   * 更新最後活動時間
   */
  updateLastActive(id: string): Promise<void>;
  
  // 邀請相關
  
  /**
   * 創建成員邀請
   */
  createInvitation(invitation: Omit<MemberInvitation, 'id'>): Promise<string>;
  
  /**
   * 獲取邀請
   */
  getInvitation(id: string): Promise<MemberInvitation | null>;
  
  /**
   * 通過 token 獲取邀請
   */
  getInvitationByToken(token: string): Promise<MemberInvitation | null>;
  
  /**
   * 更新邀請狀態
   */
  updateInvitationStatus(
    id: string,
    status: 'accepted' | 'rejected' | 'expired'
  ): Promise<void>;
  
  /**
   * 獲取待處理邀請
   */
  getPendingInvitations(workspaceId: string): Promise<MemberInvitation[]>;
}
