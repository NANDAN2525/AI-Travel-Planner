/**
 * Authentication utilities and context
 * Handles user authentication, sign in/out, and user management
 */

import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  UserCredential
} from 'firebase/auth';
import { auth } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

// User profile interface
export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  preferences?: {
    language: 'en' | 'hi' | 'ta' | 'bn';
    currency: 'INR' | 'USD' | 'EUR';
    travelStyle: 'budget' | 'luxury' | 'adventure' | 'cultural';
  };
  createdAt: Date;
  updatedAt: Date;
}

// Authentication service class
export class AuthService {
  /**
   * Sign in with email and password
   */
  static async signIn(email: string, password: string): Promise<UserCredential> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  /**
   * Create new user account
   */
  static async signUp(email: string, password: string, displayName?: string): Promise<UserCredential> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user profile in Firestore
      if (userCredential.user) {
        await this.createUserProfile(userCredential.user, displayName);
      }
      
      return userCredential;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  /**
   * Sign out current user
   */
  static async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  /**
   * Get current user
   */
  static getCurrentUser(): User | null {
    return auth.currentUser;
  }

  /**
   * Listen to authentication state changes
   */
  static onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
  }

  /**
   * Create user profile in Firestore
   */
  private static async createUserProfile(user: User, displayName?: string): Promise<void> {
    try {
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        displayName: displayName || user.displayName || '',
        photoURL: user.photoURL || '',
        preferences: {
          language: 'en',
          currency: 'INR',
          travelStyle: 'budget'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await setDoc(doc(db, 'users', user.uid), userProfile);
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  }

  /**
   * Get user profile from Firestore
   */
  static async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return userDoc.data() as UserProfile;
      }
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  static async updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
    try {
      const userRef = doc(db, 'users', uid);
      await setDoc(userRef, {
        ...updates,
        updatedAt: new Date()
      }, { merge: true });
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }
}
