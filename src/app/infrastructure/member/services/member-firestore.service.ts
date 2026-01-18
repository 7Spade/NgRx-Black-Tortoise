import { inject, Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  docData,
  collectionData,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
  getDocs
} from '@angular/fire/firestore';
import { firstValueFrom } from 'rxjs';

// Domain
import { Member, MemberRole, MemberStatus, MemberInvitation } from '@domain/member';
import { MemberRepository } from '@domain/repositories/member.repository.interface';

/**
 * Firestore implementation of MemberRepository
 * Promise-based implementation for framework-agnostic domain layer
 */
@Injectable({
  providedIn: 'root'
})
export class MemberFirestoreService implements MemberRepository {
  private firestore = inject(Firestore);
  private membersCollection = collection(this.firestore, 'members');

  /**
   * Get all members for a workspace
   */
  async getWorkspaceMembers(workspaceId: string): Promise<Member[]> {
    const q = query(
      this.membersCollection,
      where('workspaceId', '==', workspaceId),
      orderBy('joinedAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => this.mapToMember({ ...doc.data(), id: doc.id }));
  }

  /**
   * Get active members for a workspace
   */
  async getActiveMembers(workspaceId: string): Promise<Member[]> {
    const q = query(
      this.membersCollection,
      where('workspaceId', '==', workspaceId),
      where('status', '==', 'active'),
      orderBy('joinedAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => this.mapToMember({ ...doc.data(), id: doc.id }));
  }

  /**
   * Get members by role
   */
  async getMembersByRole(workspaceId: string, role: MemberRole): Promise<Member[]> {
    const q = query(
      this.membersCollection,
      where('workspaceId', '==', workspaceId),
      where('role', '==', role),
      orderBy('joinedAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => this.mapToMember({ ...doc.data(), id: doc.id }));
  }

  /**
   * Get a single member by ID
   */
  async getMemberById(memberId: string): Promise<Member | null> {
    const memberDoc = doc(this.firestore, `members/${memberId}`);
    const data = await firstValueFrom(docData(memberDoc, { idField: 'id' }));
    return data ? this.mapToMember(data) : null;
  }

  /**
   * Get member by user ID in workspace
   */
  async getMemberByUserId(workspaceId: string, userId: string): Promise<Member | null> {
    const q = query(
      this.membersCollection,
      where('workspaceId', '==', workspaceId),
      where('userId', '==', userId)
    );
    
    const snapshot = await getDocs(q);
    const docs = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    return docs.length > 0 ? this.mapToMember(docs[0]) : null;
  }

  /**
   * Get a single member
   */
  async getMember(id: string): Promise<Member | null> {
    const memberDoc = doc(this.firestore, `members/${id}`);
    const data = await firstValueFrom(docData(memberDoc, { idField: 'id' }));
    return data ? this.mapToMember(data) : null;
  }

  /**
   * Get member by account ID
   */
  async getMemberByAccountId(workspaceId: string, accountId: string): Promise<Member | null> {
    const q = query(
      this.membersCollection,
      where('workspaceId', '==', workspaceId),
      where('accountId', '==', accountId),
      limit(1)
    );

    const snapshot = await getDocs(q);
    const members = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    return members.length > 0 ? this.mapToMember(members[0]) : null;
  }

  /**
   * Add a member to workspace
   */
  async addMember(memberData: Omit<Member, 'id'>): Promise<string> {
    const data = {
      ...memberData,
      joinedAt: memberData.joinedAt instanceof Date ? Timestamp.fromDate(memberData.joinedAt) : serverTimestamp()
    };

    const docRef = await addDoc(this.membersCollection, data);
    return docRef.id;
  }

  /**
   * Update a member
   */
  async updateMember(memberId: string, data: Partial<Member>): Promise<void> {
    const memberDoc = doc(this.firestore, `members/${memberId}`);
    const updateData = {
      ...data,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(memberDoc, updateData);
  }

  /**
   * Remove a member
   */
  async removeMember(memberId: string): Promise<void> {
    const memberDoc = doc(this.firestore, `members/${memberId}`);
    await deleteDoc(memberDoc);
  }

  /**
   * Update member role
   */
  async updateMemberRole(memberId: string, role: MemberRole): Promise<void> {
    const memberDoc = doc(this.firestore, `members/${memberId}`);
    await updateDoc(memberDoc, { 
      role,
      updatedAt: serverTimestamp()
    });
  }

  /**
   * Update member status
   */
  async updateMemberStatus(memberId: string, status: MemberStatus): Promise<void> {
    const memberDoc = doc(this.firestore, `members/${memberId}`);
    await updateDoc(memberDoc, { 
      status
    });
  }

  /**
   * Update last active time
   */
  async updateLastActive(memberId: string): Promise<void> {
    const memberDoc = doc(this.firestore, `members/${memberId}`);
    await updateDoc(memberDoc, {
      lastActiveAt: serverTimestamp()
    });
  }

  /**
   * Create member invitation
   */
  async createInvitation(invitationData: Omit<MemberInvitation, 'id'>): Promise<string> {
    const data = {
      ...invitationData,
      createdAt: serverTimestamp(),
      expiresAt: invitationData['expiresAt'] instanceof Date 
        ? Timestamp.fromDate(invitationData['expiresAt'] as Date) 
        : serverTimestamp()
    };

    const docRef = await addDoc(collection(this.firestore, 'invitations'), data);
    return docRef.id;
  }

  /**
   * Get invitation by ID
   */
  async getInvitation(id: string): Promise<MemberInvitation | null> {
    const invitationDoc = doc(this.firestore, `invitations/${id}`);
    const data = await firstValueFrom(docData(invitationDoc, { idField: 'id' }));
    return data ? this.mapToInvitation(data) : null;
  }

  /**
   * Get invitation by token
   */
  async getInvitationByToken(token: string): Promise<MemberInvitation | null> {
    const q = query(
      collection(this.firestore, 'invitations'),
      where('token', '==', token),
      limit(1)
    );

    const snapshot = await getDocs(q);
    const invitations = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    return invitations.length > 0 ? this.mapToInvitation(invitations[0]) : null;
  }

  /**
   * Update invitation status
   */
  async updateInvitationStatus(
    id: string, 
    status: 'accepted' | 'rejected' | 'expired'
  ): Promise<void> {
    const invitationDoc = doc(this.firestore, `invitations/${id}`);
    const updateData: any = { status };

    if (status === 'accepted') {
      updateData.acceptedAt = serverTimestamp();
    } else if (status === 'rejected') {
      updateData.rejectedAt = serverTimestamp();
    }

    await updateDoc(invitationDoc, updateData);
  }

  /**
   * Get pending invitations for workspace
   */
  async getPendingInvitations(workspaceId: string): Promise<MemberInvitation[]> {
    const q = query(
      collection(this.firestore, 'invitations'),
      where('workspaceId', '==', workspaceId),
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => this.mapToInvitation({ ...doc.data(), id: doc.id }));
  }

  /**
   * Map Firestore document to Member entity
   */
  private mapToMember(doc: any): Member {
    return {
      id: doc.id,
      workspaceId: doc.workspaceId,
      accountId: doc.accountId,
      email: doc.email,
      displayName: doc.displayName ?? '',
      photoURL: doc.photoURL,
      role: doc.role as MemberRole,
      status: doc.status as MemberStatus,
      customPermissions: doc.customPermissions ?? [],
      joinedAt: doc.joinedAt instanceof Timestamp 
        ? doc.joinedAt.toDate() 
        : new Date(doc.joinedAt),
      lastActiveAt: doc.lastActiveAt instanceof Timestamp 
        ? doc.lastActiveAt.toDate() 
        : doc.lastActiveAt ? new Date(doc.lastActiveAt) : undefined,
      invitedBy: doc.invitedBy,
      bio: doc.bio,
      title: doc.title,
      department: doc.department
    };
  }

  /**
   * Map Firestore document to MemberInvitation entity
   */
  private mapToInvitation(doc: any): MemberInvitation {
    return {
      id: doc.id,
      workspaceId: doc.workspaceId,
      email: doc.email,
      role: doc.role as MemberRole,
      status: doc.status,
      token: doc.token,
      expiresAt: doc.expiresAt instanceof Timestamp ? doc.expiresAt.toDate() : new Date(doc.expiresAt),
      createdAt: doc.createdAt instanceof Timestamp ? doc.createdAt.toDate() : new Date(doc.createdAt),
      createdBy: doc.createdBy,
      acceptedAt: doc.acceptedAt instanceof Timestamp ? doc.acceptedAt.toDate() : undefined,
      rejectedAt: doc.rejectedAt instanceof Timestamp ? doc.rejectedAt.toDate() : undefined
    };
  }
}
