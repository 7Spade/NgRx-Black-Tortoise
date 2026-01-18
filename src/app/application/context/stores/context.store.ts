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
import { pipe, switchMap, tap, catchError, of, combineLatest } from 'rxjs';
import { initialContextState } from './context.state';
import {
  AppContext,
  ContextSwitchEvent,
  OrganizationContext,
  TeamContext,
  PartnerContext,
} from '@domain/context';
import { AuthStore } from '@application/auth/stores/auth.store';
import {
  ORGANIZATION_REPOSITORY,
  PARTNER_REPOSITORY,
  TEAM_REPOSITORY,
} from '@application/tokens';
import { EventBusService } from '@shared/services/event-bus.service';

/**
 * ContextStore - CANONICAL SOURCE OF TRUTH for Application Context
 * 
 * ╔═══════════════════════════════════════════════════════════════════╗
 * ║  🎯 SINGLE SOURCE OF TRUTH: Active Workspace & Application Context ║
 * ╚═══════════════════════════════════════════════════════════════════╝
 * 
 * ARCHITECTURAL OWNERSHIP:
 * ========================
 * This store is the ONLY owner of:
 * 1. currentWorkspaceId signal (active workspace ID)
 * 2. current (AppContext) signal (user/org/team/partner context)
 * 3. Workspace switching logic
 * 
 * CANONICAL REACTIVE FLOW:
 * ========================
 * 
 * User clicks workspace → 
 *   workspace-switcher.component.ts calls contextStore.switchWorkspace(id) →
 *     ContextStore updates currentWorkspaceId signal →
 *       WorkspaceStore.effect reacts and loads full workspace data →
 *         ModuleStore.effect reacts and loads workspace modules →
 *           UI updates automatically via signals
 * 
 * FORBIDDEN PATTERNS:
 * ===================
 * ❌ WorkspaceStore.setCurrentWorkspace() - NO SUCH METHOD
 * ❌ Direct workspace mutation outside this store
 * ❌ Components calling workspace repositories directly
 * ❌ Cross-store imports for state mutation
 * 
 * ALLOWED PATTERNS:
 * =================
 * ✅ contextStore.switchWorkspace(workspaceId)
 * ✅ contextStore.switchContext(context)
 * ✅ Other stores read currentWorkspaceId() via computed/effect
 * ✅ UI components read signals and emit events
 * 
 * DEPENDENCY DIRECTION (DDD):
 * ===========================
 * AuthStore → AccountStore → ContextStore → WorkspaceStore → ModuleStore
 *                ↑                             ↓
 *                └─────── (reacts via effects) ─┘
 * 
 * WHY THIS MATTERS:
 * =================
 * - Single mutation point prevents state inconsistency
 * - Reactive propagation eliminates manual state sync
 * - Clean separation enables testing and maintenance
 * - Type-safe signal flow catches errors at compile-time
 */
export const ContextStore = signalStore(
  { providedIn: 'root' },
  withState(initialContextState),
  withComputed(({ current, available, currentWorkspaceId }) => ({
    currentContextType: computed(() => current()?.type || null),
    currentContextId: computed(() => {
      const ctx = current();
      if (!ctx) return null;
      switch (ctx.type) {
        case 'organization':
          return ctx.organizationId;
        case 'team':
          return ctx.teamId;
        case 'partner':
          return ctx.partnerId;
        case 'user':
          return ctx.userId;
        default:
          return null;
      }
    }),
    currentContextName: computed(() => {
      const ctx = current();
      if (!ctx) return null;
      switch (ctx.type) {
        case 'organization':
        case 'team':
        case 'partner':
          return ctx.name;
        case 'user':
          return ctx.email;
        default:
          return null;
      }
    }),
    hasOrganizations: computed(() => available().organizations.length > 0),
    hasTeams: computed(() => available().teams.length > 0),
    hasPartners: computed(() => available().partners.length > 0),
    canSwitchContext: computed(() => {
      const avail = available();
      return (
        avail.organizations.length > 0 ||
        avail.teams.length > 0 ||
        avail.partners.length > 0
      );
    }),
    hasWorkspace: computed(() => currentWorkspaceId() !== null),
  })),
  withMethods((store, authStore = inject(AuthStore)) => ({
    switchContext(context: AppContext): void {
      const event: ContextSwitchEvent = {
        type: context.type,
        id:
          context.type === 'user'
            ? context.userId
            : context.type === 'organization'
            ? context.organizationId
            : context.type === 'team'
            ? context.teamId
            : context.partnerId,
        timestamp: Date.now(),
      };

      patchState(store, {
        current: context,
        history: [...store.history(), event],
      });
    },
    /**
     * Switch active workspace within current context
     * This is the SINGLE source of truth for workspace switching
     */
    switchWorkspace(workspaceId: string | null): void {
      patchState(store, { currentWorkspaceId: workspaceId });
      
      // Note: WorkspaceStore and ModuleStore should react to this signal change
      // via effects, NOT through direct method calls
      console.log('[ContextStore] Workspace switched:', workspaceId);
    },
    setAvailableOrganizations(organizations: OrganizationContext[]): void {
      patchState(store, (state) => ({
        available: {
          ...state.available,
          organizations,
        },
      }));
    },
    setAvailableTeams(teams: TeamContext[]): void {
      patchState(store, (state) => ({
        available: {
          ...state.available,
          teams,
        },
      }));
    },
    setAvailablePartners(partners: PartnerContext[]): void {
      patchState(store, (state) => ({
        available: {
          ...state.available,
          partners,
        },
      }));
    },
    resetContext(): void {
      const user = authStore.user();
      if (user) {
        patchState(store, {
          current: {
            type: 'user',
            userId: user.id,
            email: user.email || '',
            displayName: user.displayName ?? null,
          },
        });
      } else {
        patchState(store, initialContextState);
      }
    },
    clearContext(): void {
      patchState(store, initialContextState);
    },
  })),
  withHooks({
    onInit(
      store,
      authStore = inject(AuthStore),
      orgService = inject(ORGANIZATION_REPOSITORY),
      teamService = inject(TEAM_REPOSITORY),
      partnerService = inject(PARTNER_REPOSITORY)
    ) {
      // Reactive method to load available contexts when user is authenticated
      const loadAvailableContexts = rxMethod<void>(
        pipe(
          switchMap(() => {
            const user = authStore.user();
            if (!user) {
              // Clear context when user logs out
              store.clearContext();
              return of(null);
            }

            // Initialize user context
            store.switchContext({
              type: 'user',
              userId: user.id,
              email: user.email || '',
              displayName: user.displayName ?? null,
            });

            // Load all available contexts reactively
            return combineLatest([
               orgService.list({}),
               teamService.list({}),
               partnerService.list({}),
            ]);
          }),
          tap((result) => {
            if (result) {
              const [orgs, teams, partners] = result;
              
              // Transform to context objects
              const orgContexts: OrganizationContext[] = orgs.map((org: any) => ({
                type: 'organization' as const,
                organizationId: org.id,
                name: org.name,
                role: 'member' as const, // Should come from membership data
              }));

              const teamContexts: TeamContext[] = teams.map((team: any) => ({
                type: 'team' as const,
                teamId: team.id,
                organizationId: team.organizationId,
                name: team.name,
                role: 'member' as const, // Should come from membership data
              }));

              const partnerContexts: PartnerContext[] = partners.map((partner: any) => ({
                type: 'partner' as const,
                partnerId: partner.id,
                organizationId: partner.organizationId,
                name: partner.name,
                accessLevel: 'readonly' as const, // Should come from access data
              }));

              store.setAvailableOrganizations(orgContexts);
              store.setAvailableTeams(teamContexts);
              store.setAvailablePartners(partnerContexts);
            }
          }),
          catchError((error) => {
            console.error('[ContextStore] Error loading available contexts:', error);
            return of(null);
          })
        )
      );

      // Trigger loading immediately (user may already be authenticated from APP_INITIALIZER)
      // This will also react to auth state changes
      loadAvailableContexts();
    },
  })
);
