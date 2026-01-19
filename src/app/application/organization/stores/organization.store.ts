/**
 * OrganizationStore - Application Layer
 * 
 * Manages organization state with NgRx Signals.
 * Auto-loads organizations when user authenticates.
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
import { initialOrganizationState } from './organization.state';
import { Organization } from '@domain/account';
import { ORGANIZATION_REPOSITORY } from '@application/tokens';
import { AuthStore } from '@application/auth/stores/auth.store';

export const OrganizationStore = signalStore(
  { providedIn: 'root' },
  withState(initialOrganizationState),
  withComputed(({ currentOrganization, organizations, loading }) => ({
    hasOrganization: computed(() => currentOrganization() !== null),
    organizationCount: computed(() => organizations().length),
    isLoading: computed(() => loading()),
    hasOrganizations: computed(() => organizations().length > 0),
  })),
  withMethods((store, orgService = inject(ORGANIZATION_REPOSITORY)) => {
    // Load organizations for a specific user
    const loadUserOrganizationsEffect = rxMethod<string>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((userId) => orgService.getUserOrganizations(userId)),
        tapResponse({
          next: (organizations) => {
            patchState(store, {
              organizations,
              currentOrganization: organizations[0] || null,
              loading: false,
            });
          },
          error: (error: Error) => {
            patchState(store, {
              error: error.message || 'Failed to load organizations',
              loading: false,
            });
          },
        })
      )
    );

    // Create a new organization
    const createOrganizationEffect = rxMethod<Omit<Organization, 'id'>>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((org) => orgService.createOrganization(org)),
        tapResponse({
          next: (orgId) => {
            console.log('Organization created:', orgId);
            // Reload organizations after creation
            const authStore = inject(AuthStore);
            const user = authStore.user();
            if (user) {
              loadUserOrganizationsEffect(user.id);
            } else {
              patchState(store, { loading: false });
            }
          },
          error: (error: Error) => {
            patchState(store, {
              error: error.message || 'Failed to create organization',
              loading: false,
            });
          },
        })
      )
    );

    return {
      // Async operations
      loadUserOrganizations(userId: string): void {
        loadUserOrganizationsEffect(userId);
      },
      createOrganization(org: Omit<Organization, 'id'>): void {
        createOrganizationEffect(org);
      },

      // Synchronous state updates
      setCurrentOrganization(organization: Organization | null) {
        patchState(store, { currentOrganization: organization });
      },
      setOrganizations(organizations: Organization[]) {
        patchState(store, { organizations });
      },
      setLoading(loading: boolean) {
        patchState(store, { loading });
      },
      setError(error: string | null) {
        patchState(store, { error });
      },

      // Reset store state
      reset() {
        patchState(store, initialOrganizationState);
      },
    };
  }),
  withHooks({
    onInit(store) {
      const authStore = inject(AuthStore);

      // Reactive method to sync organizations with auth state
      const syncOrganizations = rxMethod<void>(
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
              store.loadUserOrganizations(userId);
            }
          }),
          catchError((error) => {
            console.error('Organization sync error:', error);
            return of(null);
          })
        )
      );

      // Start syncing organizations with auth state
      syncOrganizations();
    },
  })
);
