/**
 * AuthRepository contract for authentication operations.
 * 
 * Domain layer repository interface - framework-agnostic.
 * Returns Promises to avoid RxJS/framework dependencies in domain layer.
 */
import { AuthUser } from '../account';

export interface AuthRepository {
  /**
   * Subscribe to authentication state changes.
   * Returns an unsubscribe function.
   */
  onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void;
  
  /**
   * Sign in with email and password
   */
  login(email: string, password: string): Promise<AuthUser>;
  
  /**
   * Register a new user with email and password
   */
  register(email: string, password: string): Promise<AuthUser>;
  
  /**
   * Send password reset email
   */
  resetPassword(email: string): Promise<void>;
  
  /**
   * Sign out the current user
   */
  logout(): Promise<void>;
}
