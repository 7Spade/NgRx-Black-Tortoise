/**
 * Injection tokens for domain repositories.
 */
import { InjectionToken } from '@angular/core';
import {
  AccountRepository,
  AuthRepository,
  OrganizationRepository,
  PartnerRepository,
  TaskRepository,
  TeamRepository,
  WorkspaceRepository,
} from '@domain/repositories';

export const ACCOUNT_REPOSITORY = new InjectionToken<AccountRepository>('ACCOUNT_REPOSITORY');
export const AUTH_REPOSITORY = new InjectionToken<AuthRepository>('AUTH_REPOSITORY');
export const ORGANIZATION_REPOSITORY = new InjectionToken<OrganizationRepository>('ORGANIZATION_REPOSITORY');
export const PARTNER_REPOSITORY = new InjectionToken<PartnerRepository>('PARTNER_REPOSITORY');
export const TASK_REPOSITORY = new InjectionToken<TaskRepository>('TASK_REPOSITORY');
export const TEAM_REPOSITORY = new InjectionToken<TeamRepository>('TEAM_REPOSITORY');
export const WORKSPACE_REPOSITORY = new InjectionToken<WorkspaceRepository>('WORKSPACE_REPOSITORY');
