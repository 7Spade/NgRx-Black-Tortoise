/**
 * AuthRepository contract for authentication operations.
 */
import { Observable } from 'rxjs';
import { AuthUser } from '../account';

export interface AuthRepository {
  readonly authState$: Observable<AuthUser | null>;
  login(email: string, password: string): Observable<AuthUser>;
  register(email: string, password: string): Observable<AuthUser>;
  resetPassword(email: string): Observable<void>;
  logout(): Observable<void>;
}
