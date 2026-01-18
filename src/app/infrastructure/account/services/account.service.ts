/**
 * Account Firestore Repository
 * 
 * Infrastructure layer implementation for account persistence in Firestore.
 * Handles CRUD operations for account documents.
 */
import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
  Timestamp,
} from '@angular/fire/firestore';
import { Observable, from, map, catchError, throwError } from 'rxjs';
import { Account } from '@domain/account';
import { AccountRepository } from '@domain/repositories';

@Injectable({
  providedIn: 'root',
})
export class AccountFirestoreService implements AccountRepository {
  private firestore = inject(Firestore);
  private accountsCollection = collection(this.firestore, 'accounts');

  /**
   * Create a new account document in Firestore
   */
  createAccount(account: Omit<Account, 'createdAt' | 'updatedAt'>): Observable<Account> {
    const accountRef = doc(this.accountsCollection, account.id);
    
    const accountData = {
      ...account,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    return from(setDoc(accountRef, accountData)).pipe(
      map(() => ({
        ...account,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Account)),
      catchError((error) => {
        console.error('Error creating account:', error);
        return throwError(() => new Error('Failed to create account'));
      })
    );
  }

  /**
   * Get account by ID
   */
  getAccountById(id: string): Observable<Account | null> {
    const accountRef = doc(this.accountsCollection, id);
    
    return from(getDoc(accountRef)).pipe(
      map((docSnap) => {
        if (!docSnap.exists()) {
          return null;
        }
        return this.convertFirestoreDoc(docSnap.data(), id);
      }),
      catchError((error) => {
        console.error('Error getting account:', error);
        return throwError(() => new Error('Failed to get account'));
      })
    );
  }

  /**
   * Get all accounts for a user
   * For now, returns only the user's personal account
   * TODO: Add organization/team/partner accounts when those relationships are implemented
   */
  getAccountsByUserId(userId: string): Observable<Account[]> {
    const q = query(this.accountsCollection, where('id', '==', userId));
    
    return from(getDocs(q)).pipe(
      map((querySnapshot) => {
        const accounts: Account[] = [];
        querySnapshot.forEach((doc) => {
          accounts.push(this.convertFirestoreDoc(doc.data(), doc.id));
        });
        return accounts;
      }),
      catchError((error) => {
        console.error('Error getting accounts:', error);
        return throwError(() => new Error('Failed to get accounts'));
      })
    );
  }

  /**
   * Update account data
   */
  updateAccount(id: string, updates: Partial<Account>): Observable<Account> {
    const accountRef = doc(this.accountsCollection, id);
    
    const updateData = {
      ...updates,
      updatedAt: serverTimestamp(),
    };

    return from(updateDoc(accountRef, updateData)).pipe(
      map(() => ({
        id,
        ...updates,
        updatedAt: new Date(),
      } as Account)),
      catchError((error) => {
        console.error('Error updating account:', error);
        return throwError(() => new Error('Failed to update account'));
      })
    );
  }

  /**
   * Delete account
   */
  deleteAccount(id: string): Observable<void> {
    const accountRef = doc(this.accountsCollection, id);
    
    return from(deleteDoc(accountRef)).pipe(
      catchError((error) => {
        console.error('Error deleting account:', error);
        return throwError(() => new Error('Failed to delete account'));
      })
    );
  }

  /**
   * Convert Firestore document data to Account entity
   */
  private convertFirestoreDoc(data: any, id: string): Account {
    return {
      id,
      type: data.type || 'user',
      email: data.email,
      displayName: data.displayName,
      photoURL: data.photoURL,
      createdAt: data.createdAt instanceof Timestamp 
        ? data.createdAt.toDate() 
        : new Date(data.createdAt),
      updatedAt: data.updatedAt instanceof Timestamp 
        ? data.updatedAt.toDate() 
        : new Date(data.updatedAt),
      customClaims: data.customClaims,
      metadata: data.metadata,
    };
  }
}
