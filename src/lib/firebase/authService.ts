import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  GoogleAuthProvider,
  OAuthProvider, // For Microsoft
  signInWithPopup,
  updateProfile as updateFirebaseProfile,
  type User as FirebaseUser,
} from 'firebase/auth';
import { auth, db } from './client';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import type { UserProfile } from '@/types';

// Sign Up
export const signUpWithEmail = async (email: string, password_1: string, firstName: string, lastName: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password_1);
  const firebaseUser = userCredential.user;

  await updateFirebaseProfile(firebaseUser, {
    displayName: `${firstName} ${lastName}`,
  });
  
  // Create user document in Firestore
  const userDocRef = doc(db, 'users', firebaseUser.uid);
  await setDoc(userDocRef, {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: `${firstName} ${lastName}`,
    firstName,
    lastName,
    photoURL: firebaseUser.photoURL,
    role: 'student', // Default role
    createdAt: serverTimestamp(),
    emailVerified: firebaseUser.emailVerified,
  });
  
  await sendVerificationEmail(firebaseUser);
  return firebaseUser;
};

// Sign In
export const signInWithEmail = async (email: string, password_1: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password_1);
  return userCredential.user;
};

// Sign Out
export const signOutUser = async () => {
  await signOut(auth);
};

// Password Reset
export const resetPassword = async (email: string) => {
  await sendPasswordResetEmail(auth, email);
};

// Send Verification Email
export const sendVerificationEmail = async (user: FirebaseUser) => {
  if (user) {
    await sendEmailVerification(user);
  }
};

// Google Sign In
const googleProvider = new GoogleAuthProvider();
export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;
  // Check if user exists in Firestore, if not, create profile
  const userDocRef = doc(db, 'users', user.uid);
  const userDocSnap = await getDoc(userDocRef);
  if (!userDocSnap.exists()) {
    await setDoc(userDocRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      role: 'student',
      createdAt: serverTimestamp(),
      emailVerified: user.emailVerified,
    });
  }
  return user;
};

// Microsoft Sign In
const microsoftProvider = new OAuthProvider('microsoft.com');
export const signInWithMicrosoft = async () => {
  const result = await signInWithPopup(auth, microsoftProvider);
  const user = result.user;
  // Check if user exists in Firestore, if not, create profile
  const userDocRef = doc(db, 'users', user.uid);
  const userDocSnap = await getDoc(userDocRef);
  if (!userDocSnap.exists()) {
    await setDoc(userDocRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      role: 'student',
      createdAt: serverTimestamp(),
      emailVerified: user.emailVerified,
    });
  }
  return user;
};

// Update User Profile (Example for display name, extend as needed)
export const updateUserProfile = async (user: FirebaseUser, updates: Partial<UserProfile>) => {
  if (user) {
    if (updates.displayName) {
      await updateFirebaseProfile(user, { displayName: updates.displayName });
    }
    // Update Firestore document
    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, updates, { merge: true });
  }
};
