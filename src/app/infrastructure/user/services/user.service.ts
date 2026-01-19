/**
 * User Firestore Repository
 * 
 * Infrastructure layer implementation for user persistence in Firestore.
 * Handles CRUD operations for user documents.
 * Implements Promise-based methods for framework-agnostic domain layer.
 */
import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
  Timestamp,
} from '@angular/fire/firestore';
import { User, CreateUserData, UpdateUserData, UserStatus } from '@domain/account';
import { UserRepository } from '@domain/repositories';

@Injectable({
  providedIn: 'root',
})
export class UserFirestoreService implements UserRepository {
  private firestore = inject(Firestore);
  private usersCollection = collection(this.firestore, 'users');

  /**
   * Create a new user account in Firestore
   */
  async create(data: CreateUserData): Promise<User> {
    // Generate a new ID or use Firebase Auth UID
    const userId = doc(this.usersCollection).id;
    const userRef = doc(this.usersCollection, userId);
    
    const userData: User = {
      ...data,
      id: userId,
      organizationIds: data.organizationIds || [],
      status: UserStatus.ACTIVE,
      emailVerified: false,
      mfaEnabled: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      await setDoc(userRef, {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return userData;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  }

  /**
   * Get user by ID
   */
  async findById(id: string): Promise<User | null> {
    const userRef = doc(this.usersCollection, id);
    
    try {
      const docSnap = await getDoc(userRef);
      if (!docSnap.exists()) {
        return null;
      }
      return this.convertFirestoreDoc(docSnap.data(), id);
    } catch (error) {
      console.error('Error getting user:', error);
      throw new Error('Failed to get user');
    }
  }

  /**
   * Get user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    const q = query(this.usersCollection, where('email', '==', email));
    
    try {
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        return null;
      }
      const doc = querySnapshot.docs[0];
      return this.convertFirestoreDoc(doc.data(), doc.id);
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw new Error('Failed to find user by email');
    }
  }

  /**
   * Get all users belonging to an organization
   */
  async findByOrganizationId(organizationId: string): Promise<User[]> {
    const q = query(this.usersCollection, where('organizationIds', 'array-contains', organizationId));
    
    try {
      const querySnapshot = await getDocs(q);
      const users: User[] = [];
      querySnapshot.forEach((doc) => {
        users.push(this.convertFirestoreDoc(doc.data(), doc.id));
      });
      return users;
    } catch (error) {
      console.error('Error getting users by organization:', error);
      throw new Error('Failed to get users by organization');
    }
  }

  /**
   * Get users by array of IDs
   */
  async findByIds(ids: string[]): Promise<User[]> {
    if (ids.length === 0) return [];
    
    // Firestore 'in' queries are limited to 10 items, so we batch
    const users: User[] = [];
    const batchSize = 10;
    
    try {
      for (let i = 0; i < ids.length; i += batchSize) {
        const batch = ids.slice(i, i + batchSize);
        const q = query(this.usersCollection, where('__name__', 'in', batch));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          users.push(this.convertFirestoreDoc(doc.data(), doc.id));
        });
      }
      return users;
    } catch (error) {
      console.error('Error getting users by IDs:', error);
      throw new Error('Failed to get users by IDs');
    }
  }

  /**
   * Update user data
   */
  async update(id: string, data: UpdateUserData): Promise<User> {
    const userRef = doc(this.usersCollection, id);
    
    const updateData = {
      ...data,
      updatedAt: serverTimestamp(),
    };

    try {
      await updateDoc(userRef, updateData);
      const updatedDoc = await getDoc(userRef);
      if (!updatedDoc.exists()) {
        throw new Error('User not found after update');
      }
      return this.convertFirestoreDoc(updatedDoc.data(), id);
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Failed to update user');
    }
  }

  /**
   * Add user to organization
   */
  async addToOrganization(userId: string, organizationId: string): Promise<void> {
    const userRef = doc(this.usersCollection, userId);
    
    try {
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        throw new Error('User not found');
      }
      
      const user = this.convertFirestoreDoc(userDoc.data(), userId);
      const organizationIds = user.organizationIds || [];
      
      if (!organizationIds.includes(organizationId)) {
        organizationIds.push(organizationId);
        await updateDoc(userRef, {
          organizationIds,
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error('Error adding user to organization:', error);
      throw new Error('Failed to add user to organization');
    }
  }

  /**
   * Remove user from organization
   */
  async removeFromOrganization(userId: string, organizationId: string): Promise<void> {
    const userRef = doc(this.usersCollection, userId);
    
    try {
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        throw new Error('User not found');
      }
      
      const user = this.convertFirestoreDoc(userDoc.data(), userId);
      const organizationIds = (user.organizationIds || []).filter(id => id !== organizationId);
      
      await updateDoc(userRef, {
        organizationIds,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error removing user from organization:', error);
      throw new Error('Failed to remove user from organization');
    }
  }

  /**
   * Update user's last login timestamp
   */
  async updateLastLogin(userId: string): Promise<void> {
    const userRef = doc(this.usersCollection, userId);
    
    try {
      await updateDoc(userRef, {
        lastLoginAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating last login:', error);
      throw new Error('Failed to update last login');
    }
  }

  /**
   * Mark user email as verified
   */
  async verifyEmail(userId: string): Promise<void> {
    const userRef = doc(this.usersCollection, userId);
    
    try {
      await updateDoc(userRef, {
        emailVerified: true,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error verifying email:', error);
      throw new Error('Failed to verify email');
    }
  }

  /**
   * Enable/disable MFA for user
   */
  async setMfaEnabled(userId: string, enabled: boolean): Promise<void> {
    const userRef = doc(this.usersCollection, userId);
    
    try {
      await updateDoc(userRef, {
        mfaEnabled: enabled,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error setting MFA:', error);
      throw new Error('Failed to set MFA');
    }
  }

  /**
   * Delete user account (soft delete)
   */
  async delete(id: string): Promise<void> {
    const userRef = doc(this.usersCollection, id);
    
    try {
      await updateDoc(userRef, {
        status: UserStatus.DELETED,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new Error('Failed to delete user');
    }
  }

  /**
   * Convert Firestore document data to User entity
   */
  private convertFirestoreDoc(data: any, id: string): User {
    return {
      id,
      email: data.email,
      displayName: data.displayName,
      photoURL: data.photoURL,
      bio: data.bio,
      title: data.title,
      department: data.department,
      phoneNumber: data.phoneNumber,
      organizationIds: data.organizationIds || [],
      preferences: data.preferences || {},
      createdAt: data.createdAt instanceof Timestamp 
        ? data.createdAt.toDate() 
        : new Date(data.createdAt),
      updatedAt: data.updatedAt instanceof Timestamp 
        ? data.updatedAt.toDate() 
        : new Date(data.updatedAt),
      lastLoginAt: data.lastLoginAt 
        ? (data.lastLoginAt instanceof Timestamp 
            ? data.lastLoginAt.toDate() 
            : new Date(data.lastLoginAt))
        : undefined,
      status: data.status || UserStatus.ACTIVE,
      emailVerified: data.emailVerified || false,
      mfaEnabled: data.mfaEnabled || false,
    };
  }
}
