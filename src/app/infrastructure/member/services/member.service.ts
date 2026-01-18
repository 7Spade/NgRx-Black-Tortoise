import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  docData,
  collectionData,
  query,
  where,
  QueryConstraint,
  serverTimestamp,
  setDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { MemberRepository } from '@domain/repositories/member.repository.interface';
import { Member, MemberRole, MemberStatus, MemberInvitation } from '@domain/member';

interface MemberFirestoreData {
  id: string;
  userId: string;
  workspaceId: string;
  role: MemberRole;
  status: MemberStatus;
  invitedBy?: string;
  invitedAt?: Timestamp | Date;
  joinedAt?: Timestamp | Date;
  lastActiveAt?: Timestamp | Date;
  permissions?: string[];
  customPermissions?: string[];
}

@Injectable({ providedIn: 'root' })
export class MemberFirestoreService implements MemberRepository {
  private firestore = inject(Firestore);
  private membersCollection = collection(this.firestore, 'members');

  getMemberById(id: string): Observable<Member | null> {
    const memberDoc = doc(this.membersCollection, id);
    return docData(memberDoc, { idField: 'id' }).pipe(
      map((data) => (data ? this.convertFirestoreDoc(data as MemberFirestoreData) : null))
    );
  }

  getMembersByWorkspace(workspaceId: string): Observable<Member[]> {
    const constraints: QueryConstraint[] = [where('workspaceId', '==', workspaceId)];
    const q = query(this.membersCollection, ...constraints);

    return collectionData(q, { idField: 'id' }).pipe(
      map((docs) => docs.map((doc) => this.convertFirestoreDoc(doc as MemberFirestoreData)))
    );
  }

  getMemberByUserAndWorkspace(userId: string, workspaceId: string): Observable<Member | null> {
    const constraints: QueryConstraint[] = [
      where('userId', '==', userId),
      where('workspaceId', '==', workspaceId),
    ];
    const q = query(this.membersCollection, ...constraints);

    return collectionData(q, { idField: 'id' }).pipe(
      map((docs) => {
        const data = docs[0] as MemberFirestoreData | undefined;
        return data ? this.convertFirestoreDoc(data) : null;
      })
    );
  }

  createMember(member: Omit<Member, 'id'>): Observable<Member> {
    const newDocRef = doc(this.membersCollection);
    const memberData: Partial<MemberFirestoreData> = {
      id: newDocRef.id,
      userId: member.userId,
      workspaceId: member.workspaceId,
      role: member.role,
      status: member.status,
    };

    if (member.invitedBy) memberData.invitedBy = member.invitedBy;
    if (member.invitedAt) memberData.invitedAt = Timestamp.fromDate(member.invitedAt);
    if (member.joinedAt) memberData.joinedAt = Timestamp.fromDate(member.joinedAt);
    if (member.lastActiveAt) memberData.lastActiveAt = Timestamp.fromDate(member.lastActiveAt);
    if (member.permissions) memberData.permissions = member.permissions;
    if (member.customPermissions) memberData.customPermissions = member.customPermissions;

    return from(setDoc(newDocRef, memberData)).pipe(
      map(() => ({
        ...member,
        id: newDocRef.id,
      }))
    );
  }

  updateMember(id: string, updates: Partial<Member>): Observable<void> {
    const memberDoc = doc(this.membersCollection, id);
    const updateData: Partial<MemberFirestoreData> = {};

    if (updates.role !== undefined) updateData.role = updates.role;
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.joinedAt !== undefined) updateData.joinedAt = Timestamp.fromDate(updates.joinedAt);
    if (updates.lastActiveAt !== undefined)
      updateData.lastActiveAt = Timestamp.fromDate(updates.lastActiveAt);
    if (updates.permissions !== undefined) updateData.permissions = updates.permissions;
    if (updates.customPermissions !== undefined)
      updateData.customPermissions = updates.customPermissions;

    return from(updateDoc(memberDoc, updateData));
  }

  deleteMember(id: string): Observable<void> {
    const memberDoc = doc(this.membersCollection, id);
    return from(deleteDoc(memberDoc));
  }

  inviteMember(invitation: MemberInvitation): Observable<Member> {
    const newDocRef = doc(this.membersCollection);
    const memberData: Partial<MemberFirestoreData> = {
      id: newDocRef.id,
      userId: invitation.email, // Temporarily use email until user accepts
      workspaceId: invitation.workspaceId,
      role: invitation.role,
      status: MemberStatus.PENDING,
      invitedBy: invitation.invitedBy,
      invitedAt: serverTimestamp(),
    };

    if (invitation.permissions) {
      memberData.permissions = invitation.permissions;
    }

    return from(setDoc(newDocRef, memberData)).pipe(
      map(() => ({
        id: newDocRef.id,
        userId: invitation.email,
        workspaceId: invitation.workspaceId,
        role: invitation.role,
        status: MemberStatus.PENDING,
        invitedBy: invitation.invitedBy,
        invitedAt: new Date(),
        permissions: invitation.permissions,
      }))
    );
  }

  acceptInvitation(memberId: string, userId: string): Observable<void> {
    const memberDoc = doc(this.membersCollection, memberId);
    const updateData: Partial<MemberFirestoreData> = {
      userId,
      status: MemberStatus.ACTIVE,
      joinedAt: serverTimestamp(),
      lastActiveAt: serverTimestamp(),
    };

    return from(updateDoc(memberDoc, updateData));
  }

  private convertFirestoreDoc(data: MemberFirestoreData): Member {
    const member: Member = {
      id: data.id,
      userId: data.userId,
      workspaceId: data.workspaceId,
      role: data.role,
      status: data.status,
    };

    if (data.invitedBy) member.invitedBy = data.invitedBy;
    if (data.invitedAt) {
      member.invitedAt =
        data.invitedAt instanceof Timestamp ? data.invitedAt.toDate() : new Date(data.invitedAt);
    }
    if (data.joinedAt) {
      member.joinedAt =
        data.joinedAt instanceof Timestamp ? data.joinedAt.toDate() : new Date(data.joinedAt);
    }
    if (data.lastActiveAt) {
      member.lastActiveAt =
        data.lastActiveAt instanceof Timestamp
          ? data.lastActiveAt.toDate()
          : new Date(data.lastActiveAt);
    }
    if (data.permissions) member.permissions = data.permissions;
    if (data.customPermissions) member.customPermissions = data.customPermissions;

    return member;
  }
}
