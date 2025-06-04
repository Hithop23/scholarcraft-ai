'use client';

import type { ReactNode } from 'react';
import React, { createContext, useState, useEffect } from 'react';
import type { User as FirebaseUser } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/lib/firebase/client';
import type { UserProfile, Role } from '@/types';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  error: Error | null;
  role: Role | null;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  role: null,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [role, setRole] = useState<Role | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          try {
            const userDocRef = doc(db, 'users', firebaseUser.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
              const userData = userDocSnap.data() as Omit<UserProfile, keyof FirebaseUser>;
              setUser({ ...firebaseUser, ...userData });
              setRole(userData.role || 'student');
            } else {
              // Create a new user profile if it doesn't exist (e.g. first OAuth login)
              const newUserProfile: UserProfile = {
                ...firebaseUser,
                role: 'student', // Default role
                // Initialize other fields as needed
              };
              await setDoc(userDocRef, {
                uid: newUserProfile.uid,
                email: newUserProfile.email,
                displayName: newUserProfile.displayName,
                photoURL: newUserProfile.photoURL,
                role: 'student',
                createdAt: new Date().toISOString(),
              });
              setUser(newUserProfile);
              setRole('student');
            }
          } catch (e) {
            setError(e as Error);
            console.error("Error fetching/creating user profile:", e);
          }
        } else {
          setUser(null);
          setRole(null);
        }
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
        console.error("Auth state change error:", err);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error, role }}>
      {children}
    </AuthContext.Provider>
  );
};
