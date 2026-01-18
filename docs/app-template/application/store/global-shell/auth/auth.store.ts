/**
 * 摘要 (Summary): Auth Store - 管理全域認證狀態
 * 
 * 用途 (Purpose): 提供整個應用程式的認證狀態管理，包括使用者登入狀態、權限等資訊
 * 
 * 功能 (Features):
 * - 管理當前認證使用者資訊
 * - 追蹤登入/登出狀態
 * - 處理 Firebase Authentication 整合
 * - 提供認證相關的 computed signals
 * 
 * 責任 (Responsibilities):
 * - 維護全域認證狀態 (providedIn: 'root')
 * - 處理使用者登入/登出流程
 * - 同步 Firebase Auth 狀態
 * - 提供認證狀態查詢介面
 */

import { computed, inject } from '@angular/core';
import { 
  Auth, 
  authState,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  User
} from '@angular/fire/auth';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { pipe, switchMap, tap, from } from 'rxjs';
import { AuthState, EmailCredentials, UserUpdateData } from './auth.models';

/**
 * Initial state for Auth Store
 */
const initialState: AuthState = {
  authUser: null,
  userAccount: null,
  loading: false,
  error: null,
};

/**
 * Auth Store
 * 
 * NgRx Signals-based store for authentication state management.
 * 
 * State:
 * - authUser: Firebase Auth User object
 * - userAccount: Domain Account entity
 * - loading: Loading state for auth operations
 * - error: Error message from auth operations
 * 
 * Computed:
 * - isAuthenticated: Whether user is authenticated
 * - userDisplayName: User's display name or email
 * - userInitials: User's initials (first 2 letters)
 * - isInitializing: Whether initial auth check is in progress
 * 
 * Methods:
 * - signInWithEmail: Sign in with email and password
 * - signOut: Sign out current user
 * - updateUserProfile: Update user profile (displayName, photoURL)
 * - initAuthListener: Initialize Firebase Auth state listener
 */
export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((state) => ({
    /**
     * Check if user is authenticated
     */
    isAuthenticated: computed(() => !!state.authUser()),
    
    /**
     * Get user's display name or email prefix
     */
    userDisplayName: computed(() => {
      const user = state.authUser();
      if (!user) return 'Guest';
      
      if (user.displayName) return user.displayName;
      if (user.email) return user.email.split('@')[0];
      return 'Guest';
    }),
    
    /**
     * Get user's initials (first 2 letters of name)
     */
    userInitials: computed(() => {
      const user = state.authUser();
      if (!user) return 'U';
      
      const name = user.displayName || user.email?.split('@')[0] || 'User';
      const parts = name.split(' ').filter(p => p.length > 0);
      
      if (parts.length >= 2) {
        // First letter of first two parts
        return (parts[0][0] + parts[1][0]).toUpperCase();
      } else if (parts.length === 1 && parts[0].length >= 2) {
        // First two letters of single part
        return parts[0].substring(0, 2).toUpperCase();
      } else if (parts.length === 1) {
        // Single letter
        return parts[0][0].toUpperCase();
      }
      
      return 'U';
    }),
    
    /**
     * Check if initial authentication is in progress
     */
    isInitializing: computed(() => 
      state.loading() && !state.authUser() && !state.error()
    ),
  })),
  withMethods((store, auth = inject(Auth)) => ({
    /**
     * Sign in with email and password
     * 
     * @param credentials - Email and password credentials
     */
    signInWithEmail: rxMethod<EmailCredentials>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(({ email, password }) => 
          from(signInWithEmailAndPassword(auth, email, password))
        ),
        tapResponse({
          next: () => {
            // Auth state will be updated by the auth listener
            patchState(store, { loading: false, error: null });
          },
          error: (error: Error) => {
            patchState(store, { 
              error: error.message, 
              loading: false 
            });
          },
        })
      )
    ),
    
    /**
     * Sign out current user
     */
    signOut: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(() => from(firebaseSignOut(auth))),
        tapResponse({
          next: () => {
            // Auth state will be updated by the auth listener
            patchState(store, { 
              loading: false, 
              error: null,
              userAccount: null,
            });
          },
          error: (error: Error) => {
            patchState(store, { 
              error: error.message, 
              loading: false 
            });
          },
        })
      )
    ),
    
    /**
     * Update user profile
     * 
     * @param updates - Profile updates (displayName, photoURL)
     */
    updateUserProfile: rxMethod<UserUpdateData>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((updates) => {
          const currentUser = auth.currentUser;
          if (!currentUser) {
            throw new Error('No user is currently signed in');
          }
          return from(updateProfile(currentUser, updates));
        }),
        tapResponse({
          next: () => {
            // Auth state will be updated by the auth listener
            patchState(store, { loading: false, error: null });
          },
          error: (error: Error) => {
            patchState(store, { 
              error: error.message, 
              loading: false 
            });
          },
        })
      )
    ),
    
    /**
     * Initialize Firebase Auth state listener
     * 
     * Automatically called in onInit hook.
     * Syncs Firebase Auth state to the store.
     */
    initAuthListener: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true })),
        switchMap(() => authState(auth)),
        tapResponse({
          next: (user: User | null) => {
            patchState(store, { 
              authUser: user, 
              loading: false,
              error: null,
            });
            
            // TODO Phase 2: Load userAccount from Firestore when user is authenticated
            // if (user) {
            //   store.loadUserAccount(user.uid);
            // }
          },
          error: (error: Error) => {
            patchState(store, { 
              error: error.message, 
              loading: false 
            });
          },
        })
      )
    ),
    
    /**
     * Clear error state
     */
    clearError(): void {
      patchState(store, { error: null });
    },
  })),
  withHooks({
    /**
     * Initialize auth listener on store creation
     */
    onInit(store): void {
      // Start listening to Firebase Auth state changes
      store.initAuthListener();
    },
  })
);
