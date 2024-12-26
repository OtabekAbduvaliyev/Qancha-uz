import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB9CRANBYIJYU0HbWMHT9Sq2CjtQ3N6Xew",
  authDomain: "qancha-uz.firebaseapp.com",
  projectId: "qancha-uz",
  storageBucket: "qancha-uz.firebasestorage.app",
  messagingSenderId: "137963923440",
  appId: "1:137963923440:web:6ce33f05827a06e389df35",
  measurementId: "G-ZKC8P1LYDZ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
