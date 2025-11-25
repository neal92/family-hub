import { getFirebaseConfig } from './config';
import {
  FirebaseApp,
  initializeApp,
  getApps,
  deleteApp,
} from 'firebase/app';
import { Auth, getAuth, signOut } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';

export * from './provider';
export * from './auth/use-user';
export type { User } from 'firebase/auth';

type FirebaseInstances = {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
};

let firebaseInstances: FirebaseInstances | null = null;

export function initializeFirebase(): FirebaseInstances {
  if (firebaseInstances && getApps().length > 0) {
    return firebaseInstances;
  }

  const firebaseConfig = getFirebaseConfig();
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  firebaseInstances = { app, auth, firestore };
  return firebaseInstances;
}

export function deleteFirebaseApp() {
  if (firebaseInstances) {
    deleteApp(firebaseInstances.app);
    firebaseInstances = null;
  }
}
