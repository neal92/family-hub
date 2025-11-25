'use client';
import { Auth, onAuthStateChanged, User } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { useAuth } from '@/firebase';

export function useUser() {
  const { auth } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [initialising, setInitialising] = useState(true);
  const [error, setError] = useState<any>(null);
  useEffect(() => {
    if (!auth) {
      return;
    }
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setUser(user);
        setInitialising(false);
      },
      (error) => {
        setError(error);
        setInitialising(false);
      }
    );
    return () => unsubscribe();
  }, [auth]);

  return { user, initialising, error };
}
