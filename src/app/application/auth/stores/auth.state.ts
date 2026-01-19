import { AuthUser } from '@domain/account';

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

export interface AuthState {
  user: AuthUser | null;
  status: AuthStatus;
  error: string | null;
}

export const initialAuthState: AuthState = {
  user: null,
  status: 'idle',
  error: null,
};
