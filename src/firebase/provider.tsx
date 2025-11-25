'use client';
import {
  useContext,
  createContext,
  useState,
  useMemo,
  useEffect,
} from 'react';
import { FirebaseApp } from 'firebase/app';
import { Auth, signOut } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';
interface FirebaseContextType {
  app: FirebaseApp | null;
  auth: Auth | null;
  firestore: Firestore | null;
  signOut: () => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(
  undefined
);

export function FirebaseProvider({
  children,
  app,
  auth,
  firestore,
}: {
  children: React.ReactNode;
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}) {
  const router = useRouter();
  const handleSignOut = async () => {
    if (!auth) return;
    await signOut(auth);
    router.push('/login');
  };

  const value = useMemo(
    () => ({
      app,
      auth,
      firestore,
      signOut: handleSignOut,
    }),
    [app, auth, firestore]
  );
  return (
    <FirebaseContext.Provider value={value}>
      {children}
      <FirebaseErrorListener />
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
}

export function useFirebaseApp() {
  const { app } = useFirebase();
  if (!app) {
    throw new Error('Firebase app not available');
  }
  return app;
}

export function useAuth() {
  const { auth, signOut } = useFirebase();
  if (!auth) {
    throw new Error('Firebase Auth not available');
  }
  return { auth, signOut };
}

export function useFirestore() {
  const { firestore } = useFirebase();
  if (!firestore) {
    throw new Error('Firestore not available');
  }
  return firestore;
}
