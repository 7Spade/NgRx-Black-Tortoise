/**
 * Account Repository Interface
 * 
 * Defines the contract for account data persistence in Firestore.
 * Separates authentication (Firebase Auth) from account data (Firestore).
 */
import { Observable } from 'rxjs';
import { Account } from '../account';

export interface AccountRepository {
  /**
   * Create a new account document in Firestore
   */
  createAccount(account: Omit<Account, 'createdAt' | 'updatedAt'>): Observable<Account>;
  
  /**
   * Get account by ID
   */
  getAccountById(id: string): Observable<Account | null>;
  
  /**
   * Get all accounts for a user (personal + organizations they belong to)
   */
  getAccountsByUserId(userId: string): Observable<Account[]>;
  
  /**
   * Update account data
   */
  updateAccount(id: string, updates: Partial<Account>): Observable<Account>;
  
  /**
   * Delete account
   */
  deleteAccount(id: string): Observable<void>;
}
