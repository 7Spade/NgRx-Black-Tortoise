/**
 * Account = Identity (User | Organization | Bot | Subunit)
 * Maps to authentication claims without binding to Firebase SDK types.
 */

export type AccountType = 'user' | 'organization' | 'bot' | 'team' | 'partner';

export interface Account {
  id: string;
  type: AccountType;
  email?: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Claims for authorization
  customClaims?: Record<string, any>;
  
  // Metadata
  metadata?: {
    lastLoginAt?: Date;
    emailVerified?: boolean;
    disabled?: boolean;
  };
}

export interface UserAccount extends Account {
  type: 'user';
  email: string;
}

export interface OrganizationAccount extends Account {
  type: 'organization';
  organizationId: string;
}

export interface BotAccount extends Account {
  type: 'bot';
  serviceAccountId: string;
}

export interface SubUnitAccount extends Account {
  type: 'team' | 'partner';
  parentOrganizationId: string;
}

export interface AuthUser {
  id: string;
  email: string;
  displayName: string | null;
}
