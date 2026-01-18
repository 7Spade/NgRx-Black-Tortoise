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
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp
} from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

// Domain
import { Member, MemberRole, MemberStatus } from '@domain/member';
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
   * Add a member to workspace
   */
  addMember(memberData: Omit<Member, 'id' | 'joinedAt' | 'updatedAt'>): Observable<Member> {
    const data = {
      ...memberData,
      joinedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    return from(addDoc(this.membersCollection, data)).pipe(
      map(docRef => ({
        ...memberData,
        id: docRef.id,
        joinedAt: new Date(),
        updatedAt: new Date()
      }))
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
      status,
      updatedAt: serverTimestamp()
    }));
  }

  /**
   * Map Firestore document to Member entity
   */
  private mapToMember(doc: any): Member {
    return {
      id: doc.id,
      workspaceId: doc.workspaceId,
      userId: doc.userId,
      email: doc.email,
      displayName: doc.displayName ?? '',
      photoURL: doc.photoURL,
      role: doc.role as MemberRole,
      status: doc.status as MemberStatus,
      permissions: doc.permissions ?? [],
      invitation: doc.invitation ?? null,
      lastActiveAt: doc.lastActiveAt instanceof Timestamp 
        ? doc.lastActiveAt.toDate() 
        : doc.lastActiveAt ? new Date(doc.lastActiveAt) : null,
      joinedAt: doc.joinedAt instanceof Timestamp 
        ? doc.joinedAt.toDate() 
        : new Date(doc.joinedAt),
      updatedAt: doc.updatedAt instanceof Timestamp 
        ? doc.updatedAt.toDate() 
        : new Date(doc.updatedAt)
    };
  }
}
