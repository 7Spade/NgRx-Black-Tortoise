/**
 * User Entity
 * 
 * DOMAIN LAYER - PURE TYPESCRIPT
 * ===============================
 * NO Angular, RxJS, or Firebase dependencies allowed.
 * 
 * User represents a personal user account (Identity Layer).
 * Users can:
 * - Own workspaces
 * - Be members of organizations
 * - Be members of teams
 * - Create bots
 */

/**
 * Authenticated User
 * Minimal user information from authentication provider
 */
export interface AuthUser {
  readonly uid: string;
  readonly email: string | null;
  readonly displayName: string | null;
  readonly photoURL: string | null;
  readonly emailVerified: boolean;
}

/**
 * User account status
 */
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  DELETED = 'deleted'
}

/**
 * User preferences
 */
export interface UserPreferences {
  // Appearance
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  
  // Notifications
  emailNotifications: boolean;
  pushNotifications: boolean;
  
  // Workspace defaults
  defaultView?: 'list' | 'board' | 'calendar' | 'timeline';
}

/**
 * User Entity
 * Represents a personal user account (Identity)
 */
export interface User {
  readonly id: string;
  
  // Basic information
  email: string;
  displayName: string;
  photoURL?: string;
  
  // Profile details
  bio?: string;
  title?: string;
  department?: string;
  
  // Contact information
  phoneNumber?: string;
  
  // Organization memberships
  // IMPORTANT: Only store organization IDs, not full Organization objects
  organizationIds: string[];
  
  // Team memberships
  // IMPORTANT: Derived via Team.members, not stored here
  
  // Workspace ownership
  // IMPORTANT: Derived via Workspace.ownerId + ownerType, not stored here
  
  // Preferences
  preferences: UserPreferences;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  
  // Status
  status: UserStatus;
  
  // Email verification
  emailVerified: boolean;
  
  // Multi-factor authentication
  mfaEnabled: boolean;
}

/**
 * User Identity
 * Minimal user representation for account switcher UI
 * Extends User with type discriminator
 */
export interface UserIdentity extends User {
  readonly type: 'user';
}

/**
 * User creation data
 * Used when creating a new user account
 */
export type CreateUserData = Omit<
  User,
  'id' | 'organizationIds' | 'createdAt' | 'updatedAt' | 'lastLoginAt' | 'status' | 'emailVerified' | 'mfaEnabled'
> & {
  organizationIds?: string[];
};

/**
 * User update data
 * Partial update of user fields
 */
export type UpdateUserData = Partial<Omit<
  User,
  'id' | 'email' | 'createdAt' | 'emailVerified'
>>;

/**
 * Helper functions for user management
 */
export const UserHelpers = {
  /**
   * Check if user is active
   */
  isActive(user: User): boolean {
    return user.status === UserStatus.ACTIVE;
  },
  
  /**
   * Check if user is suspended
   */
  isSuspended(user: User): boolean {
    return user.status === UserStatus.SUSPENDED;
  },
  
  /**
   * Check if user is deleted
   */
  isDeleted(user: User): boolean {
    return user.status === UserStatus.DELETED;
  },
  
  /**
   * Check if user is member of an organization
   */
  isMemberOfOrganization(user: User, organizationId: string): boolean {
    return user.organizationIds.includes(organizationId);
  },
  
  /**
   * Get organization count
   */
  getOrganizationCount(user: User): number {
    return user.organizationIds.length;
  },
  
  /**
   * Validate email format
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  
  /**
   * Validate display name
   */
  isValidDisplayName(displayName: string): boolean {
    // Display name must be 1-100 characters
    return displayName.length >= 1 && displayName.length <= 100;
  },
  
  /**
   * Get initials from display name
   */
  getInitials(user: User): string {
    const parts = user.displayName.split(' ');
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  },
  
  /**
   * Check if user requires email verification
   */
  requiresEmailVerification(user: User): boolean {
    return !user.emailVerified;
  },
  
  /**
   * Get default preferences
   */
  getDefaultPreferences(): UserPreferences {
    return {
      theme: 'auto',
      language: 'en',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      emailNotifications: true,
      pushNotifications: false
    };
  }
};
