/**
 * Domain repository contracts.
 * 
 * Identity Layer Repositories:
 * - user.repository.interface.ts (User identity)
 * - organization.repository.interface.ts (Organization identity)
 * - bot.repository.interface.ts (Bot identity)
 * 
 * Membership Layer Repositories:
 * - team.repository.interface.ts (Team membership - requires organizationId)
 * - partner.repository.interface.ts (Partner membership - requires organizationId)
 * 
 * Workspace Layer Repositories:
 * - workspace.repository.interface.ts (Workspace container - NO members array)
 * 
 * Other Domain Repositories:
 * - auth.repository.interface.ts (Authentication)
 * - document.repository.interface.ts (Documents)
 * - task.repository.interface.ts (Tasks)
 * - module.repository.interface.ts (Modules)
 * - notification.repository.interface.ts (Notifications)
 */

// Identity Layer
export * from './user.repository.interface';
export * from './organization.repository.interface';
export * from './bot.repository.interface';

// Membership Layer
export * from './team.repository.interface';
export * from './partner.repository.interface';

// Workspace Layer
export * from './workspace.repository.interface';

// Auth
export * from './auth.repository.interface';

// Domain Entities
export * from './document.repository.interface';
export * from './task.repository.interface';
export * from './module.repository.interface';
export * from './notification.repository.interface';
