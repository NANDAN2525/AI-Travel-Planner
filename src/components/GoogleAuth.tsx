/**
 * Google OAuth Authentication Component
 * Handles Google sign-in and sign-out functionality
 */

'use client';

import React, { useState, useEffect } from 'react';
import { signInWithPopup, signOut, onAuthStateChanged, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { User } from 'firebase/auth';
import { LogIn, LogOut, User as UserIcon } from 'lucide-react';

interface GoogleAuthProps {
  className?: string;
}

export default function GoogleAuth({ className = '' }: GoogleAuthProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    if (!auth) {
      setUser(null);
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    if (!auth) {
      console.error('Firebase auth not initialized');
      return;
    }

    setSigningIn(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error signing in with Google:', error);
      alert('Failed to sign in. Please try again.');
    } finally {
      setSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    if (!auth) {
      console.error('Firebase auth not initialized');
      return;
    }

    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Failed to sign out. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
        <span className="text-sm text-gray-600">Loading...</span>
      </div>
    );
  }

  if (user) {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        <div className="flex items-center space-x-2">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName || 'User'}
              className="w-8 h-8 rounded-full border-2 border-white shadow-md"
            />
          ) : (
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <UserIcon className="w-4 h-4 text-white" />
            </div>
          )}
          <span className="text-sm font-medium text-gray-700 hidden sm:block">
            {user.displayName || user.email}
          </span>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:block">Sign Out</span>
        </button>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <button
        onClick={handleGoogleSignIn}
        disabled={signingIn}
        className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {signingIn ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span>Signing in...</span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <LogIn className="w-4 h-4" />
            <span>Sign in with Google</span>
          </>
        )}
      </button>
    </div>
  );
}
