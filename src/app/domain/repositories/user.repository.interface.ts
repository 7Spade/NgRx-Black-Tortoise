/**
 * User Repository Interface
 * 
 * DOMAIN LAYER - PURE TYPESCRIPT
 * ===============================
 * NO Angular, RxJS, or Firebase dependencies allowed.
 * Returns Promises to avoid framework coupling.
 * 
 * User is an Identity Layer entity that can:
 * - Own workspaces
 * - Be members of organizations
 * - Be members of teams
 * - Create bots
 */

import { User, CreateUserData, UpdateUserData } from '../account/entities/user.entity';

export interface UserRepository {
  /**
   * Create a new user account
   */
  create(data: CreateUserData): Promise<User>;
  
  /**
   * Get user by ID
   */
  findById(id: string): Promise<User | null>;
  
  /**
   * Get user by email
   */
  findByEmail(email: string): Promise<User | null>;
  
  /**
   * Get all users belonging to an organization
   */
  findByOrganizationId(organizationId: string): Promise<User[]>;
  
  /**
   * Get users by array of IDs
   * Useful for batch loading team/organization members
   */
  findByIds(ids: string[]): Promise<User[]>;
  
  /**
   * Update user data
   */
  update(id: string, data: UpdateUserData): Promise<User>;
  
  /**
   * Add user to organization
   */
  addToOrganization(userId: string, organizationId: string): Promise<void>;
  
  /**
   * Remove user from organization
   */
  removeFromOrganization(userId: string, organizationId: string): Promise<void>;
  
  /**
   * Update user's last login timestamp
   */
  updateLastLogin(userId: string): Promise<void>;
  
  /**
   * Mark user email as verified
   */
  verifyEmail(userId: string): Promise<void>;
  
  /**
   * Enable/disable MFA for user
   */
  setMfaEnabled(userId: string, enabled: boolean): Promise<void>;
  
  /**
   * Delete user account (soft delete - sets status to DELETED)
   */
  delete(id: string): Promise<void>;
}
