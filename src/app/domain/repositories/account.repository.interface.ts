/**
 * Account Repository Interface
 * 
 * Defines the contract for account data persistence.
 * Separates authentication (Firebase Auth) from account data (Firestore).
 * 
 * Domain layer repository interface - framework-agnostic.
 * Returns Promises to avoid RxJS/framework dependencies in domain layer.
 */
import { Account } from '../account';

export interface AccountRepository {
  /**
   * Create a new account document
   */
  createAccount(account: Omit<Account, 'createdAt' | 'updatedAt'>): Promise<Account>;
  
  /**
   * Get account by ID
   */
  getAccountById(id: string): Promise<Account | null>;
  
  /**
   * Get all accounts for a user (personal + organizations they belong to)
   */
  getAccountsByUserId(userId: string): Promise<Account[]>;
  
  /**
   * Update account data
   */
  updateAccount(id: string, updates: Partial<Account>): Promise<Account>;
  
  /**
   * Delete account
   */
  deleteAccount(id: string): Promise<void>;
}
