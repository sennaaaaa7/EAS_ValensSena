import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBRpZhyWjjyzNoHUcMnVb9JwzcUTf325f0",
  authDomain: "movie-watchlist2-1f109.firebaseapp.com",
  projectId: "movie-watchlist2-1f109",
  storageBucket: "movie-watchlist2-1f109.firebasestorage.app",
  messagingSenderId: "1082649027693",
  appId: "1:1082649027693:web:38afb6b8946dee41a94b64",
  measurementId: "G-X4N8R1YV2Z" 
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;