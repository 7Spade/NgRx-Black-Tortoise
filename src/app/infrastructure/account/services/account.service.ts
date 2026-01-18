/**
 * Account Firestore Repository
 * 
 * Infrastructure layer implementation for account persistence in Firestore.
 * Handles CRUD operations for account documents.
 * Implements Promise-based methods for framework-agnostic domain layer.
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
  async createAccount(account: Omit<Account, 'createdAt' | 'updatedAt'>): Promise<Account> {
    const accountRef = doc(this.accountsCollection, account.id);
    
    const accountData = {
      ...account,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    try {
      await setDoc(accountRef, accountData);
      return {
        ...account,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Account;
    } catch (error) {
      console.error('Error creating account:', error);
      throw new Error('Failed to create account');
    }
  }

  /**
   * Get account by ID
   */
  async getAccountById(id: string): Promise<Account | null> {
    const accountRef = doc(this.accountsCollection, id);
    
    try {
      const docSnap = await getDoc(accountRef);
      if (!docSnap.exists()) {
        return null;
      }
      return this.convertFirestoreDoc(docSnap.data(), id);
    } catch (error) {
      console.error('Error getting account:', error);
      throw new Error('Failed to get account');
    }
  }

  /**
   * Get all accounts for a user
   * For now, returns only the user's personal account
   * TODO: Add organization/team/partner accounts when those relationships are implemented
   */
  async getAccountsByUserId(userId: string): Promise<Account[]> {
    const q = query(this.accountsCollection, where('id', '==', userId));
    
    try {
      const querySnapshot = await getDocs(q);
      const accounts: Account[] = [];
      querySnapshot.forEach((doc) => {
        accounts.push(this.convertFirestoreDoc(doc.data(), doc.id));
      });
      return accounts;
    } catch (error) {
      console.error('Error getting accounts:', error);
      throw new Error('Failed to get accounts');
    }
  }

  /**
   * Update account data
   */
  async updateAccount(id: string, updates: Partial<Account>): Promise<Account> {
    const accountRef = doc(this.accountsCollection, id);
    
    const updateData = {
      ...updates,
      updatedAt: serverTimestamp(),
    };

    try {
      await updateDoc(accountRef, updateData);
      return {
        id,
        ...updates,
        updatedAt: new Date(),
      } as Account;
    } catch (error) {
      console.error('Error updating account:', error);
      throw new Error('Failed to update account');
    }
  }

  /**
   * Delete account
   */
  async deleteAccount(id: string): Promise<void> {
    const accountRef = doc(this.accountsCollection, id);
    
    try {
      await deleteDoc(accountRef);
    } catch (error) {
      console.error('Error deleting account:', error);
      throw new Error('Failed to delete account');
    }
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
