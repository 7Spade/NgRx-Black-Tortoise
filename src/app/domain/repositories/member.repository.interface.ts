/**
 * MemberRepository contract for member data access.
 */
import { Observable } from 'rxjs';
import { Member, MemberInvitation, MemberRole, MemberStatus } from '../member/entities/member.entity';

export interface MemberRepository {
  /**
   * 獲取工作區的所有成員
   */
  getWorkspaceMembers(workspaceId: string): Observable<Member[]>;
  
  /**
   * 獲取單個成員
   */
  getMember(id: string): Observable<Member | null>;
  
  /**
   * 通過帳號 ID 獲取成員
   */
  getMemberByAccountId(workspaceId: string, accountId: string): Observable<Member | null>;
  
  /**
   * 添加成員
   */
  addMember(member: Omit<Member, 'id'>): Observable<string>;
  
  /**
   * 更新成員
   */
  updateMember(id: string, data: Partial<Member>): Observable<void>;
  
  /**
   * 移除成員
   */
  removeMember(id: string): Observable<void>;
  
  /**
   * 更新成員角色
   */
  updateMemberRole(id: string, role: MemberRole): Observable<void>;
  
  /**
   * 更新成員狀態
   */
  updateMemberStatus(id: string, status: MemberStatus): Observable<void>;
  
  /**
   * 更新最後活動時間
   */
  updateLastActive(id: string): Observable<void>;
  
  // 邀請相關
  
  /**
   * 創建成員邀請
   */
  createInvitation(invitation: Omit<MemberInvitation, 'id'>): Observable<string>;
  
  /**
   * 獲取邀請
   */
  getInvitation(id: string): Observable<MemberInvitation | null>;
  
  /**
   * 通過 token 獲取邀請
   */
  getInvitationByToken(token: string): Observable<MemberInvitation | null>;
  
  /**
   * 更新邀請狀態
   */
  updateInvitationStatus(
    id: string,
    status: 'accepted' | 'rejected' | 'expired'
  ): Observable<void>;
  
  /**
   * 獲取待處理邀請
   */
  getPendingInvitations(workspaceId: string): Observable<MemberInvitation[]>;
}
