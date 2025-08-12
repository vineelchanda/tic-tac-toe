import { initializeApp } from "firebase/app";
import {
  getFirestore,
  serverTimestamp,
  runTransaction,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCGrAekXtlHLrW8GvmGDRcWb4Kn8Q64pZg",
  authDomain: "aesthetic-cacao-314106.firebaseapp.com",
  databaseURL: "https://aesthetic-cacao-314106-default-rtdb.firebaseio.com",
  projectId: "aesthetic-cacao-314106",
  storageBucket: "aesthetic-cacao-314106.appspot.com",
  messagingSenderId: "975779030831",
  appId: "1:975779030831:web:9812c609d813868953e3da",
  measurementId: "G-1PP1HT1FGH",
};

// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
//   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
//   storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
//   appId: import.meta.env.VITE_FIREBASE_APP_ID
// };

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const ts = serverTimestamp;

export { runTransaction, doc, getDoc, setDoc, updateDoc, onSnapshot };
