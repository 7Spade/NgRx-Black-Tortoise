/**
 * Bot Store - Zone-less Compatible Signal Store
 * 
 * Manages bot (service account) state.
 * Loads and manages bots created by current user or organization.
 * 
 * ARCHITECTURAL RESPONSIBILITY:
 * =============================
 * - Load bots created by user
 * - Load bots belonging to organization
 * - Load bots with access to workspace
 * - Track current active bot (for bot-as-account switching)
 * - Provide computed signals for bot filtering
 * 
 * BOT OWNERSHIP RULES:
 * ====================
 * - Bots can be created by Users or Organizations
 * - Bots CANNOT own workspaces (only User/Organization can)
 * - Bots can ACCESS workspaces via permissions
 * - Bots appear in account switcher for bot-based API access
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
import { pipe, switchMap, tap, from } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { initialBotState } from './bot.state';
import { Bot, BotStatus } from '@domain/account';
import { BOT_REPOSITORY } from '@application/tokens';
import { AuthStore } from '@application/auth/stores/auth.store';

type BotState = typeof initialBotState;

/**
 * BotStore manages bot service accounts
 * 
 * Responsibilities:
 * - Load bots created by current user
 * - Load bots belonging to organizations
 * - Load bots with workspace access
 * - Track current active bot
 * - Provide computed signals for bot status filtering
 */
export const BotStore = signalStore(
  { providedIn: 'root' },
  withState(initialBotState),
  withComputed(({ bots }) => ({
    // Active bots only
    activeBots: computed(() => 
      bots().filter(b => b.status === BotStatus.ACTIVE)
    ),
    
    // Suspended bots
    suspendedBots: computed(() => 
      bots().filter(b => b.status === BotStatus.SUSPENDED)
    ),
    
    // Revoked bots
    revokedBots: computed(() => 
      bots().filter(b => b.status === BotStatus.REVOKED)
    ),
    
    // Bot count
    botCount: computed(() => bots().length),
  })),
  withMethods((store, botRepository = inject(BOT_REPOSITORY)) => {
    // Load bots created by user
    const loadBotsByCreatorEffect = rxMethod<string>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((createdBy) => from(botRepository.findByCreatorId(createdBy))),
        tapResponse({
          next: (bots) => {
            patchState(store, {
              bots,
              loading: false,
            });
          },
          error: (error: Error) => {
            patchState(store, {
              error: error.message || 'Failed to load bots',
              loading: false,
            });
          },
        })
      )
    );

    // Load bots by organization
    const loadBotsByOrganizationEffect = rxMethod<string>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((organizationId) => from(botRepository.getBotsByOwnerId(organizationId))),
        tapResponse({
          next: (bots) => {
            patchState(store, {
              bots,
              loading: false,
            });
          },
          error: (error: Error) => {
            patchState(store, {
              error: error.message || 'Failed to load organization bots',
              loading: false,
            });
          },
        })
      )
    );

    // Load bots by workspace
    const loadBotsByWorkspaceEffect = rxMethod<string>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((workspaceId) => from(botRepository.getBotsByWorkspaceId(workspaceId))),
        tapResponse({
          next: (bots) => {
            patchState(store, {
              bots,
              loading: false,
            });
          },
          error: (error: Error) => {
            patchState(store, {
              error: error.message || 'Failed to load workspace bots',
              loading: false,
            });
          },
        })
      )
    );

    return {
      loadBotsByCreator(createdBy: string): void {
        loadBotsByCreatorEffect(createdBy);
      },
      
      loadBotsByOrganization(organizationId: string): void {
        loadBotsByOrganizationEffect(organizationId);
      },
      
      loadBotsByWorkspace(workspaceId: string): void {
        loadBotsByWorkspaceEffect(workspaceId);
      },
      
      /**
       * Set current bot (for bot account switching)
       */
      setCurrentBot(bot: Bot | null) {
        patchState(store, { currentBot: bot });
      },
      
      // Reset store state
      reset() {
        patchState(store, initialBotState);
      },
    };
  }),
  withHooks({
    onInit(store) {
      const authStore = inject(AuthStore);
      
      // Auto-load bots when user authenticates
      const syncBots = rxMethod<void>(
        pipe(
          switchMap(() => {
            const user = authStore.user();
            if (user) {
              // Load bots created by this user
              store.loadBotsByCreator(user.id);
              return pipe();
            }
            // User logged out, reset store
            store.reset();
            return pipe();
          })
        )
      );
      
      // Start syncing bots with auth state
      syncBots();
    },
  })
);
