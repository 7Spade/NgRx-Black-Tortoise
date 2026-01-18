/**
 * TeamStore - Application Layer
 * 
 * Manages team state with NgRx Signals.
 * Auto-loads teams when organization changes.
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
import { initialTeamState } from './team.state';
import { Team } from '@domain/team';
import { TeamService } from '@infrastructure/team/services/team.service';
import { OrganizationStore } from '@application/organization/stores/organization.store';

export const TeamStore = signalStore(
  { providedIn: 'root' },
  withState(initialTeamState),
  withComputed(({ teams, selectedTeam, loading }) => ({
    hasTeams: computed(() => teams().length > 0),
    teamCount: computed(() => teams().length),
    isLoading: computed(() => loading()),
    hasSelectedTeam: computed(() => selectedTeam() !== null),
    activeTeams: computed(() => teams().filter((t) => t.status === 'active')),
  })),
  withMethods((store, teamService = inject(TeamService)) => {
    // Load teams for a specific organization
    const loadOrganizationTeamsEffect = rxMethod<string>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((orgId) => teamService.getOrganizationTeams(orgId)),
        tapResponse({
          next: (teams) => {
            patchState(store, {
              teams,
              loading: false,
            });
          },
          error: (error: Error) => {
            patchState(store, {
              error: error.message || 'Failed to load teams',
              loading: false,
            });
          },
        })
      )
    );

    // Create a new team
    const createTeamEffect = rxMethod<Omit<Team, 'id'>>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((team) => teamService.createTeam(team)),
        tapResponse({
          next: (teamId) => {
            console.log('Team created:', teamId);
            // Reload teams after creation
            const orgStore = inject(OrganizationStore);
            const org = orgStore.currentOrganization();
            if (org) {
              loadOrganizationTeamsEffect(org.id);
            } else {
              patchState(store, { loading: false });
            }
          },
          error: (error: Error) => {
            patchState(store, {
              error: error.message || 'Failed to create team',
              loading: false,
            });
          },
        })
      )
    );

    return {
      // Async operations
      loadOrganizationTeams(orgId: string): void {
        loadOrganizationTeamsEffect(orgId);
      },
      createTeam(team: Omit<Team, 'id'>): void {
        createTeamEffect(team);
      },

      // Synchronous state updates
      setTeams(teams: Team[]) {
        patchState(store, { teams });
      },
      setSelectedTeam(team: Team | null) {
        patchState(store, { selectedTeam: team });
      },
      setLoading(loading: boolean) {
        patchState(store, { loading });
      },
      setError(error: string | null) {
        patchState(store, { error });
      },

      // Reset store state
      reset() {
        patchState(store, initialTeamState);
      },
    };
  }),
  withHooks({
    onInit(store) {
      const orgStore = inject(OrganizationStore);

      // Reactive method to sync teams with organization changes
      const syncTeams = rxMethod<void>(
        pipe(
          switchMap(() => {
            const org = orgStore.currentOrganization();
            if (org) {
              return of(org.id);
            }
            // No organization selected, reset store
            store.reset();
            return of(null);
          }),
          tap((orgId) => {
            if (orgId) {
              store.loadOrganizationTeams(orgId);
            }
          }),
          catchError((error) => {
            console.error('Team sync error:', error);
            return of(null);
          })
        )
      );

      // Start syncing teams with organization changes
      syncTeams();
    },
  })
);
