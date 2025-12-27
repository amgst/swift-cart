import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAeVNrK20M3pK7-ZpFeWHFGDfs68x5HHoM",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "swift-cart-4ba02.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "swift-cart-4ba02",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "swift-cart-4ba02.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "222087296910",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:222087296910:web:e3c197b704ed1f5da3d6df",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);
export default app;
