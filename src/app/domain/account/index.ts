/**
 * Account domain exports.
 * 
 * Re-exports canonical type definitions from shared/types/ddd-types-reference.ts
 * to maintain backward compatibility with existing imports.
 * 
 * SINGLE SOURCE OF TRUTH: All account-related types are defined in ddd-types-reference.ts
 * 
 * IMPORTANT: There is NO "AccountType" export.
 * Use IdentityType | MembershipType inline when handling both layers.
 */
export type {
  // Core Account Union
  Account,
  
  // Identity Layer Types
  IdentityType,
  MembershipType,
  WorkspaceOwnerType
} from '../shared/types/ddd-types-reference';

export {
  // Type Guards
  canOwnWorkspace,
  isIdentityType,
  isMembershipType
} from '../shared/types/ddd-types-reference';
