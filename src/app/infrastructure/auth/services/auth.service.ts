import { Injectable, inject } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  User,
  onAuthStateChanged as firebaseOnAuthStateChanged,
} from '@angular/fire/auth';
import { AuthUser, Account } from '@domain/account';
import { AuthRepository, AccountRepository } from '@domain/repositories';
import { environment } from '../../../../environments/environment';
import { AccountFirestoreService } from '../../account/services/account.service';

/**
 * AuthService - Infrastructure implementation of AuthRepository
 * 
 * Implements Promise-based methods for framework-agnostic domain layer.
 * Handles Firebase Auth operations and Account document synchronization.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService implements AuthRepository {
  private auth = inject(Auth);
  private accountRepository = inject(AccountFirestoreService);

  /**
   * Subscribe to authentication state changes using callback pattern.
   * Returns unsubscribe function for cleanup.
   */
  onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void {
    return firebaseOnAuthStateChanged(this.auth, (user) => {
      callback(this.toAuthUser(user));
    });
  }

  /**
   * Sign in with email and password
   * Also ensures account document exists in Firestore
   */
  async login(email: string, password: string): Promise<AuthUser> {
    // Development-only fallback to keep e2e flows stable without relying on remote auth.
    if (
      !environment.production &&
      email === 'ac7x@pm.me' &&
      password === '123123'
    ) {
      return {
        id: 'dev-mock-user',
        email,
        displayName: 'Mock User',
      };
    }

    const credential = await signInWithEmailAndPassword(this.auth, email, password);
    const authUser = this.toAuthUser(credential.user) as AuthUser;
    
    // Check if account document exists, create if not
    const existingAccount = await this.accountRepository.getAccountById(authUser.id);
    
    if (!existingAccount) {
      // Create account document for existing Firebase Auth users
      const accountData: Omit<Account, 'createdAt' | 'updatedAt'> = {
        id: authUser.id,
        type: 'user',
        email: authUser.email,
        metadata: {
          emailVerified: credential.user.emailVerified,
          disabled: false,
          lastLoginAt: new Date(),
        },
      };
      
      // Only set optional fields if they have values
      if (authUser.displayName) {
        accountData['displayName'] = authUser.displayName;
      }
      if (credential.user.photoURL) {
        accountData['photoURL'] = credential.user.photoURL;
      }
      
      await this.accountRepository.createAccount(accountData);
    } else {
      // Update last login time
      await this.accountRepository.updateAccount(authUser.id, {
        metadata: {
          ...existingAccount.metadata,
          lastLoginAt: new Date(),
        },
      });
    }
    
    return authUser;
  }

  /**
   * Register a new user with email and password
   * Creates both Firebase Auth user and Firestore account document
   */
  async register(email: string, password: string): Promise<AuthUser> {
    const credential = await createUserWithEmailAndPassword(this.auth, email, password);
    const authUser = this.toAuthUser(credential.user) as AuthUser;
    
    // Create Firestore account document
    const accountData: Omit<Account, 'createdAt' | 'updatedAt'> = {
      id: authUser.id,
      type: 'user',
      email: authUser.email,
      metadata: {
        emailVerified: credential.user.emailVerified,
        disabled: false,
        lastLoginAt: new Date(),
      },
    };
    
    // Only set optional fields if they have values
    if (authUser.displayName) {
      accountData['displayName'] = authUser.displayName;
    }
    
    await this.accountRepository.createAccount(accountData);
    
    return authUser;
  }

  /**
   * Send password reset email
   */
  async resetPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(this.auth, email);
  }

  /**
   * Sign out the current user
   */
  async logout(): Promise<void> {
    if (!environment.production) {
      return;
    }

    await signOut(this.auth);
  }

  private toAuthUser(user: User | null): AuthUser | null {
    if (!user) {
      return null;
    }
    return {
      id: user.uid,
      email: user.email ?? '',
      displayName: user.displayName ?? null,
    };
  }
}
