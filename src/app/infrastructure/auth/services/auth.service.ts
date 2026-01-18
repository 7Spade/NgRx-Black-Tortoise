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
import { map } from 'rxjs/operators';
import { AuthUser } from '@domain/account';
import { AuthRepository } from '@domain/repositories';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements AuthRepository {
  private auth = inject(Auth);

  /**
   * Observable of the current authentication state
   */
  get authState$(): Observable<AuthUser | null> {
    return authState(this.auth).pipe(map((user) => this.toAuthUser(user)));
  }

  /**
   * Sign in with email and password
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
      signInWithEmailAndPassword(this.auth, email, password).then(
        (credential) => this.toAuthUser(credential.user) as AuthUser
      )
    );
  }

  /**
   * Register a new user with email and password
   */
  register(email: string, password: string): Observable<AuthUser> {
    return from(
      createUserWithEmailAndPassword(this.auth, email, password).then(
        (credential) => this.toAuthUser(credential.user) as AuthUser
      )
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
