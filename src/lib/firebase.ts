/**
 * Firebase configuration and initialization
 * Handles authentication, Firestore, and messaging setup
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getMessaging, Messaging } from 'firebase/messaging';

// Firebase configuration interface
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// Get Firebase configuration from environment variables
const firebaseConfig: FirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
};

// Initialize Firebase app (only if not already initialized)
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let messaging: Messaging | null = null;

try {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }

  // Initialize Firebase services only if config is available
  if (app && firebaseConfig.apiKey) {
    auth = getAuth(app);
    db = getFirestore(app);
    
    // Initialize messaging only on client side
    if (typeof window !== 'undefined') {
      messaging = getMessaging(app);
    }
  }
} catch (error) {
  console.warn('Firebase not available in development mode:', error);
}

// Export Firebase services with null checks
export { auth, db, messaging };
export default app;
