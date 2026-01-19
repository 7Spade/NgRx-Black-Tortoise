/**
 * Account Aggregator Service
 * 
 * APPLICATION LAYER SERVICE
 * Aggregates data from multiple repositories to create unified Account[] list
 * 
 * RESPONSIBILITY:
 * ===============
 * This service bridges the gap between:
 * 1. Domain layer - separate User/Organization/Bot/Team/Partner repositories
 * 2. Application layer - unified Account union type for UI
 * 
 * WHY THIS SERVICE EXISTS:
 * ========================
 * The domain layer maintains separate repositories for each identity type (DDD principle).
 * The UI needs a unified list of all accounts for the account switcher.
 * This service aggregates them WITHOUT creating domain violations.
 * 
 * PATTERN:
 * ========
 * Application Service that coordinates multiple repositories
 * Returns Promise-based results (framework-agnostic)
 */
import { Injectable, inject } from '@angular/core';
import { Account } from '@domain/account';
import { USER_REPOSITORY, ORGANIZATION_REPOSITORY, BOT_REPOSITORY, TEAM_REPOSITORY, PARTNER_REPOSITORY } from '@application/tokens';

@Injectable({
  providedIn: 'root'
})
export class AccountAggregatorService {
  private userRepo = inject(USER_REPOSITORY);
  private orgRepo = inject(ORGANIZATION_REPOSITORY);
  private botRepo = inject(BOT_REPOSITORY);
  private teamRepo = inject(TEAM_REPOSITORY);
  private partnerRepo = inject(PARTNER_REPOSITORY);

  /**
   * Get all accounts for a user
   * 
   * Aggregates:
   * 1. User's own account (UserIdentity)
   * 2. Organizations the user belongs to (OrganizationIdentity[])
   * 3. Bots created by the user (BotIdentity[])
   * 4. Teams the user is a member of (TeamIdentity[])
   * 5. Partner organizations the user represents (PartnerIdentity[])
   * 
   * @param userId - The user ID to fetch accounts for
   * @returns Promise<Account[]> - Unified list of all accounts
   */
  async getAccountsByUserId(userId: string): Promise<Account[]> {
    const accounts: Account[] = [];

    try {
      // 1. Get user account
      const user = await this.userRepo.findById(userId);
      if (user) {
        accounts.push({
          ...user,
          type: 'user' as const
        });
      }

      // 2. Get user's organizations
      const userOrganizationIds = user?.organizationIds || [];
      const organizations = await Promise.all(
        userOrganizationIds.map(orgId => this.orgRepo.findById(orgId))
      );
      organizations
        .filter((org): org is NonNullable<typeof org> => org !== null)
        .forEach(org => {
          accounts.push({
            ...org,
            type: 'organization' as const
          });
        });

      // 3. Get bots created by user
      const bots = await this.botRepo.findByCreatorId(userId);
      bots.forEach(bot => {
        accounts.push({
          ...bot,
          type: 'bot' as const
        });
      });

      // 4. Get teams the user is a member of
      const teams = await this.teamRepo.findByMemberId(userId);
      teams.forEach(team => {
        accounts.push({
          ...team,
          type: 'team' as const
        });
      });

      // 5. Get partner organizations the user represents
      const partners = await this.partnerRepo.findByMemberId(userId);
      partners.forEach(partner => {
        accounts.push({
          ...partner,
          type: 'partner' as const
        });
      });

      return accounts;
    } catch (error) {
      console.error('Error aggregating accounts:', error);
      throw new Error('Failed to load accounts');
    }
  }

  /**
   * Get single account by ID and type
   * 
   * @param accountId - The account ID
   * @param accountType - The account type discriminator
   * @returns Promise<Account | null>
   */
  async getAccountById(accountId: string, accountType: Account['type']): Promise<Account | null> {
    try {
      switch (accountType) {
        case 'user': {
          const user = await this.userRepo.findById(accountId);
          return user ? { ...user, type: 'user' as const } : null;
        }
        case 'organization': {
          const org = await this.orgRepo.findById(accountId);
          return org ? { ...org, type: 'organization' as const } : null;
        }
        case 'bot': {
          const bot = await this.botRepo.findById(accountId);
          return bot ? { ...bot, type: 'bot' as const } : null;
        }
        case 'team': {
          const team = await this.teamRepo.findById(accountId);
          return team ? { ...team, type: 'team' as const } : null;
        }
        case 'partner': {
          const partner = await this.partnerRepo.findById(accountId);
          return partner ? { ...partner, type: 'partner' as const } : null;
        }
        default:
          return null;
      }
    } catch (error) {
      console.error(`Error getting account ${accountId} of type ${accountType}:`, error);
      return null;
    }
  }
}
