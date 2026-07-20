import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, signInWithEmailAndPassword } from 'firebase/auth';
import { initializeFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);

// Initialize Firestore with long polling to bypass potential websocket/proxy issues in some environments
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}, firebaseConfig.firestoreDatabaseId);

export const auth = getAuth(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

// Test connection on boot as per guidelines
const testConnection = async () => {
  try {
    await getDocFromServer(doc(db, '_connection_test_', 'check'));
    console.log("Firestore connection successful.");
  } catch (error: unknown) {
    const err = error as { message?: string, code?: string };
    if (err.message && err.message.includes('the client is offline')) {
      console.warn("Firestore connection: Client is offline.");
    } else if (err.code !== 'permission-denied') {
      // Only log other unexpected errors, ignore permission errors for this connection test
      console.warn("Firestore initialization status:", err.message || String(error));
    }
  }
};

testConnection();

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const loginWithEmail = async (email: string, pass: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, pass);
    return result.user;
  } catch (error) {
    console.error('Email login error:', error);
    throw error;
  }
};

export const logout = () => signOut(auth);
