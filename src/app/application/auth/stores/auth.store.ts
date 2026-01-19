import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
  withHooks,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { computed, inject } from '@angular/core';
import { pipe, switchMap, tap, catchError, of, from } from 'rxjs';
import { initialAuthState } from './auth.state';
import { AUTH_REPOSITORY } from '@application/tokens';
import { AuthUser } from '@domain/account';

type AuthState = typeof initialAuthState;

/**
 * AuthStore - Zone-less Compatible Signal Store
 * 
 * This store manages authentication state using @ngrx/signals, which is fully compatible
 * with Angular's zone-less change detection mode.
 * 
 * Zone-less Compatibility:
 * - All state is managed through signals (withState, withComputed)
 * - All async operations use rxMethod() which properly integrates with signals
 * - patchState() updates signals, triggering change detection automatically
 * - No Zone.js needed for change detection - signals handle it
 * 
 * Reactive Patterns:
 * 1. User interactions call methods (login, logout, etc.)
 * 2. Methods trigger rxMethod effects (Promises wrapped in from())
 * 3. Effects update state via patchState (signal modification)
 * 4. Signal updates automatically trigger UI updates in zone-less mode
 * 5. Computed signals derive additional state reactively
 * 
 * Architecture Compliance:
 * - Account: Firebase Auth provides identity (who you are)
 * - AuthStore: Manages authentication state (signal-based)
 * - Workspace: ContextStore reacts to auth changes (Account → Workspace)
 * 
 * Why this works without Zone.js:
 * - rxMethod() subscribes to observables and updates signals
 * - from() wraps Promises into Observables for rxMethod
 * - patchState() is the only way to modify state (enforced by @ngrx/signals)
 * - Every patchState() call triggers signal updates
 * - Signal updates trigger change detection in zone-less mode
 * - No manual markForCheck() needed
 */
export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialAuthState),
  withComputed(({ status, user }) => ({
    isAuthenticated: computed(() => {
      return status() === 'authenticated' && user() !== null;
    }),
    isLoading: computed(() => status() === 'loading'),
    isUnauthenticated: computed(() => status() === 'unauthenticated'),
  })),
  withMethods((store, authRepository = inject(AUTH_REPOSITORY)) => {
    // Reactive login method using rxMethod with Promise-based repository
    // Zone-less: from() wraps Promise, Observable operations update signals via patchState
    const loginEffect = rxMethod<{ email: string; password: string }>(
      pipe(
        tap(() => patchState(store, { status: 'loading', error: null })),
        switchMap((credentials) =>
          from(authRepository.login(credentials.email, credentials.password)).pipe(
            tap((user) => {
              patchState(store, {
                user: user || null,
                status: 'authenticated',
                error: null,
              });
            }),
            catchError((error: any) => {
              patchState(store, {
                user: null,
                status: 'unauthenticated',
                error: error.message || 'Login failed',
              });
              return of(null);
            })
          )
        )
      )
    );

    // Reactive register method using rxMethod with Promise-based repository
    const registerEffect = rxMethod<{ email: string; password: string }>(
      pipe(
        tap(() => patchState(store, { status: 'loading', error: null })),
        switchMap((credentials) =>
          from(authRepository.register(credentials.email, credentials.password)).pipe(
            tap((user) => {
              patchState(store, {
                user: user || null,
                status: 'authenticated',
                error: null,
              });
            }),
            catchError((error: any) => {
              patchState(store, {
                user: null,
                status: 'unauthenticated',
                error: error.message || 'Registration failed',
              });
              return of(null);
            })
          )
        )
      )
    );

    // Reactive reset password method using rxMethod with Promise-based repository
    const resetPasswordEffect = rxMethod<{ email: string }>(
      pipe(
        tap(() => patchState(store, { status: 'loading', error: null })),
        switchMap((data) =>
          from(authRepository.resetPassword(data.email)).pipe(
            tap(() => {
              patchState(store, {
                status: 'idle',
                error: null,
              });
            }),
            catchError((error: any) => {
              patchState(store, {
                error: error.message || 'Password reset failed',
                status: 'idle',
              });
              return of(null);
            })
          )
        )
      )
    );

    // Reactive logout method using rxMethod with Promise-based repository
    const logoutEffect = rxMethod<void>(
      pipe(
        tap(() => patchState(store, { status: 'loading' })),
        switchMap(() =>
          from(authRepository.logout()).pipe(
            tap(() => {
              patchState(store, {
                user: null,
                status: 'unauthenticated',
                error: null,
              });
            }),
            catchError((error: any) => {
              patchState(store, {
                user: null,
                status: 'unauthenticated',
                error: error.message || 'Logout failed',
              });
              return of(null);
            })
          )
        )
      )
    );

    return {
      // Expose async methods that call the reactive effects
      async login(credentials: { email: string; password: string }): Promise<void> {
        loginEffect(credentials);
      },
      async register(credentials: { email: string; password: string }): Promise<void> {
        registerEffect(credentials);
      },
      async resetPassword(data: { email: string }): Promise<void> {
        resetPasswordEffect(data);
      },
      async logout(): Promise<void> {
        logoutEffect();
      },
      setUser(user: AuthUser | null) {
        patchState(store, {
          user,
          status: user ? 'authenticated' : 'unauthenticated',
        });
      },
    };
  }),
  withHooks({
    onInit(store, authRepository = inject(AUTH_REPOSITORY)) {
      // Subscribe to auth state changes using callback pattern
      // Zone-less: Callback updates signals directly, triggering change detection
      const unsubscribe = authRepository.onAuthStateChanged((user) => {
        store.setUser(user);
      });

      // Return cleanup function (optional, but good practice)
      // Note: @ngrx/signals doesn't expose onDestroy in withHooks yet,
      // but the unsubscribe function is returned for future use
      return () => {
        unsubscribe();
      };
    },
  })
);
