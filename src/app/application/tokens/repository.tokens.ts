/**
 * Injection tokens for domain repositories.
 * 
 * Identity Layer:
 * - USER_REPOSITORY (User identity)
 * - ORGANIZATION_REPOSITORY (Organization identity)
 * - BOT_REPOSITORY (Bot identity)
 * 
 * Membership Layer:
 * - TEAM_REPOSITORY (Team membership - requires organizationId)
 * - PARTNER_REPOSITORY (Partner membership - requires organizationId)
 * 
 * Workspace Layer:
 * - WORKSPACE_REPOSITORY (Workspace container - NO members array)
 * 
 * Other:
 * - AUTH_REPOSITORY (Authentication)
 * - DOCUMENT_REPOSITORY, TASK_REPOSITORY, MODULE_REPOSITORY, NOTIFICATION_REPOSITORY
 */
import { InjectionToken } from '@angular/core';
import {
  AuthRepository,
  UserRepository,
  OrganizationRepository,
  BotRepository,
  TeamRepository,
  PartnerRepository,
  WorkspaceRepository,
  DocumentRepository,
  TaskRepository,
  ModuleRepository,
  NotificationRepository,
} from '@domain/repositories';

// Identity Layer
export const USER_REPOSITORY = new InjectionToken<UserRepository>('USER_REPOSITORY');
export const ORGANIZATION_REPOSITORY = new InjectionToken<OrganizationRepository>('ORGANIZATION_REPOSITORY');
export const BOT_REPOSITORY = new InjectionToken<BotRepository>('BOT_REPOSITORY');

// Membership Layer
export const TEAM_REPOSITORY = new InjectionToken<TeamRepository>('TEAM_REPOSITORY');
export const PARTNER_REPOSITORY = new InjectionToken<PartnerRepository>('PARTNER_REPOSITORY');

// Workspace Layer
export const WORKSPACE_REPOSITORY = new InjectionToken<WorkspaceRepository>('WORKSPACE_REPOSITORY');

// Auth
export const AUTH_REPOSITORY = new InjectionToken<AuthRepository>('AUTH_REPOSITORY');

// Domain Entities
export const DOCUMENT_REPOSITORY = new InjectionToken<DocumentRepository>('DOCUMENT_REPOSITORY');
export const TASK_REPOSITORY = new InjectionToken<TaskRepository>('TASK_REPOSITORY');
export const MODULE_REPOSITORY = new InjectionToken<ModuleRepository>('MODULE_REPOSITORY');
export const NOTIFICATION_REPOSITORY = new InjectionToken<NotificationRepository>('NOTIFICATION_REPOSITORY');
