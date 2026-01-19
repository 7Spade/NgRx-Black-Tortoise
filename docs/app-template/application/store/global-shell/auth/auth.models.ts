/**
 * 摘要 (Summary): Auth Models - 認證相關的介面和類型定義
 * 
 * 用途 (Purpose): 定義認證狀態、使用者資訊等相關的 TypeScript 類型
 * 
 * 功能 (Features):
 * - AuthState 介面定義
 * - User 相關類型定義
 * - 認證相關的 enum 和常數
 * 
 * 責任 (Responsibilities):
 * - 提供 Auth Store 使用的類型定義
 * - 確保類型安全的認證資料結構
 * - 定義認證相關的業務模型
 */

import { User } from '@angular/fire/auth';
import { Account } from '../../../../domain/account';

/**
 * Authentication State Interface
 * 
 * Represents the complete authentication state in the application.
 */
export interface AuthState {
  /** Firebase Auth user object (null when not authenticated) */
  authUser: User | null;
  
  /** Domain Account entity (null until loaded from Firestore) */
  userAccount: Account | null;
  
  /** Loading state for auth operations */
  loading: boolean;
  
  /** Error message from auth operations */
  error: string | null;
}

/**
 * Email and Password Credentials
 * 
 * Used for email/password sign-in operations.
 */
export interface EmailCredentials {
  /** User's email address */
  email: string;
  
  /** User's password */
  password: string;
}

/**
 * User Update Data
 * 
 * Partial updates allowed for user profile.
 */
export interface UserUpdateData {
  displayName?: string | null;
  photoURL?: string | null;
}
