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
  Timestamp
} from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

// Domain
import { Member, MemberRole, MemberStatus, MemberInvitation } from '@domain/member';
import { MemberRepository } from '@domain/repositories/member.repository.interface';

/**
 * Firestore implementation of MemberRepository
 * Manages workspace members persistence
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
  getWorkspaceMembers(workspaceId: string): Observable<Member[]> {
    const q = query(
      this.membersCollection,
      where('workspaceId', '==', workspaceId),
      orderBy('joinedAt', 'desc')
    );
    
    return collectionData(q, { idField: 'id' }).pipe(
      map(docs => docs.map(doc => this.mapToMember(doc)))
    );
  }

  /**
   * Get active members for a workspace
   */
  getActiveMembers(workspaceId: string): Observable<Member[]> {
    const q = query(
      this.membersCollection,
      where('workspaceId', '==', workspaceId),
      where('status', '==', 'active'),
      orderBy('joinedAt', 'desc')
    );
    
    return collectionData(q, { idField: 'id' }).pipe(
      map(docs => docs.map(doc => this.mapToMember(doc)))
    );
  }

  /**
   * Get members by role
   */
  getMembersByRole(workspaceId: string, role: MemberRole): Observable<Member[]> {
    const q = query(
      this.membersCollection,
      where('workspaceId', '==', workspaceId),
      where('role', '==', role),
      orderBy('joinedAt', 'desc')
    );
    
    return collectionData(q, { idField: 'id' }).pipe(
      map(docs => docs.map(doc => this.mapToMember(doc)))
    );
  }

  /**
   * Get a single member by ID
   */
  getMemberById(memberId: string): Observable<Member | null> {
    const memberDoc = doc(this.firestore, `members/${memberId}`);
    return docData(memberDoc, { idField: 'id' }).pipe(
      map(doc => doc ? this.mapToMember(doc) : null)
    );
  }

  /**
   * Get member by user ID in workspace
   */
  getMemberByUserId(workspaceId: string, userId: string): Observable<Member | null> {
    const q = query(
      this.membersCollection,
      where('workspaceId', '==', workspaceId),
      where('userId', '==', userId)
    );
    
    return collectionData(q, { idField: 'id' }).pipe(
      map(docs => docs.length > 0 ? this.mapToMember(docs[0]) : null)
    );
  }

  /**
   * Get a single member
   */
  getMember(id: string): Observable<Member | null> {
    const memberDoc = doc(this.firestore, `members/${id}`);
    return docData(memberDoc, { idField: 'id' }).pipe(
      map(data => data ? this.mapToMember(data) : null)
    );
  }

  /**
   * Get member by account ID
   */
  getMemberByAccountId(workspaceId: string, accountId: string): Observable<Member | null> {
    const q = query(
      this.membersCollection,
      where('workspaceId', '==', workspaceId),
      where('accountId', '==', accountId),
      limit(1)
    );

    return collectionData(q, { idField: 'id' }).pipe(
      map(members => members.length > 0 ? this.mapToMember(members[0]) : null)
    );
  }

  /**
   * Add a member to workspace
   */
  addMember(memberData: Omit<Member, 'id'>): Observable<string> {
    const data = {
      ...memberData,
      joinedAt: memberData.joinedAt instanceof Date ? Timestamp.fromDate(memberData.joinedAt) : serverTimestamp()
    };

    return from(addDoc(this.membersCollection, data)).pipe(
      map(docRef => docRef.id)
    );
  }

  /**
   * Update a member
   */
  updateMember(memberId: string, data: Partial<Member>): Observable<void> {
    const memberDoc = doc(this.firestore, `members/${memberId}`);
    const updateData = {
      ...data,
      updatedAt: serverTimestamp()
    };
    
    return from(updateDoc(memberDoc, updateData));
  }

  /**
   * Remove a member
   */
  removeMember(memberId: string): Observable<void> {
    const memberDoc = doc(this.firestore, `members/${memberId}`);
    return from(deleteDoc(memberDoc));
  }

  /**
   * Update member role
   */
  updateMemberRole(memberId: string, role: MemberRole): Observable<void> {
    const memberDoc = doc(this.firestore, `members/${memberId}`);
    return from(updateDoc(memberDoc, { 
      role,
      updatedAt: serverTimestamp()
    }));
  }

  /**
   * Update member status
   */
  updateMemberStatus(memberId: string, status: MemberStatus): Observable<void> {
    const memberDoc = doc(this.firestore, `members/${memberId}`);
    return from(updateDoc(memberDoc, { 
      status
    }));
  }

  /**
   * Update last active time
   */
  updateLastActive(memberId: string): Observable<void> {
    const memberDoc = doc(this.firestore, `members/${memberId}`);
    return from(updateDoc(memberDoc, {
      lastActiveAt: serverTimestamp()
    }));
  }

  /**
   * Create member invitation
   */
  createInvitation(invitationData: Omit<MemberInvitation, 'id'>): Observable<string> {
    const data = {
      ...invitationData,
      createdAt: serverTimestamp(),
      expiresAt: invitationData['expiresAt'] instanceof Date 
        ? Timestamp.fromDate(invitationData['expiresAt'] as Date) 
        : serverTimestamp()
    };

    return from(addDoc(collection(this.firestore, 'invitations'), data)).pipe(
      map(docRef => docRef.id)
    );
  }

  /**
   * Get invitation by ID
   */
  getInvitation(id: string): Observable<MemberInvitation | null> {
    const invitationDoc = doc(this.firestore, `invitations/${id}`);
    return docData(invitationDoc, { idField: 'id' }).pipe(
      map(data => data ? this.mapToInvitation(data) : null)
    );
  }

  /**
   * Get invitation by token
   */
  getInvitationByToken(token: string): Observable<MemberInvitation | null> {
    const q = query(
      collection(this.firestore, 'invitations'),
      where('token', '==', token),
      limit(1)
    );

    return collectionData(q, { idField: 'id' }).pipe(
      map(invitations => invitations.length > 0 ? this.mapToInvitation(invitations[0]) : null)
    );
  }

  /**
   * Update invitation status
   */
  updateInvitationStatus(
    id: string, 
    status: 'accepted' | 'rejected' | 'expired'
  ): Observable<void> {
    const invitationDoc = doc(this.firestore, `invitations/${id}`);
    const updateData: any = { status };

    if (status === 'accepted') {
      updateData.acceptedAt = serverTimestamp();
    } else if (status === 'rejected') {
      updateData.rejectedAt = serverTimestamp();
    }

    return from(updateDoc(invitationDoc, updateData));
  }

  /**
   * Get pending invitations for workspace
   */
  getPendingInvitations(workspaceId: string): Observable<MemberInvitation[]> {
    const q = query(
      collection(this.firestore, 'invitations'),
      where('workspaceId', '==', workspaceId),
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc')
    );

    return collectionData(q, { idField: 'id' }).pipe(
      map(invitations => invitations.map(inv => this.mapToInvitation(inv)))
    );
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
