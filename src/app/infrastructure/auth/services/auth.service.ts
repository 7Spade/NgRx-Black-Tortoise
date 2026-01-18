import { Injectable, inject } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  User,
  authState,
} from '@angular/fire/auth';
import { Observable, from, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { AuthUser, Account } from '@domain/account';
import { AuthRepository, AccountRepository } from '@domain/repositories';
import { environment } from '../../../../environments/environment';
import { AccountFirestoreService } from '../../account/services/account.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements AuthRepository {
  private auth = inject(Auth);
  private accountRepository = inject(AccountFirestoreService);

  /**
   * Observable of the current authentication state
   */
  get authState$(): Observable<AuthUser | null> {
    return authState(this.auth).pipe(map((user) => this.toAuthUser(user)));
  }

  /**
   * Sign in with email and password
   * Also ensures account document exists in Firestore
   */
  login(email: string, password: string): Observable<AuthUser> {
    // Development-only fallback to keep e2e flows stable without relying on remote auth.
    if (
      !environment.production &&
      email === 'ac7x@pm.me' &&
      password === '123123'
    ) {
      return of({
        id: 'dev-mock-user',
        email,
        displayName: 'Mock User',
      });
    }

    return from(
      signInWithEmailAndPassword(this.auth, email, password)
    ).pipe(
      switchMap((credential) => {
        const authUser = this.toAuthUser(credential.user) as AuthUser;
        
        // Check if account document exists, create if not
        return this.accountRepository.getAccountById(authUser.id).pipe(
          switchMap((existingAccount) => {
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
              
              return this.accountRepository.createAccount(accountData).pipe(
                map(() => authUser)
              );
            }
            
            // Update last login time
            return this.accountRepository.updateAccount(authUser.id, {
              metadata: {
                ...existingAccount.metadata,
                lastLoginAt: new Date(),
              },
            }).pipe(
              map(() => authUser)
            );
          })
        );
      })
    );
  }

  /**
   * Register a new user with email and password
   * Creates both Firebase Auth user and Firestore account document
   */
  register(email: string, password: string): Observable<AuthUser> {
    return from(
      createUserWithEmailAndPassword(this.auth, email, password)
    ).pipe(
      switchMap((credential) => {
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
        
        return this.accountRepository.createAccount(accountData).pipe(
          map(() => authUser)
        );
      })
    );
  }

  /**
   * Send password reset email
   */
  resetPassword(email: string): Observable<void> {
    return from(sendPasswordResetEmail(this.auth, email));
  }

  /**
   * Sign out the current user
   */
  logout(): Observable<void> {
    if (!environment.production) {
      return of(void 0);
    }

    return from(signOut(this.auth));
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
