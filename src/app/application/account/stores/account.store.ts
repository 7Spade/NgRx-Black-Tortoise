/**
 * Account Store - Zone-less Compatible Signal Store
 * 
 * Manages account data state separate from authentication.
 * Loads and manages user accounts from Firestore.
 */
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
import { pipe, switchMap, tap, catchError, of } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { initialAccountState } from './account.state';
import { Account } from '@domain/account';
import { ACCOUNT_REPOSITORY } from '@application/tokens';
import { AuthStore } from '@application/auth/stores/auth.store';

type AccountState = typeof initialAccountState;

/**
 * AccountStore manages account data from Firestore
 * 
 * Responsibilities:
 * - Load user's accounts (personal, organizations, teams, partners)
 * - Track current active account
 * - Provide computed signals for account grouping
 */
export const AccountStore = signalStore(
  { providedIn: 'root' },
  withState(initialAccountState),
  withComputed(({ currentAccount, accounts }) => ({
    // Personal account
    personalAccount: computed(() => 
      accounts().find(a => a.type === 'user') || null
    ),
    
    // Organization accounts
    organizationAccounts: computed(() => 
      accounts().filter(a => a.type === 'organization')
    ),
    
    // Team accounts
    teamAccounts: computed(() => 
      accounts().filter(a => a.type === 'team')
    ),
    
    // Partner accounts
    partnerAccounts: computed(() => 
      accounts().filter(a => a.type === 'partner')
    ),
    
    // Check if current account is set
    hasCurrentAccount: computed(() => currentAccount() !== null),
    
    // Account count
    accountCount: computed(() => accounts().length),
  })),
  withMethods((store, accountService = inject(ACCOUNT_REPOSITORY)) => {
    // Load accounts for the current user
    const loadAccountsEffect = rxMethod<string>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((userId) => accountService.getAccountsByUserId(userId)),
        tapResponse({
          next: (accounts) => {
            patchState(store, {
              accounts,
              currentAccount: accounts.find(a => a.type === 'user') || accounts[0] || null,
              loading: false,
            });
          },
          error: (error: Error) => {
            patchState(store, {
              error: error.message || 'Failed to load accounts',
              loading: false,
            });
          },
        })
      )
    );

    return {
      loadAccounts(userId: string): void {
        loadAccountsEffect(userId);
      },
      
      /**
       * Set current account and propagate to ContextStore
       * This ensures account switching triggers proper context updates
       */
      setCurrentAccount(account: Account | null) {
        patchState(store, { currentAccount: account });
        
        // Propagate account switch to ContextStore for organization/team/partner context
        if (account) {
          // ContextStore will be imported lazily to avoid circular dependencies
          // and will handle workspace reloading based on the new context
          import('@application/context/stores/context.store').then(({ ContextStore }) => {
            const contextStore = inject(ContextStore);
            
            // Map account type to context
            switch (account.type) {
              case 'organization':
                contextStore.switchContext({
                  type: 'organization',
                  organizationId: account.id,
                  name: account.name,
                  role: 'member', // TODO: Get actual role from membership
                });
                break;
              case 'team':
                // Team account requires organizationId from Account entity
                const teamAccount = account as any; // Cast to access organizationId
                contextStore.switchContext({
                  type: 'team',
                  teamId: account.id,
                  organizationId: teamAccount.organizationId || '',
                  name: account.name,
                  role: 'member', // TODO: Get actual role from membership
                });
                break;
              case 'partner':
                // Partner account requires organizationId from Account entity
                const partnerAccount = account as any; // Cast to access organizationId
                contextStore.switchContext({
                  type: 'partner',
                  partnerId: account.id,
                  organizationId: partnerAccount.organizationId || '',
                  name: account.name,
                  accessLevel: 'readonly', // TODO: Get actual access level
                });
                break;
              case 'user':
              default:
                // Switch to user context (personal)
                import('@application/auth/stores/auth.store').then(({ AuthStore }) => {
                  const authStore = inject(AuthStore);
                  const user = authStore.user();
                  if (user) {
                    contextStore.switchContext({
                      type: 'user',
                      userId: user.id,
                      email: user.email || '',
                      displayName: user.displayName ?? null,
                    });
                  }
                });
                break;
            }
          });
        }
      },
      
      // Reset store state
      reset() {
        patchState(store, initialAccountState);
      },
    };
  }),
  withHooks({
    onInit(store) {
      const authStore = inject(AuthStore);
      
      // Reactive method to load accounts when user authenticates
      const syncAccounts = rxMethod<void>(
        pipe(
          switchMap(() => {
            const user = authStore.user();
            if (user) {
              return of(user.id);
            }
            // User logged out, reset store
            store.reset();
            return of(null);
          }),
          tap((userId) => {
            if (userId) {
              store.loadAccounts(userId);
            }
          }),
          catchError((error) => {
            console.error('Account sync error:', error);
            return of(null);
          })
        )
      );
      
      // Start syncing accounts with auth state
      syncAccounts();
    },
  })
);
